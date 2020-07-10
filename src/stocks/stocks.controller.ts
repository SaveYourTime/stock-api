import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Stock> {
    return this.stocksService.findOne(id);
  }
}
