export interface StockInfo {
  rank?: number;
  number: string;
  name: string;
  date: Date;
  openingPrice?: number;
  closingPrice: number;
  highest: number;
  lowest: number;
  totalVolume?: number;
  totalCost?: number;
  priceSpread: number;
  priceChangeRatio: number;
}
