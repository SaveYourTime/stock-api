import { EntityRepository, Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { groupBy } from 'lodash';
import { Hst } from './hst.entity';
import { Category } from './category.entity';
import { Subcategory } from './subcategory.entity';
import { Distribution } from './distribution.entity';
import { FilterStockDto } from './filter-stock.dto';

@EntityRepository(Hst)
export class HstRepository extends Repository<Hst> {
  async find7DaysHST({ start, end }: FilterStockDto): Promise<any> {
    const query = this.createQueryBuilder('h')
      .leftJoinAndSelect('h.stock', 's')
      .leftJoinAndMapOne('s.category', Category, 'c', 's.category = c.id')
      .leftJoinAndMapOne('s.subcategory', Subcategory, 'sc', 's.subcategory = sc.id')
      .leftJoinAndMapOne('s.distribution', Distribution, 'd', 's.id = d.stock_id')
      .orderBy('h.date', 'DESC')
      .addOrderBy('h.price_change_ratio', 'DESC')
      .addOrderBy('d.date', 'DESC');

    if (start && end) {
      query.where('h.date BETWEEN :start AND :end', { start, end });
    } else {
      query.where('h.date > SUBDATE(CURRENT_DATE, INTERVAL 7 DAY)');
    }
    const arrayOfHST = await query.getMany();

    const arrayOfHSTWithPrevious = await Promise.all(
      arrayOfHST.map(async (hst) => {
        const previous = await this.createQueryBuilder('h')
          .where('h.stock_id = :stockId', { stockId: hst.stockId })
          .andWhere('h.date > :date', { date: `${dayjs().year()}-01-01` })
          .orderBy('h.date', 'DESC')
          .getMany();
        return { ...hst, previous };
      }),
    );

    const hst = groupBy(arrayOfHSTWithPrevious, 'date');
    return hst;
  }
}
