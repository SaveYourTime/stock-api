import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from './config/ormconfig';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), StocksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
