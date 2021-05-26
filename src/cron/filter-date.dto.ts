import { IsISO8601, IsOptional } from 'class-validator';

export class FilterDateDto {
  @IsISO8601()
  @IsOptional()
  date?: string;
}
