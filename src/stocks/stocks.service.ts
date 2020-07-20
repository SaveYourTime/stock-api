import { Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { HstRepository } from './hst.repository';
import { Stock } from './stock.entity';

@Injectable()
export class StocksService {
  constructor(
    private stockRepository: StockRepository,
    private hstRepository: HstRepository,
  ) {}

  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOne(id);
  }

  async find7DaysHST(): Promise<void> {
    return await this.hstRepository.find7DaysHST();
  }
}
