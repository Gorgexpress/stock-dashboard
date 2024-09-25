import { SymbolTable } from '../../symbols/symbol.kysely'
import { WatchListTable } from '../../watchlists/watchlist.kysely'
  
  export interface Database {
    watchlist: WatchListTable
    symbol: SymbolTable
  }
