import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { StockRepository } from './stock.repository';
import { CategoryRepository } from './category.repository';
import { Stock } from './stock.entity';
import { Distribution } from './distribution.entity';
import Crawler from '../crawler';

@Injectable()
export class StocksService {
  constructor(
    private stockRepository: StockRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  async findOne(id: number): Promise<Stock> {
    return await this.stockRepository.findOne(id);
  }

  @Cron('0 00 17 * * 1-5') // Monday to Friday at 17:00
  async handleCronHST(): Promise<void> {
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await crawler.getHSTStocks();
    await crawler.destory();
    stocks.forEach((stock) => this.stockRepository.insertHST(stock));
  }

  @Cron('0 05 17 * * 1-5') // Monday to Friday at 17:05
  async handleCronTOP(): Promise<void> {
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await crawler.getTOPStocks();
    await crawler.destory();
    stocks.forEach((stock) => this.stockRepository.insertTOP(stock));
  }

  @Cron('0 10 17 * * 1-5') // Monday to Friday at 17:10
  async handleCronDetail(): Promise<void> {
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await this.stockRepository.getStocksWithoutDetail();
    for (const { number } of stocks) {
      const detail = await crawler.getStockDetail(number);
      if (detail) {
        const category = await this.categoryRepository.findOrCreateOne(
          detail.categoryName,
        );
        await this.stockRepository.insertStockDetail(detail, category);
      } else {
        const category = await this.categoryRepository.findOrCreateOne('ETF');
        await this.stockRepository.update({ number }, { category });
      }
      await this.sleep(5);
    }
    await crawler.destory();
  }

  @Cron('00 00 22 * * 5-7') // Firday to Sunday at 22:00
  async handleCronDistribution(): Promise<void> {
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await this.stockRepository.getStocksHaveNoDistribution();
    for (const { id, number } of stocks) {
      const blackList = ['1101B', '2891C', '9103'];
      if (number.startsWith('0200') || blackList.includes(number)) {
        continue;
      }
      const dist = await crawler.getStockEquityDistribution(number);
      if (dist) {
        const distribution = new Distribution();
        distribution.stockId = id;
        distribution.date = dist.date;
        distribution.lessThan50 = dist.lessThan50;
        await distribution.save();
      }
      await this.sleep(5);
    }
    await crawler.destory();
  }

  private async sleep(seconds: number): Promise<void> {
    await new Promise((res) => setTimeout(res, seconds * 1000));
  }
}
