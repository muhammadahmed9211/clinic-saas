import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  OnModuleInit,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ClientService } from './client.service';
import {
  GetAccountsRequest,
  GetAccountsRequestQuery,
} from './dto/get-account.dto';
import { BindAccountRequest } from './dto/bind-account.dto';
import { CreateClientRequest } from './dto/create-client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientTopics } from 'src/kafka/topics/mt5/client.topics.enum';
import { ClientKafka } from '@nestjs/microservices';
import { Mt5Account } from '../entities/mt5-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAccountRequestParams } from '../account/dto/update-account-rights.dto';
import { I18nContext } from 'nestjs-i18n';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { GetPostionsQueryDto } from 'src/admin/client/dto/trading-info.dto';
import { TradingService } from 'src/trading/trading.service';

@ApiTags('MT5 Client')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller({ path: 'mt5/client', version: '1' })
export class ClientController implements OnModuleInit {
  constructor(
    private readonly clientService: ClientService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    private readonly tradingService: TradingService,
  ) {}

  @Get('account-logins/:userId')
  getAccountLogins(@Param() getAccountLoginsDto) {
    return this.clientService.getAccountLogins(getAccountLoginsDto);
  }

  @Get('trading-accounts/:userId')
  async getAllAccounts(@Param() getAllAccountsDto: GetAccountsRequest) {
    const {live} = await this.clientService.getAllAccountsByUserId(+getAllAccountsDto.userId);
    const mt5Accounts = await this.mt5AccountRepository.find({
      where: { user: { id: +getAllAccountsDto.userId } },
    });

    return {
      live: live.map((account) => {
        return {
          ...account,
          id: mt5Accounts.find((a) => a.login == account.login)?.id,
          tradingType: mt5Accounts.find((a) => a.login == account.login)
            ?.tradingType,
          // group: '**********',
        };
      })
    }
  }

  @Post('bind-account')
  bindAccount(@Body() bindAccountDto: BindAccountRequest[]) {
    return this.clientService.bindAccount(bindAccountDto);
  }

  @Post()
  createClient(@Body() createClientDto: CreateClientRequest) {
    return this.clientService.createClient(createClientDto);
  }

  @Get('update-client-on-mt5/:userId')
  syncOneClient(@Param() dto: GetAccountsRequest) {
    return this.clientService.syncOneClient(dto);
  }

  @Get('sync-clients')
  syncClients() {
    return this.clientService.syncClients();
  }

  @Get('update-groups-util')
  updateGroups(@Query() query: GetAccountsRequestQuery) {
    const { login } = query;
    return this.clientService.updateGroupsUtil(login);
  }


  @Get('deals/:login')
  async getDeals(
    @Query() query: GetPostionsQueryDto,
    @Param() params: UpdateAccountRequestParams,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const { page = 1, from, to } = query;
    let limit = query?.limit ?? 1000;

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const account = await this.mt5AccountRepository.findOne({
      where: { login: params.login },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    } 

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId: params.login,
      trade: 'closed',
      user: account?.user,
      from, 
      to,
    });

    const { data, hasNextPage } = infinityPagination(jsonData, { page, limit });
    const isSuccess = i18n?.t('success.client.dealsFetched');

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: isSuccess,
      result: {
        data,
        hasNextPage,
        total,
      },
    };
  }


  @Get('positions/:login')
  async getPostions(
    @Query() query: GetPostionsQueryDto,
    @Param() params: UpdateAccountRequestParams,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const { page = 1, from, to } = query;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    } 

    if (from && to && from > to) {
      throw new Error("The 'from' date must be before the 'to' date.");
    }

    const account = await this.mt5AccountRepository.findOne({
      where: { login: params.login },
      relations: ['user'],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const { info: jsonData, total } = await this.tradingService.get({
      paginationOptions: { page, limit },
      accountId: params.login,
      trade: 'open',
      user: account?.user,
      from,
      to,
    }); 

    const { data, hasNextPage } = infinityPagination(jsonData, {
      page,
      limit,
    });

    const isSuccess = i18n?.t('success.client.positionsFetched');

    return {
      status: 0,
      statusCode: HttpStatus.OK,
      message: isSuccess,
      result: {
        data,
        hasNextPage,
        total,
      },
    };
  }

  // @Get('update-groups-util')
  // updateOneGroups(){
  //   return this.clientService.updateGroupsUtil();
  // }

  onModuleInit() {
    // const servers = this.configService.getOrThrow(
    //   'kafka.mt5KafkaConsumerServers',
    //   { infer: true },
    // );

    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(ClientTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
