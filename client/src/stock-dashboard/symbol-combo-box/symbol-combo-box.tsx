import {useEffect, useState} from 'react'
import {useCombobox} from 'downshift'
import './symbol-combo-box.css';


interface SymbolsComboboxProps {
  onSelectedItemChange: Function;
  getCurrentWatchedSymbols: Function;
};
function SymbolsCombobox(props: SymbolsComboboxProps) {
  const [symbols, setSymbols] = useState<any[]>([]);
  const [symbolsFiltered, setSymbolsFiltered] = useState<any[]>([]);

  const getSymbols = async () => {
    const symbols = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/symbols`);
    setSymbols(await symbols.json());
  }

  useEffect(() => {
    getSymbols();
  }, []);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectItem,
  } = useCombobox({
    items: symbolsFiltered,
    itemToString(symbol: any) {
      return symbol ? symbol.symbol : '';
    },
    onInputValueChange: ({inputValue}) => {
      if(inputValue === '') return;
      //filter the list of symbols so that we only show symbols starting with our input value
      const existingSymbolsSet = props.getCurrentWatchedSymbols();
      //There's 10544 symbols right now. We want to limit the # of symbols we render, and avoid processing the entire array.
      const newSymbolsFiltered : any[] = [];
      let count = 0;
      for(let item of symbols) {
        const symbolLowerCase = item.symbol.toLowerCase();
        if (count > 20) break;
        if (existingSymbolsSet.has(symbolLowerCase)) continue;
        const startsWith = item.symbol.toLowerCase().startsWith(inputValue.toLowerCase());
        if (startsWith) { 
          newSymbolsFiltered.push(item);
          count += 1;
        }
      }
      setSymbolsFiltered(newSymbolsFiltered)
    },
    onSelectedItemChange: ({selectedItem}) => {
      if (selectedItem === null) return;
      props.onSelectedItemChange(selectedItem.symbol);
      selectItem(null);
      
    } 
  })
  return (
    <div className="watchlist">
      <label {...getLabelProps()}>Choose an element:</label>
      <div>
        <input {...getInputProps()} />
        <button
          type="button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} className='watchlist-list'>
        {isOpen &&
          (props.getCurrentWatchedSymbols().size < 30 
          ? symbolsFiltered.map((item: any, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
              }
              className="watchlist-item"
              key={`${item.symbol}`}
              {...getItemProps<any>({item, index})}
            >
              <div>{item.symbol}</div>
              <span className="text-sm text-gray-700">{item.name}</span>
            </li>
          ))
          : <p>Can't add more symbols. Only up to 30 can be watched at a time.</p>)}
      </ul>
    </div>
  )
}

export default SymbolsCombobox;

