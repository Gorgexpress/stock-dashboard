import { WebSocket, WebSocketServer } from "ws";
import StockPrice from "./interfaces/stock-price.interface";
import AlpacaMarketStreamData from "./interfaces/alpaca-market-stream-data.interface";
import ConfigService from "../../config/config.service";

export default class WatchlistsMockServer {
  stockPriceData: Record<string, StockPrice> = {};
  server!: WebSocketServer;
  constructor(private readonly configService: ConfigService) {
    this.initWebSockets();
  }

  private initWebSockets() {
    this.server = new WebSocketServer({ port: parseInt(this.configService.get('MOCK_ALPACA_WEBSOCKETS_PORT')) });
    this.server.on('connection', ws => {
      ws.on('error', console.error);
      ws.on('message', message  => {
        //respond to messages sent from our front-end
        try { 
          const data = JSON.parse(message.toString());
          console.log('received: %s', data);
          switch (data.action) {
            case 'subscribe':
              if (data.trades && data.trades.length > 0) {
                data.trades.forEach((s: string) => {
                  if (!this.stockPriceData[s]) 
                    this.stockPriceData[s] = {symbol: s, price: Math.random() * 200.0 + 1, time: new Date().toISOString()}
                })
              }
              break;
            case 'unsubscribe':
              if (data.trades && data.trades.length > 0) {
                data.trades.forEach((s: string) => {
                  if (this.stockPriceData[s]) delete this.stockPriceData[s];
                });
              }
              break;
            default:
              break;
          }
        } catch(e) {
          console.error(`Error occursed while parsing client websocket message: ${e}`)
        }
      });
      setTimeout(this.simulateStockMarket.bind(this), Math.random() * 1000 + 60);
    });
  }

  //Simulate the Alpaca live market data stream by randomly sending stock prices
  private simulateStockMarket() {
    const newData : AlpacaMarketStreamData[] = [];
    if (Object.keys(this.stockPriceData).length > 0) {
      const numTries = (this.easeInCubic(Math.random()) * 3.0) + 1;
      for(let i = 0; i < numTries; i++) {
        const values = Object.values(this.stockPriceData);
        const index = Math.floor(this.easeInCubic(Math.random()) * values.length);
        const stockPrice = values[index];
        const oldValue = stockPrice?.price && (Math.random() * 50 + 100.0);
        const newValue = Math.max(0, Math.min( 300.0, oldValue + (Math.random() * 24 - 12)));
        const newValueTruncated = Math.round(newValue * 100.0) / 100.0
        newData.push({S: stockPrice.symbol, p: newValueTruncated, t: new Date().toISOString()}); //not a complete mock, but good enough for what we need
      }
      this.server.clients.forEach(ws => ws.send(JSON.stringify(newData)));
      newData.forEach(s => {
        this.stockPriceData[s.S] = {symbol: s.S, price: s.p, time: s.t};
      });
    }
    setTimeout(this.simulateStockMarket.bind(this), Math.random() * 1000 + 60);
  }
  private easeInCubic(x: number): number {
    return x * x * x;
    }
}