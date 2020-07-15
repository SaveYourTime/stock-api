import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Hst } from './hst.entity';
import { Top } from './top.entity';
import { Stock } from './stock.entity';
import { Category } from './category.entity';
import { StockInfo } from './stock-info.interface';
import { StockDetail } from './stock-detail.interface';

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {
  private readonly logger = new Logger(StockRepository.name);
  async insertHST(hstStock: StockInfo): Promise<void> {
    const {
      number,
      name,
      date,
      closingPrice,
      highest,
      lowest,
      priceChangeRatio,
    } = hstStock;

    let stock = await this.findOne({ number });
    if (!stock) {
      stock = new Stock();
      stock.number = number;
      stock.name = name;
    }

    const hst = new Hst();
    hst.date = date;
    hst.closingPrice = closingPrice;
    hst.highest = highest;
    hst.lowest = lowest;
    hst.priceChangeRatio = priceChangeRatio;
    stock.hst = [...(stock.hst ?? []), hst];

    try {
      await stock.save();
    } catch (error) {
      if (error.errno === 1062) {
        this.logger.debug(`HST: ${name} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async insertTOP(topStock: StockInfo): Promise<void> {
    const {
      rank,
      number,
      name,
      date,
      openingPrice,
      closingPrice,
      highest,
      lowest,
      totalVolume,
      totalCost,
      priceChangeRatio,
    } = topStock;

    let stock = await this.findOne({ number });
    if (!stock) {
      stock = new Stock();
      stock.number = number;
      stock.name = name;
    }

    const top = new Top();
    top.rank = rank;
    top.date = date;
    top.openingPrice = openingPrice;
    top.closingPrice = closingPrice;
    top.highest = highest;
    top.lowest = lowest;
    top.totalVolume = totalVolume;
    top.totalCost = totalCost;
    top.priceChangeRatio = priceChangeRatio;
    stock.top = [...(stock.top ?? []), top];

    try {
      await stock.save();
    } catch (error) {
      if (error.errno === 1062) {
        this.logger.debug(`TOP: ${name} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async insertStockDetail(
    stockDetail: StockDetail,
    category: Category,
  ): Promise<void> {
    const {
      number,
      companyName,
      type,
      capital,
      description,
      dateOfListing,
      dateOfEstablishing,
    } = stockDetail;
    const stock = await this.findOne({ number });
    if (!stock) return;
    stock.companyName = companyName;
    stock.category = category;
    stock.type = type;
    stock.capital = capital;
    stock.description = description;
    stock.dateOfListing = dateOfListing;
    stock.dateOfEstablishing = dateOfEstablishing;
    await stock.save();
  }

  async getStocksWithoutDetail(): Promise<Stock[]> {
    const stocks = await this.find({
      select: ['number'],
      where: { categoryId: null },
    });
    return stocks;
  }

  async getStocksHaveNoDistribution(): Promise<Stock[]> {
    const stocks = await this.createQueryBuilder('s')
      .select(['s.id', 's.number', 'MAX(date) as date'])
      .leftJoin('s.distribution', 'd')
      .groupBy('s.id')
      .addGroupBy('s.number')
      .having('date IS null')
      .orHaving('date < SUBDATE(CURRENT_DATE, INTERVAL 10 DAY)')
      .getMany();
    return stocks;
  }
}
