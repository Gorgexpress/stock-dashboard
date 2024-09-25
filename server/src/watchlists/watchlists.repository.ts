import { Kysely } from "kysely";
import { Database } from "../config/database/types";
import { WatchListTable } from "./watchlist.kysely";

class WatchlistsRepository {
  constructor(private readonly db : Kysely<Database>) {}

  async getAll() {
    return await this.db.selectFrom('watchlist').selectAll().execute();
  }
  async updatePrices(prices : any) {

  }

  async addSymbols(symbols: any[]) {
    await this.db.insertInto('watchlist')
      .values(symbols)
      .onConflict(oc => oc.doNothing())
      .execute();
  }

  async removeSymbols(symbols: string[]) {
    await this.db.deleteFrom('watchlist')
      .where('symbol', 'in', symbols)
      .execute();
  }
}

export default WatchlistsRepository;