import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  OnApplicationBootstrap,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PriceService } from './price.service';
import {
  GetGroupQuotes,
  GetMarketDepth,
  GetTickHistoryDto,
  SymbolPriceDto,
} from './dto/get-price.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { PriceTopics } from './price.topics.enum';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';

@ApiTags('MT5 Price')
@Controller({ path: 'mt5/price', version: '1' })
export class PriceController implements OnApplicationBootstrap {
  constructor(
    private readonly mt5Service: PriceService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  //fav-symbol-mark-unmark
  @Roles(RoleEnum.client)
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({
    summary: 'Marks or Unmarks a favourite symbol',
    description:
      'Toggles favourite symbol in the database based on isFavourite flag.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symbolId: { type: 'number', example: 323 },
        isFavourite: { type: 'boolean', example: true },
      },
      required: ['symbolId', 'isFavourite'],
    },
  })
  @ApiResponse({ status: 404, description: 'No corresponding Symbol found' })
  @ApiResponse({
    status: 201,
    description: 'Favourite symbol toggled successfully',
  })
  @Post('mark-unmark-favourite-symbol')
  async markOrUnmarkFavouriteSymbol(
    @Body('symbolId') symbolId: number,
    @Body('isFavourite') isFavourite: boolean,
    @GetUser() user: User,
  ) {
    const userId = user.id;
    const result = await this.mt5Service.toggleFavouriteSymbol(
      userId,
      symbolId,
      isFavourite,
    );
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: HttpStatus.OK,
      statusText: isFavourite
        ? 'Favourite symbol added successfully'
        : 'Favourite symbol removed successfully',
      data: result,
    });
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @Delete('remove-favourite-symbol')      MARK UNMARK IS NOW 1 API
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       symbolId: { type: 'number', example: 3258 },
  //     },
  //     required: ['symbolId'],
  //   },
  // })
  // @ApiOperation({
  //   summary: 'Deletes favourite symbol',
  //   description: 'Deletes a favourite symbol from the database.',
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'No corresponding Symbol found',
  // })
  // async removeFavouriteSymbol(
  //   @GetUser() user: User,
  //   @Body('symbolId') symbolId: number,
  // ) {
  //   const userId = user.id;
  //   if (!userId) {
  //     throw new UnauthorizedException('User ID not found in token.');
  //   }
  //   if (!symbolId) {
  //     throw new UnauthorizedException('Symbol ID is required.');
  //   }
  //   const result = await this.mt5Service.removeFavouriteSymbol(
  //     userId,
  //     symbolId,
  //   );
  //   return ResponseWrapper.wrap({
  //     status: Status.SUCCESS,
  //     statusCode: HttpStatus.CREATED,
  //     statusText: 'Favourite symbol deleted successfully',
  //     data: result,
  //   });
  // }

  @Get('gold-info')
  getGoldInfo() {
    return this.mt5Service.getGoldInfo();
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
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}

@ApiTags('MT5 Price')
@Controller({ path: 'public/mt5/price', version: '1' })
export class PublicPriceController implements OnApplicationBootstrap {
  constructor(
    private readonly mt5Service: PriceService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  @Get('')
  @ApiOperation({
    summary: 'Get price for symbols',
    description:
      'Endpoint get prices from MT5 for the provided symbols or transaction id.',
  })
  getPrices(@Query() query: SymbolPriceDto) {
    return this.mt5Service.pricebySymbol(query);
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
  getGroupQuotes(@Query() query: GetGroupQuotes) {
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

  @Get('chart-history')
  @ApiOperation({
    summary: 'Get chart tick history',
    description: 'Endpoint to retrieve tick history for a symbol',
  })
  getM1History(
    @Query()
    query: GetTickHistoryDto,
  ) {
    return this.mt5Service.getM1History(query);
  }

  @Get('market-depth')
  @ApiOperation({
    summary: 'Get market depth',
    description: 'Endpoint to retrieve market depth for a symbol',
  })
  getMarketDepth(@Query() query: GetMarketDepth) {
    return this.mt5Service.getMarketDepth(query);
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
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
