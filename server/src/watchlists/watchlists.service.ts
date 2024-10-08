import WatchlistsRepository from "./watchlists.repository";
import ConfigService from "../config/config.service";
import Watchlist from "./watchlist.entity";
import { StockPriceWithoutSymbol } from "./market-data-stream/interfaces/stock-price.interface";


class WatchlistsService {
    constructor(
      private watchListsRepository: WatchlistsRepository,
      private readonly configService: ConfigService) {}

    async getWatchlist(): Promise<Watchlist[]> {
      return await this.watchListsRepository.getAll();
    }
    async addSymbols(symbols: Watchlist[]): Promise<void> {
      const watchlistEntries = symbols.map(s => { return { symbol:s};});
      await this.watchListsRepository.addSymbols(watchlistEntries);
    }
    async removeSymbols(symbols: string[]) {
      await this.watchListsRepository.removeSymbols(symbols);
    }
    
  /**
   * Get the last trades for a list of stock symbols.
   * Not sure if this belongs in the symbols module, but I'm also not sure if i want to make a new module just for this one endpoint. 
   * @param symbols list of stock symbols
   * @returns a dictionary where the key is a stock symbol, and the value is an object containing the price and time of that symbol's last trade.
   */
  async getLastTrades(symbols: string[]) {
    if(!symbols || symbols.length === 0)
      return [];
    const result = await fetch(
      `https://data.alpaca.markets/v2/stocks/trades/latest?feed=iex&currency=USD&symbols=${encodeURIComponent(symbols.join(','))}`, {
        headers: {
          "APCA-API-KEY-ID": this.configService.get('ALPACA_TRADE_KEY_ID'), 
          "APCA-API-SECRET-KEY": this.configService.get('ALPACA_TRADE_SECRET_KEY')
        }
      });
    const responseJson = await result.json();
    const lastTrades = Object.keys(responseJson.trades).reduce((acc: Record<string, StockPriceWithoutSymbol>, symbol: string) => {
      acc[symbol] = {
        price: responseJson.trades[symbol].p,
        time: responseJson.trades[symbol].t
      }
      return acc;
    }, {});
    return lastTrades;
  }

}

export default WatchlistsService;