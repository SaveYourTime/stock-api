import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfig } from './config/ormconfig';
import { StocksModule } from './stocks/stocks.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ScheduleModule.forRoot(),
    StocksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
