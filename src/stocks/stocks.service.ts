import { Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { HstRepository } from './hst.repository';
import { TopRepository } from './top.repository';
import { Stock } from './stock.entity';

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

  async find7DaysHST(): Promise<void> {
    return await this.hstRepository.find7DaysHST();
  }

  async find7DaysTOP(): Promise<void> {
    return await this.topRepository.find7DaysTOP();
  }
}
