import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  ParseBoolPipe,
  Param,
  Post,
  Query,
  UseGuards,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { TradingService } from './trading.service';
import { AuthGuard } from '@nestjs/passport';
import { infinityPagination } from '../utils/infinity-pagination';
import { QueryTradingInfoDto } from './dto/trading-info.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ClientService as Mt5ClientService } from 'src/mt5/client/client.service';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { ChangeLeverageDto } from './dto/leverage-change.dto';
import { OperatorRole, Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { RoleEnum } from 'src/roles/roles.enum';
import { TradeRequestDto } from './dto/trade-request.dto';
import { AccountTopics } from 'src/kafka/topics/mt5/account.topics.enum';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';

@ApiTags('Admin Trading')
@Controller({
  path: 'admin/trading',
  version: '1',
})
export class AdminTradingController {
  constructor(
    private readonly tradingService: TradingService,
    private readonly mt5ClientService: Mt5ClientService,
  ) {}

  @ApiBearerAuth()
  @Get('info')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getTradingInfo(
    @Query() query: QueryTradingInfoDto,
    @GetUser() user: User,
  ) {
    const { accountId, page = 1, trade = 'all', from, to } = query;
    const limit = query?.limit ?? 10;
    // if (limit > 50) {
    //   limit = 50;
    // }

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId,
      trade,
      user,
      from,
      to,
    });

    const { data, hasNextPage } = infinityPagination(jsonData, { page, limit });

    const stats = await this.mt5ClientService.getClientAccountSummary(
      user.id,
      accountId,
    );

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: {
        tradingInfo: { data, hasNextPage, total },
        tradingStats: { data: ResponseWrapper.unwrap(stats) },
      },
    };
  }

  @ApiBearerAuth()
  @Get('stats')
  @OperatorRole()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getStats(@GetUser() user: User) {
    return this.mt5ClientService.getClientAccountSummary(user.id);
  }
}

@ApiTags('Client Trading')
@Controller({
  path: 'client/trading',
  version: '1',
})
export class ClientTradingController {
  constructor(
    private readonly tradingService: TradingService,
    private readonly mt5ClientService: Mt5ClientService,
  ) {}
  @ApiBearerAuth()
  @Get('info')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getTradingInfo(
    @Query() query: QueryTradingInfoDto,
    @GetUser() user: User,
  ) {
    const { accountId, page = 1, trade = 'all', from, to } = query;
    const limit = query?.limit ?? 10;
    // if (limit > 50) {
    //   limit = 50;
    // }

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId,
      trade,
      user,
      from,
      to,
    });

    const { data, hasNextPage } = infinityPagination(jsonData, { page, limit });

    const stats = await this.mt5ClientService.getClientAccountSummary(
      user.id,
      accountId,
    );

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: {
        tradingInfo: { data, hasNextPage, total },
        tradingStats: { data: ResponseWrapper.unwrap(stats) },
      },
    };
  }

  @ApiBearerAuth()
  @Get('stats')
  @Roles(RoleEnum.client)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  getStats(@GetUser() user: User) {
    return this.mt5ClientService.getClientAccountSummary(user.id);
  }
}

@ApiTags('Trading')
@Controller({
  path: 'trading',
  version: '1',
})
export class TradingController {
  constructor(
    private readonly tradingService: TradingService,
    private readonly mt5ClientService: Mt5ClientService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}
  @ApiBearerAuth()
  @Get('/info')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async getTradingInfo(
    @Query() query: QueryTradingInfoDto,
    @GetUser() user: User,
  ) {
    const { accountId, page = 1, trade = 'all', from, to } = query;
    const limit = query?.limit ?? 10;
    // if (limit > 50) {
    //   limit = 50;
    // }

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId,
      trade,
      user,
      from,
      to,
    });

    const { data, hasNextPage } = infinityPagination(jsonData, { page, limit });

    const stats = await this.mt5ClientService.getClientAccountSummary(
      user.id,
      accountId,
    );

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: 'OK',
      result: {
        tradingInfo: { data, hasNextPage, total },
        tradingStats: { data: ResponseWrapper.unwrap(stats) },
      },
    };
  }

  @ApiBearerAuth()
  @Get('stats')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getStats(@GetUser() user: User) {
    return this.mt5ClientService.getClientAccountSummary(user.id);
  }

  @ApiBearerAuth()
  @Get('accounts-list')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getAllAccounts(@GetUser() user: User) {
    return this.tradingService.getAllAccounts(user);
  }

  @ApiBearerAuth()
  @Get('all-accounts-list')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getAllAccountsList(@GetUser() user: User) {
    return this.tradingService.getAllAccountsForListing(user);
  }

  @ApiBearerAuth()
  @Get('accounts-list/transfer')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getAccountListForTransfer(@GetUser() user: User) {
    return this.tradingService.getAccountListForTransfer(user.id);
  }

  @ApiBearerAuth()
  @Get('get-balance/:login')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getAccountBalance(@GetUser() user: User, @Param('login') login: string) {
    return this.tradingService.getAccountBalance(user, login);
  }

  @ApiBearerAuth()
  @Post('change-leverage')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  updateLeverage(@GetUser() user: User, @Body() body: ChangeLeverageDto) {
    return this.tradingService.changeLeverage(user, body);
  }

  @ApiBearerAuth()
  @Post('send-trade-request-kafka')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  tradeRequestKafka(
    @GetUser() user: User,
    @Body() body: TradeRequestDto,
    @Query('demo', ParseBoolPipe) demo: boolean,
  ) {
    const transformedDto = {
      ...body,
      Volume: this.transformVolume(body.Volume),
    };

    return this.tradingService.openTradeKafka(user, transformedDto, demo);
  }

  @ApiBearerAuth()
  @Post('send-trade-request')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  tradeRequest(
    @GetUser() user: User,
    @Body() body: TradeRequestDto,
    @Query('demo', ParseBoolPipe) demo: boolean,
  ) {
    const transformedDto = {
      ...body,
      Volume: this.transformVolume(body.Volume),
    };

    return this.tradingService.openTrade(user, transformedDto, demo);
  }

  @ApiBearerAuth()
  @Post('trade-request-result')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get trade request results' })
  @ApiQuery({
    name: 'id',
    required: true,
    description: 'Comma-separated list of request IDs',
    example: '1,2,3',
  })
  @ApiQuery({
    name: 'demo',
    required: true,
    description: 'Whether to use demo or live trading mode',
    type: Boolean,
    example: true,
  })
  async tradeRequestResult(
    @GetUser() user: User,
    @Query(
      'id',
      new ParseArrayPipe({
        separator: ',',
        items: String,
        optional: false,
      }),
    )
    ids: string[],
    @Query('demo', ParseBoolPipe) demo: boolean,
  ) {
    return this.tradingService.tradeRequestResult(user, ids, demo);
  }

  private transformVolume(volume: string): string {
    const numValue = parseFloat(volume);
    if (!isNaN(numValue)) {
      return String(numValue * 10000);
    }
    return volume;
  }

  onModuleInit() {
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(AccountTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });

    Object.values(PriceTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
