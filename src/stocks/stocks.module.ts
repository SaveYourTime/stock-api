import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { StockRepository } from './stock.repository';
import { CategoryRepository } from './category.repository';
import { SubcategoryRepository } from './subcategory.repository';
import { HstRepository } from './hst.repository';
import { TopRepository } from './top.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockRepository,
      CategoryRepository,
      SubcategoryRepository,
      HstRepository,
      TopRepository,
    ]),
  ],
  controllers: [StocksController],
  providers: [StocksService],
  exports: [TypeOrmModule],
})
export class StocksModule {}
