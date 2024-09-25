import express, { Router } from "express";
import WatchlistsController from "./watchlists.controller";
import 'express-async-errors';
class WatchlistsRoutes { 
  router!: Router;
  constructor(private readonly watchlistsController: WatchlistsController) {
    this.router = express.Router()
    this.router.get('/watchlists', this.watchlistsController.get.bind(this.watchlistsController));
    this.router.patch('/watchlists', this.watchlistsController.patch.bind(this.watchlistsController));
    this.router.get('/watchlists/lasttrades', this.watchlistsController.getLastTrades.bind(this.watchlistsController));

  }
}

export default WatchlistsRoutes;