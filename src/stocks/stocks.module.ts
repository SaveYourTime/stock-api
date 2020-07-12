import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { StockRepository } from './stock.repository';
import { CategoryRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StockRepository, CategoryRepository])],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
