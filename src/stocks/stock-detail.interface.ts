import { StockType } from './stock-type.enum';

export interface StockDetail {
  number: string;
  companyName: string;
  categoryName: string;
  type: StockType;
  capital: string;
  description: string;
  dateOfListing: Date;
  dateOfEstablishing: Date;
}
