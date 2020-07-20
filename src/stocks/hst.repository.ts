import { EntityRepository, Repository } from 'typeorm';
import { Hst } from './hst.entity';
import { Category } from './category.entity';
import { Distribution } from './distribution.entity';

@EntityRepository(Hst)
export class HstRepository extends Repository<Hst> {
  async find7DaysHST(): Promise<any> {
    const arrayOfHST = await this.createQueryBuilder('h')
      .leftJoinAndSelect('h.stock', 's')
      .leftJoinAndMapOne('s.category', Category, 'c', 's.category = c.id')
      .leftJoinAndMapOne(
        's.distribution',
        Distribution,
        'd',
        's.id = d.stock_id',
      )
      .where('h.date > SUBDATE(CURRENT_DATE, INTERVAL 7 DAY)')
      .orderBy('h.date', 'DESC')
      .addOrderBy('h.price_change_ratio', 'DESC')
      .addOrderBy('d.date', 'DESC')
      .getMany();
    const hst = arrayOfHST.reduce((items, item) => {
      const key = item.date.toString();
      if (items[key]) {
        items[key].push(item);
        return items;
      }
      items[key] = [item];
      return items;
    }, {});
    return hst;
  }
}
