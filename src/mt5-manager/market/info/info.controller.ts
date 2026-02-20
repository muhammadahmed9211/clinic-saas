/**
 * Market Info Controller
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */

import {
  Controller,
  Get,
  Inject,
  OnApplicationBootstrap,
  Param,
  Request,
} from '@nestjs/common';
import { InfoService } from './info.service';
import { ApiTags } from '@nestjs/swagger';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';

@ApiTags('Info')
@Controller({
  path: 'info',
  version: '1',
})
export class InfoController implements OnApplicationBootstrap {
  constructor(
    private readonly infoService: InfoService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}
  @Get('market-status/:symbolId')
  getMarketStatus(@Request() req, @Param('symbolId') symbolId: string) {
    return this.infoService.getMarketStatus(symbolId);
  }
  @Get('product-specification/:symbolId')
  getProductSpecification(@Param('symbolId') symbolId: string) {
    return this.infoService.getProductSpecification(symbolId);
  }
  @Get('swap-rates/:symbolId')
  getSwapRates(@Param('symbolId') symbolId: string) {
    return this.infoService.getSwapRates(symbolId);
  }
  @Get('session-quotes/:symbolId')
  getQuotes(@Request() req, @Param('symbolId') symbolId: string) {
    return this.infoService.getQuotes(symbolId);
  }
  @Get('margin/:symbolId')
  getMargin(@Param('symbolId') symbolId: string) {
    return this.infoService.getMarginInfo(symbolId);
  }
  @Get('live-analytics/:symbolId')
  getLiveAnalytics(@Param('symbolId') symbolId: string) {
    return this.infoService.getLiveAnalytics(symbolId);
  }

  onApplicationBootstrap() {
    // Subscribe after all modules are initialized to avoid consumer rebalancing issues
    // This ensures all subscriptions happen together before the consumer starts
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(PriceTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      console.log('subscribing to topic:', `${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
