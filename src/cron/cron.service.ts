import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import Crawler from '../crawler/index';
import { StockRepository } from '../stocks/stock.repository';
import { CategoryRepository } from '../stocks/category.repository';
import { SubcategoryRepository } from '../stocks/subcategory.repository';
import { Distribution } from '../stocks/distribution.entity';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private stockRepository: StockRepository,
    private categoryRepository: CategoryRepository,
    private subcategoryRepository: SubcategoryRepository,
  ) {}

  @Cron('0 00 09,17 * * *') // Everyday at 09:00am and 05:00pm
  async handleCronHST(): Promise<void> {
    this.logger.debug('CALLED: handleCronHST');
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await crawler.getHSTStocks();
    this.logger.debug(`We got ${stocks.length} stocks need to be process`);
    await crawler.destory();
    const promises = stocks.map((stock) => this.stockRepository.insertHST(stock));
    await Promise.all(promises);
    this.logger.debug('DONE: handleCronHST');
  }

  @Cron('0 05 09,17 * * *') // Everyday at 09:05am and 05:05pm
  async handleCronTOP(): Promise<void> {
    this.logger.debug('CALLED: handleCronTOP');
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await crawler.getTOPStocks();
    this.logger.debug(`We got ${stocks.length} stocks need to be process`);
    await crawler.destory();
    const promises = stocks.map((stock) => this.stockRepository.insertTOP(stock));
    await Promise.all(promises);
    this.logger.debug('DONE: handleCronTOP');
  }

  @Cron('0 10 09,17 * * *') // Everyday at 09:10am and 05:10pm
  async handleCronDetail(): Promise<void> {
    this.logger.debug('CALLED: handleCronDetail');
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await this.stockRepository.getStocksWithoutDetail();
    this.logger.debug(`We got ${stocks.length} stocks need to be process`);
    for (const { number } of stocks) {
      this.logger.debug(`STOCK_NUMBER: ${number}`);
      const detail = await crawler.getStockDetail(number);
      this.logger.debug(`DETAIL: ${JSON.stringify(detail)}`);
      if (detail) {
        const category = await this.categoryRepository.findOrCreateOne(detail.categoryName);
        await this.stockRepository.insertStockDetail(detail, category);
      } else {
        const category = await this.categoryRepository.findOrCreateOne('ETF');
        await this.stockRepository.update({ number }, { category });
      }
      await this.sleep(5);
    }
    await crawler.destory();
    this.logger.debug('DONE: handleCronDetail');
  }

  @Cron('0 15 09,17 * * *') // Everyday at 09:15am and 05:15pm
  async handleCronSubcategory(): Promise<void> {
    this.logger.debug('CALLED: handleCronSubcategory');
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await this.stockRepository.getStocksWithoutSubcategory();
    this.logger.debug(`We got ${stocks.length} stocks need to be process`);
    for (const { number } of stocks) {
      const subcate = await crawler.getStockSubcategory(number);
      const subcategory = await this.subcategoryRepository.findOrCreateOne(subcate || 'ETF');
      await this.stockRepository.update({ number }, { subcategory });
      await this.sleep(5);
    }
    await crawler.destory();
    this.logger.debug('DONE: handleCronSubcategory');
  }

  @Cron('0 */30 10-16 * * *') // Everyday every 30 minutes between 10am and 04pm
  async handleCronDistribution(): Promise<void> {
    this.logger.debug('CALLED: handleCronDistribution');
    const crawler = new Crawler();
    await crawler.init();
    const stocks = await this.stockRepository.getStocksHaveNoDistribution();
    const pureStocks = stocks.filter(
      ({ number }) =>
        !number.startsWith('010') && !number.startsWith('0200') && !number.startsWith('91'),
    );
    this.logger.debug(`We got ${pureStocks.length} stocks need to be process`);
    for (const { id, number } of pureStocks) {
      const dist = await crawler.getStockEquityDistribution(number);
      if (dist) {
        try {
          const distribution = new Distribution();
          distribution.stockId = id;
          distribution.date = dist.date;
          distribution.lessThan50 = dist.lessThan50;
          await distribution.save();
        } catch (error) {
          console.log(error);
        }
      }
      await this.sleep(5);
    }
    await crawler.destory();
    this.logger.debug('DONE: handleCronDistribution');
  }

  private async sleep(seconds: number): Promise<void> {
    await new Promise((res) => setTimeout(res, seconds * 1000));
  }
}
