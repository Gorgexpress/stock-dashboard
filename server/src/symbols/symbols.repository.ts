import { Kysely } from "kysely";
import { Database } from "../config/database/types";
import Symbol from "./symbol.entity";

class SymbolsRepository {
  constructor(private readonly db : Kysely<Database>) {}

    async getAll() : Promise<Symbol[]>{
      return await this.db.selectFrom('symbol').selectAll().execute();
    }
  }

export default SymbolsRepository;