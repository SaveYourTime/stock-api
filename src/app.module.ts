import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmConfig } from './config/ormconfig';
import { StocksModule } from './stocks/stocks.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(TypeOrmConfig),
    ScheduleModule.forRoot(),
    StocksModule,
    CronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
