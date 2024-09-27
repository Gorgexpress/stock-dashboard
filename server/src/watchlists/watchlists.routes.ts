import express, { Router } from "express";
import WatchlistsController from "./watchlists.controller";
import 'express-async-errors';
import { bodySymbolsSchema, querySymbolsSchema } from "./watchlists.validate";
import { ZodBodyValidator, ZodQueryValidator } from "../validate.middleware";
import { StockPriceWithoutSymbol } from "./market-data-stream/interfaces/stock-price.interface";

class WatchlistsRoutes { 
  router!: Router;
  constructor(private readonly watchlistsController: WatchlistsController) {
    this.router = express.Router()
    /**
     * Get all symbols in the watchlist
     * @returns {Watchlist[]}
     */
    this.router.get('/watchlists', this.watchlistsController.get.bind(this.watchlistsController));
    /**
     * Inserts a list of new symbols into the watchlist. Might wanna switch this to accept a Watchlist[] in the future...
     * The front-end ignores this endpoint in favor of adding symbols via websockets.
     * @param {string[]} req.body the list of new symbols as a list of strings
     */
    this.router.patch('/watchlists',  ZodBodyValidator(bodySymbolsSchema), this.watchlistsController.patch.bind(this.watchlistsController));
    /**
     * Deletes a list of symbols in the watchlist. Might wanna switch this to accept a Watchlist[] in the future...
     * The front-end ignores this endpoint in favor of removing symbols via websockets.
     * @param {string[]} req.body the list of symbols to remove as a list of strings
     */
    this.router.delete('/watchlists',  ZodBodyValidator(bodySymbolsSchema), this.watchlistsController.delete.bind(this.watchlistsController));
    /**
     * Given a list of stock symbols, get the latest trade for each via the Alpaca API
     * @param {string[]} req.body the list of symbols as a list of strings
     * @returns {Record<string, StockPriceWithoutSymbol>} Returns an object where the key is the symbol, and the value is the price and time for the last trade of that symbol
     */
    this.router.get('/watchlists/lasttrades', ZodQueryValidator(querySymbolsSchema), this.watchlistsController.getLastTrades.bind(this.watchlistsController));

  }
}

export default WatchlistsRoutes;