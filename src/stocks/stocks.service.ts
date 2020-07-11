import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StockRepository } from './stock.repository';
import { Stock } from './stock.entity';
import Crawler from '../crawler';

@Injectable()
export class StocksService {
  constructor(private stockRepository: StockRepository) {}

  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOne(id);
  }

  @Cron('0 0 15 * * 1-5') // Monday to Friday at 03:00pm
  async handleCronHST(): Promise<void> {
    const crawler = new Crawler();
    const stocks = await crawler.getHSTStocks();
    stocks.forEach((stock) => this.stockRepository.insertHST(stock));
  }

  @Cron('0 0 15 * * 1-5') // Monday to Friday at 03:00pm
  async handleCronTOP(): Promise<void> {
    const crawler = new Crawler();
    const stocks = await crawler.getTOPStocks();
    stocks.forEach((stock) => this.stockRepository.insertTOP(stock));
  }
}
