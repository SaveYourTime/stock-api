import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CronService } from './cron.service';
import { FilterDateDto } from './filter-date.dto';

@ApiTags('cron')
@Controller('cron')
export class CronController {
  constructor(private cronService: CronService) {}

  @Get('hst')
  async handleCronHST(): Promise<void> {
    return await this.cronService.handleCronHST();
  }

  @Get('top')
  async handleCronTOP(@Query() filterDateDto?: FilterDateDto): Promise<void> {
    return await this.cronService.handleCronTOP(filterDateDto.date);
  }

  @Get('detail')
  async handleCronDetail(): Promise<void> {
    return await this.cronService.handleCronDetail();
  }

  @Get('subcategory')
  async handleCronSubcategory(): Promise<void> {
    return await this.cronService.handleCronSubcategory();
  }

  @Get('distribution')
  async handleCronDistribution(): Promise<void> {
    return await this.cronService.handleCronDistribution();
  }
}
