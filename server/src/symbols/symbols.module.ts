import ConfigModule from '../config/config.module';
import { db } from '../config/database/database';
import SymbolsController from "./symbols.controller";
import SymbolsRepository from "./symbols.repository";
import SymbolsRoutes from './symbols.routes';

//This module manages the list of valid stock symbols.
class SymbolsModule {
    symbolsController!: SymbolsController;
    symbolsRepository!: SymbolsRepository;
    symbolsRoutes!: SymbolsRoutes;
    constructor(private readonly configModule: ConfigModule) {
      this.symbolsRepository = new SymbolsRepository(db);
      this.symbolsController = new SymbolsController(this.symbolsRepository);
      this.symbolsRoutes = new SymbolsRoutes(this.symbolsController);
    }
}

export default SymbolsModule;