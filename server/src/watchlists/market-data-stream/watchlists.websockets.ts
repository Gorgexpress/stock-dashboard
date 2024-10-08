import { WebSocket, WebSocketServer } from "ws";
import WatchListsService from "../watchlists.service";
import ConfigService from "../../config/config.service";
import AlpacaMarketStreamData from "./interfaces/alpaca-market-stream-data.interface";
import StockPrice from "./interfaces/stock-price.interface";
import { z, ZodError } from "zod";

const websocketSchema = z.object({
  action: z.string().min(1),
  symbols: z.string().min(1).array()
});

class WatchListsWebsockets {
  client!: WebSocket;
  server!: WebSocketServer;
  constructor(
    private readonly watchlistService: WatchListsService,
    private readonly configService: ConfigService) {
    this.initWebSockets();
  }

  private initWebSockets() {
    this.server = new WebSocketServer({ port: 8080 });
    this.server.on('connection', ws => {
      ws.on('error', console.error);
      ws.on('message', message  => {
        //respond to messages sent from our front-end
        try { 
          const data = JSON.parse(message.toString());
          console.log('received: %s', data);
          websocketSchema.parse(data);
          switch (data.action) {
            case 'subscribe':
              if (data.symbols && data.symbols.length > 0) {
                this.client.send(JSON.stringify({
                  action: 'subscribe',
                  trades: data.symbols
                }));
                this.watchlistService.addSymbols(data.symbols);
              }
              break;
            case 'unsubscribe':
              if (data.symbols && data.symbols.length > 0) {
                this.client.send(JSON.stringify({
                  action: 'unsubscribe',
                  trades: data.symbols
                }));
                this.watchlistService.removeSymbols(data.symbols);
              }
              break;
            default:
              ws.send(JSON.stringify({message:`Unknown action ${data.action}`}))
              break;
          }
        } catch(e) {
          console.error(`Error occursed while parsing client websocket message: ${e}`)
          if(e instanceof ZodError) {
            ws.send(JSON.stringify({message: "A validation error has occured", issues: e.issues.map(i => i.message)}));
            return;
          }
          ws.send(JSON.stringify({error: "An error has occured"}));
        }
      });
    });
    this.client = new WebSocket(this.configService.get('ALPACA_MARKET_STREAM_URL'));

    this.client.on("error", error => {
      console.log(error)
    });
    this.client.on("open", async () => {
      this.client.send(JSON.stringify({
        action: 'auth',
        key: this.configService.get('ALPACA_BROKER_KEY_ID'),
        secret: this.configService.get('ALPACA_BROKER_SECRET_KEY')
      }), async (err) => {
        console.log(err);
      })
    });
    this.client.on("message", async (data, _isBinary) => {
      try {
        console.log(data.toString());
        //prices for multiple symbols can be sent at the same time. We want to only send the latest price for each symbol.
        const prices : AlpacaMarketStreamData[] = JSON.parse(data.toString());
        if(!prices[0] || !prices[0].S) return; //return if not price data
        const pricesReduced = prices.reduce((acc:Record<string, StockPrice>, cur) => {
          if (!acc[cur.S] || acc[cur.S].time < cur.t)
            acc[cur.S] = { symbol: cur.S, price: cur.p, time: cur.t};
          return acc;
        }, {});
        //const pricesParsed:  Array<StockPrice> = prices.map(p => { return { symbol: p.S, price: p.p, time: p.t}});
        this.server.clients.forEach( ws => {
          if (ws.readyState === WebSocket.OPEN)
            ws.send(JSON.stringify(Object.values(pricesReduced)));
        });
      } catch(e) {
        console.error(`Error parsing Alpaca websocket message: ${e}`);
      }
    })
  }
}

export default WatchListsWebsockets;