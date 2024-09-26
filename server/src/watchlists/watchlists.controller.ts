import { Response, Request } from "express";
import WatchlistService from './watchlists.service';

class WatchlistsController {
  constructor(private readonly watchlistService: WatchlistService) {}
  async get(req: Request, res: Response) {
    const symbols = await this.watchlistService.getWatchlist();
    res.send(symbols);
  }
  async patch(req: Request, res: Response) {
    await this.watchlistService.addSymbols(req.body.symbols);
    res.sendStatus(200);
  }
  async delete(req: Request, res: Response) {
    await this.watchlistService.removeSymbols(req.body.symbols);
    res.sendStatus(200);
  }
  async getLastTrades(req: Request, res: Response) {
    const symbols = decodeURIComponent(req.query.symbols as string);
    if (!symbols) res.sendStatus(200);
    const trades = await this.watchlistService.getLastTrades(symbols.split(','));
    res.send(trades);
  }
}

export default WatchlistsController;