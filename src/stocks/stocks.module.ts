import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { StockRepository } from './stock.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StockRepository])],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
