import express, { Request, Response } from 'express'
import WatchListsModule from './watchlists/watchlists.module';
import SymbolsModule from './symbols/symbols.module';
import cors from 'cors';
import dotenv from 'dotenv'; 
import ConfigModule from './config/config.module';
import morgan from "morgan";
dotenv.config();

if(!process.env.CORS_WHITELIST) {
  console.log("missing CORS_WHITELIST environmental variable. Did you set up the .env file?");
}
const app = express()
const port = 3000;

app.use(express.json());
app.use(morgan('dev'))


const configModule = new ConfigModule();
const watchlistsModule = new WatchListsModule(configModule);
const symbolsModule = new SymbolsModule(configModule);
app.use(cors({origin: process.env.CORS_WHITELIST, credentials: true}));
app.use('/api/v1', symbolsModule.symbolsRoutes.router);
app.use('/api/v1', watchlistsModule.watchlistsRoutes.router);

app.listen(port, () => console.log(`Listening on port ${port}`))