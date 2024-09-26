import ConfigModule from '../config/config.module';
import { db } from '../config/database/database';
import WatchlistsController from './watchlists.controller';

import WatchlistsRepository from "./watchlists.repository";
import WatchlistsRoutes from './watchlists.routes';
import WatchlistsService from "./watchlists.service";
import WatchlistsWebsockets from "./market-data-stream/watchlists.websockets";
import WatchlistsMockServer from './market-data-stream/watchlists-mock-server.websockets';

class WatchlistsModule {
    watchlistsService!: WatchlistsService;
    watchlistsRepository!: WatchlistsRepository;
    watchlistsWebsockets!: WatchlistsWebsockets;
    watchlistsController!: WatchlistsController;
    watchlistsRoutes!: WatchlistsRoutes;
    constructor(private readonly configModule: ConfigModule) {
        if (this.configModule.configService.get('MOCK_ALPACA_WEBSOCKETS') === 'true') {
            const mockWebSocketSeverUrl = 'ws://localhost:' + this.configModule.configService.get('MOCK_ALPACA_WEBSOCKETS_PORT');
            this.configModule.configService.set('ALPACA_MARKET_STREAM_URL',mockWebSocketSeverUrl);
            const watchlistsMockServer = new WatchlistsMockServer(this.configModule.configService);
        }
        this.watchlistsRepository = new WatchlistsRepository(db);
        this.watchlistsService = new WatchlistsService(this.watchlistsRepository, configModule.configService);
        this.watchlistsController = new WatchlistsController(this.watchlistsService);
        this.watchlistsRoutes = new WatchlistsRoutes(this.watchlistsController);
        this.watchlistsWebsockets = new WatchlistsWebsockets(this.watchlistsService, configModule.configService);

    }
}

export default WatchlistsModule;