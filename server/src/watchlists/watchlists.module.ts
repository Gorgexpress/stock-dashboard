import ConfigModule from '../config/config.module';
import { db } from '../config/database/database';
import WatchlistsController from './watchlists.controller';

import WatchlistsRepository from "./watchlists.repository";
import WatchlistsRoutes from './watchlists.routes';
import WatchlistsService from "./watchlists.service";
import WatchlistsWebsockets from "./watchlists.websockets";

class WatchlistsModule {
    watchlistsService!: WatchlistsService;
    watchlistsRepository!: WatchlistsRepository;
    watchlistsWebsockets!: WatchlistsWebsockets;
    watchlistsController!: WatchlistsController;
    watchlistsRoutes!: WatchlistsRoutes;
    constructor(private readonly configModule: ConfigModule) {
        this.watchlistsRepository = new WatchlistsRepository(db);
        this.watchlistsService = new WatchlistsService(this.watchlistsRepository, configModule.configService);
        this.watchlistsWebsockets = new WatchlistsWebsockets(this.watchlistsService, configModule.configService);
        this.watchlistsController = new WatchlistsController(this.watchlistsService);
        this.watchlistsRoutes = new WatchlistsRoutes(this.watchlistsController);
    }
}

export default WatchlistsModule;