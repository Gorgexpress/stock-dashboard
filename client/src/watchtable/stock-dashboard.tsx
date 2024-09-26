import { useEffect, useRef, useState } from 'react'
import './stock-dashboard.css';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { ColDef } from 'ag-grid-community';
import SymbolsCombobox from './symbol-combo-box/symbol-combo-box';
import WatchTableRemoveButton, { WatchTableRemoveButtonProps } from './watchtable-remove-button';
import StockPrice from './stock-price.interface';
import { toast } from 'react-toastify';

function StockDashboard() {
  const gridRef = useRef<AgGridReact<StockPrice> | null>(null); 
  const clientRef = useRef<WebSocket| null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [rowData, setRowData] = useState<StockPrice[]>([]);
  const [colDefs, _setColDefs] = useState<ColDef[]>([
    { field: "symbol", },
    { field: "price" },
    { field: "time", valueFormatter: (v: any) => {return v.value === undefined ? '' :new Date(v.value).toLocaleTimeString()}},
    {
      field: 'button',
      headerName: 'Remove',
      cellRenderer: WatchTableRemoveButton,
      cellRendererParams: {
        onClick: removeFromWatchlist
      }
    },
  ]);
  async function getWatchlist()  {
    try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/watchlists`);
    const list = await response.json();
    return list.map((s: any) => { return { symbol: s.symbol };});
    } catch (e) {
      setErrorMessage("Could not connect to the server.");
      return;
    }
  }
  async function getLastTrades(watchlist: StockPrice[], shouldUpdateState: boolean = false) {
    if(watchlist.length === 0) return;
    let response: Response
    try {
      response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/watchlists/lasttrades?symbols=${encodeURIComponent(watchlist.map(w => w.symbol).join(','))}`);
    } catch(e) {
      setErrorMessage("Could not connect to the server.");
      return;
    }
    const trades = await response.json();
    const newList = watchlist.map(s => { return { symbol: s.symbol, price: trades[s.symbol]?.price, time: trades[s.symbol]?.time}});
    if(shouldUpdateState) {
      const newRowData: StockPrice[] = [...newList, ...rowData];
      const groupedData = newRowData.reduce((acc: Record<string, StockPrice>, cur) => {
        const existingEntry = acc[cur.symbol];
        const existingEntryTime = acc[cur.symbol]?.time;
        const newEntryTime = cur.time;
        //lots of undefined checks to make typescript happy
        if (!existingEntry  || existingEntryTime === undefined || (newEntryTime !== undefined && existingEntryTime < newEntryTime))
          acc[cur.symbol] = { symbol: cur.symbol, price: cur.price, time: cur.time};
        return acc;
      }, {})
      setRowData(Object.values(groupedData));
    }
    return newList;
  }

  function addToWatchlist(symbol: string) {
    if(rowData.length >= 30) {
      console.error("Watch list is maxed out at 30 symbols");
      return;
    }
    const client = clientRef.current;
    //I might want to have the server send a confirmation that the subscribe action succeeded
    client?.send(JSON.stringify({action: 'subscribe', symbols: [symbol]}));
    toast(`${symbol} added`);
    getLastTrades([{symbol}], true);
  }
  function removeFromWatchlist(props: WatchTableRemoveButtonProps) {
    //Didn't have much luck accessing the rowData variable directly, but getting all rows via the ag grid api works fine
    const symbol = props.data?.symbol;
    const client = clientRef.current;
    client?.send(JSON.stringify({action: 'unsubscribe', symbols: [symbol]}));
    toast(`${symbol} removed`);
    const newRowData: StockPrice[] = [];
    gridRef.current?.api.forEachNode((rowNode: any, index: number) => {
      if(rowNode.data.symbol !== symbol) newRowData.push(rowNode.data);
    })
    setRowData(newRowData);
  }
  async function setupWebSockets(watchlist: StockPrice[]) {
    const client = new WebSocket(import.meta.env.VITE_BACKEND_WEBSOCKET_URL);
    clientRef.current = client;
    client.onopen = ev => {
      //subscribe to stocks in watchlist
      setErrorMessage('');
      if(watchlist && watchlist.length > 0)
        client?.send(JSON.stringify({action: 'subscribe', symbols: watchlist.map(s => s.symbol)}));
    };
    client.onclose = ev => {
      console.log('closed');
      setErrorMessage("Websocket was closed. Is the server running? Please refresh when you want to attempt to reconnect.");
      setTimeout(function(){
        if (clientRef.current !== null && clientRef.current.readyState === WebSocket.CLOSED)
          setupWebSockets([])}
      , 10000); //retry in 10 seconds. There's probably a better way to do this...
    }
    client.onerror = (error) => {
      setErrorMessage("Could not connect to the server.");
      console.log(error);
    };
    client.onmessage = (event) => {
      //parse the incoming stock price and update the table
      let message: StockPrice[] = JSON.parse(event.data);
      if(message[0] && message[0].symbol) { //check that this is actually a valid stock price.
        message = message.filter(m => m.symbol);
        if(!message)return;
        if(!watchlist) watchlist = [];
        const newRowData: StockPrice[] = mergeDuplicatesInWatchlist([...message, ...getRowData()]);
        setRowData(newRowData);
      }
    }
    return client;
  }

  //used by watchlist to filter out symbols we are already watching
  function getCurrentWatchedSymbols() {
      //I almost forgot javascript has complex data structures other than arrays and sets. This should be widely supported now.
    return rowData.reduce((acc, cur) => acc.add(cur.symbol.toLowerCase()), new Set());
  }

  //Trying to access rowData directly from a websocket callback will only ever return the initial value, so we grab it from the grid reference instead
  function getRowData() {
    return gridRef.current?.props.rowData as StockPrice[];
  }

  function mergeDuplicatesInWatchlist(watchlist: StockPrice[]): StockPrice[] {
    const groupedData = watchlist.reduce((acc: Record<string, StockPrice>, cur) => {
      const existingEntry = acc[cur.symbol];
      const existingEntryTime = acc[cur.symbol]?.time;
      const newEntryTime = cur.time;
      //lots of undefined checks to make typescript happy
      if (!existingEntry  || existingEntryTime === undefined || (newEntryTime !== undefined && new Date(existingEntryTime) < new Date(newEntryTime)))
        acc[cur.symbol] = { symbol: cur.symbol, price: cur.price, time: cur.time};
      return acc;
    }, {});
    return Object.values(groupedData);
  }
  useEffect(() => {
    let mounted = true;
    async function init() {
      let watchlist = await getWatchlist();
      watchlist = await getLastTrades(watchlist, true); //setupWebSockets won't set the rowData state, so do it here
      if(mounted) //don't open the websocket if the component was unmounted before we get here
        await setupWebSockets(watchlist);
    }
    init(); 
    return () => {mounted = false; clientRef.current?.close();};
  }, []);

 
  return (
    <>
      <div className="ag-theme-quartz table">
        <AgGridReact<StockPrice> rowData={rowData} columnDefs={colDefs} ref={gridRef} rowHeight={32}/>
        <p className="error-message">{errorMessage}</p>
      </div>
      <div className='combobox-container'>
        <SymbolsCombobox getCurrentWatchedSymbols={getCurrentWatchedSymbols} onSelectedItemChange={(symbol: string) => addToWatchlist(symbol)}/>
      </div>
    </>
  )
}

export default StockDashboard;
