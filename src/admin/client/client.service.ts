import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ClientService as Mt5ClientService } from 'src/mt5/client/client.service';
import { AccountService as Mt5AccountService } from 'src/mt5/account/account.service';
import { Client } from 'src/users/entities/client.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { ClientSettingDto } from './dto/clientSetting.dto';
import { CreateAccountDto } from './dto/create-account-request.dto';
import { CreateAccountRequest } from 'src/mt5/account/dto/create-account.dto';
import { GetTradingInfoRequestParams } from './dto/trading-info.dto';
import { ITradingInfo } from 'src/utils/interface/mt5/trading/trading-info.interface';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { AccountData } from 'src/utils/interface/mt5/account/account-reponse.interface';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { ServerName } from 'src/wallet/entities/server.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { I18nContext } from 'nestjs-i18n';
import { CustomStatus, StatusType } from './entities/custom_status.entity';
import { toTitleCase } from 'src/utils/helper';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { Session } from 'src/session/entities/session.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { Lead } from '../leads/entities/lead.entity';
import { Partner } from 'src/settings/entities/partner.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mt5ClientService: Mt5ClientService,
    private readonly walletService: WalletService,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly mt5AccountService: Mt5AccountService,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) { } //private adminKycRepository: Repository<required_kyc_documents>, //@InjectRepository(required_kyc_documents)

  async updateClientOne(
    user: User['id'],
    payload: DeepPartial<Client>,
  ): Promise<string> {
    const i18n = I18nContext.current();
    const clientExist = await this.clientRepository.findOne({
      where: { userId: user },
    });
    if (!clientExist) {
      const message = i18n?.t('errors.auth.clientNotFound');
      throw new NotFoundException({
        message: message,
      });
    }

    const isSuccess = i18n?.t('success.client.updateSuccess');

    await this.clientRepository.update(user, payload);
    return `${isSuccess}`;
  }

  async getClientsToggle(userId: User['id']): Promise<ClientSettingDto> {
    const i18n = I18nContext.current();
    const data = await this.clientRepository.findOne({
      where: { userId },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        testUserMode: true,
        isPhoneValid: true,
        isSecondPhoneValid: true,
        isEmailConfirmed: true,
        isUserConverted: true,
        isProTrader: true,
        isShowInvestments: true,
        isAutomaticTransfer: true,
        isAllowTransactions: true,
        isSuspiciousUser: true,
        isBlockAllCommunications: true,
        isBlockSendingEmails: true,
        isProblematicClient: true,
        isBlockClientArea: true,
        isBonusAbuser: true,
      },
      order: { userId: 'asc' },
    });

    if (!data) {
      const message = i18n?.t('errors.auth.clientNotFound');
      throw new NotFoundException({
        message: message,
      });
    }
    return data;
  }

  async getUserAccountsList(id: number) {
    try {
      const wallets = await this.walletService.findAllByUserId(id);
      const { live, demo } =
        await this.mt5ClientService.getAllAccountsByUserId(id);
      const mt5Accounts = [...live, ...demo];

      const updatedWallets = wallets.map((wallet) => ({
        ...wallet,
        type: 'wallet',
        server: 'wallet',
      }));

      if (mt5Accounts) {
        this.mapMt5Accounts(mt5Accounts);
        mt5Accounts.map((account) => {
          updatedWallets.push(this.mapMt5Accounts(account));
        });
      }

      return {
        status: 1,
        statusCode: 200,
        message: 'Ok',
        result: updatedWallets,
      };
    } catch (error) {
      console.error('error', error.message);
      throw new BadRequestException(error.message);
    }
  }

  mapMt5Accounts(account) {
    return {
      id: +account.Login,
      currency: account.Currency ?? 'USD',
      balance: +account.Balance,
      actualBalance: +account.Balance,
      type: 'MT5',
      server: 'MT5-Live',
      createdAt: '',
      updatedAt: '',
    };
  }

  async createAccount(
    id: number,
    createAccountDto: CreateAccountDto,
    byPassLimit: boolean = false,
    operatorUser: User,
  ) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    const client = await this.clientRepository.findOneBy({
      email: user.email ?? '',
    });
    if (!client) throw new NotFoundException('Client not found');

    const createMt5AccountRequest = {
      Name: `${user.firstName} ${user.lastName}`,
      Server: createAccountDto.server,
      Currency: createAccountDto.currency,
      PassMain: 'P@ssword1',
      PassInvestor: 'P@ssword1',
      Email: user.email,
      Country: user.country,
      ClientID: client.userId.toString(),
      Company: 'Individual',
    } as CreateAccountRequest;

    switch (createAccountDto.server.toLowerCase()) {
      case 'wallet':
        return await this.walletService.create(
          createAccountDto.currency,
          user.id,
        );
      case 'mt5-live':
        return await this.mt5AccountService.createAccount(
          {
            ...createMt5AccountRequest,
            Server: 'live',
          },
          user,
          byPassLimit,
          operatorUser,
        );
      case 'mt5-demo':
        return await this.mt5AccountService.createDemoAccount(
          {
            ...createMt5AccountRequest,
            Server: 'demo',
          },
          user,
          true,
          operatorUser,
        );
      default:
        throw new NotFoundException('Server not found');
    }
  }

  async getAccountWallet(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['wallets', 'mt5Account'],
      select: {
        wallets: true,
        mt5Account: true,
      },
    });

    return user;
  }

  async getTradingInfo(dto: GetTradingInfoRequestParams): Promise<any> {
    const i18n = I18nContext.current();
    try {
      let user: User | null, wallet: Wallet | null;
      let walletId, userId;
      const account: AccountData | null = ResponseWrapper.unwrapDeep(
        await this.mt5AccountService.getOneAccount({
          login: dto.login,
        }),
      );

     const crmMt5Account = await this.mt5AccountRepository.findOne({
      where: { login: dto.login },
      relations: ['group' , "commissionProfile" , "commissionProfile.classification"],
    });
      // console.log('================crmMt5Account', crmMt5Account);

      if (crmMt5Account) {
        user = await this.userRepository.findOneBy({
          email: crmMt5Account.email,
        });
        wallet = await this.walletRepository.findOneBy({
          user: { email: crmMt5Account.email },
        });
        walletId = wallet?.id;
        userId = user?.id;
      }

      if (!account) {
        const message = i18n?.t('errors.client.accountNotFound');
        throw new NotFoundException(message);
      }

      const tradingInfo: ITradingInfo = {
        id: account.Login,
        tradingGroup:
          crmMt5Account?.server.name === ServerName.LIVE
            ? `${toTitleCase(
                this.configService.getOrThrow('app.domain', {
                  infer: true,
                }),
              )} - Live`
            : `${toTitleCase(
                this.configService.getOrThrow('app.domain', {
                  infer: true,
                }),
              )} - Demo`,
        fixedCurrencyRatio: 'USD',
        accountAgent: account.Agent != '0' ? 'N/A' : 'N/A',
        commentFromTradingPlatform: account.Comment,
        server:
          crmMt5Account?.server.name === ServerName.LIVE ? 'Live' : 'Demo',
        // accountGroupType: '**********',
        accountGroupType: account.Group,
        ibLink: 'N/A',
        platform: 'MT5',
        leverage: account.Leverage,
        walletId: walletId?.toString() ?? 'N/A',
        creationTime: crmMt5Account?.createdAt.toISOString() ?? '',
        externalId: userId?.toString() ?? '',
        accountTier:
          crmMt5Account?.server.name === ServerName.LIVE ? 'Real' : 'Demo',
        updateTime: crmMt5Account?.updatedAt.toISOString() ?? '',
        name: account.FirstName,
        email: account.Email,
        commissionProfile: crmMt5Account?.commissionProfile,
        tradingGroupDescription:
        crmMt5Account?.group?.description ?? 'N/A',
        // tradingGroup: crmMt5Account?.group?.name ?? 'N/A',  
      };

      const isSuccess = i18n?.t('success.client.tradingInfoFetch');
      return {
        status: 0,
        statusCode: 200,
        message: isSuccess,
        result: tradingInfo,
      };
    } catch (error) {
      console.error('Error in getTradingInfo', error);
      throw new UnprocessableEntityException();
    }
  }

  async checkClientKycStatus(id: number): Promise<any> {
    const client = await this.clientRepository.findOneBy({ user: { id } });
    if (!client) throw new NotFoundException('User not found');
    return client.kycStatus;
  }

  async checkClientKycApproved(id: number): Promise<any> {
    return this.clientRepository.findOneBy({
      user: { id },
      kycStatus: await this.customStatusRepository
        .findOne({
          where: { type: StatusType.Kyc_Status, name: 'Approved' },
        })
        .then((res) => res?.id),
    });
  }

  async blockUnblockUser(id: number, user: User): Promise<boolean> {
    const userEntity = await this.userRepository.findOne({
      where: { id, isClient: true, userType: 2 },
    });
    if (!userEntity) throw new NotFoundException('User not found');

    const lead = await this.leadRepository.findOne({
      where: { clientID: String(id) },
    });

    await this.userRepository.update(id, {
      isActive: userEntity.isActive ? false : true,
    });
    await this.clientRepository.update({ userId: id }, {
      isActive: userEntity.isActive ? false : true,
    });
    await this.leadRepository.update({ clientID: String(id) }, {
      isActive: userEntity.isActive ? false : true,
    });

    let oldData: any = { isActive: userEntity.isActive ? true : false };
    let newData: any = { isActive: userEntity.isActive ? false : true };
    let field = userEntity.isActive ? 'User Disabled' : 'User Enabled';

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: newData,
      oldData: oldData,
      entityId: id,
      entityType: 'User',
      performerId: user.id,
      performerType: 'Operator',
      field: field,
      parentType: 'Lead',
      parentId: lead?.id
    });

    return true;
  }

  async togglePendingWithdrawalVisibility(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const client = await this.clientRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (!client) throw new NotFoundException('Client not found');

    const { affected } = await this.clientRepository.update(
      { user: { id: user.id } },
      {
        isWithdrawRequestAllowed: !client.isWithdrawRequestAllowed,
      },
    );

    await this.cacheManager.del(`get-me-api-${user.id}`);

    return affected === 1;
  }

  async forceLogout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isClient: true, userType: 2 },
    });
    if (!user) throw new NotFoundException('User not found');
    const sessions = await this.sessionRepository.find({
      where: { user: { id: userId } },
    });

    if (!sessions.length) {
      throw new NotFoundException('No active sessions found for this user');
    }

    await this.sessionRepository.delete({
      user: { id: userId },
    });

    await this.cacheManager.del(`get-me-api-${user.id}`);
  }

  async mt5Creation(id: number, user: User): Promise<boolean> {
    const clientEntity = await this.clientRepository.findOne({
      where: { userId: id },
    });
    if (!clientEntity) throw new NotFoundException('User not found');


    await this.clientRepository.update(id, {
      isMt5CreationDisabled: clientEntity.isMt5CreationDisabled ? false : true,
    });
    await this.clientRepository.update({ userId: id }, {
      isMt5CreationDisabled: clientEntity.isMt5CreationDisabled ? false : true,
    });

    let oldData: any = { isMt5CreationDisabled: clientEntity.isMt5CreationDisabled ? true : false };
    let newData: any = { isMt5CreationDisabled: clientEntity.isMt5CreationDisabled ? false : true };
    let field = clientEntity.isMt5CreationDisabled ? 'Client Mt5 Creation Blocked' : 'Client Mt5 Creation Unblocked';

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: newData,
      oldData: oldData,
      entityId: id,
      entityType: 'User',
      performerId: user.id,
      performerType: 'Operator',
      field: field,
    });
    await this.cacheManager.del(`get-me-api-${id}`);
    return true;
  }

  async updateAffid(userId: number, partner: Partner, performerId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }
    });
    if (user) {
      const newData = { affid: partner.uuid }
      const oldData = { affid: user.affid }
      await this.userRepository.update({ id: userId }, newData);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: newData,
        oldData: oldData,
        entityId: userId,
        entityType: 'User',
        performerId,
        performerType: 'Operator',
        field: "Record Updated",
      });
    }
    const client = await this.clientRepository.findOne({
      where: {
        userId
      }
    });
    if (client) {
      const newData = { affid: partner.id }
      const oldData = { affid: client.affid }
      await this.clientRepository.update({ userId }, newData);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: newData,
        oldData: oldData,
        entityId: userId,
        entityType: 'User',
        performerId,
        performerType: 'Operator',
        field: "Record Updated",
      });
    }
    const lead = await this.leadRepository.findOne({
      where: {
        client: {
          userId
        }
      }
    });
    if (lead) {
      const oldData = { affId: lead.affId };
      const newData = { affId: partner.uuid };
      await this.leadRepository.update(lead.id, newData);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: newData,
        oldData: oldData,
        entityId: lead.id,
        entityType: 'User',
        performerId,
        performerType: 'Operator',
        parentType: "Lead",
        field: "Record Updated",
      });

    }
  }
}
