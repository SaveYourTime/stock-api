import { EntityRepository, Repository } from 'typeorm';
import { Stock } from './stock.entity';

@EntityRepository(Stock)
export class StockRepository extends Repository<Stock> {}
