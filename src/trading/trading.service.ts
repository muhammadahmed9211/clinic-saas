import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { WalletService } from 'src/wallet/wallet.service';
import { ClientService as Mt5ClientService } from 'src/mt5/client/client.service';
import { TradeStatus } from './dto/trading-info.dto';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { PositionService as Mt5PositionService } from 'src/mt5/trading/positions/position.service';
import { DealService as Mt5DealService } from 'src/mt5/trading/deals/deal.service';
import { DealPagedDto } from 'src/mt5/trading/deals/dto/trading-deal.dto';
import { PositionPagedDto } from 'src/mt5/trading/positions/dto/trading-position.dto';
import { TradingResponse } from './dto/trading-stats.response.dto';
import { DealData } from 'src/utils/interface/mt5/trading/deal.reponse.interface';
import { PositionData } from 'src/utils/interface/mt5/trading/position.response.interface';
import { MailService } from 'src/mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ChangeLeverageDto } from './dto/leverage-change.dto';
import { LeverageRequest } from './entities/leverage-request.entity';
import { TradeRequestDto } from './dto/trade-request.dto';
import { TradeRequestService } from 'src/mt5/trading/trade-requests/trade-requests.service';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { ServerName } from 'src/wallet/entities/server.entity';
import { AccountService } from 'src/mt5/account/account.service';
import { Mt5UsersReplicated } from 'src/mt5/entities/mt5-users.entity';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { InfoService } from 'src/mt5-manager/market/info/info.service';
import { Status } from 'src/utils/enums/mt5/response-status.enum';

@Injectable()
export class TradingService {
  constructor(
    private readonly walletService: WalletService,
    private readonly mt5ClientService: Mt5ClientService,
    private readonly mt5PositionService: Mt5PositionService,
    private readonly mt5DealService: Mt5DealService,
    private readonly mailService: MailService,
    private readonly mt5TradeRequestService: TradeRequestService,
    private readonly mt5AccountService: AccountService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LeverageRequest)
    private readonly leverageRequestRepository: Repository<LeverageRequest>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(Mt5UsersReplicated)
    private readonly mt5UsersReplicatedRepository: Repository<Mt5UsersReplicated>,
    @InjectRepository(Mt5Symbol)
    private readonly symbolRepository: Repository<Mt5Symbol>,
    private readonly marketInfoService: InfoService,
  ) {}
  async get({
    paginationOptions,
    accountId,
    trade,
    user,
    from,
    to,
  }: {
    paginationOptions: IPaginationOptions;
    accountId: string;
    trade: TradeStatus;
    user: User;
    from: string;
    to: string;
  }) {
    try {
      // const userAccounts: any[] | null = await ResponseWrapper.unwrapDeep(
      //   await this.mt5ClientService.getAllAccounts({
      //     userId: user.id.toString(),
      //   }),
      // );

      const { live } = await this.mt5ClientService.getAllAccountsByUserId(
        user.id,
      );

      // if (
      //   accountId &&
      //   ![...live, ...demo]?.some((account) => account.Login === accountId)
      // ) {
      //   throw new BadRequestException('Account does not belong to user.');
      // }

      const accountIds = accountId
        ? [accountId]
        : [...live]?.map((account) => account.login) ?? [];

      let info: any[];
      switch (trade) {
        case 'all':
          info = await this.fetchAllTrades(accountIds, from, to);
          break;
        case 'closed':
          info = await this.fetchClosedTrades(accountIds, from, to);
          break;
        case 'open':
          info = await this.fetchOpenTrades(accountIds, from, to);
          break;
        default:
          info = await this.fetchAllTrades(accountId, from, to);
          break;
      }

      const startIndex = (paginationOptions.page - 1) * paginationOptions.limit;
      const endIndex = startIndex + paginationOptions.limit;
      const paginatedInfo = info.slice(startIndex, endIndex);

      return { info: paginatedInfo, total: info.length };
    } catch (error) {
      console.error(error);
      return { info: [], total: 0 };
    }
  }

  async fetchAllTrades(accountIds, from, to) {
    const dealInfo = await Promise.all(
      accountIds.map(async (id) =>
        ResponseWrapper.unwrap(
          await this.mt5DealService.getDealPaged({
            login: id,
            from,
            to,
          } as DealPagedDto),
        ),
      ),
    );
    const positionInfo = await Promise.all(
      accountIds.map(async (id) =>
        ResponseWrapper.unwrap(
          await this.mt5PositionService.getPositionPaged({
            login: id,
            from,
            to,
          } as PositionPagedDto),
        ),
      ),
    );
    return [...dealInfo.flat(), ...positionInfo.flat()];
  }

  async fetchClosedTrades(accountIds, from, to) {
    return await Promise.all(
      accountIds.map(async (id) =>
        ResponseWrapper.unwrap(
          await this.mt5DealService.getDealPaged({
            login: id,
            from,
            to,
          } as DealPagedDto),
        ),
      ),
    ).then((results) => results.flat());
  }

  async fetchOpenTrades(accountIds, from, to) {
    return await Promise.all(
      accountIds.map(async (id) =>
        ResponseWrapper.unwrap(
          await this.mt5PositionService.getPositionPaged({
            login: id,
            from,
            to,
          } as PositionPagedDto),
        ),
      ),
    ).then((results) => results.flat());
  }

  async getAllAccounts(user: User) {
    try {
      const wallets = await this.walletService.findAllByUserId(user.id);

      const { live: mt5Accounts } =
        await this.mt5ClientService.getAllAccountsByUserId(user.id);
      const accounts = await this.mt5AccountRepository.find({
        where: { user: { id: user.id }, server: { name: ServerName.LIVE } },
      });

      if (mt5Accounts.length > 0) {
        const logins = mt5Accounts.map((account) => account.login);
        const usersReplicated = await this.mt5UsersReplicatedRepository.find({
          where: { login: In(logins) },
          select: ['login', 'rights'],
        });
        const rightsMap = new Map(
          usersReplicated.map((user) => [user.login, user.rights]),
        );
        // Filter and map only enabled accounts
        mt5Accounts.forEach((account) => {
          const rights = rightsMap.get(account.login);
          const isEnabled = rights ? (Number(rights) & 0x0001) !== 0 : false;
          if (isEnabled) {
            wallets.push({
              id: +account.login,
              currency: account.currency ?? 'USD',
              balance: +account.balance,
              leverage: `1:${+account.marginLeverage}`,
              actualBalance: +account.balance,
              freeMargin: +account.marginFree,
              type: 'MT5',
              tradingType:
                accounts.find((acc) => acc.login === account.login)?.tradingType
                  ?.name ?? '',
              createdAt: '',
              updatedAt: '',
            });
          }
        });
      }

      return { status: 0, statusCode: 200, message: 'Ok', result: wallets };
    } catch (error) {
      console.log('getAllAccounts.error', error.message);
    }
  }

  async getAllAccountsForListing(user: User) {
    try {
      const wallets = await this.walletService.findAllByUserId(user.id);

      const mt5Accounts = await this.mt5AccountRepository.find({
        where: { user: { id: user.id } },
        relations: {
          tradingType: true,
          server: true,
          mt5AccountsReplicated: true,
        },
      });

      if (mt5Accounts.length > 0) {
        const allLogins = mt5Accounts.map((account) => account.login);

        const usersReplicated =
          allLogins.length > 0
            ? await this.mt5UsersReplicatedRepository.find({
                where: { login: In(allLogins) },
                select: ['login', 'rights'],
              })
            : [];

        const rightsMap = new Map(
          usersReplicated.map((user) => [user.login, user.rights]),
        );

        mt5Accounts.forEach((account) => {
          // For DEMO accounts
          if (account.server.name === ServerName.DEMO) {
            const rights = rightsMap.get(account.login);

            if (rights !== undefined) {
              const isEnabled = (Number(rights) & 0x0001) !== 0;

              if (!isEnabled) {
                return;
              }
            }

            wallets.push({
              id: +account.login,
              currency: 'USD',
              balance: 0,
              leverage: `1:${
                account.mt5AccountsReplicated?.marginLeverage || '500'
              }`,
              actualBalance: 0,
              freeMargin: 0,
              type: 'MT5',
              tradingType: account.tradingType?.name ?? '',
              createdAt: account.createdAt,
              updatedAt: account.updatedAt,
            });
            return;
          }

          if (!account.mt5AccountsReplicated) {
            return;
          }

          // Process LIVE accounts with rights check
          if (account.server.name === ServerName.LIVE) {
            const rights = rightsMap.get(account.login);
            const isEnabled = rights ? (Number(rights) & 0x0001) !== 0 : false;

            if (isEnabled) {
              wallets.push({
                id: +account.login,
                currency: 'USD',
                balance: +account.mt5AccountsReplicated?.balance,
                leverage: `1:${
                  +account.mt5AccountsReplicated?.marginLeverage || '500'
                }`,
                actualBalance: +account.mt5AccountsReplicated?.balance,
                freeMargin: +account.mt5AccountsReplicated?.marginFree,
                type: 'MT5',
                tradingType: account.tradingType?.name ?? '',
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
              });
            } else {
              console.log(
                `Filtered out disabled LIVE account: ${account.login} with rights: ${rights}`,
              );
            }
          }
        });
      }

      return { status: 0, statusCode: 200, message: 'Ok', result: wallets };
    } catch (error) {
      console.log('getAllAccounts.error', error.message);
    }
  }

  async getAccountListForTransfer(userId: number) {
    const wallets = await this.walletService.findAllByUserId(userId);
    const accounts = await this.mt5AccountRepository.find({
      where: { user: { id: userId }, server: { name: ServerName.LIVE } },
      relations: ['server', 'tradingType'],
    });

    if (accounts.length > 0) {
      const logins = accounts.map((account) => account.login);

      // Fetch rights from mt5_users_replicated
      const usersReplicated = await this.mt5UsersReplicatedRepository.find({
        where: { login: In(logins) },
        select: ['login', 'rights'],
      });
      const rightsMap = new Map(
        usersReplicated.map((user) => [user.login, user.rights]),
      );
      accounts.forEach((account) => {
        const rights = rightsMap.get(account.login);
        // Check if account is enabled (USER_RIGHT_ENABLED = 0x0001)
        const isEnabled = rights ? (Number(rights) & 0x0001) !== 0 : false;

        if (isEnabled) {
          wallets.push({
            id: +account.login,
            currency: 'USD',
            balance: 0,
            leverage: `1:500`,
            actualBalance: 0,
            freeMargin: 0,
            type: 'MT5',
            tradingType: account.tradingType?.name ?? '',
            createdAt: account.createdAt,
            updatedAt: account.updatedAt,
          });
        }
      });
    }
    return { status: 0, statusCode: 200, message: 'Ok', result: wallets };
  }

  async getAccountBalance(user: User, login: string) {
    const owner = await this.mt5AccountRepository.findOne({
      where: { login },
      relations: ['user'],
    });
    if (!owner) {
      return {
        status: 0,
        statusCode: 200,
        message: 'Account not found',
        result: null,
      };
    }
    if (owner.user.id !== user.id) {
      return {
        status: 0,
        statusCode: 401,
        message: 'Account does not belong to user.',
        result: null,
      };
    }
    const account = await this.mt5AccountService.getOneAccount({ login });
    if (!account) {
      return {
        status: 0,
        statusCode: 200,
        message: 'Account not found',
        result: null,
      };
    }

    return account;
  }

  async changeLeverage(user: User, data: ChangeLeverageDto) {
    const isExist = await this.userRepository.findOneBy({ id: user.id });

    if (!isExist) return { message: 'User does not exist' };
    const isExist2 = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['client', 'role', 'wallets', 'client.customKycStatus'],
    });

    const userId = isExist2?.id;
    const regulation = isExist2?.client?.regulations;

    const request = await this.leverageRequestRepository.save(
      await this.leverageRequestRepository.create({
        tradingAccount: data.accountId,
        user: isExist,
        leverage: data.leverage,
        email: isExist.email ?? '',
      }),
    );

    await this.mailService.leverageChange({
      ...data,
      name: `${isExist.firstName} ${isExist.lastName}`,
      email: isExist.email ?? '',
      referenceId: request.id,
      userId,
      regulation,
    });

    return {
      status: 0,
      statusCode: 200,
      message: 'Request to change leverage submitted.',
      result: { referenceId: request.id },
    };
  }

  postionsMapper(pos: PositionData[]): TradingResponse[] {
    return pos.map((item) => {
      const timestampMilliseconds = parseInt(item.TimeCreate, 10) * 1000;
      const openTime = new Date(timestampMilliseconds);

      return {
        orderId: item.Position,
        openTime: openTime.toDateString(),
        closeTime: '',
        symbol: item.Symbol,
        price: item.PriceOpen,
        commision: '0',
        swap: '0',
        profit: item.Profit,
        volume: item.Volume,
        direction: '',
      };
    });
  }

  dealsMapper(pos: DealData[]): TradingResponse[] {
    return pos.map((item) => {
      const timestampMilliseconds = parseInt(item.Time, 10) * 1000;
      const time = new Date(timestampMilliseconds);

      return {
        orderId: item.Deal,
        openTime: '',
        closeTime: time.toDateString(),
        symbol: item.Symbol,
        price: item.Price,
        commision: item.Commission,
        swap: (
          parseFloat(item.MarketAsk) - parseFloat(item.MarketBid)
        ).toString(),
        profit: item.Profit,
        volume: item.Volume,
        direction: '0',
      };
    });
  }

  async openTradeKafka(user: User, data: TradeRequestDto, demo: boolean) {
    if (!(await this.isOwner(data.Login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const res = await this.mt5TradeRequestService.tradeRequest(
      user,
      data,
      demo,
    );

    if (res.status === 0 && res.result.answer) {
      const finalRes = await this.tradeRequestResult(
        user,
        res.result.answer,
        demo,
      );
      return finalRes;
    }
    throw new UnprocessableEntityException('Cannot open trade');
  }

  async openTrade(user: User, data: TradeRequestDto, demo: boolean) {
    const marketStatus = await this.marketInfoService.getMarketStatus(
      data.Symbol,
    );
    if (!marketStatus.isMarketOpen) {
      throw new BadRequestException(
        `Market is closed for ${data.Symbol}. You can trade after ${marketStatus.opensIn?.hours} hours and ${marketStatus.opensIn?.minutes} minutes.`,
      );
    }

    if (!(await this.isOwner(data.Login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const canTrade = await this.canTrade(data.Login);

    console.log(`Can trade check for login ${data.Login}:`, canTrade);
    if (!canTrade) {
      throw new UnprocessableEntityException(
        'Trading is disabled for this account',
      );
    }

    const symbol = await this.symbolRepository.findOne({
      where: { symbolCode: data.Symbol },
    });

    console.log('Fetched symbol:', symbol);

    if (!symbol) {
      console.error(`Symbol not found: ${data.Symbol}`);
      throw new UnprocessableEntityException('Invalid trading symbol');
    }

    const updatedVolume = this.makeValidVolume(
      +data.Volume,
      +symbol?.stepVolume,
      +symbol?.minVolume,
      +symbol?.maxVolume,
    );

    console.log(
      `Transformed volume from ${data.Volume} to ${updatedVolume} for symbol ${data.Symbol}`,
    );

    return this.mt5TradeRequestService.tradeRequestRest(
      user,
      { ...data, Volume: updatedVolume.toString() },
      demo,
    );
  }

  async tradeRequest(user: User, data: TradeRequestDto, demo: boolean) {
    if (!(await this.isOwner(data.Login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    return this.mt5TradeRequestService.tradeRequest(user, data, demo);
  }

  async tradeRequestResult(user: User, ids: string | string[], demo: boolean) {
    // if (!(await this.isOwner(data.Login, user))) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to make trade on this account',
    //   );
    // }
    if (!Array.isArray(ids)) {
      ids = [ids];
    }
    return this.mt5TradeRequestService.tradeRequestResult(user, ids, demo);
  }

  private async isOwner(
    logins: string | string[],
    user: User,
  ): Promise<boolean> {
    const loginArray = Array.isArray(logins) ? logins : [logins];

    const mt5accounts = await this.mt5AccountRepository.find({
      where: {
        login: In(loginArray),
        user: { id: user.id },
      },
    });

    return mt5accounts.length === loginArray.length;
  }

  /**
   * Snap a user-entered volume to a valid step and clamp between min/max.
   * @param {number} value
   * @param {number} step
   * @param {number} min
   * @param {number} max
   * @param {'nearest'|'down'|'up'} [mode='nearest']
   * @param {boolean} [offsetFromMin=false]
   * @returns {number}
   */
  makeValidVolume(
    value,
    step,
    min,
    max,
    mode = 'nearest',
    offsetFromMin = false,
  ) {
    // Validate inputs
    if (![value, step, min, max].every(Number.isFinite)) {
      throw new Error('Non-finite value in inputs');
    }
    if (step <= 0) throw new Error('step must be > 0');
    if (min > max) throw new Error('min must be <= max');

    // Compute step index
    const eps = 1e-12;
    const rawIndex = offsetFromMin ? (value - min) / step : value / step;

    let k;
    switch (mode) {
      case 'down':
        k = Math.floor(rawIndex + eps);
        break;
      case 'up':
        k = Math.ceil(rawIndex - eps);
        break;
      default:
        k = Math.round(rawIndex);
        break; // nearest
    }

    // Snap back to ladder
    const snapped = offsetFromMin ? min + k * step : k * step;

    // Clamp to bounds
    const valid = Math.min(Math.max(snapped, min), max);

    // Round to step's decimal places
    const dp = this.decimalPlaces(step);
    return Number(valid.toFixed(dp));
  }

  decimalPlaces(n) {
    const s = String(n);
    const i = s.indexOf('.');
    return i === -1 ? 0 : s.length - i - 1;
  }

  async canTrade(login: string): Promise<boolean> {
    const rights = await this.mt5AccountService.getAccountRights({
      login: login,
    });
    if (rights?.status !== Status.SUCCESS) {
      throw new UnprocessableEntityException('Account not found');
    }
    if (rights.result.rights.allowTrade) {
      return true;
    }
    return false;
  }
}
