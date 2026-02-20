import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  GetAccountByLoginRequest,
  GetLiveAccountsByTradingTypeRequest,
} from './dto/get-account-by-login-request.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { DeleteAccountRequest } from './dto/delete-account.dto';
import { UpdateBalanceRequest } from '../trading/trade-requests/dto/update-balance.dto';
import { AccountTopics } from '../../kafka/topics/mt5/account.topics.enum';
import { UpdateAccountRequest } from './dto/update-account.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import {
  AccountTradingType,
  CreateAccountRequest,
} from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccountClassification,
  Client,
} from 'src/users/entities/client.entity';
import { In, IsNull, Repository } from 'typeorm';
import { Mt5Account } from '../entities/mt5-account.entity';
import {
  Server,
  ServerName,
  ServerType,
} from 'src/wallet/entities/server.entity';
import { User } from 'src/users/entities/user.entity';
import { ClientService as Mt5ClientService } from '../client/client.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { AccountData } from 'src/utils/interface/mt5/account/account-reponse.interface';
import { WalletService } from 'src/wallet/wallet.service';
import { RandomPasswordService } from 'src/utils/random-password.service';
import { MailService } from 'src/mail/mail.service';
import { BonusCreditDto, CreditRequest } from './dto/credit.dto';
import {
  UpdateAccountRequestParams,
  UpdateAccountRightsRequest,
} from './dto/update-account-rights.dto';
import { TradingAccountRights } from 'src/utils/enums/mt5/trading-rights.enum';
import { Mt5RetCode } from 'src/utils/enums/mt5/response-codes.enum.';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  RequestVia,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { Methods } from 'src/transaction/entities/transaction-method.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import {
  CustomStatus,
  StatusType,
} from 'src/admin/client/entities/custom_status.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { Label } from 'src/tasks/entities/label.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { NotificationService } from 'src/notification/notification.service';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { Mt5AccountRepository } from './repositories/mt5-account.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { TradingGroupService } from 'src/trading-group/trading-group.service';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { TradeRequestService } from '../trading/trade-requests/trade-requests.service';
import { DealService } from '../trading/deals/deal.service';
import { TransactionUtilsService } from 'src/transaction/services/utils/utils.service';
import { I18nContext } from 'nestjs-i18n';
import { PartnerRepository } from 'src/admin/partner/repositories/partner.repository';
import { PlugitService } from 'src/plugit/plugit.service';
import { RegulationsConfigService } from 'src/admin/regulations/regulations-config/regulations-config.service';
import { RegulationEventKeys } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { RegulationRuleKeys } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { AdminKycService } from 'src/admin/kyc/kyc.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import {
  actionType,
  entityType,
  performerType,
} from 'src/admin/active-log/active-log.type';
import { Mt5AccountTradingType } from '../entities/mt5-account-trading-type.entity';
import { SendEmailService } from 'src/common/services/send-email.service';
import { CreateCommissionDealDto } from 'src/ib/interfaces/Mt5Deal.interface';
import { CommissionTopics } from 'src/kafka/topics/ib/commission.topics.enum';
import { Mt5HttpService } from '../http/mt5-http.service';
import { HttpSocketClientService } from 'src/sockets/http-socket-client.service';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { UserRights } from './account.enum';
import { AccountTradingRights } from 'src/kafka/topics/mt5/account-trading-rights.enum';

interface UserState {
  kycApproved: boolean;
  ftdDone: boolean;
}

enum RequirementType {
  KYC = 'kyc',
  FTD = 'ftd',
}

const requirementChecks = {
  [RequirementType.KYC]: (state: UserState) => state.kycApproved,
  [RequirementType.FTD]: (state: UserState) => state.ftdDone,
} as const;

@Injectable()
export class AccountService {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
    private readonly kafka: KafkaService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly mt5AccountRepository: Mt5AccountRepository,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => Mt5ClientService))
    private readonly mt5ClientService: Mt5ClientService,
    private readonly walletService: WalletService,
    private readonly randomPasswordService: RandomPasswordService,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    private readonly notificationService: NotificationService,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    private readonly tradingGroupService: TradingGroupService,
    @InjectRepository(PartnerTradingGroups)
    private readonly partnerTradingGroupsRepository: Repository<PartnerTradingGroups>,
    private readonly tradeRequestService: TradeRequestService,
    private readonly tradingDealsService: DealService,
    private readonly transactionUtilsService: TransactionUtilsService,
    private readonly partnerRepository: PartnerRepository,
    private readonly plugitService: PlugitService,
    private readonly regulationConfigService: RegulationsConfigService,
    private readonly kycService: AdminKycService,
    private readonly eventEmitter: EventEmitter2,
    private readonly sendEmailService: SendEmailService,
    @InjectRepository(Mt5AccountTradingType)
    private readonly mt5AccountTradingTypeRepository: Repository<Mt5AccountTradingType>,
    private readonly mt5HttpService: Mt5HttpService,
    private readonly SocketClientt: HttpSocketClientService,
    @InjectRepository(IbCommissionProfile)
    private readonly ibCommissionProfileRepository: Repository<IbCommissionProfile>,
  ) {}

  async getOneAccount<T = any>(
    getAccountByLoginDto: GetAccountByLoginRequest,
  ): Promise<T> {
    const server = await this.checkAccountServer(getAccountByLoginDto.login);
    console.log('server', server);
    return this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.getAccountByLogin,
      getAccountByLoginDto,
      server,
    );
  }

  async getLiveAccountsByUserFromDB(
    userId: number,
    includeDisabled: boolean = false,
    query?: GetLiveAccountsByTradingTypeRequest,
  ) {
    const rawSql = `
    SELECT 
        ma.login,
        ISNULL(mur.[Group], '') as [group],
        CAST(ISNULL(mur.CertSerialNumber, 0) AS VARCHAR) as certSerialNumber,
        CAST(ISNULL(mur.Rights, 0) AS VARCHAR) as rights,
        ISNULL(mur.MQID, '0') as mqid,
        CAST(DATEDIFF(SECOND, '1970-01-01', mur.Registration) AS VARCHAR) as registration,
        CAST(DATEDIFF(SECOND, '1970-01-01', mur.LastAccess) AS VARCHAR) as lastAccess,
        CAST(DATEDIFF(SECOND, '1970-01-01', mur.LastPassChange) AS VARCHAR) as lastPassChange,
        ISNULL(mur.LastIP, '') as lastIp,
        ISNULL(mur.[Name], '') as [name],
        ISNULL(mur.FirstName, '') as firstName,
        ISNULL(mur.LastName, '') as lastName,
        ISNULL(mur.MiddleName, '') as middleName,
        ISNULL(mur.Company, '') as company,
        ISNULL(mur.Account, '') as account,
        ISNULL(mur.Country, '') as country,
        CAST(ISNULL(mur.[Language], 0) AS VARCHAR) as [language],
        CAST(ISNULL(mur.ClientID, 0) AS VARCHAR) as clientId,
        ISNULL(mur.City, '') as city,
        ISNULL(mur.[State], '') as [state],
        ISNULL(mur.ZipCode, '') as zipCode,
        ISNULL(mur.[Address], '') as [address],
        ISNULL(mur.Phone, '') as phone,
        ISNULL(mur.Email, ISNULL(ma.email, '')) as email,
        ISNULL(mur.ID, '') as id,
        ISNULL(mur.[Status], 'active') as [status],
        ISNULL(mur.Comment, '') as comment,
        CAST(ISNULL(mur.Color, 4278190080) AS VARCHAR) as color,
        ISNULL(mur.PhonePassword, '') as phonePassword,
        ISNULL(mar.MarginLeverage, 0) as leverage,
        CAST(ISNULL(mur.Agent, 0) AS VARCHAR) as agent,
        CAST(ISNULL(mur.LimitPositions, 0) AS VARCHAR) as limitPositions,
        CAST(ISNULL(mur.LimitOrders, 0) AS VARCHAR) as limitOrders,
        CAST(ISNULL(mar.CurrencyDigits, 2) AS VARCHAR) as currencyDigits,
        CAST(ISNULL(mar.Balance, 0) AS VARCHAR) as balance,
        CAST(ISNULL(mar.Credit, 0) AS VARCHAR) as credit,
        '0.00' as interestRate,
        '0.00' as commissionDaily,
        '0.00' as commissionMonthly,
        '0.00' as commissionAgentDaily,
        '0.00' as commissionAgentMonthly,
        '0.00' as balancePrevDay,
        '0.00' as balancePrevMonth,
        '0.00' as equityPrevDay,
        '0.00' as equityPrevMonth,
        ISNULL(mur.TradeAccounts, '') as tradeAccounts,
        CASE 
            WHEN mur.ApiData IS NULL OR mur.ApiData = '' THEN '[]'
            ELSE mur.ApiData 
        END as apiData,
        ISNULL(mur.LeadCampaign, '') as leadCampaign,
        ISNULL(mur.LeadSource, '') as leadSource,
        'FSCA' as regulator,
        'siliconfort Group - Live' as serverName,
        -54.18 as closedPl,
        0 as closedCommisions,
        0 as closedSwaps,
        -54.18 as totalClosedPl,
        0.48 as tradingVolume,
        0 as openPl,
        0 as openCommisions,
        0 as openSwaps,
        0 as totalopenPl,
        CAST(ISNULL(mar.Margin, 0) AS VARCHAR) as margin,
        CAST(ISNULL(mar.MarginFree, 0) AS VARCHAR) as marginFree,
        CAST(ISNULL(mar.MarginLevel, 0) AS VARCHAR) as marginLevel,
        CAST(ISNULL(mar.MarginLeverage, 500) AS VARCHAR) as marginLeverage,
        CAST(ISNULL(mar.Profit, 0) AS VARCHAR) as profit,
        CAST(ISNULL(mar.Storage, 0) AS VARCHAR) as storage,
        CAST(ISNULL(mar.Floating, 0) AS VARCHAR) as floating,
        CAST(ISNULL(mar.Equity, 0) AS VARCHAR) as equity,
        '0' as soActivation,
        '0' as soTime,
        '0.00' as soLevel,
        '0.00' as soEquity,
        '0.00' as soMargin,
        CAST(ISNULL(mar.Assets, 0) AS VARCHAR) as assets,
        CAST(ISNULL(mar.Liabilities, 0) AS VARCHAR) as liabilities,
        CAST(ISNULL(mar.BlockedCommission, 0) AS VARCHAR) as blockedCommission,
        CAST(ISNULL(mar.BlockedProfit, 0) AS VARCHAR) as blockedProfit,
        CAST(ISNULL(mar.MarginInitial, 0) AS VARCHAR) as marginInitial,
        CAST(ISNULL(mar.MarginMaintenance, 0) AS VARCHAR) as marginMaintenance,
        CASE WHEN ma.isDefault = 1 THEN 1 ELSE 0 END as isDefault,
        ISNULL(matt.[name], 'Normal Trading') as tradingType,
        'LIVE' as server
    FROM mt5_account ma
    LEFT JOIN mt5_users_replicated mur ON ma.[login] = mur.[login]
    LEFT JOIN mt5_accounts_replicated mar ON ma.[login] = mar.[login]
    LEFT JOIN mt5_account_trading_type matt ON ma.tradingTypeId = matt.id
    WHERE ma.userId = @0
        AND (@1 IS NULL 
             OR (@1 = 'normal' AND matt.[name] = 'Normal Trading')
             OR (@1 = 'copy_trading' AND matt.[name] = 'Copy Trading'))
        AND ma.deletedAt IS NULL
        AND ma.serverId = (SELECT id FROM server WHERE name = 'LIVE')
  `;

    const results = await this.mt5AccountRepository.query(rawSql, [
      userId,
      query?.tradingType || null,
    ]);
    // Filter out disabled accounts if includeDisabled is false
    let accountsToProcess = results;

    if (!includeDisabled) {
      accountsToProcess = results.filter((account) => {
        const rights = parseInt(account.rights, 10);
        const isEnabled =
          (rights & UserRights.USER_RIGHT_ENABLED) ===
          UserRights.USER_RIGHT_ENABLED;

        if (!isEnabled) {
          console.log(
            `Account ${account.login} is disabled (rights: ${account.rights})`,
          );
        }

        return isEnabled;
      });
    }
    this.SocketClientt.emitUserAccounts(userId);

    // Parse apiData JSON string for each result and convert data types
    return accountsToProcess.map((account) => {
      const rightsValue = parseInt(account.rights, 10);
      const decodedRights = this.decodeUserRights(rightsValue);

      return {
        ...account,
        permissions: decodedRights, // Add decoded permissions
        apiData: JSON.parse(account.apiData),
        isDefault: Boolean(account.isDefault),
        // Convert string numbers back to proper types where needed
        balance: parseFloat(account.balance).toFixed(2),
        credit: parseFloat(account.credit).toFixed(2),
        margin: parseFloat(account.margin).toFixed(2),
        marginFree: parseFloat(account.marginFree).toFixed(2),
        marginLevel: parseFloat(account.marginLevel).toFixed(2),
        profit: parseFloat(account.profit).toFixed(2),
        storage: parseFloat(account.storage).toFixed(2),
        floating: parseFloat(account.floating).toFixed(2),
        equity: parseFloat(account.equity).toFixed(2),
        assets: parseFloat(account.assets).toFixed(2),
        liabilities: parseFloat(account.liabilities).toFixed(2),
        blockedCommission: parseFloat(account.blockedCommission).toFixed(2),
        blockedProfit: parseFloat(account.blockedProfit).toFixed(2),
        marginInitial: parseFloat(account.marginInitial).toFixed(2),
        marginMaintenance: parseFloat(account.marginMaintenance).toFixed(2),
      };
    });
  }

  async getLiveAccountsByUser(
    userId: number,
    includeDisabled: boolean = false,
    query?: GetLiveAccountsByTradingTypeRequest,
  ) {
    // const accounts = await this.kafka.SendMessage(
    //   this.mt5Client,
    //   AccountTopics.getAccountsByUser,
    //   { userId },
    //   'live',
    // );

    const accounts = await this.mt5HttpService.makeRequest<any>(
      'GET',
      `account/${AccountTopics.getAccountsByUser}`,
      'live',
      {},
      { userId },
    );

    // Extract logins from the Kafka response
    const logins =
      accounts?.map((acc) => acc.login).filter((login) => !!login) || [];

    if (!logins.length) {
      return []; // If no logins, return empty array
    }

    const dbAccounts = await this.mt5AccountRepository.find({
      where: {
        user: { id: userId },
        server: { name: ServerName.LIVE },
      },
    });
    // Filter out disabled accounts if includeDisabled is false
    let accountsToProcess = accounts;

    if (!includeDisabled) {
      accountsToProcess = accounts.filter((account) => {
        const rights = parseInt(account.rights, 10);
        const isEnabled =
          (rights & UserRights.USER_RIGHT_ENABLED) ===
          UserRights.USER_RIGHT_ENABLED;

        if (!isEnabled) {
          console.log(
            `Account ${account.login} is disabled (rights: ${account.rights})`,
          );
        }

        return isEnabled;
      });
    }
    // Combine Kafka account data with 'isDefault' from the database
    let combinedAccounts = accountsToProcess.map((account) => {
      // Find the matching 'isDefault' flag from dbAccounts based on login
      const dbAccount = dbAccounts.find(
        (dbAcc) => dbAcc.login === account.login,
      );
      // Parse and decode rights
      const rightsValue = parseInt(account.rights, 10);
      const decodedRights = this.decodeUserRights(rightsValue);

      // Return a combined account object with full account data from Kafka and isDefault from DB
      return {
        ...account, // Full account data from Kafka
        isDefault: dbAccount ? dbAccount.isDefault : false, // Add isDefault flag (default to false if not found in DB)
        permissions: decodedRights,
        tradingType:
          dbAccounts.find((mt5Account) => mt5Account.login === account.login)
            ?.tradingType?.name ?? 'Normal Trading',
        server: dbAccounts.find(
          (mt5Account) => mt5Account.login === account.login,
        )?.server.name,
      };
    });

    if (query?.tradingType) {
      combinedAccounts = combinedAccounts.filter((account) => {
        // filter out accounts based on query
        if (query.tradingType === 'normal') {
          return account.tradingType === 'Normal Trading';
        } else if (query.tradingType === 'copy_trading') {
          return account.tradingType === 'Copy Trading';
        }
      });
    }

    return combinedAccounts;
  }

  async getDemoAccountsByUser(userId: number) {
    return this.mt5HttpService.makeRequest<any>(
      'GET',
      `account/${AccountTopics.getAccountsByUser}`,
      'demo',
      {},
      { userId },
    );

    // return this.kafka.SendMessage(
    //   this.mt5ClientDemo,
    //   AccountTopics.getAccountsByUser,
    //   { userId },
    //   'demo',
    // );
  }

  async getMultipleAccounts<T = any>(
    getMultpleAccountsDto,
    isDemo = false,
  ): Promise<T> {
    if (isDemo) {
      return this.kafka.SendMessage(
        this.mt5ClientDemo,
        AccountTopics.getMultipleAccounts,
        getMultpleAccountsDto,
        'demo',
      );
    }
    return this.kafka.SendMessage(
      this.mt5Client,
      AccountTopics.getMultipleAccounts,
      getMultpleAccountsDto,
    );
  }

  async getMultipleAccountsWithMargin<T = any>(
    getMultpleAccountsDto,
    isDemo = false,
  ): Promise<T> {
    if (isDemo) {
      return this.kafka.SendMessage(
        this.mt5ClientDemo,
        AccountTopics.getMultipleAccountsWithMargin,
        getMultpleAccountsDto,
        'demo',
      );
    }
    return this.kafka.SendMessage(
      this.mt5Client,
      AccountTopics.getMultipleAccountsWithMargin,
      getMultpleAccountsDto,
    );
  }

  async createAccount(
    createAccountDto: CreateAccountRequest,
    user: User,
    byPassLimit: boolean = false,
    operatorUser: User | null = null,
    isAgentAccount: boolean = false,
  ) {
    const i18n = I18nContext.current();
    let tradingGroup: Partial<IbCommissionProfile> | undefined;
    if (!user) {
      const message = i18n?.t('errors.auth.userNotFound');
      throw new NotFoundException(message);
    }

    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: {
        regulation: true,
        commissionProfile: {
          copyTradingGroup: true,
          tradingGroup: true,
          agentTradingGroup: true,
        },
      },
    });
    if (!client) {
      const message = i18n?.t('errors.auth.clientNotFound');
      throw new NotFoundException(message);
    }

    let allowedToCreate = byPassLimit;
    if (!byPassLimit) {
      allowedToCreate = await this.canCreateLiveAccount(user.id);
    }

    if (!allowedToCreate && !byPassLimit) {
      throw new BadRequestException('Not Allowed to create live account');
    }

    let Group: string | undefined = undefined;

    if (client.commissionProfile) {
      tradingGroup = client.commissionProfile;
    } else {
      const defaultProfile = await this.ibCommissionProfileRepository.findOne({
        where: {
          name: `Default ${AccountClassification.STANDARD}`,
          classification: {
            name: AccountClassification.STANDARD,
          },
        },
        relations: {
          copyTradingGroup: true,
          tradingGroup: true,
          agentTradingGroup: true,
        },
      });
      if (defaultProfile) {
        tradingGroup = defaultProfile;
      }
    }

    if (isAgentAccount) {
      Group = tradingGroup?.agentTradingGroup?.name;
    } else if (
      createAccountDto.TradingType === AccountTradingType.COPY_TRADING
    ) {
      Group = tradingGroup?.copyTradingGroup?.name;
    } else {
      Group = tradingGroup?.tradingGroup?.name;
    }

    if (client.isSwapFree && !isAgentAccount) {
      if (Group) {
        Group = `${Group}_SW`;
      }
    }

    console.log(Group, 'Group');
    // const kycApproved = this.checkClientKycApproved(user.id);
    // if (!kycApproved) {
    //   const message = i18n?.t('errors.kyc.notApproved');
    //   throw new BadRequestException(message);
    // }

    if (!byPassLimit) {
      const exceedsLimit = await this.checkAccountOpeningLimit(user.id, 'live');

      if (exceedsLimit) {
        const message = i18n?.t('success.account.liveTradingAccountRequest');
        await this.sendAccountCreationRequest(createAccountDto, user);
        return {
          status: 0,
          statusCode: 200,
          // message: `Your creation request for creating ${createAccountDto.Server} trading account has been submitted.`,
          message,
          result: null,
        };
      }
    }

    console.log('Serverrrr', createAccountDto.Server);

    const serverName = ServerName[createAccountDto.Server.toUpperCase()];
    console.log('serrverrr nameeee', serverName);
    if (!serverName) throw new NotFoundException('Server not found');

    const server = await this.serverRepository.findOneBy({
      name: serverName,
    });
    if (!server) throw new NotFoundException('Server not found');

    const password = this.randomPasswordService.generatePassword(15);

    const userInfo = await this.userRepository.findOneBy({ id: user.id });

    // let Rights: string = AccountTradingRights.TradingDisabled;

    const { kycApproved } = await this.userState(user.id);

    // if(kycApproved){
    //   Rights = AccountTradingRights.FullRights
    // }

    // if(createAccountDto.Rights){
    //   Rights = createAccountDto.Rights
    // }

    const res = await this.kafka.SendMessage(
      this.mt5Client,
      AccountTopics.createAccount,
      {
        ...createAccountDto,
        Name: `${userInfo?.firstName} ${userInfo?.lastName}`,
        Email: user?.email,
        PassMain: password,
        PassInvestor: password,
        Country: userInfo?.country,
        City: userInfo?.city,
        ClientID: user.id.toString(),
        Server: '',
        Company: 'Individual',
        Currency: createAccountDto.Currency ?? 'USD',
        Leverage: '500',
        Group,
        Rights: kycApproved
          ? AccountTradingRights.FullRights
          : AccountTradingRights.TradingDisabled,
      } as CreateAccountRequest,
      'live',
      // createAccountDto.Server ?? 'dev', // to be uncomment for prod
    );

    const tradingType = await this.mt5AccountTradingTypeRepository.findOne({
      where: { key: createAccountDto.TradingType },
    });

    if (!tradingType) {
      throw new NotFoundException('Trading type not found');
    }

    if (res?.result?.retcode === Mt5RetCode.SUCCESS) {
      const existingAccounts = await this.mt5AccountRepository.find({
        // elm Get all existing accounts for the user
        where: { user: { id: user.id } },
      });
      let isDefault = false;
      if (existingAccounts.length === 0) {
        isDefault = true; // First account
      } else {
        const hasDefault = existingAccounts.some(
          (acc) => acc.isDefault === true,
        ); // Check if any existing account is marked as default
        if (!hasDefault) {
          isDefault = true; // Recovery scenario: accounts exist, but none is default
        }
      }
      const group = tradingGroup?.tradingGroup;
      const account = await this.mt5AccountRepository.save({
        login: res?.result?.answer?.Login,
        server: server,
        user: user,
        email: user.email ?? '',
        tradingType: tradingType,
        isDefault: isDefault, //is default added
        commissionProfile: tradingGroup ? tradingGroup : undefined,
        group,
      });

      const partner = await this.partnerRepository.findOne({
        where: {
          id: client?.partner?.id,
        },
      });

      if (partner && partner.ib && partner.userIbId) {
        try {
          if (partner.autoLinkMt5) {
            console.log(
              `Auto linking MT5 account: ${res?.result?.answer?.Login} to IB: `,
              partner.userIbId,
            );

            const linkRes = await this.updateAccount(
              res?.result?.answer?.Login,
              {
                Agent: partner.userIbId,
              } as UpdateAccountRequest,
            );

            if (linkRes?.result?.retcode !== Mt5RetCode.SUCCESS) {
              console.error(
                `Failed to link MT5 account: ${res?.result?.answer?.Login} to IB: `,
                partner.userIbId,
              );
            } else {
              console.log(
                `Successfully linked MT5 account: ${res?.result?.answer?.Login} to IB: `,
                partner.userIbId,
              );
            }
          }

          // const poolAndCountries = await this.plugitService.getPoolAndCountry();

          // let country;
          // if (!poolAndCountries) {
          //   console.log('poolAndCountries not found', poolAndCountries);
          //   throw new NotFoundException('Pool and Countries not found');
          // }
          // const masterIb = await this.plugitService.findOneIb(
          //   partner.userIbId.toString(),
          // );
          // if (!masterIb) {
          //   console.log('masterIb not found', masterIb);
          //   throw new NotFoundException('Master IB not found');
          // }
          // const createIbPayload = {
          //   FirstName: user.firstName ?? '',
          //   LastName: user.lastName ?? '',
          //   Email: user.email ?? '',
          //   PoolID: poolAndCountries.Data.Pools[0].PoolID,
          //   IBCode: account.login,
          //   CountryID: country?.CountryID || 484,
          //   MasterClientID: masterIb.ClientID,
          //   PhoneNumber: user.telephone ?? '',
          // };

          // console.log('creating ib client: ', createIbPayload);
          // await this.plugitService.createIb(createIbPayload);

          const linkIbPayload = {
            ServerName: 'Live',
            ServerType: 'MT5',
            Login: res?.result?.answer?.Login,
            IBCode: partner.userIbId.toString(),
          };
          console.log('linking ib client: ', linkIbPayload);
          await this.plugitService.linkAccountToIb(linkIbPayload);
        } catch (error) {
          console.error(error);
        }
      }

      const systemOperator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });

      if (!systemOperator) {
        throw new BadRequestException('System operator not found');
      }

      await this.sendEmailService.sendEmailToClient({
        entityName: 'client',
        entityValue: client.userId as any,
        createdForId: client.userId,
        emailEventName: 'CREATE_MT5_ACCOUNT',
        operatorId: systemOperator.id,
        externalVariables: { userName: res?.result?.answer?.Login, password },
      });

      // await this.mailService.sendTradingAccountPassword(
      //   {
      //     to: user?.email ?? '',
      //     data: {
      //       password,
      //       login: res?.result?.answer?.Login,
      //       accountType: 'Live',
      //       firstName: user?.firstName || 'User',
      //     },
      //   },
      //   user?.id,
      //   regulation,
      //   regulationId,
      // );

      if (user.demo) {
        await this.userRepository.save(
          await this.userRepository.create({ ...user, demo: false }),
        );
      }

      if (!account)
        throw new HttpException(
          'Error while creating trading account during kyc',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    } else {
      console.error(
        'Error from MT5 during creating account after kyc: ',
        res?.result?.retcode ?? res,
      );
      throw new BadRequestException(
        res?.result?.retcode ??
          'Error from MT5 during creating account after kyc',
      );
    }

    const label = await this.labelRepository.findOne({
      where: {
        description: NotificationMessages.client_tradeaccount_live_create,
      },
    });

    const labelTitle = await this.labelRepository.findOne({
      where: {
        description: NotificationTitles.client_tradeaccount_live_create_title,
      },
    });

    const system_operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });

    const notificationData = {
      entity_id: user?.id,
      entity_name: 'clients',
      title_label_id: labelTitle?.id,
      description_label_id: label?.id,
      created_by: 'system',
      is_read: false,
      is_deleted: false,
      user_id: user?.id,
      creator_id: system_operator?.id,
    };

    await this.notificationService.createNotification({
      ...notificationData,
    });

    const message = i18n?.t('success.mt5.createLiveAccount');

    if (operatorUser) {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: {
          ...res?.result?.answer,
          InvestorPassword: '********',
          MasterPassword: '********',
        },
        oldData: null,
        entityId: res?.result?.answer?.Login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: operatorUser?.id,
        performerType: performerType.OPERATOR,
        field: actionType.RECORD_CREATED,
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: actionType.RECORD_CREATED,
        entity_id: res?.result?.answer?.Login,
        entity_type: entityType.MT5_ACCOUNT,
        json_object: {
          ...res?.result?.answer,
          InvestorPassword: '********',
          MasterPassword: '********',
        },
        performer_id: operatorUser?.id,
        performer_type: performerType.OPERATOR,
        is_from_archive: 0,
        trigger_type: 'Default',
      });
    } else {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: {
          ...res?.result?.answer,
          InvestorPassword: '********',
          MasterPassword: '********',
        },
        oldData: null,
        entityId: res?.result?.answer?.Login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: user?.id,
        performerType: performerType.USER,
        field: actionType.RECORD_CREATED,
      });
    }

    return { ...res, message };
  }

  async createDemoAccount(
    createAccountDto: CreateAccountRequest,
    user: User,
    byPassLimit: boolean = false,
    operatorUser: User | null = null,
  ) {
    const i18n = I18nContext.current();
    if (!user) {
      const message = i18n?.t('errors.auth.userNotFound');
      throw new NotFoundException(message);
    }
    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: {
        regulation: true,
      },
    });
    if (!client) {
      const message = i18n?.t('errors.auth.clientNotFound');
      throw new NotFoundException(message);
    }
    const regulation = client?.regulations;
    const regulationId = client?.regulation?.id;

    if (!byPassLimit) {
      console.log('checking account opening limit...');
      const exceedsLimit = await this.checkAccountOpeningLimit(user.id, 'demo');
      if (exceedsLimit) {
        const message = i18n?.t('success.account.liveTradingAccountRequest');
        await this.sendAccountCreationRequest(createAccountDto, user);
        return {
          status: 0,
          statusCode: 200,
          // message: `Your creation request for creating ${createAccountDto.Server} trading account has been submitted.`,
          message,
          result: null,
        };
      }
    }

    const tradingGroup = this.configService.getOrThrow('app.defaultDemoGroup', {
      infer: true,
    });

    const server = await this.serverRepository.findOneBy({
      name: ServerName[createAccountDto.Server.toUpperCase()],
    });
    if (!server) throw new NotFoundException('Server not found');

    const password = this.randomPasswordService.generatePassword(15);

    const userInfo = await this.userRepository.findOneBy({ id: user.id });

    const res = await this.kafka.SendMessage(
      this.mt5ClientDemo,
      AccountTopics.createAccount,
      {
        ...createAccountDto,
        Name: `${userInfo?.firstName} ${userInfo?.lastName}`,
        Email: user?.email,
        PassMain: password,
        PassInvestor: password,
        Country: userInfo?.country,
        City: userInfo?.city,
        ClientID: user?.id?.toString(),
        Server: '',
        Company: 'Individual',
        Currency: createAccountDto.Currency ?? 'USD',
        Leverage: '500',
        Group: tradingGroup,
      } as CreateAccountRequest,
      'demo',
      // createAccountDto.Server ?? 'dev', // to be uncomment for prod
    );

    if (res?.result?.retcode === Mt5RetCode.SUCCESS) {
      const existingAccounts = await this.mt5AccountRepository.find({
        // elm
        where: { user: { id: user.id } },
      });
      let isDefault = false;
      if (existingAccounts.length === 0) {
        isDefault = true;
      } else {
        const hasDefault = existingAccounts.some(
          (acc) => acc.isDefault === true,
        );
        if (!hasDefault) {
          isDefault = true;
        }
      }
      const group = await this.tradingGroupService.getDemoTradingGroup();
      const account = await this.mt5AccountRepository.save({
        login: res?.result?.answer?.Login,
        server: server,
        user: user,
        email: user.email ?? '',
        tradingType: { key: 'normal' },
        isDefault: isDefault, //is default added
        group,
      });

      const addedBalance = await this.addDemoBalance(
        res?.result?.answer?.Login,
      );

      console.log('Balance added to demo account: ', addedBalance);
      const systemOperator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });

      if (!systemOperator) {
        throw new BadRequestException('System operator not found');
      }

      await this.sendEmailService.sendEmailToClient({
        entityName: 'client',
        entityValue: client.userId as any,
        createdForId: client.userId,
        emailEventName: 'CREATE_MT5_DEMO_ACCOUNT',
        operatorId: systemOperator.id,
        externalVariables: { userName: res?.result?.answer?.Login, password },
      });

      // await this.mailService.sendTradingAccountPassword(
      //   {
      //     to: user?.email ?? '',
      //     data: {
      //       password,
      //       login: res?.result?.answer?.Login,
      //       accountType: 'Demo',
      //       firstName: user?.firstName || 'User',
      //     },
      //   },
      //   user?.id,
      //   regulation,
      //   regulationId,
      // );

      if (!account)
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }

    const label = await this.labelRepository.findOne({
      where: {
        description: NotificationMessages.client_tradeaccount_demo_create,
      },
    });

    const labelTitle = await this.labelRepository.findOne({
      where: {
        description: NotificationTitles.client_tradeaccount_demo_create_title,
      },
    });

    const system_operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });

    const notificationData = {
      entity_id: user?.id,
      entity_name: 'clients',
      title_label_id: labelTitle?.id,
      description_label_id: label?.id,
      created_by: 'system',
      is_read: false,
      is_deleted: false,
      user_id: user?.id,
      creator_id: system_operator?.id,
    };

    await this.notificationService.createNotification({
      ...notificationData,
    });

    const message = i18n?.t('success.mt5.createDemoAccount');

    if (operatorUser) {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: {
          ...res?.result?.answer,
          InvestorPassword: '********',
          MasterPassword: '********',
        },
        oldData: null,
        entityId: res?.result?.answer?.Login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: operatorUser?.id,
        performerType: performerType.OPERATOR,
        field: actionType.RECORD_CREATED,
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: actionType.RECORD_CREATED,
        entity_id: res?.result?.answer?.Login,
        entity_type: entityType.MT5_ACCOUNT,
        json_object: {
          ...res?.result?.answer,
          InvestorPassword: '********',
          MasterPassword: '********',
        },
        performer_id: operatorUser?.id,
        performer_type: performerType.OPERATOR,
        is_from_archive: 0,
        trigger_type: 'Default',
      });
    } else {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: {
          ...res?.result?.answer,
          InvestorPassword: '********',
          MasterPassword: '********',
        },
        oldData: null,
        entityId: res?.result?.answer?.Login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: user?.id,
        performerType: performerType.USER,
        field: actionType.RECORD_CREATED,
      });
    }

    return { ...res, message };
  }

  async updateAccount(login: string, updateAccountDto: UpdateAccountRequest) {
    const server = await this.checkAccountServer(login);
    return this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.updateAccount,
      {
        login,
        accountData: updateAccountDto,
      },
      server,
    );
  }

  async updateBalance(updateBalanceDto: UpdateBalanceRequest) {
    const server = await this.checkAccountServer(updateBalanceDto.login);
    return this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.updateBalance,
      updateBalanceDto,
      server,
    );
  }

  // async getDemoAccounts(user: User) {
  //   return this.getDemoAccountsByUser(user.id);

  //   // const accumulatedValues = res.result.reduce(
  //   //   (accumulator, currentValue) => {
  //   //     const balance = parseFloat(currentValue.Balance);
  //   //     const credit = parseFloat(currentValue.Credit);
  //   //     const equityPrevDay = parseFloat(currentValue.EquityPrevDay);

  //   //     accumulator.totalBalance += balance;
  //   //     accumulator.totalCredit += credit;
  //   //     accumulator.totalEquityPrevDay += equityPrevDay;

  //   //     return accumulator;
  //   //   },
  //   //   {
  //   //     totalBalance: 0,
  //   //     totalCredit: 0,
  //   //     totalEquityPrevDay: 0,
  //   //   },
  //   // );

  //   // return {
  //   //   ...res,
  //   //   result: { accounts: res.result, totals: accumulatedValues },
  //   // } as IBaseResponse<{
  //   //   accounts: AccountData[];
  //   //   total: {
  //   //     totalBalance: number;
  //   //     totalCredit: number;
  //   //     totalEquityPrevDay: number;
  //   //   };
  //   // }>;
  // }

  // async getLiveAccounts(user: User) {
  //   const res = await this.mt5ClientService.getAllAccounts(
  //     { userId: user.id.toString() },
  //     true,
  //   );

  //   const accumulatedValues = res.result.reduce(
  //     (accumulator, currentValue) => {
  //       const balance = parseFloat(currentValue.Balance);
  //       const credit = parseFloat(currentValue.Credit);
  //       const equityPrevDay = parseFloat(currentValue.EquityPrevDay);

  //       accumulator.totalBalance += balance;
  //       accumulator.totalCredit += credit;
  //       accumulator.totalEquityPrevDay += equityPrevDay;

  //       return accumulator;
  //     },
  //     {
  //       totalBalance: 0,
  //       totalCredit: 0,
  //       totalEquityPrevDay: 0,
  //     },
  //   );

  //   return {
  //     ...res,
  //     result: { accounts: res.result, totals: accumulatedValues },
  //   } as IBaseResponse<{
  //     accounts: AccountData[];
  //     total: {
  //       totalBalance: number;
  //       totalCredit: number;
  //       totalEquityPrevDay: number;
  //     };
  //   }>;
  // }

  async getStats(user: User) {
    try {
      const balance = await this.walletService.getWalletBalances(user);
      // const client = await this.clientRepository.findOneBy({
      //   userId: user.id,
      //   // clientId: Not(IsNull()),
      // });
      // if (!client) throw new BadRequestException('Kyc is not completed');
      const { volume: v, equity: e } = await this.getDashboardData(
        user.id,
        // client.clientId,
      );

      return {
        status: 0,
        statusCode: HttpStatus.OK,
        statusText: 'OK',
        result: { balance: balance ?? 0, volume: v ?? 0, equity: e ?? 0 },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAccount(deleteAccountDto: DeleteAccountRequest) {
    const server = await this.checkAccountServer(deleteAccountDto.login);
    return this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.deleteAccount,
      deleteAccountDto,
      server,
    );
  }

  async makeDefaultAccount(login: string, userId: number) {
    // 1. Check if the login belongs to the authenticated user
    const account = await this.mt5AccountRepository.findOne({
      where: { login, user: { id: userId } },
    });

    if (!account) {
      throw new NotFoundException(`User not found for login ${login}`);
    }

    // 2. Set all user's accounts isDefault = false
    await this.mt5AccountRepository
      .createQueryBuilder()
      .update()
      .set({ isDefault: false })
      .where('userId = :userId', { userId })
      .execute();

    // 3. Set the selected account isDefault = true
    const result = await this.mt5AccountRepository
      .createQueryBuilder()
      .update()
      .set({ isDefault: true })
      .where('login = :login', { login })
      .andWhere('userId = :userId', { userId })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(
        `Account with login ${login} not found for this user`,
      );
    }

    return {
      status: 0,
      message: `Account ${login} has been set as default.`,
    };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    source: 'client' | 'admin',
    user?: User,
  ) {
    const i18n = I18nContext.current();
    let accountOwner: NullableType<Mt5Account>;
    if (source === 'client' && user) {
      accountOwner = await this.mt5AccountRepository.findOne({
        where: {
          login: changePasswordDto.Login,
          user: { id: user.id },
        },
        relations: ['user'],
      });
      if (!accountOwner)
        throw new BadRequestException('Account does not belong to user.');
    } else {
      accountOwner = await this.mt5AccountRepository.findOne({
        where: {
          login: changePasswordDto.Login,
        },
        relations: ['user'],
      });
    }

    const server = await this.checkAccountServer(changePasswordDto.Login);

    const res = await this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.changePassword,
      { ...changePasswordDto, Source: 'admin' },
      server,
    );

    if (
      res?.result?.retcode === Mt5RetCode.SUCCESS &&
      source === 'admin' &&
      accountOwner
    ) {
      const client = await this.clientRepository.findOneBy({
        userId: accountOwner?.user?.id,
      });
      const regulation = client?.regulations;
      await this.mailService.sendTradingAccountPassword(
        {
          to: accountOwner.email ?? '',
          data: {
            password: changePasswordDto.Password,
            login: changePasswordDto.Login,
            accountType: server === 'live' ? 'Live' : 'Demo',
            firstName: user?.firstName || 'User',
          },
        },
        accountOwner.user.id,
        regulation,
      );
    }

    const message =
      changePasswordDto.Type === 'main'
        ? i18n?.t('success.mt5.changeMasterPassword')
        : i18n?.t('success.mt5.changeInvestorPassword');

    if (source === 'admin') {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: null,
        entityId: changePasswordDto.Login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: user?.id,
        performerType: performerType.OPERATOR,
        field: 'Password Update',
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: actionType.PASSWORD_CHANGED,
        entity_id: changePasswordDto.Login,
        entity_type: entityType.MT5_ACCOUNT,
        json_object: null,
        performer_id: user?.id,
        performer_type: performerType.OPERATOR,
        is_from_archive: 0,
        trigger_type: 'Default',
      });
    } else {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: null,
        entityId: changePasswordDto.Login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: user?.id,
        performerType: performerType.USER,
        field: 'Password Update',
      });
    }

    return { ...res, message };
  }

  async checkAccountOpeningLimit(userId: number, server: 'demo' | 'live') {
    if (server === 'live') {
      // const existingAccounts: Promise<
      //   AxiosResponse<{ [key: string]: number[] }>
      // > | null = ResponseWrapper.unwrapDeep(
      //   await this.mt5ClientService.getAccountLogins({
      //     client: clientId,
      //   }),
      // );

      // if (existingAccounts && existingAccounts[`${clientId}`].length > 4) {
      //   return true;
      // }
      // return false;

      const existingAccounts = await this.mt5AccountRepository.count({
        where: {
          user: { id: userId },
          server: {
            id: await this.serverRepository
              .findOne({
                where: { name: ServerName.LIVE, type: ServerType.MT5 },
              })
              .then((server) => server?.id),
          },
        },
      });
      return existingAccounts > 4;
    } else {
      const existingAccounts = await this.mt5AccountRepository.count({
        where: {
          user: { id: userId },
          server: {
            id: await this.serverRepository
              .findOne({
                where: { name: ServerName.DEMO, type: ServerType.MT5 },
              })
              .then((server) => server?.id),
          },
        },
      });
      return existingAccounts > 4;
    }
  }

  async sendAccountCreationRequest(
    createAccountDto: CreateAccountRequest,
    user: User,
  ) {
    try {
      const supportEmail = this.configService.getOrThrow('mail.supportEmail', {
        infer: true,
      });
      await this.mailService.accountCreationRequest({
        to: supportEmail,
        context: {
          ...createAccountDto,
          UserId: user.id.toString(),
          Email: createAccountDto.Email ?? user.email,
          Name: createAccountDto.Name ?? `${user.firstName} ${user.lastName}`,
        },
      });
    } catch (error) {
      console.log('error sending email in sendAccountCreationRequest', error);
    }
  }

  async bonus(dto: BonusCreditDto, userId: number, bonusCode?: string) {
    const isExist = await this.transactionService.getById(dto.transactionId);
    if (
      !isExist ||
      isExist?.status !== TransactionStatus.APPROVED ||
      isExist.type !== TransactionType.DEPOSIT
    ) {
      throw new BadRequestException('Invalid transaction id');
    }
    const mt5Login = dto.login.toString();
    const mt5Account = await this.mt5AccountRepository.findOne({
      where: {
        login: mt5Login,
      },
      relations: ['user'],
    });
    if (!mt5Account?.user?.id || isExist.user.id !== mt5Account.user.id) {
      throw new BadGatewayException('User not found');
    }
    const type =
      dto.balance > 0 ? TransactionType.BONUS_IN : TransactionType.BONUS_OUT;

    const server = await this.checkAccountServer(dto.login.toString());
    const isCredited = await this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.bonus,
      dto,
      server,
    );
    const tradingPlatformBalance = isCredited?.result?.balance;
    if (isCredited.result?.ticket) {
      const tr = await this.transactionService.create(
        {
          amount: Math.abs(dto.balance),
          internalNote: dto.internalNote,
          internalComment: dto.comment,
          login: mt5Login,
          userId: mt5Account.user.id,
          method: Methods.NONE,
          internalReferenceNo: dto?.internalReferenceNo,
          tradingPlatformId: dto?.tradingPlatformId,
          currency: 'USD',
          relatedTransactionId: isExist.id,
          defaultStatus: TransactionStatus.APPROVED,
          tradingPlatformBalance,
          actionById: userId,
          initiatedById: userId,
          requestVia: RequestVia.ADMIN_AREA,
          bonusCode,
          mt5AccountLogin: bonusCode ? mt5Login.toString() : undefined,
        },
        type,
      );
      const comment = dto.balance > 0 ? 'BI' : 'BO';
      const mt5Comment = this.transactionUtilsService.createComment(
        comment,
        tr.id,
      );
      if (isCredited.result?.ticket) {
        try {
          await this.tradingDealsService.updateDeal({
            Deal: isCredited.result?.ticket,
            Comment: mt5Comment,
          });
        } catch (error) {
          console.error(error);
        }
      }
      this.transactionService.onBonusInAndBonusOut(
        tr,
        userId,
        dto.transactionId,
      );
      return tr;
    }
    const message = isCredited?.result?.message || 'Error updating bonus';
    throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async credit(dto: CreditRequest, userId: number) {
    const mt5Login = dto.login.toString();
    const mt5Account = await this.mt5AccountRepository.findOne({
      where: {
        login: mt5Login,
      },
      relations: ['user'],
    });
    if (!mt5Account?.user?.id) {
      throw new BadGatewayException('User not found');
    }
    const type =
      dto.balance > 0 ? TransactionType.CREDIT_IN : TransactionType.CREDIT_OUT;

    const server = await this.checkAccountServer(dto.login.toString());

    const isCredited = await this.kafka.SendMessage(
      server === 'live' ? this.mt5Client : this.mt5ClientDemo,
      AccountTopics.credit,
      dto,
      server,
    );
    if (isCredited.result?.answer?.ticket) {
      const tr = await this.transactionService.create(
        {
          amount: Math.abs(dto.balance),
          internalNote: dto.internalNote,
          internalComment: dto.internalComment || dto.comment,
          login: mt5Login,
          userId: mt5Account.user.id,
          method: Methods.NONE,
          internalReferenceNo: dto?.internalReferenceNo,
          tradingPlatformId: dto?.tradingPlatformId,
          currency: 'USD',
          defaultStatus: TransactionStatus.APPROVED,
          externalNote: dto.externalNote,
          initiatedById: userId,
          requestVia: RequestVia.ADMIN_AREA,
        },
        type,
      );
      const comment = dto.balance > 0 ? 'CI' : 'CO';
      const mt5Comment = this.transactionUtilsService.createComment(
        comment,
        tr.id,
      );
      try {
        await this.tradingDealsService.updateDeal({
          Deal: isCredited.result?.answer?.ticket,
          Comment: mt5Comment,
        });
      } catch (error) {
        console.error(error);
      }
      this.transactionService.onCreditInAndOut(tr, userId);
      return tr;
    }
    const message =
      isCredited?.result?.retcode === Mt5RetCode.NO_MONEY
        ? 'Insufficient Balance'
        : 'Error updating credit';
    throw new BadRequestException(message);
  }

  async getAccountRights(dto: UpdateAccountRequestParams) {
    try {
      const account: AccountData | null = ResponseWrapper.unwrapDeep(
        await this.getOneAccount({ login: dto.login }),
      );
      const mt5Account = await this.mt5AccountRepository.findOne({
        where: {
          login: dto.login,
        },
      });

      if (!mt5Account) {
        throw new NotFoundException('Account not found');
      }

      if (account?.Rights) {
        const rightsDecimal: number = +account.Rights;
        const rights = this.mapRights(rightsDecimal);

        return {
          status: 0,
          statusCode: 200,
          message: 'Rights fetched.',
          result: {
            rights: {
              ...rights,
              calculateCommission: mt5Account?.calculateCommission,
            },
            value: rightsDecimal,
          },
        };
      }
      throw new NotFoundException('Account not found');
    } catch (error) {
      console.log('Error in getAccountRights', error);
    }
  }

  async updateAccountRights(
    dto: UpdateAccountRightsRequest,
    login: string,
    user: User,
  ) {
    try {
      const account: AccountData | null = ResponseWrapper.unwrapDeep(
        await this.getOneAccount({ login }),
      );
      const mt5Account = await this.mt5AccountRepository.findOne({
        where: { login: login },
      });

      if (!mt5Account) {
        throw new NotFoundException('Account not found');
      }

      if (account?.Rights) {
        const rightsDecimal: number = +account.Rights;
        let newRights = rightsDecimal;
        const oldCommission = mt5Account.calculateCommission;

        //   newRights = dto.allowLogin
        //   ? newRights | TradingAccountRights.USER_RIGHT_ENABLED
        //   : newRights & ~TradingAccountRights.USER_RIGHT_ENABLED;
        // newRights = dto.allowTrade
        //   ? newRights & ~TradingAccountRights.USER_RIGHT_TRADE_DISABLED
        //   : newRights | TradingAccountRights.USER_RIGHT_TRADE_DISABLED;
        // newRights = dto.allowPasswordChange
        //   ? newRights | TradingAccountRights.USER_RIGHT_PASSWORD
        //   : newRights & ~TradingAccountRights.USER_RIGHT_PASSWORD;
        // newRights = dto.allowEnableOtp
        //   ? newRights | TradingAccountRights.USER_RIGHT_OTP_ENABLED
        //   : newRights & ~TradingAccountRights.USER_RIGHT_OTP_ENABLED;

        if (typeof dto.allowLogin === 'boolean') {
          newRights = dto.allowLogin
            ? newRights | TradingAccountRights.USER_RIGHT_ENABLED
            : newRights & ~TradingAccountRights.USER_RIGHT_ENABLED;
        }
        if (typeof dto.allowTrade === 'boolean') {
          newRights = dto.allowTrade
            ? newRights & ~TradingAccountRights.USER_RIGHT_TRADE_DISABLED
            : newRights | TradingAccountRights.USER_RIGHT_TRADE_DISABLED;
        }
        if (typeof dto.allowPasswordChange === 'boolean') {
          newRights = dto.allowPasswordChange
            ? newRights | TradingAccountRights.USER_RIGHT_PASSWORD
            : newRights & ~TradingAccountRights.USER_RIGHT_PASSWORD;
        }
        if (typeof dto.allowEnableOtp === 'boolean') {
          newRights = dto.allowEnableOtp
            ? newRights | TradingAccountRights.USER_RIGHT_OTP_ENABLED
            : newRights & ~TradingAccountRights.USER_RIGHT_OTP_ENABLED;
        }
        if (typeof dto.calculateCommission === 'boolean') {
          mt5Account.calculateCommission = dto.calculateCommission;
          await this.mt5AccountRepository.save(mt5Account);
        }

        let res: AccountData | null = account;
        if (newRights !== rightsDecimal) {
          res = ResponseWrapper.unwrapDeep(
            await this.updateAccount(login, {
              Rights: newRights.toString(),
            } as UpdateAccountRequest),
          );
          if (!res)
            throw new UnprocessableEntityException('Error updating rights');
        }

        const commissionChanged =
          typeof dto.calculateCommission === 'boolean' &&
          dto.calculateCommission !== oldCommission;

        const newData = {
          ...this.mapRights(newRights),
          ...(commissionChanged && {
            calculateCommission: dto.calculateCommission,
          }),
        };

        const oldData = {
          ...this.mapRights(rightsDecimal),
          ...(commissionChanged && {
            calculateCommission: oldCommission,
          }),
        };

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData,
          oldData,
          entityId: login,
          entityType: entityType.MT5_ACCOUNT,
          performerId: user.id,
          performerType: 'Operator',
          field: 'MT5 Account Updated',
        });

        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'DetailsUpdated',
          entity_id: user.id,
          entity_type: entityType.MT5_ACCOUNT,
          json_object: dto,
          performer_id: user.id,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default',
        });

        return {
          status: 0,
          statusCode: 200,
          message: 'Account updated successfully.',
          result: {
            rights: this.mapRights(res.Rights),
            value: res.Rights,
          },
        };
      }

      throw new NotFoundException('Account not found');
    } catch (error) {
      console.log('Error in updateAccountRights', error);
      throw error;
    }
  }

  mapRights(rightsDecimal) {
    return {
      allowLogin: Boolean(
        rightsDecimal & TradingAccountRights.USER_RIGHT_ENABLED,
      ),
      allowTrade: !(
        rightsDecimal & TradingAccountRights.USER_RIGHT_TRADE_DISABLED
      ), // Note the negation because the DTO expects "allow" not "disable"
      allowPasswordChange: Boolean(
        rightsDecimal & TradingAccountRights.USER_RIGHT_PASSWORD,
      ),
      allowEnableOtp: Boolean(
        rightsDecimal & TradingAccountRights.USER_RIGHT_OTP_ENABLED,
      ),
    };
  }

  async checkAccountServer(login: string) {
    console.log('loginnnn', login);
    const account = await this.mt5AccountRepository.findOneBy({ login });
    console.log('accounttt', account);
    if (!account) throw new NotFoundException('Account not found');
    return account?.server?.name?.toLowerCase();
  }

  getTotals(accounts) {
    const { totalBalance, totalCredit, totalEquityPrevDay } = accounts.reduce(
      (accumulator, currentValue) => {
        const balance = parseFloat(currentValue.balance);
        const credit = parseFloat(currentValue.credit);
        const equityPrevDay = parseFloat(currentValue.equity);

        accumulator.totalBalance += balance;
        accumulator.totalCredit += credit;
        accumulator.totalEquityPrevDay += equityPrevDay;

        return accumulator;
      },
      {
        totalBalance: 0,
        totalCredit: 0,
        totalEquityPrevDay: 0,
      },
    );

    return {
      totalBalance: totalBalance.toFixed(2),
      totalCredit: totalCredit.toFixed(2),
      totalEquityPrevDay: totalEquityPrevDay.toFixed(2),
    };
  }

  async checkClientKycApproved(id: number) {
    return this.clientRepository.findOneBy({
      user: { id },
      kycStatus: await this.customStatusRepository
        .findOne({
          where: { type: StatusType.Kyc_Status, name: 'Approved' },
        })
        .then((res) => res?.id),
    });
  }

  async getDashboardData(userId: number) {
    // if (!(await this.checkClientKycApproved(userId))) {
    //   throw new HttpException(
    //     'Please complete your KYC',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    return this.kafka.SendMessage(
      this.mt5Client,
      AccountTopics.getDashboardData,
      { userId },
      'live',
    );
  }

  async getAllTradingAccounts(
    user: User,
    body: ApplyListFilterSortColumnDto,
    query: PaginationDto,
  ) {
    try {
      const { limit = 100, page = 1 } = query;
      const res: {
        listConfig: any;
        result: Mt5Account[];
        total: number;
      } = await this.mt5AccountRepository.advanceFilters({
        userId: user.id,
        relations: [
          'server',
          'user',
          'user.wallets',
          'user.client',
          'user.client.customKycStatus',
          'user.client.partner',
          'user.client.partner.tradingGroup',
          'mt5AccountsReplicated',
          'mt5UsersReplicated',
          'commissionProfile',
          'commissionProfile.classification',
          'commissionProfile.tradingGroup',
        ],
        page,
        limit,
        filterList: body.filters || undefined,
        sortList: body.sort || undefined,
        listName: ListNames.MT5_ACCOUNTS,
        defaultSortKey: 'createdAt',
        listViewId: body.listViewId,
      });

      return res;

      // const regulations = this.configService.getOrThrow(
      //   'app.mt5RegulationServers',
      //   {
      //     infer: true,
      //   },
      // );

      // const logins = res?.result?.map((account) => {
      //   if (this.isMt5Account(account)) return account.login;
      // });

      // const regulationsPromiseLive = regulations.map(
      //   async (regulationServer) => {
      //     return this.kafka.SendMessage(
      //       this.mt5Client,
      //       AccountTopics.getAllTradingAccounts,
      //       { logins },
      //       user,
      //       'live',
      //       regulationServer,
      //     );
      //   },
      // );

      // const mt5AccountsDemo = await this.kafka.SendMessage(
      //   this.mt5ClientDemo,
      //   AccountTopics.getAllTradingAccounts,
      //   { logins },
      //   user,
      //   'demo',
      //   'FSCA',
      // );

      // const mt5AccountsLive = await Promise.all(regulationsPromiseLive);

      // const mt5Accounts = mt5AccountsLive.concat(mt5AccountsDemo);

      // const clientPromise = res?.result?.map(
      //   async (account) =>
      //     await this.clientRepository.findOne({
      //       where: {
      //         user: { id: account?.user?.id },
      //       },
      //     }),
      // );

      // const clients = await Promise.all(clientPromise);

      // res.result = res?.result?.map((account) => {
      //   const mt5Account = mt5Accounts.find(
      //     (mt5Account) => mt5Account.login == account.login,
      //   );
      //   const client = clients.find((client) => client?.user?.id);

      //   if (mt5Account) {
      //     return {
      //       ...account,
      //       ...mt5Account,
      //       salesRep: client?.salesRep ?? null,
      //       retentionRep: client?.retentionRep ?? null,
      //       id: account.id,
      //       isDeleted: false,
      //     };
      //   } else {
      //     return {
      //       ...account,
      //       salesRep: client?.salesRep ?? null,
      //       retentionRep: client?.retentionRep ?? null,
      //       isDeleted: true,
      //     };
      //   }
      // });
    } catch (error) {
      console.log('Error fetching trading accounts:', error);
      if (
        error instanceof InternalServerErrorException ||
        error instanceof Error
      )
        throw new InternalServerErrorException(
          'Error fetching trading accounts',
        );

      throw error;
    }
  }

  async changeLeverage(
    login: string,
    dto: UpdateAccountRequest,
    operatorUser: User,
  ) {
    const exisitngAccount = await this.getOneAccount({ login });
    if (!exisitngAccount?.result) {
      throw new NotFoundException('Account not found');
    }
    const res = await this.updateAccount(login, dto);

    if (res.result.retcode !== Mt5RetCode.SUCCESS) {
      throw new UnprocessableEntityException(res.result.retcode);
    }

    if (operatorUser) {
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: {
          Leverage: res?.result?.answer?.Leverage,
        },
        oldData: {
          Leverage: exisitngAccount?.result?.answer?.Leverage,
        },
        entityId: login,
        entityType: entityType.MT5_ACCOUNT,
        performerId: operatorUser?.id,
        performerType: performerType.OPERATOR,
        field: actionType.DETAILS_UPDATED,
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: actionType.DETAILS_UPDATED,
        entity_id: login,
        entity_type: entityType.MT5_ACCOUNT,
        json_object: {
          Leverage: res?.result?.answer?.Leverage,
        },
        performer_id: operatorUser?.id,
        performer_type: performerType.OPERATOR,
        is_from_archive: 0,
        trigger_type: 'Default',
      });
    }

    return { ...res, message: 'Leverage Updated Successfully' };
  }

  isMt5Account(object: any): object is Mt5Account {
    return 'login' in object;
  }

  isWallet(object: any): object is Wallet {
    return 'walletId' in object;
  }

  async addDemoBalance(login: number) {
    return this.tradeRequestService.updateDemoBalance({
      login: login.toString(),
      balance: 100000,
      type: 2,
      comment: 'Demo balance added',
    });
  }

  async getTradeState(login: number, user: User) {
    if (!(await this.isOwner(login.toString(), user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(login.toString());
    return this.kafka.SendMessage(
      server === 'demo' ? this.mt5ClientDemo : this.mt5Client,
      AccountTopics.getTradeState,
      {
        login,
      },
      server,
    );
  }

  async userState(userId: number) {
    const kycApproved = await this.kycService.isUserKycApproved(userId);
    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: {
        regulation: true,
      },
    });

    if (!client || !client.regulation) {
      throw new NotFoundException('Client or Regulation not found');
    }

    return { kycApproved, ftdDone: client?.FTD ? true : false };
  }

  async canCreateLiveAccount(userId: number) {
    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: {
        regulation: true,
      },
    });

    if (!client || !client.regulation) {
      throw new NotFoundException('Client or Regulation not found');
    }

    const checkFor: RegulationRuleKeys[] = [
      // RegulationRuleKeys.on_kyc_approval,
      // RegulationRuleKeys.on_ftd,
      RegulationRuleKeys.is_kyc_required,
      RegulationRuleKeys.is_ftd_required,
      // Easy to add new checks here
    ];

    const requirementTypes: RequirementType[] = [
      RequirementType.KYC,
      RequirementType.FTD,
      // Easy to add new types here
    ];

    const { kycApproved, ftdDone } = await this.userState(userId);

    const regulationRequirements =
      await this.regulationConfigService.isAllowedInRegulation(
        client?.regulation.id,
        RegulationEventKeys.mt5_live_account_creation,
        checkFor,
      );

    const validation = this.validateUserRequirements(
      { kycApproved, ftdDone },
      regulationRequirements,
      requirementTypes,
    );

    if (!validation.isValid) {
      const failureMessages = validation.failedRequirements.map(
        (requirement) => {
          switch (requirement) {
            case RequirementType.KYC:
              return 'KYC approval required';
            case RequirementType.FTD:
              return 'First Time Deposit required';
            default:
              return `${requirement} requirement not met`;
          }
        },
      );

      throw new BadRequestException(
        `Account creation not allowed: ${failureMessages.join(', ')}`,
      );
    }

    return true;
  }

  validateUserRequirements(
    userState: UserState,
    regulationRequirements: boolean[],
    requirementTypes: RequirementType[],
  ) {
    const failedRequirements: RequirementType[] = [];
    let anyRequirementMet = false;

    // Zip requirements with their types and validate each
    regulationRequirements.forEach((isRequired, index) => {
      const requirementType = requirementTypes[index];
      const checkFn = requirementChecks[requirementType];

      // If requirement is active and check passes, mark that at least one requirement is met
      if (isRequired && checkFn(userState)) {
        anyRequirementMet = true;
      }
      // If requirement is active but check fails, add to failed requirements
      else if (isRequired && !checkFn(userState)) {
        failedRequirements.push(requirementType);
      }
    });

    return {
      // Valid if ANY requirement was met
      isValid: anyRequirementMet,
      failedRequirements,
    };
  }

  private async isOwner(
    logins: string | string[],
    user: User,
  ): Promise<boolean> {
    const loginArray = Array.isArray(logins) ? logins : [logins];

    console.log('loginArray', loginArray);
    console.log('user', user);

    const mt5accounts = await this.mt5AccountRepository.find({
      where: {
        login: In(loginArray),
        user: { id: user.id },
      },
    });
    return mt5accounts.length === loginArray.length;
  }
  async addCommission(createCommissionDealDto: CreateCommissionDealDto) {
    return await this.kafka.SendMessage(
      this.mt5Client,
      CommissionTopics.createCommisionDeal,
      createCommissionDealDto,
    );
  }
  async getAccountsFromDB(userId: number) {
    return this.mt5AccountRepository.find({
      where: { user: { id: userId } },
      relations: ['server', 'user'],
    });
  }
  private decodeUserRights(rightsValue: number) {
    return {
      enabled:
        (rightsValue & UserRights.USER_RIGHT_ENABLED) ===
        UserRights.USER_RIGHT_ENABLED
          ? 1
          : 0,
      canChangePassword:
        (rightsValue & UserRights.USER_RIGHT_PASSWORD) ===
        UserRights.USER_RIGHT_PASSWORD
          ? 1
          : 0,
      tradeDisabled:
        (rightsValue & UserRights.USER_RIGHT_TRADE_DISABLED) ===
        UserRights.USER_RIGHT_TRADE_DISABLED
          ? 1
          : 0,
      investor:
        (rightsValue & UserRights.USER_RIGHT_INVESTOR) ===
        UserRights.USER_RIGHT_INVESTOR
          ? 1
          : 0,
      confirmed:
        (rightsValue & UserRights.USER_RIGHT_CONFIRMED) ===
        UserRights.USER_RIGHT_CONFIRMED
          ? 1
          : 0,
      canUseTrailingStop:
        (rightsValue & UserRights.USER_RIGHT_TRAILING) ===
        UserRights.USER_RIGHT_TRAILING
          ? 1
          : 0,
      canUseExpertAdvisors:
        (rightsValue & UserRights.USER_RIGHT_EXPERT) ===
        UserRights.USER_RIGHT_EXPERT
          ? 1
          : 0,
      obsolete:
        (rightsValue & UserRights.USER_RIGHT_OBSOLETE) ===
        UserRights.USER_RIGHT_OBSOLETE
          ? 1
          : 0,
      receiveDailyReports:
        (rightsValue & UserRights.USER_RIGHT_REPORTS) ===
        UserRights.USER_RIGHT_REPORTS
          ? 1
          : 0,
      readOnly:
        (rightsValue & UserRights.USER_RIGHT_READONLY) ===
        UserRights.USER_RIGHT_READONLY
          ? 1
          : 0,
      mustResetPassword:
        (rightsValue & UserRights.USER_RIGHT_RESET_PASS) ===
        UserRights.USER_RIGHT_RESET_PASS
          ? 1
          : 0,
      otpEnabled:
        (rightsValue & UserRights.USER_RIGHT_OTP_ENABLED) ===
        UserRights.USER_RIGHT_OTP_ENABLED
          ? 1
          : 0,
      sponsoredHosting:
        (rightsValue & UserRights.USER_RIGHT_SPONSORED_HOSTING) ===
        UserRights.USER_RIGHT_SPONSORED_HOSTING
          ? 1
          : 0,
      apiEnabled:
        (rightsValue & UserRights.USER_RIGHT_API_ENABLED) ===
        UserRights.USER_RIGHT_API_ENABLED
          ? 1
          : 0,
      pushNotifications:
        (rightsValue & UserRights.USER_RIGHT_PUSH_NOTIFICATION) ===
        UserRights.USER_RIGHT_PUSH_NOTIFICATION
          ? 1
          : 0,
      technical:
        (rightsValue & UserRights.USER_RIGHT_TECHNICAL) ===
        UserRights.USER_RIGHT_TECHNICAL
          ? 1
          : 0,
      excludeFromReports:
        (rightsValue & UserRights.USER_RIGHT_EXCLUDE_REPORTS) ===
        UserRights.USER_RIGHT_EXCLUDE_REPORTS
          ? 1
          : 0,
    };
  }

  async enableClientTrading(userId: number) {
    const mt5Accounts = await this.mt5AccountRepository.find({
      where: { user: { id: userId }, deletedAt: IsNull() },
    });

    const promises = mt5Accounts.map(async (account) => {
      return this.updateAccountRights({ allowTrade: true }, account.login, {
        id: userId,
      } as User);
    });

    return Promise.all(promises);
  }
}
