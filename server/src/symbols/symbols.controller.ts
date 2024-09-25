import { Response, Request } from "express";
import SymbolsRepository from "./symbols.repository";

class SymbolsController {
  constructor(
    private readonly symbolsRepository: SymbolsRepository,
  ) {}
  async get(req: Request, res: Response) {
    const symbols = await this.symbolsRepository.getAll();
    res.send(symbols);
  }
}

export default SymbolsController;