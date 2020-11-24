import { IsISO8601, IsOptional } from 'class-validator';

export class FilterStockDto {
  @IsISO8601()
  @IsOptional()
  start?: string;

  @IsISO8601()
  @IsOptional()
  end?: string;
}
