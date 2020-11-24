import { Injectable, BadRequestException } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { StockRepository } from './stock.repository';
import { HstRepository } from './hst.repository';
import { TopRepository } from './top.repository';
import { Stock } from './stock.entity';
import { FilterStockDto } from './filter-stock.dto';

@Injectable()
export class StocksService {
  constructor(
    private stockRepository: StockRepository,
    private hstRepository: HstRepository,
    private topRepository: TopRepository,
  ) {}

  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOne(id);
  }

  async find7DaysHST(filterStockDto: FilterStockDto): Promise<void> {
    this.validateDateRange({ start: filterStockDto.start, end: filterStockDto.end }, 7);
    return await this.hstRepository.find7DaysHST(filterStockDto);
  }

  async find7DaysTOP(filterStockDto: FilterStockDto): Promise<void> {
    this.validateDateRange({ start: filterStockDto.start, end: filterStockDto.end }, 7);
    return await this.topRepository.find7DaysTOP(filterStockDto);
  }

  validateDateRange({ start, end }: { start: string; end: string }, days = 7): void {
    if (dayjs(start).diff(dayjs(end), 'day') > days) {
      throw new BadRequestException(`Date range must be in ${days} days`);
    }
  }
}
