import { Injectable } from '@nestjs/common';
import { StockRepository } from './stock.repository';
import { Stock } from './stock.entity';

@Injectable()
export class StocksService {
  constructor(private stockRepository: StockRepository) {}
  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOne(id);
  }
}
