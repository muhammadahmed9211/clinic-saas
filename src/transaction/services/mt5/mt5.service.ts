import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { AccountService } from 'src/mt5/account/account.service';
import { ClientsService } from 'src/users/clients.service';
import { TradeRequestService } from 'src/mt5/trading/trade-requests/trade-requests.service';
import { Mt5RetCode } from 'src/utils/enums/mt5/response-codes.enum.';
import { Client } from 'src/users/entities/client.entity';
import { RegulationsConfigService } from 'src/admin/regulations/regulations-config/regulations-config.service';
import { ServerName } from 'src/wallet/entities/server.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { RegulationEventKeys } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { RegulationRuleKeys } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { AccountTradingType } from 'src/mt5/account/dto/create-account.dto';
import { BonusCreditDto } from 'src/mt5/account/dto/credit.dto';
import { HttpService } from '@nestjs/axios';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class MT5Service {
  constructor(
    @Inject(forwardRef(() => AccountService))
    private readonly accountService: AccountService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    private readonly tradeRequestService: TradeRequestService,
    private readonly regulationsConfigService: RegulationsConfigService,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async execMt5ManagerCall(url: string, body: any, method: 'get' | 'post') {
    try {
      const base_url = this.configService.getOrThrow('app.mt5ManagerLiveUrl', {
        infer: true,
      });

      let apiUrl = `${base_url}${url}`;
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      if (method === 'get') {
        if (body.login) {
          const str = `?login=${body.login}`;
          apiUrl = apiUrl + str;
        }
        const { data } = await this.httpService.axiosRef.get(apiUrl, config);
        return data;
      }

      const { data } = await this.httpService.axiosRef.post(
        apiUrl,
        body,
        config,
      );
      return data;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('An error occurred');
    }
  }

  async getUserMT5Account(login: string, userId: number) {
    const server = await this.accountService.checkAccountServer(login);
    if (server !== 'live') {
      throw new BadRequestException('Cannot transfer in demo account');
    }
    const body = { login: login };
    const account = await this.execMt5ManagerCall(
      '/account/get-account-by-login',
      body,
      'get'
    );
    if (!account) {
      throw new BadRequestException('An error occurred');
    }
    // const account = await this.accountService.getOneAccount(body);
    const email = account?.result?.answer?.Email
      ? account?.result?.answer?.Email
      : account?.result?.Email;
    if (!email) {
      throw new NotFoundException('Account does not exist');
    }
    const userData = await this.clientsService.findOne({ id: userId });
    if (userData?.email?.toLowerCase() !== email.toLowerCase()) {
      throw new NotFoundException('Account does not exist');
    }
    return account;
  }

  async verifyMT5Balance(login: string, userId: number, amount: number) {
    const account = await this.getUserMT5Account(login, userId);
    let balanceKey = account?.result?.answer?.Balance;
    if (!balanceKey) {
      balanceKey = account?.result?.Balance;
    }
    const balance = Number(balanceKey ? balanceKey : 0);

    // (write by Usman)
    if (amount > balance) {
      throw new BadRequestException('Insufficient balance');
    }
    return account;
  }

  async updateMT5Balance(login: string, amount: number, comment: string) {
    console.log('updateMT5Balance, login: ', login, 'amount: ', amount);
    const mt5Comment = comment ? comment : '';
    const body = {
      login:Number(login),
      balance: amount,
      type: 2,
      comment: mt5Comment,
    };

    const isDebited = await this.execMt5ManagerCall(
      '/account/update-balance',
      body,
      'post'
    );
    if (!isDebited) {
      throw new BadRequestException('An error occurred');
    }
    // const isDebited = await this.tradeRequestService.updateBalance(body);
    if (isDebited?.result?.retcode === Mt5RetCode.SUCCESS) {
      return isDebited;
    }
    console.log(isDebited);
    throw new BadRequestException(isDebited?.message ?? 'An error occurred');
  }

  async createMt5AccountOnFTD(
    regulationId: number,
    user: User,
    client: Client,
    tranaction?:Transaction
  ) {
    const [shouldCreateOnFTD] =
      await this.regulationsConfigService.isAllowedInRegulation(
        regulationId,
        RegulationEventKeys.mt5_live_account_creation,
        [RegulationRuleKeys.on_ftd],
      );
    if (shouldCreateOnFTD) {
      const existingAccounts = await this.mt5AccountRepository.count({
        where: { user: { id: user.id }, server: { name: ServerName.LIVE } },
      });
      if (existingAccounts < 1) {
        const account = await this.accountService.createAccount(
          {
            Server: ServerName.LIVE,
            ClientID: user.id.toString(),
            Currency: 'USD',
            Email: user?.email ?? '',
            TradingType: client.isCopyTrading
              ? AccountTradingType.COPY_TRADING
              : AccountTradingType.NORMAL,
          },
          user,
        );
        const tradingAccountRef = account?.result?.answer?.Login;
        if(tranaction && tranaction?.isNewTradingAccount && tradingAccountRef){
          await this.transactionRepository.update(tranaction.id , {
            tradingAccountRef
          });
        }
      }
    }
  }

  async addBonus(dto: BonusCreditDto, userId: number, code?: string) {
    return this.accountService.bonus(dto, userId, code);
  }
}
