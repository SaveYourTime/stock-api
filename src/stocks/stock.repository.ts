import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { Hst } from './hst.entity';
import { Top } from './top.entity';
import { StockInfo } from '../crawler/stock-info.interface';

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {
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
        console.log(`HST: ${name} already exists`);
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
        console.log(`TOP: ${name} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
