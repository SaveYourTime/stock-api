import { EntityRepository, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { Top } from './top.entity';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { Distribution } from './distribution.entity';
import { FilterStockDto } from './filter-stock.dto';

@EntityRepository(Top)
export class TopRepository extends Repository<Top> {
  async find7DaysTOP({ start, end }: FilterStockDto): Promise<any> {
    const query = this.createQueryBuilder('t')
      .leftJoinAndSelect('t.stock', 's')
      .leftJoinAndMapOne('s.category', Category, 'c', 's.category = c.id')
      .leftJoinAndMapOne('s.subcategory', Subcategory, 'sc', 's.subcategory = sc.id')
      .leftJoinAndMapOne('s.distribution', Distribution, 'd', 's.id = d.stock_id')
      .orderBy('t.date', 'DESC')
      .addOrderBy('t.price_change_ratio', 'DESC')
      .addOrderBy('d.date', 'DESC');

    if (start && end) {
      query.where('t.date BETWEEN :start AND :end', { start, end });
    } else {
      query.where('t.date > SUBDATE(CURRENT_DATE, INTERVAL 7 DAY)');
    }
    const arrayOfTOP = await query.getMany();

    const arrayOfTOPWithPrevious = await Promise.all(
      arrayOfTOP.map(async (hst) => {
        const previous = await this.createQueryBuilder('t')
          .where('t.stock_id = :stockId', { stockId: hst.stockId })
          .andWhere('t.date > :date', { date: `${dayjs().year()}-01-01` })
          .orderBy('t.date', 'DESC')
          .getMany();
        return { ...hst, previous };
      }),
    );

    const unsortedTop = groupBy(arrayOfTOPWithPrevious, 'date');

    const top = Object.entries(unsortedTop).reduce((data, [key, value]) => {
      const limitUp = [];
      const rest = [];
      (value as any[]).forEach((stock) => {
        const { closingPrice, highest, priceChangeRatio } = stock;
        if (closingPrice === highest && priceChangeRatio >= 9.2) {
          limitUp.push(stock);
        } else {
          rest.push(stock);
        }
      });
      limitUp.sort((a, b) => a.rank - b.rank);
      data[key] = [...limitUp, ...rest];
      return data;
    }, {});
    return top;
  }
}
