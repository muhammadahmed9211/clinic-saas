import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  NotFoundException,
  OnApplicationBootstrap,
  Param,
  Patch,
  Post,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from './account.service';
import {
  GetAccountByLoginRequest,
  GetLiveAccountsByTradingTypeRequest,
} from './dto/get-account-by-login-request.dto';
import { DeleteAccountRequest } from './dto/delete-account.dto';
import { CreateAccountRequest } from './dto/create-account.dto';
import {
  ChangeLeverageRequest,
  UpdateAccountRequest,
} from './dto/update-account.dto';
import { GetMultipleAccountsRequest } from './dto/get-multiple-accounts.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AccountTopics } from 'src/kafka/topics/mt5/account.topics.enum';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { BonusCreditDto, CreditParam, CreditRequest } from './dto/credit.dto';
import { ServerName } from 'src/wallet/entities/server.entity';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { MakeDefaultAccountRequest } from './dto/make-default-account.dto';
import { CommissionTopics } from 'src/kafka/topics/ib/commission.topics.enum';

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@ApiTags('MT5 Accounts')
@Controller({
  path: 'mt5/account',
  version: '1',
})
export class AccountController implements OnApplicationBootstrap {
  constructor(
    private readonly accountService: AccountService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  getAllTradingAccounts(
    @Body() body: ApplyListFilterSortColumnDto,
    @Query() query: PaginationDto,
    @GetUser() user: User,
  ) {
    return this.accountService.getAllTradingAccounts(user, body, query);
  }

  @Get('get-mutiple')
  getMultipleAccounts(
    @Query() getMultipleAccountsDto: GetMultipleAccountsRequest,
  ) {
    return this.accountService.getMultipleAccounts(getMultipleAccountsDto);
  }

  @Post()
  async createAccount(
    @Body() createAccountDto: CreateAccountRequest,
    @GetUser() user: User,
  ) {
    switch (createAccountDto.Server.toLowerCase()) {
      case 'mt5-live':
        return this.accountService.createAccount(
          {
            ...createAccountDto,
            Server: ServerName.LIVE,
          },
          user,
        );
      case 'mt5-demo':
        return this.accountService.createDemoAccount(
          {
            ...createAccountDto,
            Server: ServerName.DEMO,
          },
          user,
        );
      default:
        throw new NotFoundException('Server not found');
    }
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard('jwt'))
  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  // @Patch(':login')
  // updateAccount(
  //   @Param() updateAccountParam: GetAccountByLoginRequest,
  //   @Body() updateAccountDto: UpdateAccountRequest,
  // ) {
  //   console.log(updateAccountParam, updateAccountDto);
  //   return this.accountService.updateAccount(
  //     updateAccountParam.login,
  //     updateAccountDto,
  //   );
  // }

  @Get(':login')
  getAccountByLogin(@Param() getAccountByLoginDto: GetAccountByLoginRequest) {
    return this.accountService.getOneAccount(getAccountByLoginDto);
  }

  @Get('stats/all')
  getAccountStates(@GetUser() user: User) {
    return this.accountService.getStats(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({
    groups: ['admin'],
  })
  @Delete(':login')
  deleteAccount(@Param() deleteAccountDto: DeleteAccountRequest) {
    return this.accountService.deleteAccount(deleteAccountDto);
  }

  @Put('make-default/:login')
  @ApiParam({ name: 'login', type: String })
  makeAccountDefault(@Param('login') login: string, @GetUser() user: User) {
    return this.accountService.makeDefaultAccount(login, user.id);
  }

  @Get('list/demo')
  async getDemoAccounts(@GetUser() user: User) {
    try {
      const accounts = await this.accountService.getDemoAccountsByUser(user.id);

      const mt5Accounts = await this.accountService.getAccountsFromDB(user.id);

      return ResponseWrapper.wrap({
        status: 0,
        statusCode: HttpStatus.OK,
        statusText: 'Demo Accounts Fecthed Successfuly.',
        data: {
          accounts: accounts.map((account) => ({
            ...account,
            server: mt5Accounts.find(
              (mt5Account) => mt5Account.login === account.login,
            )?.server.name,
            isDefault: mt5Accounts.find(
              (mt5Account) => mt5Account.login === account.login,
            )?.isDefault,
          })),
          totals: this.accountService.getTotals(accounts),
        },
      });
    } catch (error) {
      console.log('Error fetching demo accounts: ', error);
      throw new HttpException(
        'Error fetching demo accounts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('list/live')
  async getLiveAccounts(
    @GetUser() user: User,
    @Query() query: GetLiveAccountsByTradingTypeRequest,
  ) {
    try {
      const accounts = await this.accountService.getLiveAccountsByUserFromDB(
        user.id,
        false,
        query,
      );
      // const mt5Accounts = await this.accountService.getAccountsFromDB(user.id);

      return ResponseWrapper.wrap({
        status: 0,
        statusCode: HttpStatus.OK,
        statusText: 'Live Accounts Fecthed Successfuly.',
        data: {
          // accounts: accounts.map((account) => ({
          //   ...account,
          //   tradingType:
          //     mt5Accounts.find(
          //       (mt5Account) => mt5Account.login === account.login,
          //     )?.tradingType?.name ?? '',
          //   server: mt5Accounts.find(
          //     (mt5Account) => mt5Account.login === account.login,
          //   )?.server.name,
          // })),
          accounts,
          totals: this.accountService.getTotals(accounts),
        },
      });
    } catch (error) {
      console.log('Error fetching live accounts: ', error);
      throw new HttpException(
        'Error fetching live accounts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    return this.accountService.changePassword(
      changePasswordDto,
      'client',
      user,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add credit' })
  @ApiResponse({
    description: 'Add credit to a trading account.',
  })
  @Post('/add-credit/:id')
  addCredit(
    @Param() params: CreditParam,
    @Body() addCreditDto: CreditRequest,
    @GetUser() user: User,
  ) {
    return this.accountService.credit(
      {
        ...addCreditDto,
        login: +params?.id,
      },
      user.id,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subtract credit' })
  @ApiResponse({
    description: 'Subtract credit from a trading account.',
  })
  @Post('/subtract-credit/:id')
  subtractCredit(
    @Body() subtractCreditDto: CreditRequest,
    @Param() params: CreditParam,
    @GetUser() user: User,
  ) {
    return this.accountService.credit(
      {
        ...subtractCreditDto,
        balance: -subtractCreditDto.balance,
        login: +params?.id,
      },
      user.id,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add bonus' })
  @ApiResponse({
    description: 'Add bonus to a trading account.',
  })
  @Post('/add-bonus/:id')
  addBonus(
    @Param() params: CreditParam,
    @Body() addCreditDto: BonusCreditDto,
    @GetUser() user: User,
  ) {
    return this.accountService.bonus(
      {
        ...addCreditDto,
        login: +params?.id,
      },
      user.id,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Subtract bonus' })
  @ApiResponse({
    description: 'Subtract bonus to a trading account.',
  })
  @Post('/subtract-bonus/:id')
  subtractBonus(
    @Body() subtractCreditDto: BonusCreditDto,
    @Param() params: CreditParam,
    @GetUser() user: User,
  ) {
    return this.accountService.bonus(
      {
        ...subtractCreditDto,
        balance: -subtractCreditDto.balance,
        login: +params?.id,
      },
      user.id,
    );
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update Leverage' })
  @ApiResponse({
    description: 'Update leverage of a trading account.',
  })
  @Post('/update-leverage/:login')
  changeLeverage(
    @Param() param: GetAccountByLoginRequest,
    @Body() dto: ChangeLeverageRequest,
    @GetUser() user: User,
  ) {
    return this.accountService.changeLeverage(
      param.login,
      {
        Leverage: dto.leverage,
      } as UpdateAccountRequest,
      user,
    );
  }

  @Get(':login/trade-state')
  getTradeState(@Param('login') login: string, @GetUser() user: User) {
    return this.accountService.getTradeState(+login, user);
  }

  onApplicationBootstrap() {
    // Subscribe after all modules are initialized to avoid consumer rebalancing issues
    // This ensures all subscriptions happen together before the consumer starts
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    const regulations = this.configService.getOrThrow(
      'app.mt5RegulationServers',
      {
        infer: true,
      },
    );

    Object.values(AccountTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      console.log('subscribing to topic:', `${env}.${'demo'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });

    Object.values(CommissionTopics).forEach((topic) => {
      console.log('subscribing to topic:', `${env}.${'live'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
    });
  }
}
