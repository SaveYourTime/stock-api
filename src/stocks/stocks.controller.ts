import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiParam } from '@nestjs/swagger';
import { StocksService } from './stocks.service';
import { Stock } from './stock.entity';
import { FilterStockDto } from './filter-stock.dto';

@ApiTags('stocks')
@Controller('stocks')
export class StocksController {
  constructor(private stocksService: StocksService) {}

  @Get('hst')
  find7DaysHST(@Query() filterStockDto?: FilterStockDto): Promise<void> {
    return this.stocksService.find7DaysHST(filterStockDto);
  }

  @Get('top')
  find7DaysTOP(@Query() filterStockDto?: FilterStockDto): Promise<void> {
    return this.stocksService.find7DaysTOP(filterStockDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 1 })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Stock> {
    return this.stocksService.findOne(id);
  }
}
