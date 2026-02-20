import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { InsightsService } from './insights.service';
import {
  GeneralInsightDto,
  InsightResponseDto,
  PivotPointDto,
  TradersSentimentDto,
} from './dtos/insights.dto';

@Controller({
  path: 'insights',
  version: '1',
})
@ApiTags('Trading Insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('currency/:symbol')
  @ApiOperation({
    summary: 'Get trading insights for a symbol',
    description:
      'Returns general insights, traders sentiment, and pivot points for the specified symbol',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Symbol (e.g., EURUSD, GBPUSD, USDJPY)',
    example: 'EURUSD',
  })
  @ApiResponse({
    status: 200,
    description: 'Trading insights retrieved successfully',
    type: InsightResponseDto,
  })
  getCurrencyInsights(@Param('symbol') pair: string): InsightResponseDto {
    return this.insightsService.getCurrencyPairInsights(pair);
  }

  @Get('sentiment/:symbol')
  @ApiOperation({
    summary: 'Get traders sentiment for a symbol',
    description:
      'Returns the current sentiment breakdown between buyers and sellers',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Symbol',
    example: 'EURUSD',
  })
  @ApiResponse({
    status: 200,
    description: 'Traders sentiment retrieved successfully',
    type: TradersSentimentDto,
  })
  getTradersSentiment(@Param('symbol') pair: string): TradersSentimentDto {
    return this.insightsService.getTradersSentiment(pair);
  }

  @Get('pivot-points/:symbol')
  @ApiOperation({
    summary: 'Get pivot points for a symbol',
    description:
      'Returns resistance and support levels using classic and Fibonacci calculations',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Symbol',
    example: 'EURUSD',
  })
  @ApiResponse({
    status: 200,
    description: 'Pivot points retrieved successfully',
    type: [PivotPointDto],
  })
  getPivotPoints(@Param('symbol') pair: string): PivotPointDto[] {
    return this.insightsService.getPivotPoints(pair);
  }

  @Get('general/:symbol')
  @ApiOperation({
    summary: 'Get general market data for a symbol',
    description:
      'Returns basic market data including open, bid, ask, previous close, ranges, and yearly change',
  })
  @ApiParam({
    name: 'symbol',
    description: 'Symbol',
    example: 'EURUSD',
  })
  @ApiResponse({
    status: 200,
    description: 'General insights retrieved successfully',
    type: GeneralInsightDto,
  })
  getGeneralInsights(@Param('symbol') pair: string): GeneralInsightDto {
    const insights = this.insightsService.getCurrencyPairInsights(pair);
    return insights.generalInsight;
  }

  @Get('symbols')
  @ApiOperation({
    summary: 'Get list of supported symbols',
    description: 'Returns all available symbols for trading insights',
  })
  @ApiResponse({
    status: 200,
    description: 'Supported symbols retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        sumbols: {
          type: 'array',
          items: { type: 'string' },
          example: ['EURUSD', 'GBPUSD', 'USDJPY'],
        },
      },
    },
  })
  getSupportedPairs(): { pairs: string[] } {
    return {
      pairs: ['EURUSD', 'GBPUSD', 'USDJPY'],
    };
  }
}
