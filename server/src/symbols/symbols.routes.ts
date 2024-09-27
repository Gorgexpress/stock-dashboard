import express, { Router } from "express";
import SymbolsController from "./symbols.controller";
import 'express-async-errors';

class SymbolsRoutes { 
  router!: Router;
  constructor(private readonly symbolsController: SymbolsController) {
    this.router = express.Router();
    /**
     * Get a list of supported symbols
     * There's a lot of them, and the list probably wouldn't change super frequently. Might be worth cacheing. 
     * @returns {Symbol[]} A list of all supported symbols. 
     */
    this.router.get('/symbols', this.symbolsController.get.bind(this.symbolsController));
  }
}

export default SymbolsRoutes;