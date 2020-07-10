import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StockRepository } from './stock.repository';
import { Stock } from './stock.entity';

@Injectable()
export class StocksService {
  constructor(private stockRepository: StockRepository) {}

  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOne(id);
  }

  @Cron('0 0 15 * * 1-5') // Monday to Friday at 03:00pm
  handleCron(): void {
    console.log('Called on Monday to Friday at 03:00pm');
  }
}
