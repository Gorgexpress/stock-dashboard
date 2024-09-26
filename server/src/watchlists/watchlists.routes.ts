import express, { Router } from "express";
import WatchlistsController from "./watchlists.controller";
import 'express-async-errors';
import { bodySymbolsSchema, querySymbolsSchema } from "./watchlists.validate";
import { ZodBodyValidator, ZodQueryValidator } from "../validate.middleware";
class WatchlistsRoutes { 
  router!: Router;
  constructor(private readonly watchlistsController: WatchlistsController) {
    this.router = express.Router()
    this.router.get('/watchlists', this.watchlistsController.get.bind(this.watchlistsController));
    this.router.patch('/watchlists',  ZodBodyValidator(bodySymbolsSchema), this.watchlistsController.patch.bind(this.watchlistsController));
    this.router.get('/watchlists/lasttrades', ZodQueryValidator(querySymbolsSchema), this.watchlistsController.getLastTrades.bind(this.watchlistsController));

  }
}

export default WatchlistsRoutes;