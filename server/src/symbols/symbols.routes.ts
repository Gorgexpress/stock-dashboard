import express, { Router } from "express";
import SymbolsController from "./symbols.controller";
import 'express-async-errors';

class SymbolsRoutes { 
  router!: Router;
  constructor(private readonly symbolsController: SymbolsController) {
    this.router = express.Router();
    this.router.get('/symbols', this.symbolsController.get.bind(this.symbolsController));
  }
}

export default SymbolsRoutes;