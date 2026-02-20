/**
 * Price History Controller
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - AllConfigType: src/config/config.types → src/config/config.type
 */

import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import {
  GetHistoryQuery,
  GetMarketDepth,
  GetSymbolInfoQuery,
  GetTickHistoryDto,
  SymbolPriceDto,
} from './dto/get-price.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { AllConfigType } from 'src/config/config.type';
import { PriceHistoryService } from './price-history.service';
import { RouteCacheInterceptor } from 'src/common/interceptors/route-cache.interceptor';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';

@ApiTags('Price History')
@Controller({
  path: 'price-history',
  version: '1',
})
export class PriceHistoryController implements OnModuleInit {
  constructor(
    private readonly mt5Service: PriceHistoryService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
  ) {}

  onModuleInit() {
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(PriceTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(
        `${env}.${'live'}.${topic}`,
        // `${env}.${env === 'dev' || env === 'local' ? 'fsca.' : ''}${'live'}.${topic}`,
      );
    });
  }
}

@ApiTags('Price History')
@Controller({
  path: 'public/price-history',
  version: '1',
})
export class PublicPriceHistoryController {
  constructor(private readonly mt5Service: PriceHistoryService) {}

  @Get('history')
  @UseInterceptors(RouteCacheInterceptor)
  @ApiOperation({
    summary: 'Get price for symbols',
    description:
      'Endpoint get price history for the provided symbols and ranges.',
  })
  getHistory(@Query() query: GetHistoryQuery) {
    return this.mt5Service.getPriceHistory(query);
  }

  @Get('symbol_info')
  @ApiOperation({
    summary: 'Get graph data for symbols for groups',
    description:
      'Endpoint get price history for the provided symbols and ranges.',
  })
  symbolInfo(@Query() query: GetSymbolInfoQuery) {
    return this.mt5Service.getSymbolInfoFormatted(query);
  }

  @Get('config')
  // @UseInterceptors(RouteCacheInterceptor)
  @ApiOperation({
    summary: 'Get graph data for symbols for groups',
    description:
      'Endpoint get price history for the provided symbols and ranges.',
  })
  config() {
    return this.mt5Service.getConfig();
  }

  @Get('quotes')
  @ApiOperation({
    summary: 'Get quotes for a symbol',
    description: 'Endpoint to retrieve quotes for a specific symbol',
  })
  getQuotes(@Query() query: SymbolPriceDto) {
    return this.mt5Service.getQuotes(query);
  }

  @Get('group-quotes')
  @ApiOperation({
    summary: 'Get quotes for a group',
    description: 'Endpoint to retrieve quotes for a symbol group',
  })
  getGroupQuotes(
    @Query() query: { symbol?: string; group?: string; trans_id?: number },
  ) {
    return this.mt5Service.getGroupQuotes(query);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Get symbol statistics',
    description: 'Endpoint to retrieve statistics for a symbol',
  })
  getStatistics(@Query() query: SymbolPriceDto) {
    return this.mt5Service.getStatistics(query);
  }

  @Get('tick-history')
  @ApiOperation({
    summary: 'Get tick history',
    description: 'Endpoint to retrieve tick history for a symbol',
  })
  getTickHistory(
    @Query()
    query: GetTickHistoryDto,
  ) {
    return this.mt5Service.getTickHistory(query);
  }

  @Get('market-depth')
  @ApiOperation({
    summary: 'Get market depth',
    description: 'Endpoint to retrieve market depth for a symbol',
  })
  getMarketDepth(@Query() query: GetMarketDepth) {
    return this.mt5Service.getMarketDepth(query);
  }
}
