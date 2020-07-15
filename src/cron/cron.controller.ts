import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CronService } from './cron.service';

@ApiTags('cron')
@Controller('cron')
export class CronController {
  constructor(private cronService: CronService) {}

  @Get('hst')
  async handleCronHST(): Promise<void> {
    return await this.cronService.handleCronHST();
  }

  @Get('top')
  async handleCronTOP(): Promise<void> {
    return await this.cronService.handleCronTOP();
  }

  @Get('detail')
  async handleCronDetail(): Promise<void> {
    return await this.cronService.handleCronDetail();
  }

  @Get('distribution')
  async handleCronDistribution(): Promise<void> {
    return await this.cronService.handleCronDistribution();
  }
}
