export default interface StockPrice {
  symbol: string;
  price: number;
  time: string;
}

export interface StockPriceWithoutSymbol {
  price: number;
  time: string;
}



