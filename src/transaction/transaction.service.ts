import {
  HttpException,
  HttpStatus,
  Injectable,
  BadRequestException,
  NotFoundException,
  UnprocessableEntityException,
  OnModuleInit,
  forwardRef,
  Inject,
  ForbiddenException,
} from '@nestjs/common';
import {
  COINS,
  CreateTransactionDto,
  ITransactionInfo,
  SinglePaymentMethod,
} from './dto/create-transaction.dto';
import { BridgerPayService } from './services/bridgerpay/bridgerpay.service';
import {
  AccountType,
  AdjustmentType,
  RequestVia,
  Transaction,
  TransactionStatus,
  TransactionType,
} from './entities/transaction.entity';
import { WalletService } from 'src/wallet/wallet.service';
import crypto from 'crypto';
import { TransactionRepository } from './repositories/transaction.repository';
import {
  CreateTransferDto,
  TransferRewardDto,
} from './dto/create-transfer.dto';
import { User } from 'src/users/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { GetTransactionList } from './dto/get-transaction.list';
import {
  Not,
  IsNull,
  Between,
  Repository,
  FindManyOptions,
  FindOptionsWhere,
} from 'typeorm';
import { WithdrawRequestDTO } from './dto/create-withdraw-request.dto';
import { WithdrawRequestRepository } from './repositories/widthdraw-request.repository.';
import { BankDetailsService } from 'src/bank-details/bank-details.service';
import { BankDetail } from 'src/bank-details/entities/bank-detail.entity';
import {
  BaseTransactionMethod,
  CreateManualTransactionDto,
} from './dto/create-manual-transaction.dto';
import {
  ICreateManualTransaction,
  ICreateTransaction,
  ITransactionClientInfo,
  IUpdateTransactionDetails,
} from './types';
import { MT5Service } from './services/mt5/mt5.service';
import {
  WithdrawSubType,
  WithdrawType,
} from './entities/withdraw-request.entity';
import { UpdateTransactionDto } from './dto/update-transcation.dto';
import { BinanceService } from './services/binance/binance.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { FileEntity } from 'src/files/entities/file.entity';
import {
  CreateManualBank,
  CreateManualCrypto,
} from './dto/create-manual-crypto.dto';
import {
  AdvanceSearchDto,
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { PspRepository } from './repositories/psp.repository';
import { PSP, PspNames } from './entities/psp.entity';
import {
  Methods,
  Methods as TransactionMethods,
  TransactionMethod as TransactionMethodsEntity,
} from './entities/transaction-method.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { I18nContext } from 'nestjs-i18n';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';
import {
  IncrementType,
  UserCreditCardsService,
} from 'src/user-credit-cards/user-credit-cards.service';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { IWithdrawPayload } from './dto/create-withdraw.dto';
import { UserEWalletService } from 'src/user-ewallet/user-ewallet.service';
import { Exchange } from './entities/exchange.entity';
import {
  PerformerType,
  TransactionAction,
  TransactionActivityLogsService,
} from './services/transaction-activity-logs/transaction-activity-logs.service';
import { UserTask } from 'src/tasks/entities/user_task.entity';
import { MasterTask } from 'src/tasks/entities/master_task.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { CreateUserCreditCardDto } from 'src/user-credit-cards/dto/create-user-credit-card.dto';
import { CreateUserEWalletDto } from 'src/user-ewallet/dto/create-user-ewallet.dto';
import { TransactionNotificationService } from './services/transcation-notification/transaction-notification.service';
import { TransactionMailService } from './services/transcation-email/transaction-mail.service';
import { FilesService } from 'src/files/files.service';
import { TransactionTaskService } from './services/transcation-tasks/transaction-tasks.service';
import { BillingInformationService } from 'src/billing-information/billing-information.service';
import { ExportedTransactions } from './entities/export.entity';
import { NGeniusService } from './services/n-genius/n-genius.service';
import { DpoService } from './services/dpo/dpo.service';
import { TransactionUtilsService } from './services/utils/utils.service';
import { In } from 'typeorm';
import { PraxisService } from './services/praxis/praxis.service';
import { MyFatoorahService } from './services/my-fatoorah/myfatoorah.service';
import { TaskService } from 'src/admin/task/task.service';
import { ClientRepository } from 'src/users/repositories/client.repository';
import {
  CreateTaskDto,
  TaskPriorityLevel,
} from 'src/admin/task/dto/create-task.dto';
import { TaskEntityType } from 'src/admin/task/entities/task.entity';
import { Client } from 'src/users/entities/client.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { AlphaPayService } from './services/alphapay/alphapay.service';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import {
  CreateTransactionNote,
  UpdateTransactionNote,
} from './dto/create-transaction-note.dto';
import { Otp } from 'src/users/entities/otp.entity';
import { RegulationsConfigService } from 'src/admin/regulations/regulations-config/regulations-config.service';
import { RegulationEventKeys } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { RegulationRuleKeys } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { AdminKycService } from 'src/admin/kyc/kyc.service';
import { MaskDataService } from 'src/roles/maskData/maskData.service';
import { TransferService } from 'src/transfer/transfer.service';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import {
  entityType,
  performerType,
} from 'src/admin/active-log/active-log.type';
import { SupportedCrypto } from './entities/supported-crypto.entity';
import { JenaPayService } from './services/jenapay/jenapay.service';
import { PspService } from 'src/psp/psp.service';
import { AggregatorNames } from 'src/aggregator/entities/aggregator.entity';
import { ReferralRewardService } from 'src/referral-reward/referral-reward.service';
import { BonusReward } from './entities/bonus-reward.entity';
import { BonusService } from 'src/bonus/bonus.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly bridgerPayService: BridgerPayService,
    private readonly userKycDocumentsService: UserKycDocumentsService,
    private readonly transactionRepository: TransactionRepository,
    private readonly pspRepository: PspRepository,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
    private readonly withdrawRequestRepository: WithdrawRequestRepository,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(TransactionMethodsEntity)
    private readonly transactionMethodsRepository: Repository<TransactionMethodsEntity>,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    @InjectRepository(BankDetail)
    private readonly bankDetailRepository: Repository<BankDetail>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    @InjectRepository(UserTask)
    private readonly userTaskRepository: Repository<UserTask>,
    @InjectRepository(MasterTask)
    private readonly masterTaskRepository: Repository<MasterTask>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(BonusReward)
    private readonly bonusRewardRepository: Repository<BonusReward>,
    @InjectRepository(ExportedTransactions)
    private readonly exportRepository: Repository<ExportedTransactions>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(notes)
    private readonly notesRepository: Repository<notes>,
    @InjectRepository(SupportedCrypto)
    private readonly supportedCryptoRepositories: Repository<SupportedCrypto>,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mt5Service: MT5Service,
    private readonly binanceService: BinanceService,
    private readonly bankDetailsService: BankDetailsService,
    private readonly userCreditCardsService: UserCreditCardsService,
    private readonly userEWalletService: UserEWalletService,
    private readonly transactionActivityLogs: TransactionActivityLogsService,
    private readonly transactionNotificationService: TransactionNotificationService,
    private readonly transactionMailService: TransactionMailService,
    private readonly transactionTaskService: TransactionTaskService,
    private readonly fileService: FilesService,
    private readonly billingInformationService: BillingInformationService,
    private readonly dpoService: DpoService,
    private readonly nGeniusService: NGeniusService,
    private readonly praxisService: PraxisService,
    private readonly myFatoorahService: MyFatoorahService,
    private readonly transactionUtilService: TransactionUtilsService,
    private readonly taskService: TaskService,
    private readonly clientRepository: ClientRepository,
    private readonly alphaPayService: AlphaPayService,
    private readonly regulationConfigService: RegulationsConfigService,
    private readonly userKycService: AdminKycService,
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly maskDataService: MaskDataService,
    private readonly eventEmitter: EventEmitter2,
    private readonly jenaPayService: JenaPayService,
    private readonly pspService: PspService,
    private readonly referralRewardService: ReferralRewardService,
    private readonly bonusService:BonusService
  ) {}

  async getPaymentPSPList(
    psp: string,
    amount: number,
    isSecondary: boolean,
    method: string,
    regulationsId: number,
    isSA: boolean,
  ): Promise<string[]> {
    const defaultAggregator = this.configService.getOrThrow(
      'app.defaultAggregator',
      {
        infer: true,
      },
    );

    const defaultCryptoPsp = this.configService.getOrThrow(
      'app.defaultCryptoPsp',
      {
        infer: true,
      },
    );

    const cryptoPsp = {
      ap: ['ap', 'px'],
      px: ['px', 'ap'],
    };

    const pspPriority = {
      ng: ['ng', 'px', 'jena', 'mf'],
      jena: ['px', 'jena', 'mf'],
      mf: ['px', 'mf', 'jena'],
    };

    let list: string[] = pspPriority[psp];

    if (method === SinglePaymentMethod.crypto) {
      if (cryptoPsp[defaultCryptoPsp]) {
        list = cryptoPsp[defaultCryptoPsp];
      }
    } else if (method !== SinglePaymentMethod.credit_card) {
      if (defaultAggregator) {
        return [defaultAggregator];
      }
      return ['px'];
    }

    if (!list) {
      if (!isSecondary || amount > 2700) {
        list = pspPriority.jena;
      } else {
        list = pspPriority.ng;
      }
    }

    const automatedPsp = await this.pspRepository.find({
      where: {
        name: In([
          PspNames.AlphaPay,
          PspNames.BridgerPay,
          PspNames.MyFatoorah,
          PspNames.Praxis,
          PspNames.DPO,
          PspNames.EPay,
          PspNames.N_GENIUS,
          PspNames.JENAPAY,
        ]),
        regulations: {
          regulation: {
            id: regulationsId,
          },
        },
      },
    });

    const mapObjectToPsp = {
      ap: PspNames.AlphaPay,
      bp: PspNames.BridgerPay,
      mf: PspNames.MyFatoorah,
      px: PspNames.Praxis,
      dpo: PspNames.DPO,
      epay: PspNames.EPay,
      ng: PspNames.N_GENIUS,
      jena: PspNames.JENAPAY,
    };

    const finalizedList: string[] = [];
    list.forEach((l) => {
      const psp = mapObjectToPsp[l] as PspNames;
      const isExist = automatedPsp.find((p) => p.name === psp);
      if (isExist) {
        finalizedList.push(l);
      }
    });

    return finalizedList;
  }

  isAmountInRange(
    amount: number,
    type: TransactionType,
    isAdmin = false,
    isCrypto?: boolean,
  ): boolean {
    let isInRange = true;
    let message = '';

    if (type === TransactionType.DEPOSIT) {
      const depositMinValue = this.configService.getOrThrow(
        'app.depositMinValue',
        {
          infer: true,
        },
      );
      let depositMaxValue = this.configService.getOrThrow(
        'app.depositMaxValue',
        {
          infer: true,
        },
      );

      if (isCrypto) {
        depositMaxValue = this.configService.getOrThrow(
          'app.cryptoMaxDepositValue',
          {
            infer: true,
          },
        );
      }
      if (amount > depositMaxValue) {
        isInRange = false;
        message = `Maximum deposit limit is ${depositMaxValue}. Please adjust your deposit amount`;
      } else if (amount < depositMinValue) {
        isInRange = false;
        message = `Minimum deposit limit is ${depositMinValue}. Please adjust your deposit amount`;
      }
    } else if (type === TransactionType.WITHDRAW) {
      let withdrawalMinValue = this.configService.getOrThrow(
        'app.withdrawalMinValue',
        {
          infer: true,
        },
      );
      if (isAdmin) {
        const fee = this.configService.getOrThrow('app.withdrawalFee', {
          infer: true,
        });
        withdrawalMinValue = Number(fee);
      }
      const withdrawalMaxValue = this.configService.getOrThrow(
        'app.withdrawalMaxValue',
        {
          infer: true,
        },
      );
      if (amount > withdrawalMaxValue) {
        isInRange = false;
        message = `Maximum withdrawal value is ${withdrawalMaxValue}. Please adjust your request.`;
      } else if (amount < withdrawalMinValue) {
        isInRange = false;
        message = `Minimum withdrawal value is ${withdrawalMinValue}. Please adjust your request.`;
      }
    }
    if (message) {
      throw new BadRequestException(message);
    }
    return isInRange;
  }

  async create(dto: ICreateTransaction, type: TransactionType) {
    const {
      walletId = null,
      userId,
      amount,
      currency,
      login = null,
      withdrawRequestId = null,
      method,
    } = dto;

    const user = new User();
    user.id = userId;

    const newTransaction = new Transaction();
    newTransaction.status = TransactionStatus.INITIALIZED_NOT_PAID;
    newTransaction.currency = currency;
    newTransaction.amount = amount;
    newTransaction.paidAmount = amount;
    newTransaction.user = user;
    newTransaction.type = type;
    let transactionFee = 0;
    if (type === TransactionType.DEPOSIT) {
      const depositFee = this.configService.getOrThrow('app.depositFee', {
        infer: true,
      });
      transactionFee = depositFee;
    } else if (type === TransactionType.WITHDRAW) {
      const withdrawFee = this.configService.getOrThrow('app.withdrawalFee', {
        infer: true,
      });
      transactionFee = withdrawFee;
    }

    if (transactionFee > amount) {
      throw new BadRequestException('Amount is less then fee');
    }

    newTransaction.fee = transactionFee;
    newTransaction.netAmount = amount - transactionFee;
    newTransaction.hash = dto.hash || 'N/A';
    let country = 'N/A';

    if (!dto.country) {
      const billingInfo =
        await this.billingInformationService.findUserBillingInfo(userId);
      if (billingInfo && billingInfo?.country) {
        country = billingInfo.country;
      }
    } else {
      country = dto.country;
    }

    newTransaction.country = country;

    if (dto.externalTransactionId) {
      newTransaction.externalTransactionId = dto.externalTransactionId;
    }
    if (dto.defaultStatus) {
      newTransaction.status = dto.defaultStatus;
    }

    if (dto.commentForUser) {
      newTransaction.commentForUser = dto.commentForUser;
    }

    if (dto.internalComment) {
      newTransaction.internalComment = dto.internalComment;
    }

    if (type !== TransactionType.DEPOSIT) {
      newTransaction.isManual = true;
    }

    if (dto.isManual) {
      newTransaction.isManual = dto.isManual;
    }

    if (dto.cryptoHashReference) {
      newTransaction.cryptoHashReference = dto.cryptoHashReference;
    }

    if (dto.externalNote) {
      newTransaction.externalNote = dto.externalNote;
    }

    if (typeof dto.tradingPlatformBalance === 'number') {
      newTransaction.tradingPlatformBalance = dto.tradingPlatformBalance;
    }

    if (dto.internalReferenceNo) {
      newTransaction.internalReferenceNo = dto.internalReferenceNo;
    }

    if (dto.cryptoClientWalletAddress) {
      newTransaction.cryptoClientWalletAddress = dto.cryptoClientWalletAddress;
    }

    if (dto.cryptoCoinName) {
      newTransaction.cryptoCoinName = dto.cryptoCoinName;
    }

    if (dto.paidCryptoCoin) {
      newTransaction.paidCryptoCoin = dto.paidCryptoCoin;
    }

    if (dto.pspTransactionId) {
      newTransaction.pspTransactionId = dto.pspTransactionId;
    }

    if (dto.transactionNote) {
      newTransaction.transactionNote = dto.transactionNote;
    }

    if (dto.internalNote) {
      newTransaction.internalNote = dto.internalNote;
    }

    if (dto.relatedTransactionId) {
      newTransaction.relatedTransactionId = dto.relatedTransactionId;
    }

    if (dto.brokerExternalId) {
      newTransaction.brokerExternalId = dto.brokerExternalId;
    }

    if (dto.pspAccountNo) {
      newTransaction.pspAccountNo = dto.pspAccountNo;
    }

    if (dto.transferFrom) {
      newTransaction.transferFrom = dto.transferFrom;
    }

    if (dto.transferTo) {
      newTransaction.transferTo = dto.transferTo;
    }

    if (dto.network) {
      newTransaction.network = dto.network;
    }

    if (dto.clientRemarks) {
      newTransaction.clientRemarks = dto.clientRemarks;
    }

    if (dto.isClientVisible === false) {
      newTransaction.isClientVisible = dto.isClientVisible;
    }

    if (type === TransactionType.ADJUSTMENT) {
      const adjustmentAccountType = dto.adjustmentAccountType;
      if (!adjustmentAccountType || !AccountType[adjustmentAccountType]) {
        throw new BadRequestException('Adjustment account type is required');
      }

      const adjustmentType = dto.adjustmentType;
      if (!adjustmentType || !AdjustmentType[adjustmentType]) {
        throw new BadRequestException('Adjustment type is required');
      }
    }

    if (dto.adjustmentAccountType) {
      newTransaction.adjustmentAccountType = dto.adjustmentAccountType;
    }

    if (dto.adjustmentType) {
      newTransaction.adjustmentType = dto.adjustmentType;
    }

    if (dto.exchangeId) {
      const exchangeEntity = await this.exchangeRepository.findOneBy({
        id: dto.exchangeId,
      });
      if (!exchangeEntity) {
        throw new BadRequestException('Exchange not found');
      }
      newTransaction.exchangeDetails = exchangeEntity;
    }

    if (dto.actionById) {
      const actionBy = await this.userRepository.findOne({
        where: {
          id: dto.actionById,
        },
        loadEagerRelations: false,
      });
      if (actionBy) {
        newTransaction.actionBy = actionBy;
      }
    }

    if (dto.tradingPlatformId) {
      // const mt5Account = await this.mt5AccountRepository.findOne({
      //   where: { id: dto.tradingPlatformId, user: { id: userId } },
      // });
      // if (mt5Account) {
      newTransaction.tradingPlatformId = dto.tradingPlatformId;
      // } else {
      //   throw new BadRequestException('Could not find trading platform');
      // }
    }

    if (method) {
      const trMethods = await this.transactionMethodsRepository.findOne({
        where: { method },
      });
      if (trMethods) {
        newTransaction.method = trMethods;
      }
    }

    if (dto.companyBankId) {
      const isExist = await this.bankAccountRepository.findOneBy({
        id: dto.companyBankId,
      });
      if (!isExist) {
        throw new BadRequestException('Bank account not found');
      }
      newTransaction.companyBank = new BankAccount();
      newTransaction.companyBank.id = isExist.id;
    }

    if (dto.userBankId) {
      const isExist = await this.bankDetailRepository.findOneBy({
        id: dto.userBankId,
        user: {
          id: userId,
        },
      });
      if (!isExist) {
        throw new BadRequestException('Bank account not found');
      }
      newTransaction.userBank = new BankDetail();
      newTransaction.userBank.id = dto.userBankId;
    }

    if (dto.psp) {
      newTransaction.psp = dto.psp;
    } else {
      const psp = await this.pspRepository.getDefaultPSP();
      if (psp) {
        newTransaction.psp = psp;
      }
    }

    if (dto.pspId) {
      const psp = await this.pspRepository.findOneBy({ id: dto.pspId });
      if (!psp) {
        throw new BadRequestException('PSP not found');
      }
      newTransaction.psp = psp;
    }

    //Add evidence if evidence id is provided
    if (dto.evidenceId) {
      const file = await this.fileRepository.findOne({
        where: { id: dto.evidenceId },
      });
      if (!file) {
        throw new BadRequestException('File not found');
      }
      const isAlreadyExist = await this.transactionRepository.findOne({
        where: { evidence: { id: dto.evidenceId } },
      });
      if (isAlreadyExist) {
        throw new BadRequestException(
          'Evidence already used against existing transaction',
        );
      }
      newTransaction.evidence = file;
    }

    //Add user credit card id if provided
    if (dto.creditCardDetailsId) {
      const creditCardDetails = await this.userCreditCardsService.findOne(
        dto.creditCardDetailsId,
        userId,
      );
      if (creditCardDetails) {
        newTransaction.creditCardDetails = creditCardDetails;
      }
    }

    if (dto.userEWalletId) {
      const userEWallet = await this.userEWalletService.findOne(
        dto.userEWalletId,
        userId,
      );
      if (!userEWallet) {
        throw new BadRequestException('EWallet not found');
      }
      if (userEWallet) {
        newTransaction.eWallet = userEWallet;
      }
    }

    //Add wallet if wallet id is provided
    if (walletId) {
      const isExist = await this.walletService.findById(walletId, userId);
      if (isExist) {
        const transactionWallet = new Wallet();
        transactionWallet.id = walletId;
        newTransaction.wallet = transactionWallet;
      }
    }

    if (login) {
      const mt5Account = await this.mt5AccountRepository.findOne({
        where: { login, user: { id: userId } },
      });
      if (mt5Account) {
        newTransaction.mt5Account = mt5Account;
      } else {
        throw new BadRequestException('Could not find mt5 account');
      }
    }

    if (withdrawRequestId) {
      const withdrawRequest = await this.withdrawRequestRepository.findOne({
        where: {
          id: withdrawRequestId,
          user: { id: userId },
        },
      });
      if (withdrawRequest) {
        newTransaction.withdrawRequest = withdrawRequest;
      }
    }

    if (dto.exchange) {
      const exchangeData = this.exchangeRepository.create({
        ...dto.exchange,
      });
      const exchange = await this.exchangeRepository.save(exchangeData);
      newTransaction.exchangeDetails = exchange;
    }

    if (dto.requestVia) {
      newTransaction.requestVia = dto.requestVia;
    }

    if (dto.initiatedById) {
      const initiatedBy = await this.userRepository.findOne({
        where: {
          id: dto.initiatedById,
        },
        loadEagerRelations: false,
      });
      if (initiatedBy) {
        newTransaction.initiatedBy = initiatedBy;
      }
    }

    const clientInfo = await this.getTransactionClientInfo(userId);
    Object.keys(clientInfo).map((key) => {
      newTransaction[key] = clientInfo[key];
    });

    if (!newTransaction.actionBy) {
      const actionBy = await this.userRepository.findOne({
        where: {
          id: dto.initiatedById,
        },
        loadEagerRelations: false,
      });
      if (actionBy) {
        newTransaction.actionBy = actionBy;
      }
    }

    const companyBankId = newTransaction?.companyBank?.id;

    const exchangeId = newTransaction?.exchangeDetails?.id;
    if (companyBankId) {
      const psp = await this.pspRepository.findOne({
        where: {
          bankAccount: {
            id: companyBankId,
          },
        },
      });
      if (psp) {
        newTransaction.psp = psp;
      }
    }

    if (exchangeId) {
      const psp = await this.pspRepository.findOne({
        where: {
          exchange: {
            id: exchangeId,
          },
        },
      });
      if (psp) {
        newTransaction.psp = psp;
      }
    }
    const isNewTradingAccount= dto.isNewTradingAccount ? dto.isNewTradingAccount : false;
    const {bonusCode,isBonusApplicable,isTradingAccountAutoDeposit,tradingAccountRef} = await this.getAutoTradingAccountDepositAndBonusPayload({
      code:dto.bonusCode,
      login:dto.mt5AccountLogin,
      amount,
      isNewTradingAccount
    } , userId, type);

    newTransaction.bonusCode = bonusCode;
    newTransaction.tradingAccountRef = tradingAccountRef;
    newTransaction.isBonusApplicable = isBonusApplicable;
    newTransaction.isTradingAccountAutoDeposit = isTradingAccountAutoDeposit;
    newTransaction.isNewTradingAccount = isNewTradingAccount;
    const isBonus = type === TransactionType.BONUS_IN || type === TransactionType.BONUS_OUT;
    if(isBonus && dto.bonusCode){
    newTransaction.bonusCode = dto.bonusCode;
    }

    let accountType = AccountType.MT5;
    if(type === TransactionType.DEPOSIT || type === TransactionType.WITHDRAW){
      accountType = AccountType.WALLET;
    };

    if(type === TransactionType.TRANSFER_IN && newTransaction.transferFrom && newTransaction?.transferFrom?.includes("MT5 -")){
      accountType = AccountType.WALLET;
    }

    if(type === TransactionType.TRANSFER_OUT && newTransaction.transferTo && newTransaction?.transferTo?.includes("MT5 -")){
      accountType = AccountType.WALLET;
    }

    if(accountType){
      newTransaction.accountType = accountType;
    }

    if(newTransaction.adjustmentAccountType){
      newTransaction.accountType = newTransaction.adjustmentAccountType
    };
    return await this.transactionRepository.save(newTransaction);
  }

  async createTransaction(
    userId: number,
    createTransactionDto: CreateTransactionDto,
    regulationsId: number,
  ) {
    const { walletId, single_payment_method, amount } = createTransactionDto;

    const wallet = await this.walletService.findById(walletId, userId);
    if (!wallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const eligiblePsp = await this.pspService.getPspForUser(
      {
        amount,
        country: billingDetails.country,
        regulationId: regulationsId,
        single_payment_method,
      },
      userId,
    );

    let resp: { url: any | unknown | string; transaction: Transaction } | null =
      null;
    let processedPsp: PSP | null = null;
    const info: ITransactionInfo = {
      bonusCode: createTransactionDto.bonusCode,
      mt5AccountLogin: createTransactionDto.mt5AccountLogin,
      isNewTradingAccount:createTransactionDto?.isNewTradingAccount || false
    };
    if (Array.isArray(eligiblePsp)) {
      for (const aggregator of eligiblePsp) {
        try {
          if (resp) {
            break;
          }

          if (aggregator.name === AggregatorNames.BridgerPay) {
            resp = await this.bridgerPayService.createTransaction(
              createTransactionDto,
              wallet.currency,
              userId,
              info,
            );
          } else if (aggregator.name === AggregatorNames.Praxis) {
            resp = await this.praxisService.createTransaction(
              createTransactionDto,
              wallet.currency,
              userId,
              info,
            );
          } else if (aggregator.name === AggregatorNames.LOCAL_GATEWAY) {
            const localPsp = aggregator.psp;
            for (const psp of localPsp) {
              try {
                if (psp.name === PspNames.N_GENIUS) {
                  resp = await this.nGeniusService.createTransaction({
                    walletId: wallet.id,
                    userId,
                    amount,
                  }, info);
                } else if (psp.name === PspNames.DPO) {
                  resp = await this.dpoService.createTransaction({
                    walletId: wallet.id,
                    userId,
                    amount,
                  }, info);
                } else if (psp.name === PspNames.MyFatoorah) {
                  resp = await this.myFatoorahService.createTransaction({
                    walletId: wallet.id,
                    userId,
                    amount,
                  }, info);
                } else if (psp.name === PspNames.JENAPAY) {
                  resp = await this.jenaPayService.createTransaction({
                    walletId: wallet.id,
                    userId,
                    amount,
                  }, info);
                } else if (psp.name === PspNames.AlphaPay) {
                  resp = await this.alphaPayService.createTransaction(
                    createTransactionDto,
                    userId,
                    info
                  );
                }
              } catch (error) {
                await this.pspService.addAttempt({
                  isError: true,
                  pspId: psp.id,
                  requestPayload: '',
                  responsePayload: JSON.stringify(error),
                  userId,
                });
                console.error(
                  `Error creating transaction of ${psp.name} ,"PSP"`,
                  error,
                );
              }
            }
          }
        } catch (error) {
          await this.pspService.addAttempt({
            isError: true,
            aggregator: aggregator,
            requestPayload: '',
            responsePayload: JSON.stringify(error),
            userId,
          });
          console.error(
            `Error creating transaction of ${aggregator.name} , "Aggregator"`,
            error,
          );
        }
      }
      console.log(processedPsp);
      return resp;
    }
  }
  async createDeposit(createTransactionDto: CreateTransactionDto, user: User) {
    const i18n = I18nContext.current();
    const userId = user?.id;
    await this.isDepositOrWithdrawalCreationAllowed(
      userId,
      TransactionType.DEPOSIT,
    );

    let regulationId: null | number = null;
    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: ['regulation'],
    });
    if (client && client?.regulation?.id) {
      regulationId = client?.regulation?.id;
    }
    if (!regulationId) {
      throw new BadRequestException('Client Regulation not found');
    }

    const isBtcCrypto =
      createTransactionDto.single_payment_method ===
      SinglePaymentMethod.crypto &&
      createTransactionDto.currency === COINS.BTC;

    const btcWalletAddress = this.configService.getOrThrow(
      'app.btcWalletAddress',
      {
        infer: true,
      },
    );

    const btcQRCode = this.configService.getOrThrow('app.btcQRCode', {
      infer: true,
    });

    if (isBtcCrypto) {
      return {
        url: {
          qr_code: btcQRCode,
          qrcode: btcQRCode,
          address: btcWalletAddress,
        },
      };
    }
    const resp = await this.createTransaction(
      userId,
      createTransactionDto,
      regulationId,
    );
    if (resp) {
      const { transaction, url } = resp;
      this.transactionActivityLogs.emit({
        entityId: transaction.id,
        field: TransactionAction.RECORD_CREATED,
        newData: transaction,
        oldData: null,
        performerId: userId,
        performerType: PerformerType.USER,
      });
      await this.onDepositAndWithdrawCreation(transaction, false);
      return { url };
    }
    const message = i18n?.t('errors.transaction.unableToCreate');
    throw new UnprocessableEntityException(message);
  }

  async get(transactionId: string, hash: string) {
    const genMd5Hash = crypto.createHash('md5');
    genMd5Hash.update(hash);
    const md5Hash = genMd5Hash.digest('hex');
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: transactionId,
        hash: md5Hash,
      },
    });
    return transaction;
  }

  async initTransaction(transaction: Transaction, lastStatus?: string) {
    transaction.status = TransactionStatus.INITIALIZED;

    if (lastStatus) {
      transaction.lastStatus = lastStatus;
    }
    await this.transactionRepository.save(transaction);
  }

  async approveTransaction(
    transaction: Transaction,
    amount: number,
    lastStatus?: string,
    shouldCredit = true,
  ) {
    const i18n = I18nContext.current();
    if (lastStatus) {
      transaction.lastStatus = lastStatus;
    }

    const operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });
    let actionBy: null | User = null;
    if (operator) {
      const user = await this.userRepository.findOne({
        where: {
          operator: {
            id: operator.id,
          },
        },
      });
      if (user) {
        actionBy = user;
      }
    }

    if (
      transaction.amount !== amount ||
      transaction.status !== TransactionStatus.APPROVED
    ) {
      await this.transactionRepository.update(transaction.id, {
        paidAmount: amount,
        status: TransactionStatus.APPROVED,
        actionBy: actionBy ? actionBy : undefined,
      });
    }

    const payment = await this.transactionRepository.findOne({
      where: {
        id: transaction.id,
      },
    });
    let creditIncrementType: IncrementType | null = null;
    let creditAmount: number | null = null;
    let creditDetailsId: number | null = null;

    if (payment?.status === TransactionStatus.APPROVED) {
      try {
        const tr = await this.getById(payment.id);
        if (
          tr?.method?.method === Methods.CREDIT_CARD &&
          tr?.creditCardDetails?.id
        ) {
          let incrementType;
          if (tr.type === TransactionType.DEPOSIT) {
            incrementType = IncrementType.DEPOSIT;
          } else if (tr.type === TransactionType.WITHDRAW) {
            incrementType = IncrementType.WITHDRAW;
          }
          if (incrementType) {
            creditIncrementType = incrementType;
            creditAmount = tr?.amount;
            creditDetailsId = tr?.creditCardDetails?.id;
          }
        }
      } catch (error) {
        console.error(error);
      }
      if (shouldCredit) {
        const resp = await this.walletService.credit(payment);
        try {
          if (resp && creditDetailsId && creditAmount && creditIncrementType) {
            await this.userCreditCardsService.increment(
              creditDetailsId,
              creditAmount,
              creditIncrementType,
            );
          }
        } catch (error) {
          console.error(error);
        }

        return resp;
      } else {
        try {
          if (
            payment &&
            creditDetailsId &&
            creditAmount &&
            creditIncrementType
          ) {
            await this.userCreditCardsService.increment(
              creditDetailsId,
              creditAmount,
              creditIncrementType,
            );
          }
        } catch (error) {
          console.error(error);
        }
        return payment;
      }
    } else {
      const message = await i18n?.t('errors.transaction.transactionDiffer');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: message,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async failTransaction(transaction: Transaction, lastStatus?: string) {
    if (lastStatus) {
      transaction.lastStatus = lastStatus;
    }
    const operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });
    let actionBy: null | User = null;
    if (operator) {
      const user = await this.userRepository.findOne({
        where: {
          operator: {
            id: operator.id,
          },
        },
      });
      if (user) {
        actionBy = user;
      }
    }

    transaction.status = TransactionStatus.FAILED;
    if (actionBy) {
      transaction.actionBy = actionBy;
    }
    await this.transactionRepository.save(transaction);
  }

  async updateLastStatus(transaction: Transaction, lastStatus: string) {
    if (lastStatus) {
      transaction.lastStatus = lastStatus;
      await this.transactionRepository.save(transaction);
    }
  }

  isValidForRejection(transaction: Transaction) {
    const isManualCrypto = this.isManualCryptoTransaction(transaction);
    const isManualBankTransfer =
      this.isManualBankTransferTransaction(transaction);
    const isWithdrawalRequest = this.isWithdrawalRequest(transaction.type);
    return isManualBankTransfer || isWithdrawalRequest || isManualCrypto;
  }

  async rejectTransaction(id: string, dto: UpdateTransactionDto, user: User, isAdminEndpoint=false) {
    const i18n = I18nContext.current();
    const performerId = user.id;
    const performerType = this.transactionActivityLogs.getPerformerType(user);
    const isExist = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: ['method'],
    });
    if (!isExist) {
      const message = i18n?.t('errors.transaction.notFound');
      throw new BadRequestException(message);
    }
    if(isAdminEndpoint){
      await this.isTransactionUserAllowedToOperator(isExist.user.id, user.id)
    }
    if (isExist.type === TransactionType.WITHDRAW) {
      if (!dto.reason) {
        throw new BadRequestException('Reason is required for Rejection');
      }
      if (!dto.internalComment) {
        throw new BadRequestException(
          'Internal Comment is required for Rejection',
        );
      }
      if (!dto.externalNote) {
        throw new BadRequestException('ExternalNote is required for Rejection');
      }
      if (!dto.pspId) {
        throw new BadRequestException('PSP is required for Rejection');
      }
    }

    const transaction = await this.update(dto, id, user.id);
    const isValidForRejection = this.isValidForRejection(isExist);
    if (!isValidForRejection) {
      const message = i18n?.t('errors.transaction.invalidType');
      throw new BadRequestException(message);
    }

    const isValidForApproval = this.isValidForApprovalOrRejection(
      transaction.status,
    );
    if (!isValidForApproval) {
      const message = i18n?.t('errors.transaction.invalidStatus');
      throw new BadRequestException(message);
    }

    transaction.status = TransactionStatus.REJECTED;
    const actionBy = await this.userRepository.findOne({
      where: {
        id: performerId,
      },
    });
    if (actionBy) {
      transaction.actionBy = actionBy;
    }
    const result = await this.transactionRepository.save(transaction);
    if (transaction.type !== TransactionType.WITHDRAW) {
      this.transactionNotificationService.depositRequestRejectedByAdmin(
        transaction,
      );
      this.transactionMailService.onManualDepositRejection(transaction);
    } else {
      this.transactionMailService.onWithdrawRejection(transaction);
    }
    this.transactionActivityLogs.emit({
      entityId: transaction.id,
      field: TransactionAction.DETAILS_UPDATED,
      newData: result,
      oldData: isExist,
      performerId,
      performerType,
    });

    return result;
  }

  async cancelWithdraw(id: string, user: User, isAdminEndpoint=false) {
    const i18n = I18nContext.current();
    const performerId = user.id;
    const performerType = this.transactionActivityLogs.getPerformerType(user);
    const isExist = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });

    if (!isExist) {
      const message = i18n?.t('errors.transaction.notFound');
      throw new BadRequestException(message);
    }

    if(isAdminEndpoint){
      await this.isTransactionUserAllowedToOperator(isExist.user.id, user.id)
    }


    if (isExist.type !== TransactionType.WITHDRAW) {
      throw new BadRequestException('Invalid Transaction Type');
    }

    if (isExist.status !== TransactionStatus.APPROVED) {
      throw new BadRequestException('Invalid Transaction Status');
    }

    await this.walletService.revertWithdrawal(isExist);

    const result = await this.transactionRepository.update(isExist.id, {
      status: TransactionStatus.CANCELLED,
    });
    const newData = await this.transactionRepository.findOne({
      where: {
        id,
      },
    });
    this.transactionActivityLogs.emit({
      entityId: isExist.id,
      field: TransactionAction.DETAILS_UPDATED,
      newData: newData,
      oldData: isExist,
      performerId,
      performerType,
    });

    return result;
  }

  async transfer(dto: CreateTransferDto, user: User, clientId?: string) {
    const transferType = this.configService.getOrThrow(
      'app.transferTransactionType',
      {
        infer: true,
      },
    );
    const isQueue = transferType.toLowerCase() === 'queue';
    if (!isQueue) {
      return this.transferAmount(dto, user, clientId);
    }
    const response = await this.transferAmount(dto, user, clientId);
    return response;
  }

  async transferAmount(dto: CreateTransferDto, user: User, clientId?: string , isSystem?:boolean) {
    const i18n = I18nContext.current();
    const { transferIn, transferOut, amount, ...rest } = dto;
    const userId = clientId ? Number(clientId) : user.id;
    const initiatedById = user.id;
    let requestVia = clientId
      ? RequestVia.ADMIN_AREA
      : RequestVia.CLIENT_AREA;
    let performerId = user.id;
    const performerType = this.transactionActivityLogs.getPerformerType(user, isSystem);

    if(isSystem){
      requestVia = RequestVia.SYSTEM;
      const systemUser = await this.userRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });
      if(systemUser){
        performerId = systemUser.id
      }
    };

    const fromWalletToTrading =
      Boolean(transferOut.walletId) && Boolean(transferIn.login);
    const fromTradingToWallet =
      Boolean(transferOut.login) && Boolean(transferIn.walletId);
    const transferFunds = () => {
      if (fromWalletToTrading) {
        console.log('Transfering from wallet to trading...', dto);
        return this.fromWalletToTradingTransfer(
          transferOut.walletId,
          transferIn.login,
          amount,
          userId,
          { ...rest, requestVia, initiatedById },
        );
      } else if (fromTradingToWallet) {
        console.log('Transfering from trading to wallet...', dto);
        return this.fromTradingToWalletTransfer(
          transferOut.login,
          transferIn.walletId,
          amount,
          userId,
          { ...rest, requestVia, initiatedById },
        );
      }
    };
    const resp = await transferFunds();
    if (resp?.from && !isSystem) {
      if (clientId) {
        this.transactionNotificationService.transferByAdmin(resp.from);
      } else {
      }
      this.transactionNotificationService.transferByUser(resp.from);
    }
    if (!resp) {
      const message = i18n?.t('errors.transaction.operationNotAllowed');
      throw new UnprocessableEntityException(message);
    }

    this.transactionActivityLogs.emit({
      entityId: resp?.to.id,
      field: TransactionAction.RECORD_CREATED,
      newData: resp,
      oldData: null,
      performerId,
      performerType,
    });
    this.transactionActivityLogs.emit({
      entityId: resp?.from.id,
      field: TransactionAction.RECORD_CREATED,
      newData: resp,
      oldData: null,
      performerId,
      performerType,
    });
    if(!isSystem){
      this.transactionMailService.onTransferInOut(resp.from);
    }
    return resp;
  }

  async getUserPendingWithdrawalVisible(userId: number) {
    const client = await this.clientRepository.findOne({
      where: {
        user: { id: userId },
      },
      loadEagerRelations: false,
    });
    return client?.isPendingWithdrawalVisible;
  }

  async isUserWithdrawAllowed(userId: number) {
    const client = await this.clientRepository.findOne({
      where: {
        user: { id: userId },
      },
      loadEagerRelations: false,
    });
    return client?.isWithdrawRequestAllowed;
  }

  async findAll(
    query: GetTransactionList,
    userId?: number,
    isClient: boolean = false,
  ) {
    const {
      limit = 7,
      page = 1,
      from = null,
      to = null,
      method = null,
      login = null,
      ...params
    } = query;
    let baseQuery: FindManyOptions<Transaction> = {
      where: {},
      relations: ['user', 'withdrawRequest', 'wallet', 'wallet.server'],
      order: {
        createdAt: 'DESC',
      },
    };
    const statusIn = [
      TransactionStatus.APPROVED,
      TransactionStatus.REJECTED,
      TransactionStatus.FAILED,
    ];
    if (isClient) {
      baseQuery = {
        where: {
          status: In(statusIn),
        },
        relations: ['user', 'withdrawRequest', 'wallet', 'wallet.server'],
        order: {
          createdAt: 'DESC',
        },
      };
    }

    if (userId) {
      if (baseQuery.where) {
        baseQuery.where = {
          ...baseQuery.where,
          user: { id: userId },
        };
      }
    }

    if (from && to) {
      if (baseQuery.where) {
        baseQuery.where = {
          ...baseQuery.where,
          createdAt: Between<Date>(new Date(from), new Date(to)),
        };
      }
    }
    if (method) {
      const transactionMethods =
        await this.transactionMethodsRepository.findOne({
          where: { method },
        });
      if (baseQuery.where && transactionMethods) {
        baseQuery.where = {
          ...baseQuery.where,
          method: {
            id: transactionMethods.id,
          },
        };
      }
    }

    if (params) {
      if (baseQuery.where) {
        baseQuery.where = {
          ...baseQuery.where,
          ...params,
        };
      }
    }

    const OR: FindOptionsWhere<Transaction>[] = [
      baseQuery.where as FindOptionsWhere<Transaction>,
    ];
    if (isClient && userId && !params?.type) {
      const newQuery: FindOptionsWhere<Transaction> = {
        user: { id: userId },
        type: TransactionType.WITHDRAW,
        ...params,
      };
      if (from && to) {
        newQuery.createdAt = Between<Date>(new Date(from), new Date(to));
      }

      if (method) {
        const transactionMethods =
          await this.transactionMethodsRepository.findOne({
            where: { method },
          });
        if (newQuery && transactionMethods) {
          newQuery.method = {
            id: transactionMethods.id,
          };
        }
      }
      OR.push(newQuery);
    } else {
      if (params.type === TransactionType.WITHDRAW && !params.status) {
        statusIn.push(TransactionStatus.INITIALIZED_NOT_PAID);
      }
    }

    let isInValidFilters = false;
    if (isClient && params.status === TransactionStatus.INITIALIZED_NOT_PAID) {
      if (params.type && params.type !== TransactionType.WITHDRAW) {
        isInValidFilters = true;
      }
      OR.forEach((o) => {
        o.type = TransactionType.WITHDRAW;
      });
    }
    baseQuery.where = OR;
    if (isInValidFilters) {
      return [];
    }

    if (isClient) {
      const orWithClientVisible = OR.map((o) => {
        return {
          ...o,
          isClientVisible: true,
        };
      });
      baseQuery.where = orWithClientVisible;
    }

    if(login){
      if(Array.isArray(baseQuery.where)){
        const orWithLoginFilter = baseQuery.where.map((o)=>{
          return {
            ...o,
            mt5Account:{
              login
            },
            accountType:AccountType.MT5
          }
        });
        baseQuery.where = orWithLoginFilter
      }
    }
    const data = await this.transactionRepository.findWithPagination(
      baseQuery,
      { limit, page },
    );
    return data;
  }

  async findAllWithFilters(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    userId: number,
    clientUserId?: number,
  ) {
    const filters: FilterItem[] = [];

    const relations = [
      'method',
      'psp',
      'user',
      'user.client',
      'user.client.customKycStatus',
      'user.client.partner',
      'mt5Account',
      'mt5Account.server',
      'wallet',
      'wallet.server',
      'creditCardDetails',
    ];

    if (clientUserId) {
      const filter: FilterItem = {
        name: 'user.id',
        operation: FilterOperation.EQUALS,
        value: [clientUserId],
      };
      filters.push(filter);
    }

    const payload = {
      relations,
      limit,
      page,
      listName: ListNames.TRANSACTIONS,
      filterList: body.filters,
      sortList: body.sort,
      sort: body.sort,
      userId,
      defaultSortKey: 'createdAt',
      listViewId: body.listViewId,
      orList: body.or,
      filters,
    };
    const data = await this.transactionRepository.advanceFilters(payload);
    return data;
  }

  async findAllWithFiltersForExport(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    userId: number,
  ) {
    const payload = {
      relations: [
        'user',
        'user.client',
        'user.client.customKycStatus',
        'user.client.partner',
        'withdrawRequest',
        'wallet',
        'wallet.server',
        'mt5Account.server',
        'creditCardDetails',
      ],
      limit,
      page,
      listName: ListNames.TRANSACTIONS,
      filterList: body.filters,
      sortList: body.sort,
      sort: body.sort,
      userId,
      defaultSortKey: 'createdAt',
      listViewId: body.listViewId,
      all: true,
    };

    const data = await this.transactionRepository.advanceFilters(payload);
    const maskedData = await this.maskDataService.maskData(data, userId);
    const fileUrl = await this.fileService.exportToXls(maskedData);
    const client = await this.userRepository.findOne({
      where: { id: userId, isOperator: true },
    });

    if (!client) {
      throw new Error('Operator not found');
    }

    const exportEntity = this.exportRepository.create({
      url: fileUrl,
      operatorId: client.id,
      operatorEmail: client?.email ?? undefined,
    });
    await this.exportRepository.save(exportEntity);
    await this.transactionMailService.onTransactionExport(+userId, fileUrl);
    return fileUrl;
  }

  async findUserWithdrawRequest(userId: number) {
    const entities = await this.transactionRepository.find({
      where: {
        user: {
          id: userId,
        },
        withdrawRequest: Not(IsNull()),
      },
      relations: {
        user: true,
      },
    });
    return entities;
  }

  async deleteWithdrawRequest(id: number, userId: number) {
    const i18n = I18nContext.current();
    const entity = await this.transactionRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        withdrawRequest: {
          id,
        },
      },
    });
    if (!entity) {
      const message = i18n?.t('errors.transaction.widthdrawRequestNotFound');
      throw new NotFoundException(message);
    }
    if (
      entity.status !== TransactionStatus.NEW &&
      entity.status !== TransactionStatus.INITIALIZED_NOT_PAID &&
      entity.status !== TransactionStatus.PENDING
    ) {
      const message = i18n?.t('errors.transaction.withdrawCannotDeleted');
      throw new BadRequestException(`${message} ${entity.status}`);
    }
    const fromTransaction = await this.transactionRepository.softDelete({
      withdrawRequest: {
        id,
      },
    });

    if (fromTransaction.affected !== 1) {
      throw new UnprocessableEntityException('An error occurred');
    }

    const withdrawReq = await this.withdrawRequestRepository.softDelete({
      id,
    });

    return { deleted: withdrawReq.affected === 1 };
  }

  async fromWalletToTradingTransfer(
    fromWalletId: number,
    toLogin: string,
    amount: number,
    userId: number,
    transactionData: object & { initiatedById: number; requestVia: RequestVia },
  ) {
    const i18n = I18nContext.current();
    const wallet = await this.walletService.findById(fromWalletId, userId);
    if (!wallet) {
      const message = i18n?.t('errors.transaction.walletNotFound');
      throw new NotFoundException(message);
    }

    const canCreate = await this.canTransferFromWallet(userId, amount, wallet);
    if (!canCreate) {
      const message = i18n?.t(
        'errors.transaction.transferLimitDueToPendingWithdrawal',
      );
      throw new BadRequestException(message);
    }

    if (amount > wallet.balance) {
      const message = i18n?.t('errors.transaction.insufficientFunds');
      throw new NotFoundException(message);
    }

    const account = await this.mt5Service.getUserMT5Account(toLogin, userId);
    if (!account) {
      const message = i18n?.t('errors.transaction.accountDoesNotExist');
      throw new NotFoundException(message);
    }

    console.log('MT5 Account: ', account);

    const data = {
      userId,
      hash: 'N/A',
      amount,
      status: TransactionStatus.INITIALIZED_NOT_PAID,
      currency: wallet.currency,
      method: TransactionMethods.INTERNAL_TRANSFER,
    };
    const transferTo = `MT5 - ${toLogin}`;
    const transferFrom = `Wallet - ${fromWalletId}`;

    const from = await this.create(
      {
        ...data,
        walletId: fromWalletId,
        ...transactionData,
        login: toLogin,
        transferTo,
        transferFrom,
      },
      TransactionType.TRANSFER_OUT,
    );
    const to = await this.create(
      {
        ...data,
        login: toLogin,
        ...transactionData,
        walletId: fromWalletId,
        transferTo,
        transferFrom,
      },
      TransactionType.TRANSFER_IN,
    );

    if (!from || !to) {
      const message = i18n?.t('errors.transaction.creatingTransaction');
      throw new UnprocessableEntityException(message);
    }

    const isDebited = await this.walletService.debit(from);

    console.log('Trasnsfer response from wallet: ', isDebited);

    if (isDebited) {
      const updateFrom = new Transaction();
      updateFrom.id = from.id;
      updateFrom.status = TransactionStatus.APPROVED;

      const updateTo = new Transaction();
      updateTo.id = to.id;
      updateTo.status = TransactionStatus.APPROVED;

      const isUpdatedFrom = await this.transactionRepository.save(updateFrom);
      if (isUpdatedFrom) {
        const comment = this.transactionUtilService.createComment(
          'TI',
          from.id,
        );
        const data = await this.mt5Service.updateMT5Balance(
          toLogin,
          amount,
          comment,
        );
        if (
          data?.result?.answer &&
          data?.result?.answer &&
          data?.result?.answer?.ticket
        ) {
          const ticket = data?.result?.answer?.ticket;
          if (ticket) {
            try {
              await this.transactionRepository.update(
                [updateFrom.id, updateTo.id],
                { ticket },
              );
            } catch (error) {
              console.error(
                'ERROR IN ticket update in transaction from mt5',
                error,
              );
            }
          }
        }
        console.log('Transfer response from MT5: ', data);
        if (data) {
          const isUpdatedTo = await this.transactionRepository.save(updateTo);
          const toTr = await this.getById(isUpdatedTo.id);
          const fromTr = await this.getById(isUpdatedFrom.id);
          if (isUpdatedTo) {
            return {
              from: fromTr,
              to: toTr,
            };
          } else {
            const message = i18n?.t('errors.transaction.processingTransfer');
            throw new UnprocessableEntityException(message);
          }
        } else {
          const message = i18n?.t('errors.transaction.processingTransfer');
          throw new UnprocessableEntityException(message);
        }
      } else {
        const message = i18n?.t('errors.transaction.processingTransfer');
        throw new UnprocessableEntityException(message);
      }
    } else {
      const message = i18n?.t('errors.transaction.processingTransfer');
      throw new UnprocessableEntityException(message);
    }
  }

  async fromTradingToWalletTransfer(
    fromLogin: string,
    toWalletId: number,
    amount: number,
    userId: number,
    transactionData: object & { initiatedById: number; requestVia: RequestVia },
  ) {
    const i18n = I18nContext.current();
    const wallet = await this.walletService.findById(toWalletId, userId);
    if (!wallet) {
      const message = i18n?.t('errors.transaction.walletNotFound');
      throw new NotFoundException(message);
    }

    const account = await this.mt5Service.verifyMT5Balance(
      fromLogin,
      userId,
      amount,
    );
    if (!account) {
      const message = i18n?.t('errors.transaction.processingTransaction');
      throw new NotFoundException(message);
    }

    console.log('Response from MT5 Balance check: ', account);

    const data = {
      userId,
      hash: 'N/A',
      amount,
      status: TransactionStatus.INITIALIZED_NOT_PAID,
      currency: wallet.currency,
      method: TransactionMethods.INTERNAL_TRANSFER,
    };

    const transferTo = `Wallet - ${toWalletId}`;
    const transferFrom = `MT5 - ${fromLogin}`;
    const from = await this.create(
      {
        ...data,
        login: fromLogin,
        ...transactionData,
        walletId: toWalletId,
        transferFrom,
        transferTo,
      },
      TransactionType.TRANSFER_OUT,
    );
    const to = await this.create(
      {
        ...data,
        walletId: toWalletId,
        ...transactionData,
        login: fromLogin,
        transferFrom,
        transferTo,
      },
      TransactionType.TRANSFER_IN,
    );

    if (!from || !to) {
      const message = i18n?.t('errors.transaction.creatingTransaction');
      throw new UnprocessableEntityException(message);
    }
    const comment = this.transactionUtilService.createComment('TO', from.id);
    const isDebited = await this.mt5Service.updateMT5Balance(
      fromLogin,
      -amount,
      comment,
    );

    if (
      isDebited?.result?.answer &&
      isDebited?.result?.answer &&
      isDebited?.result?.answer?.ticket
    ) {
      const ticket = isDebited?.result?.answer?.ticket;
      if (ticket) {
        try {
          await this.transactionRepository.update([from.id, to.id], { ticket });
        } catch (error) {
          console.error(
            'ERROR IN ticket update in transaction from mt5',
            error,
          );
        }
      }
    }

    console.log('Trasnsfer response from MT5: ', isDebited);

    if (isDebited) {
      const updateFrom = new Transaction();
      updateFrom.id = from.id;
      updateFrom.status = TransactionStatus.APPROVED;

      const updateTo = new Transaction();
      updateTo.id = to.id;
      updateTo.status = TransactionStatus.APPROVED;

      const isUpdatedFrom = await this.transactionRepository.save(updateFrom);
      if (isUpdatedFrom) {
        const data = await this.walletService.credit(to);

        console.log('Transfer response from Wallet: ', data);

        if (data) {
          const isUpdatedTo = await this.transactionRepository.save(updateTo);
          const fromTr = await this.getById(isUpdatedFrom.id);
          const toTr = await this.getById(isUpdatedTo.id);
          if (isUpdatedTo) {
            return {
              from: fromTr,
              to: toTr,
            };
          } else {
            const message = i18n?.t('errors.transaction.processingTransfer');
            throw new UnprocessableEntityException(message);
          }
        } else {
          const message = i18n?.t('errors.transaction.processingTransfer');
          throw new UnprocessableEntityException(message);
        }
      } else {
        const message = i18n?.t('errors.transaction.processingTransfer');
        throw new UnprocessableEntityException(message);
      }
    } else {
      const message = i18n?.t('errors.transaction.processingTransfer');
      throw new UnprocessableEntityException(message);
    }
  }

  async createProofOfPaymentTask(userId: number) {
    const taskName = 'clientregistration_payment_document_upload';
    const masterTask = await this.masterTaskRepository.findOneBy({
      name: taskName,
    });
    const label = await this.labelRepository.findOneBy({ key: taskName });

    if (masterTask && label) {
      const isAlreadyExist = await this.userTaskRepository.findOneBy({
        user: {
          id: userId,
        },
        task: {
          id: masterTask.id,
        },
        isCompleted: false,
      });
      if (!isAlreadyExist) {
        const taskData = this.userTaskRepository.create({
          user: {
            id: userId,
          },
          url: masterTask.masterUrl,
          task: masterTask,
          label: {
            id: label.id,
          },
        });
        await this.userTaskRepository.save(taskData);
      }
    }
  }

  async createWithdrawRequest(
    withdrawRequestDto: WithdrawRequestDTO & { payload?: IWithdrawPayload },
    userData: User,
    isAdmin = false,
    isApproved = false,
    subType = WithdrawSubType.CLIENT_REQUEST,
    method = TransactionMethods.NONE,
    clientId?: string,
    verificationId?: number,
  ) {
    const i18n = I18nContext.current();
    const userId = clientId ? Number(clientId) : userData.id;
    const performerId = userData.id;
    const performerType =
      this.transactionActivityLogs.getPerformerType(userData);
    await this.isDepositOrWithdrawalCreationAllowed(
      userId,
      TransactionType.WITHDRAW,
    );

    if (!isAdmin) {
      const isAllowed = await this.isUserWithdrawAllowed(userId);
      if (!isAllowed) {
        const message = i18n?.t(
          'errors.transaction.withdrawRequestCreationNotAllowed',
        );
        throw new UnprocessableEntityException(message);
      }
    }

    if (!isAdmin && withdrawRequestDto.type === WithdrawType.NONE) {
      const message = i18n?.t('errors.transaction.withdrawalTypeNone');
      throw new UnprocessableEntityException(message);
    }

    if (withdrawRequestDto.walletId && withdrawRequestDto.login) {
      const message = i18n?.t('errors.transaction.oneWalletIdLoginProvided');
      throw new UnprocessableEntityException(message);
    }
    const {
      bankDetailId = null,
      walletId = null,
      ...rest
    } = withdrawRequestDto;

    let bankDetail: BankDetail | undefined = undefined;
    let wallet: Wallet | undefined = undefined;

    const user = new User();
    user.id = userId;

    if (bankDetailId) {
      bankDetail = await this.bankDetailsService.findOne(userId, bankDetailId);
    }

    if (walletId) {
      const walletDetail = await this.walletService.findById(walletId, userId);
      if (!walletDetail) {
        const message = i18n?.t('errors.transaction.walletNotFound');
        throw new BadRequestException(message);
      }
      if (withdrawRequestDto.amount > walletDetail.balance) {
        const message = i18n?.t('errors.transaction.insufficientFunds');
        throw new BadRequestException(message);
      }
      wallet = walletDetail;
    }

    if (!wallet && withdrawRequestDto.login) {
      const account = await this.mt5Service.verifyMT5Balance(
        withdrawRequestDto.login,
        userId,
        withdrawRequestDto.amount,
      );
      if (!account) {
        const message = i18n?.t('errors.transaction.insufficientFunds');
        throw new BadRequestException(message);
      }
    }
    if (!wallet) {
      const message = i18n?.t('errors.transaction.walletNotFound');
      throw new BadRequestException(message);
    }
    const canCreate = await this.canCreateWithdraw(
      userId,
      withdrawRequestDto.amount,
      wallet,
    );
    if (!canCreate) {
      const message = i18n?.t('errors.transaction.withdrawExceedBalance');
      throw new BadRequestException(message);
    }
    const withdrawRequest = this.withdrawRequestRepository.create({
      bankDetail,
      wallet,
      user,
      subType,
      ...rest,
    });
    const result = await this.withdrawRequestRepository.save(withdrawRequest);

    const currency =
      wallet?.currency || withdrawRequest.cryptoCurrency || 'N/A';

    const isWirePayment = method === TransactionMethods.WIRE;
    const isExchangePayment = method === TransactionMethods.EXCHANGE;

    let psp;
    if (isWirePayment) {
      psp = await this.pspRepository.findOne({
        where: { name: PspNames.BankTransfer },
      });
    } else if (isExchangePayment) {
      psp = await this.pspRepository.findOne({
        where: { name: PspNames.NONE },
      });
    }

    const transactionPayload: ICreateTransaction = {
      ...(withdrawRequestDto.payload ? withdrawRequestDto.payload : {}),
      ...(withdrawRequestDto.userEWalletId
        ? { userEWalletId: withdrawRequestDto.userEWalletId }
        : {}),
      ...(withdrawRequestDto.creditCardDetailsId
        ? { creditCardDetailsId: withdrawRequestDto.creditCardDetailsId }
        : {}),
      ...(withdrawRequestDto.payload?.brokerExternalId
        ? { brokerExternalId: withdrawRequestDto.payload?.brokerExternalId }
        : {}),
      ...(withdrawRequestDto.bankDetailId
        ? { userBankIdF: withdrawRequestDto.bankDetailId }
        : {}),
      ...(withdrawRequestDto.payload?.pspAccountNo
        ? { pspAccountNo: withdrawRequestDto.payload?.pspAccountNo }
        : {}),
      amount: withdrawRequestDto.amount,
      userId,
      method: method,
      currency: currency,
      walletId: result.wallet?.id || undefined,
      login: withdrawRequest.login || undefined,
      withdrawRequestId: result.id,
      psp,
      exchangeId: withdrawRequestDto.exchangeId,
      actionById: isAdmin ? performerId : undefined,
      initiatedById: performerId,
      requestVia: isAdmin ? RequestVia.ADMIN_AREA : RequestVia.CLIENT_AREA,
      clientRemarks: withdrawRequestDto?.clientRemarks || undefined,
    };

    if (!transactionPayload.network && withdrawRequestDto?.network) {
      transactionPayload.network = withdrawRequestDto?.network;
    }

    if (
      !transactionPayload.cryptoCoinName &&
      withdrawRequestDto?.cryptoCurrency
    ) {
      transactionPayload.cryptoCoinName = withdrawRequestDto?.cryptoCurrency;
    }

    if (
      !transactionPayload.cryptoClientWalletAddress &&
      withdrawRequestDto?.cryptoAddress
    ) {
      transactionPayload.cryptoClientWalletAddress =
        withdrawRequestDto?.cryptoAddress;
    }

    const transaction = await this.create(
      transactionPayload,
      TransactionType.WITHDRAW,
    );

    this.transactionActivityLogs.emit({
      entityId: transaction.id,
      field: TransactionAction.RECORD_CREATED,
      newData: transaction,
      oldData: null,
      performerId,
      performerType,
    });

    if (isAdmin && isApproved) {
      const resp = await this.withdraw(transaction);
      this.transactionActivityLogs.emit({
        entityId: resp.id,
        field: TransactionAction.RECORD_CREATED,
        newData: resp,
        oldData: null,
        performerId,
        performerType,
      });
      this.transactionNotificationService.withdrawRequestByAdmin(transaction);
      await this.transactionMailService.onWithdrawApproval(transaction);
      return resp;
    } else {
      this.transactionNotificationService.clientWithdrawRequest(transaction);
      await this.transactionMailService.onWithdrawCreation(transaction);
    }
    await this.transactionRepository.update(transaction.id, {
      actionBy: {
        id: userData.id,
      },
    });
    await this.onDepositAndWithdrawCreation(transaction);
    if (verificationId) {
      await this.otpRepository.update(verificationId, {
        isVerified: false,
        entityId: transaction.id,
      });
    }
    return transaction;
  }

  async getCreditCard(dto: BaseTransactionMethod, userId: number) {
    const data: CreateUserCreditCardDto = {
      holderName: dto.cardHolderName,
      expiration: dto.cardExpiration,
      number: dto.cardNumber,
      type: dto.cardType,
    };
    const card = await this.userCreditCardsService.create(data, userId);
    return card;
  }

  async getEWallet(dto: BaseTransactionMethod, userId: number) {
    const data: CreateUserEWalletDto = {
      eWalletId: dto.eWalletId,
      name: dto.eWalletName,
      title: dto.eWalletTitle,
    };
    const eWallet = await this.userEWalletService.create(data, userId);
    return eWallet;
  }

  async createManualTransaction(
    dto: CreateManualTransactionDto,
    userId: number,
    user: User,
  ) {
    const isExchangePayment = dto.method === Methods.EXCHANGE;
    const isCreditCard = dto.method === Methods.CREDIT_CARD;
    const isEWallet = dto.method === Methods.E_WALLET;
    await this.isDepositOrWithdrawalCreationAllowed(
      userId,
      TransactionType.DEPOSIT,
    );
    let creditCardDetailsId: number | undefined;
    let userEWalletId: number | undefined;
    const wireDetails = {
      userBankId: dto?.userBankId || undefined,
      companyBankId: dto.companyBankId,
    };
    const cryptoDetails = {
      cryptoHashReference: dto.cryptoHashReference,
      cryptoClientWalletAddress: dto.cryptoClientWalletAddress,
      cryptoCoinName: dto.cryptoCoinName,
      paidCryptoCoin: dto.paidCryptoCoin,
      network: dto?.network,
    };

    if (isCreditCard) {
      const card = await this.getCreditCard(dto, userId);
      creditCardDetailsId = card.id;
    } else if (isEWallet) {
      const eWallet = await this.getEWallet(dto, userId);
      userEWalletId = eWallet.id;
    }

    const i18n = I18nContext.current();
    const performerId = user.id;
    const performerType = this.transactionActivityLogs.getPerformerType(user);

    const { amount, method } = dto;
    const payload: ICreateManualTransaction = {
      pspTransactionId: dto?.pspTransactionId,
      internalReferenceNo: dto.internalReferenceNo,
      evidenceId: dto.evidenceId,
      pspId: dto.pspId,
      tradingPlatformId: dto.tradingPlatformId,
      externalTransactionId: dto.externalTransactionId,
      internalComment: dto.internalComment,
      commentForUser: dto.commentForUser,
      brokerExternalId: dto.brokerExternalId,
      pspAccountNo: dto.pspAccountNo,
      externalNote: dto?.externalNote,
      creditCardDetailsId,
      userEWalletId,
      ...wireDetails,
      ...cryptoDetails,
    };
    let currency = 'N/A';
    if (dto.walletId && dto.login) {
      const message = i18n?.t('errors.transaction.walletAndLoginNotProcessed');
      throw new BadRequestException(message);
    }
    const isWalletDeposit = dto.walletId;
    if (isWalletDeposit && dto.walletId) {
      const wallet = await this.walletService.findById(dto.walletId, userId);
      if (!wallet) {
        const message = i18n?.t('errors.transaction.walletNotFound');
        throw new BadRequestException(message);
      }
      currency = wallet.currency;
      payload.walletId = wallet.id;
    }

    if (!isWalletDeposit && dto.login) {
      const isVerified = await this.mt5Service.getUserMT5Account(
        dto.login,
        userId,
      );
      if (!isVerified) {
        const message = i18n?.t('errors.transaction.tradingAccountNotFound');
        throw new BadRequestException(message);
      }
      payload.login = dto.login;
    }

    if (!payload.walletId && !payload.login) {
      throw new BadRequestException('An error occurred');
    }

    const isWirePayment = method === TransactionMethods.WIRE;
    let psp;
    if (isWirePayment) {
      psp = await this.pspRepository.findOne({
        where: { name: PspNames.BankTransfer },
      });
    }

    const result = await this.create(
      {
        amount,
        currency,
        method,
        userId,
        ...payload,
        psp,
        exchangeId: isExchangePayment ? dto.exchangeId : undefined,
        requestVia: RequestVia.ADMIN_AREA,
        initiatedById: performerId,
        actionById: performerId,
        isManual: true,
      },
      TransactionType.DEPOSIT,
    );

    if (result) {
      let isCredited = false;
      if (result.wallet && dto.walletId) {
        isCredited = !!(await this.walletService.credit(result));
      } else if (result.mt5Account?.login && dto.login && !isCredited) {
        const shortId = result.id.substring(0, 18);
        const comment = `Deposit:${shortId}`;
        isCredited = await this.mt5Service.updateMT5Balance(
          dto.login,
          amount,
          comment,
        );
      }

      if (isCredited) {
        const transaction = await this.transactionRepository.save({
          id: result.id,
          status: TransactionStatus.APPROVED,
          actionBy: {
            id: user.id,
          },
        });
        if (transaction.status === TransactionStatus.APPROVED) {
          await this.approveTransaction(
            transaction,
            transaction.amount,
            undefined,
            false,
          );
        }
        this.transactionActivityLogs.emit({
          entityId: transaction.id,
          field: TransactionAction.RECORD_CREATED,
          newData: transaction,
          oldData: null,
          performerId,
          performerType,
        });
        this.transactionNotificationService.manualDepositByAdmin(transaction);
        await this.transactionMailService.onManualDepositApproval(transaction);
        await this.onDepositAndWithdrawApproval(result);
        return transaction;
      }
    } else {
      throw new BadRequestException('An error occurred');
    }
  }

  async withdraw(transaction: Transaction) {
    const i18n = I18nContext.current();
    const { wallet, mt5Account, user, amount, status } = transaction;
    if (wallet && mt5Account?.login) {
      const message = i18n?.t('errors.transaction.loginWalletIdBothNotUse');
      throw new BadRequestException(message);
    }

    if (transaction.type !== TransactionType.WITHDRAW) {
      throw new BadRequestException('Invalid Transaction Type');
    }

    if (
      status !== TransactionStatus.NEW &&
      status !== TransactionStatus.INITIALIZED &&
      status !== TransactionStatus.INITIALIZED_NOT_PAID &&
      status !== TransactionStatus.PENDING
    ) {
      const message = i18n?.t('errors.transaction.statusMustBeThis');
      throw new BadRequestException(message);
    }
    let isDebited = false;

    if (!mt5Account?.login && wallet) {
      const userWallet = await this.walletService.findById(wallet.id, user.id);
      if (!userWallet) {
        const message = i18n?.t('errors.transaction.walletNotFound');
        throw new NotFoundException(message);
      }
      if (amount > userWallet.balance) {
        const message = i18n?.t('errors.transaction.insufficientFunds');
        throw new BadRequestException(message);
      }

      const walletDebit = await this.walletService.debit(transaction);
      if (!walletDebit) {
        throw new BadRequestException('An Error has occurred');
      }
      isDebited = true;
    }

    if (!wallet && mt5Account?.login) {
      const mt5Balance = await this.mt5Service.verifyMT5Balance(
        mt5Account?.login,
        user.id,
        amount,
      );
      if (!mt5Balance) {
        const message = i18n?.t('errors.transaction.insufficientFunds');
        throw new BadRequestException(message);
      }
      const shortId = transaction.id.substring(0, 18);
      const comment = `Withdraw:${shortId}`;
      const mt5Debit = await this.mt5Service.updateMT5Balance(
        mt5Account?.login,
        -amount,
        comment,
      );
      if (!mt5Debit) {
        throw new BadRequestException('An Error has occurred');
      }
      isDebited = true;
    }

    if (isDebited) {
      await this.approveTransaction(
        transaction,
        transaction.amount,
        undefined,
        false,
      );
      const result = await this.transactionRepository.save({
        id: transaction.id,
        status: TransactionStatus.APPROVED,
      });
      if (result) {
        await this.onDepositAndWithdrawApproval(transaction);
        return result;
      }
    }

    throw new NotFoundException('An error occurred');
  }

  async update(
    dto: UpdateTransactionDto,
    id: string,
    actionById?: number,
    updateData?: IUpdateTransactionDetails,
  ) {
    const i18n = I18nContext.current();
    const {
      subType,
      userReason,
      transactionReason,
      pspId = null,
      salesRepId = null,
      creditCardDetailsId = null,
      salesDeskId = null,
      method,
      retentionRepId = null,
      retentionDeskId = null,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      amount = null,
      ...rest
    } = dto;
    let psp;
    let transactionMethods;
    let salesRep;
    let salesDesk;
    let retentionRep;
    let retentionDesk;
    if (pspId) {
      psp = await this.pspRepository.findOne({ where: { id: pspId } });
      if (!psp) {
        const message = i18n?.t('errors.transaction.pspNotFound');
        throw new BadRequestException(message);
      }
    }

    if (method) {
      transactionMethods = await this.transactionMethodsRepository.findOne({
        where: { method },
      });
      if (!transactionMethods) {
        const message = i18n?.t('errors.transaction.methodNotFound');
        throw new BadRequestException(message);
      }
    }

    if (salesRepId) {
      salesRep = await this.operatorRepository.findOne({
        where: { id: salesRepId },
      });
      if (!salesRep) {
        const message = i18n?.t('errors.transaction.salesRepNotFound');
        throw new BadRequestException(message);
      }
    }

    if (retentionRepId) {
      retentionRep = await this.operatorRepository.findOne({
        where: { id: retentionRepId },
      });
      if (!retentionRep) {
        const message = i18n?.t('errors.transaction.retentionRepNotFound');
        throw new BadRequestException(message);
      }
    }

    if (salesDeskId) {
      salesDesk = await this.deskRepository.findOne({
        where: { id: salesDeskId },
      });
      if (!salesDesk) {
        const message = i18n?.t('errors.transaction.salesRepNotFound');
        throw new BadRequestException(message);
      }
    }

    if (retentionDeskId) {
      retentionDesk = await this.deskRepository.findOne({
        where: { id: retentionDeskId },
      });
      if (!retentionDesk) {
        const message = i18n?.t('errors.transaction.salesRepNotFound');
        throw new BadRequestException(message);
      }
    }
    const pspTransactionId = updateData?.pspTransactionId;
    const paymentClientName = updateData?.paymentClientName;
    const transaction = await this.transactionRepository.updateOne(
      { id },
      {
        ...rest,
        ...(creditCardDetailsId
          ? {
            creditCardDetails: {
              id: creditCardDetailsId,
            },
          }
          : {}),
        psp,
        method: transactionMethods,
        salesDesk,
        salesRep,
        retentionDesk,
        retentionRep,
        ...(dto.externalNote ? { externalNote: dto?.externalNote } : {}),
        ...(actionById ? { actionBy: { id: actionById } } : {}),
        ...(pspTransactionId ? { pspTransactionId } : {}),
        ...(paymentClientName ? { paymentClientName } : {}),
        ...(updateData?.creditCardDetailsId
          ? {
            creditCardDetails: {
              id: updateData?.creditCardDetailsId,
            },
          }
          : {}),
        ...(updateData?.userEWalletId
          ? {
            eWallet: {
              id: updateData?.userEWalletId,
            },
          }
          : {}),
        ...(updateData?.cryptoCoinName
          ? {
            cryptoCoinName: updateData?.cryptoCoinName,
          }
          : {}),
        ...(updateData?.clientWalletAddress
          ? {
            cryptoClientWalletAddress: updateData?.clientWalletAddress,
          }
          : {}),
        ...(updateData?.customParam1
          ? {
            customParam1: updateData?.customParam1,
          }
          : {}),
        ...(updateData?.subPspName
          ? {
            subPspName: updateData?.subPspName,
          }
          : {}),
        ...(dto?.pspAccountNo
          ? {
            pspAccountNo: dto?.pspAccountNo,
          }
          : {}),
        ...(dto?.authenticationAlert
          ? {
            authenticationAlert: dto?.authenticationAlert,
          }
          : {}),
        ...(dto?.brokerExternalId
          ? {
            brokerExternalId: dto?.brokerExternalId,
          }
          : {}),
        ...(dto?.reconcile
          ? {
            reconcile: dto?.reconcile,
          }
          : {}),
        ...(dto?.kycRepId
          ? {
            kycRep: {
              id: dto.kycRepId,
            },
          }
          : {}),
        ...(dto?.reason
          ? {
            reason: dto?.reason,
          }
          : {}),
        ...(updateData?.network
          ? {
            network: updateData?.network,
          }
          : {}),
        ...(updateData?.clientWalletAddress
          ? {
            cryptoClientWalletAddress: updateData?.clientWalletAddress,
          }
          : {}),
        ...(updateData?.companyWalletAddress
          ? {
            companyWalletAddress: updateData?.companyWalletAddress,
          }
          : {}),
        ...(updateData?.cryptoHashReference
          ? {
            cryptoHashReference: updateData?.cryptoHashReference,
          }
          : {}),
      },
    );
    if (transaction?.withdrawRequest) {
      const withdrawRequest = await this.withdrawRequestRepository.updateOne(
        { id: transaction.withdrawRequest.id },
        { subType, userReason, transactionReason },
      );
      if (!withdrawRequest) {
        const message = i18n?.t('errors.transaction.updateFailed');
        throw new UnprocessableEntityException(message);
      }
    }
    if (!transaction) {
      const message = i18n?.t('errors.transaction.updateFailed');
      throw new UnprocessableEntityException(message);
    }
    return transaction;
  }

  async updateManualCrypto(
    dto: UpdateTransactionDto,
    id: string,
    actionById: number,
    fee: number,
  ) {
    const i18n = I18nContext.current();
    const { amount } = dto;

    if (!amount || amount < 0) {
      const message = i18n?.t('errors.transaction.invalidAmount');
      throw new BadRequestException(message);
    }
    const transaction = await this.update(dto, id, actionById);
    if (!transaction) {
      const message = i18n?.t('errors.transaction.updateFailed');
      throw new UnprocessableEntityException(message);
    }
    const paidAmount = amount;
    if (fee > paidAmount) {
      throw new BadRequestException(
        'Paid amount should be equal or greater than fee',
      );
    }
    const netAmount = paidAmount - fee;
    //updating the amount
    const isAmountUpdated = await this.transactionRepository.update(id, {
      paidAmount,
      netAmount,
    });
    const updatedData = await this.transactionRepository.findOne({
      where: { id },
    });
    return isAmountUpdated ? updatedData : null;
  }

  isValidForApprovalOrRejection(status: TransactionStatus) {
    return (
      status === TransactionStatus.NEW ||
      status === TransactionStatus.INITIALIZED_NOT_PAID ||
      status === TransactionStatus.INITIALIZED ||
      status === TransactionStatus.PENDING
    );
  }

  isWithdrawalRequest(type: TransactionType) {
    return type === TransactionType.WITHDRAW;
  }

  async approveManualTransaction(
    id: string,
    dto: UpdateTransactionDto,
    user: User,
    isAdminEndpoint=false
  ) {
    const i18n = I18nContext.current();
    const isExist = await this.getById(id);
    if(isAdminEndpoint){
      await this.isTransactionUserAllowedToOperator(isExist.user.id, user.id)
    }
    const performerId = user.id;
    const performerType = this.transactionActivityLogs.getPerformerType(user);
    let response: null | Transaction = null;
    if (!isExist) {
      const message = i18n?.t('errors.transaction.notFound');
      throw new NotFoundException(message);
    }
    const isValidForApproval = this.isValidForApprovalOrRejection(
      isExist.status,
    );
    if (!isValidForApproval) {
      const message = i18n?.t('errors.transaction.invalidStatus');
      throw new BadRequestException(message);
    }

    if (isExist.type === TransactionType.WITHDRAW) {
      if (!dto.reason) {
        throw new BadRequestException('Reason is required for Approval');
      }
      if (!dto.internalComment) {
        throw new BadRequestException(
          'Internal Comment is required for Approval',
        );
      }
      if (!dto.externalNote) {
        throw new BadRequestException('ExternalNote is required for Approval');
      }
      if (!dto.pspId) {
        throw new BadRequestException('PSP is required for Approval');
      }
    }

    const isManualCrypto = this.isManualCryptoTransaction(isExist);

    const isManualBankTransfer = this.isManualBankTransferTransaction(isExist);

    const isWithdrawalRequest = this.isWithdrawalRequest(isExist.type);

    if (isManualCrypto) {
      if (!dto.amount) {
        const message = i18n?.t('errors.transaction.amountIsRequired');
        throw new BadRequestException(message);
      }
      const transaction = await this.updateManualCrypto(
        dto,
        id,
        user.id,
        isExist.fee,
      );
      if (transaction) {
        await this.approveTransaction(transaction, dto.amount);
        response = transaction;
      }
    } else if (isManualBankTransfer) {
      if (dto.amount) {
        const message = i18n?.t('errors.transaction.amountNotAllowed');
        throw new BadRequestException(message);
      }
      const transaction = await this.update(dto, id, user.id);
      await this.approveTransaction(transaction, transaction.amount);
      response = transaction;
    } else if (isWithdrawalRequest) {
      if (dto.amount) {
        const message = i18n?.t('errors.transaction.amountNotAllowed');
        throw new BadRequestException(message);
      }
      const transaction = await this.update(dto, id, user.id);
      const result = await this.withdraw(transaction);
      response = result;
    } else {
      throw new BadRequestException('An Error Occurred');
    }
    if (response) {
      await this.transactionRepository.save({
        id: response.id,
        actionBy: user,
      });
      this.transactionActivityLogs.emit({
        entityId: response.id,
        field: TransactionAction.DETAILS_UPDATED,
        newData: response,
        oldData: isExist,
        performerId,
        performerType,
      });
      if (isWithdrawalRequest) {
        this.transactionNotificationService.withdrawRequestApprovedByAdmin(
          response,
        );
        await this.transactionMailService.onWithdrawApproval(response);
      } else {
        this.transactionNotificationService.depositRequestApprovedByAdmin(
          response,
        );
        await this.transactionMailService.onManualDepositApproval(
          response,
          isExist?.method?.method,
        );
      }
      return response;
    }
  }

  async getDepositAddress(coin: string) {
    const coins = this.configService.get('binance.coins', { infer: true });
    const currentCoin = coins?.find((c) => c === coin);
    if (!currentCoin) {
      throw new BadRequestException('Invalid Coin');
    }
    const address = await this.binanceService.getDepositAddress(coin);
    return address;
  }

  async cancelWithdrawalRequest(id: string, user: User) {
    const i18n = I18nContext.current();
    const userId = user.id;
    const isExist = await this.getById(id, userId);
    if (isExist.type !== TransactionType.WITHDRAW) {
      const message = i18n?.t('errors.transaction.invalidType');
      throw new BadRequestException(message);
    }

    const isCancelable = this.isValidForApprovalOrRejection(isExist.status);
    if (!isCancelable) {
      const message = i18n?.t('errors.transaction.invalidStatus');
      throw new BadRequestException(message);
    }

    isExist.status = TransactionStatus.CANCELLED;
    const isUpdated = await this.transactionRepository.save(isExist);

    this.transactionActivityLogs.emit({
      entityId: isExist.id,
      field: TransactionAction.RECORD_CREATED,
      newData: isUpdated,
      oldData: isExist,
      performerId: userId,
      performerType: PerformerType.USER,
    });
    this.transactionNotificationService.cancelClientWithdrawRequest(isExist);
    this.transactionMailService.onWithdrawCancellation(isExist);
    return isUpdated;
  }

  async createManualCrypto(
    {
      evidenceId,
      cryptoHashReference,
      cryptoClientWalletAddress,
      walletId,
      ...dto
    }: CreateManualCrypto,
    user: User,
  ) {
    const i18n = I18nContext.current();
    const userId = user.id;
    const psp = await this.pspRepository.findOne({
      where: { name: PspNames.CryptoDeposit },
    });
    await this.isDepositOrWithdrawalCreationAllowed(
      userId,
      TransactionType.DEPOSIT,
    );

    const wallet = await this.walletService.findById(walletId, userId);
    if (!wallet) {
      const message = i18n?.t('errors.transaction.walletNotFound');
      throw new UnprocessableEntityException(message);
    }
    const entity = await this.create(
      {
        amount: dto.amount,
        userId,
        isManual: true,
        currency: 'USD',
        cryptoCoinName: dto.currency,
        network: dto.network,
        walletId,
        cryptoHashReference,
        evidenceId: evidenceId || undefined,
        cryptoClientWalletAddress,
        psp,
        method: TransactionMethods.CRYPTO,
        initiatedById: userId,
        requestVia: RequestVia.CLIENT_AREA,
        bonusCode: dto.bonusCode,
        mt5AccountLogin: dto.mt5AccountLogin,
        isNewTradingAccount: dto.isNewTradingAccount || false
      },
      TransactionType.DEPOSIT,
    );

    this.transactionActivityLogs.emit({
      entityId: entity.id,
      field: TransactionAction.RECORD_CREATED,
      newData: entity,
      oldData: null,
      performerId: userId,
      performerType: PerformerType.USER,
    });

    this.transactionNotificationService.clientManualTransactionNotification(
      entity,
    );
    await this.transactionMailService.onManualDepositCreation(entity);
    this.transactionTaskService.onUserManualDepositCreate(entity);
    await this.onDepositAndWithdrawCreation(entity);
    return entity;
  }

  async createManualBank(dto: CreateManualBank, user: User) {
    const { evidenceId, companyBankId, userBankId, amount } = dto;
    const i18n = I18nContext.current();
    const userId = user.id;
    const psp = await this.pspRepository.findOne({
      where: { name: PspNames.BankTransfer },
    });
    await this.isDepositOrWithdrawalCreationAllowed(
      userId,
      TransactionType.DEPOSIT,
    );

    const [wallet] = await this.walletService.findAllByUserId(userId);
    if (!wallet) {
      const message = i18n?.t('errors.transaction.walletNotFound');
      throw new UnprocessableEntityException(message);
    }
    const entity = await this.create(
      {
        amount,
        userId,
        isManual: true,
        currency: 'USD',
        walletId: wallet.id,
        evidenceId: evidenceId || undefined,
        psp,
        userBankId,
        companyBankId,
        method: TransactionMethods.WIRE,
        initiatedById: userId,
        requestVia: RequestVia.CLIENT_AREA,
        bonusCode: dto.bonusCode,
        mt5AccountLogin: dto.mt5AccountLogin,
        isNewTradingAccount: dto.isNewTradingAccount || false
      },
      TransactionType.DEPOSIT,
    );

    this.transactionActivityLogs.emit({
      entityId: entity.id,
      field: TransactionAction.RECORD_CREATED,
      newData: entity,
      oldData: null,
      performerId: userId,
      performerType: PerformerType.USER,
    });
    this.transactionNotificationService.clientManualTransactionNotification(
      entity,
    );
    await this.transactionMailService.onManualDepositCreation(entity);
    this.transactionTaskService.onUserManualDepositCreate(entity);
    await this.onDepositAndWithdrawCreation(entity);
    return entity;
  }

  async getById(
    id: string,
    userId?: number,
    isAdmin: boolean = false,
    operatorUserId?: number,
  ) {
    const i18n = I18nContext.current();
    const where: FindOptionsWhere<Transaction> = {};
    where.id = id;
    if (userId && !isAdmin) {
      where.user = {
        id: userId,
      };
    }
    const entity = await this.transactionRepository.findOne({
      where,
      relations: [
        'method',
        'eWallet',
        'creditCardDetails',
        'exchangeDetails',
        'companyBank',
        'userBank',
        'kycRep',
        'evidence',
      ],
    });
    if (!entity) {
      const message = i18n?.t('errors.transaction.notFound');
      throw new NotFoundException(message);
    }
    if (entity?.evidence?.id) {
      const url = await this.fileService.getSignedUrl(entity.evidence.id);
      if (url) {
        //@ts-expect-error url is not in type
        entity.evidence.url = url;
      }
    }

    const bonuses = await this.transactionRepository.find({
      where: {
        relatedTransactionId: entity.id,
        type: In([TransactionType.BONUS_IN, TransactionType.BONUS_OUT]),
      },
    });

    let bonusCredit = 0;
    const bonusTransactions = bonuses?.length || 0;
    if (Array.isArray(bonuses)) {
      bonuses.forEach((bonus) => {
        bonusCredit = bonusCredit + bonus.amount;
      });
    }
    if (operatorUserId) {
      const client = await this.clientRepository.getClientWithRoleFilter(
        operatorUserId,
        { user: { id: entity.user.id } },
      );
      if (!client) {
        const message = i18n?.t('errors.transaction.notFound');
        throw new NotFoundException(message);
      }
    }

    return { ...entity, bonusCredit, bonusTransactions, bonuses };
  }

  async search(dto: AdvanceSearchDto, userId?: number) {
    const { filters, page = 1, limit = 50, sort } = dto;

    //Add user id in filters if provided
    if (userId) {
      filters.push({
        name: 'user.id',
        operation: FilterOperation.EQUALS,
        value: [userId],
      });
    }

    const entities = await this.transactionRepository.advanceSearch({
      filters,
      limit,
      page,
      sort,
      all: false,
      select: undefined,
    });
    return entities;
  }

  async delete(id: string) {
    const isDeleted = await this.transactionRepository.delete(id);
    return isDeleted.affected === 1;
  }

  async getPspList() {
    const entities = await this.pspRepository.find({
      where: { isActive: true },
    });
    return entities.map((e) => {
      const suffix = e.aggregatorName ? ` - ${e.aggregatorName}` : '';
      const nameWithAggregator = `${e.displayName}${suffix}`;
      return {
        ...e,
        nameWithAggregator,
      };
    });
  }

  getCryptoCoinsList(): string[] {
    const coins = this.configService.get('binance.coins', { infer: true });
    return coins || [];
  }

  async getSupportedCoinsList(coin?: string, channel?: string) {
    let isDepositSupported;

    if (channel) {
      if (channel.toLowerCase() === 'deposit') {
        isDepositSupported = true;
      }
    }

    const result = await this.supportedCryptoRepositories.find({
      relations: {
        networks: true,
      },
      where: {
        coin: coin || undefined,
        isDepositSupported,
      },
    });

    if (isDepositSupported) {
      const newResults = result.map((r) => {
        const networks = r.networks.filter((n) => n.isDepositSupported);
        return {
          ...r,
          networks,
        };
      });
      return newResults;
    }
    return result;
  }

  isManualCryptoTransaction(transaction: Transaction) {
    const isCryptoTransaction =
      transaction.method?.method === Methods.CRYPTO &&
      transaction.isManual &&
      transaction.type === TransactionType.DEPOSIT &&
      transaction.psp?.name === PspNames.CryptoDeposit;
    return isCryptoTransaction;
  }

  isManualBankTransferTransaction(transaction: Transaction) {
    const isManualBank =
      transaction.method?.method === Methods.WIRE &&
      transaction.isManual &&
      transaction.type === TransactionType.DEPOSIT;
    return isManualBank;
  }

  emitOnUpdate(oldData: any, newData: any, user: User) {
    const performerType = this.transactionActivityLogs.getPerformerType(user);
    const performerId = user.id;
    this.transactionActivityLogs.emit({
      entityId: newData.id,
      field: TransactionAction.DETAILS_UPDATED,
      newData,
      oldData,
      performerId,
      performerType,
    });
  }

  onCreditInAndOut(transaction: Transaction, performerId: number) {
    const performerType = PerformerType.OPERATOR;
    let field: null | TransactionAction = null;
    if (transaction.type === TransactionType.CREDIT_IN) {
      this.transactionNotificationService.creditIn(transaction);
      field = TransactionAction.CREDIT_IN;
    } else if (transaction.type === TransactionType.CREDIT_OUT) {
      this.transactionNotificationService.creditOut(transaction);
      field = TransactionAction.CREDIT_OUT;
    }
    this.transactionMailService.onCreditInAndOut(transaction);
    if (field) {
      this.transactionActivityLogs.emit({
        entityId: transaction.id,
        oldData: null,
        newData: transaction,
        performerId,
        performerType,
        field,
      });
    }
  }

  onBonusInAndBonusOut(
    transaction: Transaction,
    performerId: number,
    transactionId: string,
  ) {
    const performerType = PerformerType.OPERATOR;
    let field: null | TransactionAction = null;
    if (transaction.type === TransactionType.BONUS_IN) {
      this.transactionNotificationService.creditIn(transaction);
      field = TransactionAction.BONUS_IN;
    } else if (transaction.type === TransactionType.BONUS_OUT) {
      this.transactionNotificationService.creditOut(transaction);
      field = TransactionAction.BONUS_OUT;
    }
    this.transactionMailService.onBonusInAndOut(transaction);
    if (field) {
      this.transactionActivityLogs.emit({
        entityId: transaction.id,
        oldData: null,
        newData: transaction,
        performerId,
        performerType,
        field: TransactionAction.RECORD_CREATED,
      });
      this.transactionActivityLogs.emit({
        entityId: transactionId,
        oldData: null,
        newData: transaction,
        performerId,
        performerType,
        field,
      });
    }
  }

  async onDepositAndWithdrawCreation(
    transaction: Transaction,
    isManual: boolean = true,
  ) {
    try {
      if (
        transaction.type !== TransactionType.DEPOSIT &&
        transaction.type !== TransactionType.WITHDRAW
      ) {
        return;
      }

      await this.transactionMailService.sendEmailToRetentionAndSalesRep(
        transaction,
        false,
        isManual,
      );

      const client = await this.clientRepository.findOne({
        where: { user: { id: transaction.user.id } },
      });

      const salesRep = await this.userRepository.findOne({
        where: { operator: { id: client?.salesRepId } },
        relations: ['operator'],
      });

      const retentionRep = await this.userRepository.findOne({
        where: { operator: { id: client?.retentionRepId } },
        relations: ['operator'],
      });

      if (transaction.type === TransactionType.DEPOSIT) {
        if (salesRep) {
          this.transactionNotificationService.salesRepDepositCreate({
            ...transaction,
            user: salesRep,
          });
          if (salesRep?.operator?.manager_operator_id) {
            const managerSalesRep = await this.userRepository.findOne({
              where: {
                isOperator: true,
                operator: { id: salesRep?.operator?.manager_operator_id },
              },
            });
            if (managerSalesRep)
              this.transactionNotificationService.salesRepDepositCreate({
                ...transaction,
                user: managerSalesRep,
              });
          }
          await this.createTask({
            subject: 'New Deposit',
            description: 'Review new deposit',
            status: 'NOT STARTED',
            transaction,
            operator: salesRep,
            client,
          });
        }
        if (retentionRep) {
          this.transactionNotificationService.salesRepDepositCreate({
            ...transaction,
            user: retentionRep,
          });
          if (retentionRep?.operator?.manager_operator_id) {
            const managerRetentionRep = await this.userRepository.findOne({
              where: {
                isOperator: true,
                operator: { id: retentionRep?.operator?.manager_operator_id },
              },
            });
            if (managerRetentionRep)
              this.transactionNotificationService.salesRepDepositCreate({
                ...transaction,
                user: managerRetentionRep,
              });
          }
          await this.createTask({
            subject: 'New Deposit',
            description: 'Review new deposit',
            status: 'NOT STARTED',
            transaction,
            operator: retentionRep,
            client,
          });
        }
      } else if (transaction.type === TransactionType.WITHDRAW) {
        if (salesRep) {
          this.transactionNotificationService.salesRepWithdrawalCreate({
            ...transaction,
            user: salesRep,
          });
          if (salesRep?.operator?.manager_operator_id) {
            const managerSalesRep = await this.userRepository.findOne({
              where: {
                isOperator: true,
                operator: { id: salesRep?.operator?.manager_operator_id },
              },
            });
            if (managerSalesRep)
              this.transactionNotificationService.salesRepDepositCreate({
                ...transaction,
                user: managerSalesRep,
              });
          }
          await this.createTask({
            subject: 'New Withdrawal',
            description: 'Review new withdrawal',
            status: 'NOT STARTED',
            transaction,
            operator: salesRep,
            client,
          });
        }
        if (retentionRep) {
          this.transactionNotificationService.salesRepWithdrawalCreate({
            ...transaction,
            user: retentionRep,
          });
          if (retentionRep?.operator?.manager_operator_id) {
            const managerRetentionRep = await this.userRepository.findOne({
              where: {
                isOperator: true,
                operator: { id: retentionRep?.operator?.manager_operator_id },
              },
            });
            if (managerRetentionRep)
              this.transactionNotificationService.salesRepDepositCreate({
                ...transaction,
                user: managerRetentionRep,
              });
          }
          await this.createTask({
            subject: 'New Withdrawal',
            description: 'Review new withdrawal',
            status: 'NOT STARTED',
            transaction,
            operator: retentionRep,
            client,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async onDepositAndWithdrawApproval(transaction: Transaction) {
    console.log('Iniside onDepositAndWithdrawApproval');
    try {
      if (transaction.type !== TransactionType.DEPOSIT) {
        return;
      }

      const client = await this.clientRepository.findOne({
        where: { user: { id: transaction.user.id } },
      });

      const salesRep = await this.userRepository.findOne({
        where: { operator: { id: client?.salesRepId } },
        relations: ['operator'],
      });

      const retentionRep = await this.userRepository.findOne({
        where: { operator: { id: client?.retentionRepId } },
        relations: ['operator'],
      });

      await this.transactionMailService.sendEmailToRetentionAndSalesRep(
        transaction,
        true,
        true,
      );

      if (salesRep) {
        this.transactionNotificationService.salesRepDepositApprove({
          ...transaction,
          user: salesRep,
        });
        if (salesRep?.operator?.manager_operator_id) {
          const managerSalesRep = await this.userRepository.findOne({
            where: {
              isOperator: true,
              operator: { id: salesRep?.operator?.manager_operator_id },
            },
          });
          if (managerSalesRep)
            this.transactionNotificationService.salesRepDepositCreate({
              ...transaction,
              user: managerSalesRep,
            });
        }
        await this.createTask({
          subject: 'New Deposit Approval',
          description: 'Review new Deposit Approval',
          status: 'NOT STARTED',
          transaction,
          operator: salesRep,
          client,
        });
      }
      if (retentionRep) {
        this.transactionNotificationService.salesRepDepositCreate({
          ...transaction,
          user: retentionRep,
        });
        if (retentionRep?.operator?.manager_operator_id) {
          const managerRetentionRep = await this.userRepository.findOne({
            where: {
              isOperator: true,
              operator: { id: retentionRep?.operator?.manager_operator_id },
            },
          });
          if (managerRetentionRep)
            this.transactionNotificationService.salesRepDepositCreate({
              ...transaction,
              user: managerRetentionRep,
            });
        }
        await this.createTask({
          subject: 'New Deposit Approval',
          description: 'Review new Deposit Approval',
          status: 'NOT STARTED',
          transaction,
          operator: retentionRep,
          client,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async createTask({
    subject,
    description,
    status,
    transaction,
    operator,
    client,
  }: {
    subject: string;
    description: string;
    status: string;
    transaction: Transaction;
    operator: User;
    client: NullableType<Client>;
  }) {
    const currentDate = new Date();
    return this.taskService.create(
      {
        subject,
        description,
        assignTo: operator?.operator.id,
        status,
        contact: client?.leadId,
        priority: TaskPriorityLevel.HIGH,
        repeat: 'never',
        entityId: transaction.id,
        entity: TaskEntityType.TRANSACTION,
        dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
      } as CreateTaskDto,
      {
        id: operator?.id,
      } as User,
    );
  }

  async getTransactionClientInfo(
    userId: User['id'],
  ): Promise<ITransactionClientInfo> {
    const i18n = I18nContext.current();
    const client = await this.clientRepository.findOne({
      where: { userId },
      loadEagerRelations: false,
      relations: {
        partner: true,
      },
    });
    if (!client) {
      throw new NotFoundException('Client Not Found');
    }

    let partnerId: null | number = client?.partner?.id;
    let partnerName: null | string = client?.partner?.name || null;

    if (!partnerId) {
      const errorMsg = i18n?.t('errors.transaction.partnerNotAssigned');
      throw new NotFoundException(errorMsg);
    }

    let salesManagerId: null | number = null;
    let salesManagerName: null | string = client.salesManager || null;

    let retentionManagerId: null | number = null;
    let retentionManagerName: null | string = client.retentionManager || null;

    if (client.retentionManagerId) {
      const retentionManager = await this.userRepository.findOne({
        where: { operator: { id: Number(client.retentionManagerId) } },
        loadEagerRelations: false,
      });
      if (retentionManager) {
        retentionManagerId = Number(retentionManager.id);
        if (!retentionManagerName) {
          retentionManagerName = `${retentionManager.firstName}`;
          if (retentionManager.lastName) {
            retentionManagerName =
              retentionManagerName + retentionManager.lastName;
          }
        }
      }
    }

    let salesRepId: null | number = null;
    let salesRepName: null | string = client.salesRep || null;

    if (client.salesRepId) {
      const salesRep = await this.userRepository.findOne({
        where: { operator: { id: Number(client.salesRepId) } },
        loadEagerRelations: false,
      });
      if (salesRep) {
        salesRepId = Number(salesRep.id);
        if (!salesRepName) {
          salesRepName = `${salesRep.firstName} ${salesRep.lastName}`;
        }
        if (!salesManagerId && salesRep) {
          const salesRepOperator = await this.operatorRepository.findOne({
            where: { id: Number(client.salesRepId) },
            loadEagerRelations: false,
          });
          if (salesRepOperator?.manager_operator_id) {
            const managerOperator = await this.userRepository.findOne({
              where: {
                operator: { id: Number(salesRepOperator?.manager_operator_id) },
              },
              loadEagerRelations: false,
            });
            if (managerOperator) {
              salesManagerId = managerOperator.id;
              salesManagerName = `${managerOperator.firstName} ${managerOperator.lastName}`;
            }
          }
        }
      }
    }

    let retentionRepId: null | number = null;
    let retentionRepName: null | string = client.retentionRep || null;

    if (client.retentionRepId) {
      const retentionRep = await this.userRepository.findOne({
        where: { operator: { id: Number(client.retentionRepId) } },
        loadEagerRelations: false,
      });
      if (retentionRep) {
        retentionRepId = Number(retentionRep.id);
        if (!retentionRepName) {
          retentionRepName = `${retentionRep.firstName} ${retentionRep.lastName}`;
        }
      }
    }

    let salesDeskId: number | null = null;

    if (client.salesDeskId) {
      const salesDesk = await this.deskRepository.findOne({
        where: { id: Number(client.salesDeskId) },
        loadEagerRelations: false,
      });
      if (salesDesk) {
        salesDeskId = salesDesk.id;
      }
    }

    let retentionDeskId: number | null = null;

    if (client.retentionDeskId) {
      const retentionDesk = await this.deskRepository.findOne({
        where: { id: Number(client.retentionDeskId) },
        loadEagerRelations: false,
      });
      if (retentionDesk) {
        retentionDeskId = retentionDesk.id;
      }
    }

    const isTransferToRetention = client.isTransferToRetention;

    return {
      partnerId,
      partnerName,

      salesManagerId,
      salesManagerName,

      retentionManagerId,
      retentionManagerName,

      salesRepId,
      salesRepName,

      retentionRepId,
      retentionRepName,

      salesDeskId,
      salesDeskName: client.salesDesk || null,

      retentionDeskId,
      retentionDeskName: client?.retentionDesk || null,

      officeId: Number(client.officeId) || null,
      officeName: client.office || null,

      leadSource: client.source || null,
      isTransferToRetention,
    };
  }

  async createNote(
    transactionId: Transaction['id'],
    createdBy: User,
    dto: CreateTransactionNote,
  ) {
    const { note, file_id = null } = dto;
    const transaction = await this.getById(
      transactionId,
      undefined,
      true,
      createdBy.id,
    );
    await this.isTransactionUserAllowedToOperator(transaction.user.id, createdBy.id)
    const lead = await this.leadRepository.findOne({
      where: {
        clientID: transaction.user.id as any,
      },
    });

    let fileName: string | null = null;
    if (file_id) {
      const file = await this.fileRepository.findOneBy({
        id: file_id,
      });

      if (!file) {
        throw new NotFoundException('File not found');
      }
      fileName = file.fileName;
    }

    const noteEntity = this.notesRepository.create({
      user_id: { id: transaction.user.id },
      lead_id: { id: lead?.id },
      fileName: fileName || undefined,
      note,
      created_by: createdBy,
      file_id: file_id || undefined,
      type: 'TRANSACTION_NOTE',
      isPublic: true,
      transaction: {
        id: transactionId,
      },
    });
    const savedNote = await this.notesRepository.save(noteEntity);
    const getOperator = await this.userRepository.findOne({
      where: {
        id: createdBy?.id,
      },
      relations: {
        operator: true,
      },
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savedNote,
      oldData: null,
      entityId: savedNote?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Note Created',
      parentId: savedNote?.lead_id?.id,
      parentType: entityType.LEAD,
    });
    await this.leadRepository.update(lead?.id as any, {
      latestNote: note,
      lastNoteAt: savedNote?.updated_at,
    });
    return savedNote;
  }

  async getNotes(transactionId: Transaction['id'], userId: number) {
    const transaction = await this.getById(transactionId, undefined, true, userId);
    await this.isTransactionUserAllowedToOperator(transaction.user.id , userId)
    const notes = await this.notesRepository.find({
      where: {
        transaction: { id: transactionId },
        type: 'TRANSACTION_NOTE',
      },
      relations: ['created_by'],
    });
    for (const note of notes) {
      if (note.file_id) {
        const attachmentUrl = await this.fileService.getSignedUrl(
          note?.file_id,
        );
        if (attachmentUrl) {
          note.attchementUrl = attachmentUrl;
        }
      }
    }
    return notes;
  }

  async getNote(noteId: notes['id'], userId: number) {
    const note = await this.notesRepository.findOne({
      where: {
        type: 'TRANSACTION_NOTE',
        id: noteId,
      },
      relations: ['created_by', 'transaction'],
    });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    const transaction = await this.getById(note.transaction.id, undefined, true, userId);
    await this.isTransactionUserAllowedToOperator(transaction.user.id , userId)
    if (note?.file_id) {
      const attachmentUrl = await this.fileService.getSignedUrl(note?.file_id);
      if (attachmentUrl) {
        note.attchementUrl = attachmentUrl;
      }
    }
    return note;
  }

  async updateNote(
    noteId: notes['id'],
    userId: User['id'],
    dto: UpdateTransactionNote,
  ) {
    const { file_id } = dto;
    const note = await this.notesRepository.findOne({
      where: {
        type: 'TRANSACTION_NOTE',
        id: noteId,
      },
      relations: ['created_by', 'user_id', 'lead_id', 'transaction'],
    });
    const oldNote = { ...note };

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.created_by.id !== userId) {
      throw new BadRequestException('Note can only be edited by creator');
    }

    const transaction = await this.getById(note.transaction.id, undefined, true, userId);
    await this.isTransactionUserAllowedToOperator(transaction.user.id, userId)
    if (file_id && file_id !== note.file_id) {
      const file = await this.fileRepository.findOneBy({
        id: file_id,
      });
      if (!file) {
        throw new NotFoundException('File not found');
      }
      note.file_id = file_id;
      note.fileName = file.fileName;
      const attachmentUrl = await this.fileService.getSignedUrl(file_id);
      if (attachmentUrl) {
        note.attchementUrl = attachmentUrl;
      }
    }

    if (dto.note) {
      note.note = dto.note;
    }
    const getOperator = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        operator: true,
      },
    });

    const savedNote = await this.notesRepository.save(note);

    if (note?.lead_id?.id) {
      await this.leadRepository.update(note?.lead_id.id, {
        latestNote: dto.note,
        lastNoteAt: savedNote?.updated_at,
      });
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savedNote,
      oldData: oldNote,
      entityId: note?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Note Updated',
      parentId: note?.lead_id.id,
      parentType: entityType.LEAD,
    });

    return savedNote;
  }

  async deleteNote(noteId: notes['id'], userId: User['id']) {
    const note = await this.notesRepository.findOne({
      where: {
        type: 'TRANSACTION_NOTE',
        id: noteId,
      },
      relations: ['created_by', 'user_id', 'lead_id', 'transaction'],
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    if (note.created_by.id !== userId) {
      throw new NotFoundException('Note is not created by user');
    }
    const transaction = await this.getById(note.transaction.id, undefined, true, userId);
    await this.isTransactionUserAllowedToOperator(transaction.user.id , userId)
    const isDeleted = await this.notesRepository.softDelete(noteId);
    const getOperator = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        operator: true,
      },
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: note,
      entityId: note?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Note Deleted',
      parentId: note?.lead_id?.id,
      parentType: entityType.LEAD,
    });
    if (note?.lead_id?.id) {
      const previousNote = await this.notesRepository.findOne({
        where: {
          lead_id: { id: note?.lead_id?.id },
        },
        order: { updated_at: 'DESC' },
      });
      await this.leadRepository.update(note?.lead_id?.id, {
        latestNote: previousNote?.note,
        lastNoteAt: previousNote?.updated_at,
      });
    }
    return { isDeleted: isDeleted.affected === 1 };
  }

  async getPendingWithdrawAmount(userId: number) {
    const withdrawRequest = await this.transactionRepository.findMany({
      select: { amount: true, id: true },
      where: {
        type: TransactionType.WITHDRAW,
        status: TransactionStatus.INITIALIZED_NOT_PAID,
        user: { id: userId },
      },
      loadEagerRelations: false,
    });
    let totalWithdraw = 0;
    withdrawRequest.forEach((r) => {
      totalWithdraw = totalWithdraw + r.amount;
    });

    return totalWithdraw;
  }

  async canCreateWithdraw(userId: number, amount: number, wallet: Wallet) {
    const totalWithdrawPending = await this.getPendingWithdrawAmount(userId);
    const totalWithdrawAmount = totalWithdrawPending + amount;
    if (
      totalWithdrawAmount > wallet.balance ||
      totalWithdrawAmount > wallet.actualBalance
    ) {
      return false;
    }
    return true;
  }

  async canTransferFromWallet(userId: number, amount: number, wallet: Wallet) {
    const totalWithdrawPending = await this.getPendingWithdrawAmount(userId);
    const totalWithdrawAmount = totalWithdrawPending + amount;
    if (
      totalWithdrawAmount > wallet.balance ||
      totalWithdrawAmount > wallet.actualBalance
    ) {
      return false;
    }
    return true;
  }

  async isDepositOrWithdrawalCreationAllowed(
    userId: number,
    type: TransactionType.DEPOSIT | TransactionType.WITHDRAW,
  ) {
    const i18n = I18nContext.current();
    const isWithdraw = type === TransactionType.WITHDRAW;
    const isProofOfPaymentExist =
      await this.userKycDocumentsService.isProofOfPaymentExist(userId);
    if (isWithdraw) {
      if (!isProofOfPaymentExist) {
        await this.createProofOfPaymentTask(userId);
      }
    }

    const group = isWithdraw
      ? RegulationEventKeys.withdrawal_creation
      : RegulationEventKeys.deposit_creation;
    const config = [
      RegulationRuleKeys.kyc_approved,
      RegulationRuleKeys.proof_of_payment,
    ];
    const [isKycRequired, isProofOfPaymentRequired] =
      await this.regulationConfigService.isAllowedInUserRegulation(
        userId,
        group,
        config,
      );

    if (isProofOfPaymentRequired && !isProofOfPaymentExist) {
      const message = isWithdraw
        ? i18n?.t('errors.transaction.witdrawProofOfPayment')
        : i18n?.t('errors.transaction.depositProofOfPayment');
      throw new BadRequestException(message);
    }

    if (isKycRequired) {
      const isKycApproved = await this.userKycService.isUserKycApproved(userId);
      if (!isKycApproved) {
        const message = isWithdraw
          ? i18n?.t('errors.transaction.withdrawKycRequired')
          : i18n?.t('errors.transaction.depositKycRequired');
        throw new BadRequestException(message);
      }
    }
  }

  async adjustment(dto: CreateAdjustmentDto, user: User, clientId?: string) {
    const i18n = I18nContext.current();
    let {
      accountType,
      login = null,
      amount,
      isClientVisible = false,
      type,
      ...rest
    } = dto;

    const userId = clientId ? Number(clientId) : user.id;
    const initiatedById = user.id;
    const performerId = user.id;

    const requestVia = RequestVia.ADMIN_AREA;
    const performerType = this.transactionActivityLogs.getPerformerType(user);

    const isMT5Adjustment = accountType === AccountType.MT5;
    const isNegativeAdjustment = type === AdjustmentType.NEGATIVE;

    if (!isMT5Adjustment && login) {
      login = null;
    }

    const psp = await this.pspRepository.getDefaultPSP();
    if (!psp) {
      throw new BadRequestException('An error occurred while finding the PSP.');
    }

    const wallet = await this.walletService.findOne('USD', userId);
    if (!wallet) {
      throw new BadRequestException('User wallet not found.');
    }

    if (isMT5Adjustment && !login) {
      throw new BadRequestException(
        'MT5 login is required to make adjustments to the MT5 account.',
      );
    }

    if (login) {
      const account = await this.mt5Service.getUserMT5Account(login, userId);
      if (!account) {
        const message = i18n?.t('errors.transaction.accountDoesNotExist');
        throw new NotFoundException(message);
      }

      if (account && isNegativeAdjustment) {
        const mtAccount = await this.mt5Service.verifyMT5Balance(
          login,
          userId,
          amount,
        );
        if (!mtAccount) {
          throw new BadRequestException(
            'An error occurred while creating the adjustment.',
          );
        }
      }
    }

    if (isNegativeAdjustment && !isMT5Adjustment) {
      const userWallet = await this.walletService.verifyWalletBalance(
        wallet,
        amount,
      );
      if (!userWallet) {
        throw new BadRequestException(
          'An error occurred while creating the adjustment.',
        );
      }
    }

    const adjustment = await this.create(
      {
        amount,
        currency: 'USD',
        initiatedById,
        method: TransactionMethods.NONE,
        requestVia,
        userId,
        actionById: performerId,
        defaultStatus: TransactionStatus.INITIALIZED_NOT_PAID,
        isManual: true,
        walletId: wallet.id,
        login: login || undefined,
        isClientVisible,
        adjustmentAccountType: accountType,
        adjustmentType: type,
        internalComment: rest?.internalComment,
        externalNote: rest?.externalNote,
        internalReferenceNo: rest?.internalReferenceNo,
        tradingPlatformId: rest.tradingPlatformId,
      },
      TransactionType.ADJUSTMENT,
    );
    const comment = this.transactionUtilService.createComment(
      'ADJ',
      adjustment.id,
    );

    let isDebited = false;
    let isCredited = false;

    //Handle Negative Adjustment
    if (isNegativeAdjustment) {
      // For Wallet
      if (!isMT5Adjustment) {
        const isDebitedFromWallet = await this.walletService.debit(adjustment);
        if (isDebitedFromWallet) {
          isDebited = true;
        } else {
          throw new BadRequestException(
            'An error occurred while creating the adjustment.',
          );
        }
      } else {
        if (login) {
          const isDebitedFromMT5 = await this.mt5Service.updateMT5Balance(
            login,
            -amount,
            comment,
          );
          if (isDebitedFromMT5) {
            isDebited = true;
          } else {
            throw new BadRequestException(
              'An error occurred while creating the adjustment.',
            );
          }
        } else {
          throw new BadRequestException(
            'An error occurred while creating the adjustment.',
          );
        }
      }

      if (isDebited) {
        adjustment.status = TransactionStatus.APPROVED;
      }
    }
    //Handle Positive Adjustment
    else {
      if (!isMT5Adjustment) {
        const isCreditInWallet = await this.walletService.credit(adjustment);
        if (isCreditInWallet) {
          isCredited = true;
        } else {
          throw new BadRequestException(
            'An error occurred while creating the adjustment.',
          );
        }
      } else {
        if (login) {
          const isCreditedIntoMT5 = await this.mt5Service.updateMT5Balance(
            login,
            amount,
            comment,
          );
          if (isCreditedIntoMT5) {
            isCredited = true;
          } else {
            throw new BadRequestException(
              'An error occurred while creating the adjustment.',
            );
          }
        } else {
          throw new BadRequestException(
            'An error occurred while creating the adjustment.',
          );
        }
      }

      if (isCredited) {
        adjustment.status = TransactionStatus.APPROVED;
      }
    }

    const resp = await this.transactionRepository.save(adjustment);

    if (!resp) {
      const message = i18n?.t('errors.transaction.operationNotAllowed');
      throw new UnprocessableEntityException(message);
    }

    this.transactionActivityLogs.emit({
      entityId: resp.id,
      field: TransactionAction.RECORD_CREATED,
      newData: resp,
      oldData: null,
      performerId,
      performerType,
    });

    return adjustment;
  }

  async transferReward(user: User) {
    const i18n = I18nContext.current();

    const userId = user.id;
    const currency = 'USD';
    const actionById = userId;
    const initiatedById = userId;
    const requestVia = RequestVia.CLIENT_AREA;
    const method = Methods.INTERNAL_TRANSFER;

    const wallet = await this.walletService.findOne(currency, userId);
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }

    const referralReward =
      await this.referralRewardService.getUserReferralWallet(user);

    if (!referralReward) {
      throw new BadRequestException('Referral Reward not found');
    }

    if (0 >= referralReward.balance) {
      throw new BadRequestException('No funds in Referral Reward');
    }

    const transferTo = `Wallet - ${wallet.id}`;
    const transferFrom = `Referral Reward`;
    const externalNote = `Transfer into user wallet ${wallet.id} from user Referral Reward ${referralReward.id}`;
    const walletId = wallet.id;
    const to = await this.create(
      {
        amount: referralReward.balance,
        currency,
        initiatedById,
        requestVia,
        actionById,
        userId,
        method,
        transferFrom,
        transferTo,
        walletId,
        externalNote,
      },
      TransactionType.TRANSFER_IN,
    );

    const from = await this.create(
      {
        amount: referralReward.balance,
        currency,
        initiatedById,
        requestVia,
        actionById,
        userId,
        method,
        transferFrom,
        transferTo,
        walletId,
        externalNote,
      },
      TransactionType.TRANSFER_OUT,
    );

    const isDebited = await this.referralRewardService.debit(to);
    if (!isDebited?.amount) {
      const message = i18n?.t('errors.transaction.processingTransfer');
      throw new UnprocessableEntityException(message);
    }

    const isCredited = await this.walletService.credit(to);
    if (!isCredited) {
      const message = i18n?.t('errors.transaction.processingTransfer');
      throw new UnprocessableEntityException(message);
    }

    await this.transactionRepository.update(to.id, {
      status: TransactionStatus.APPROVED,
    });

    await this.transactionRepository.update(from.id, {
      status: TransactionStatus.APPROVED,
    });

    return this.getById(to.id);
  }

  async processTransactionEvents(tr:Transaction){
    const transaction = await this.transactionRepository.findOne({
      where:{
        id:tr.id,
        status:TransactionStatus.APPROVED,
        type:TransactionType.DEPOSIT
      },
      relations:{
        user:true,
        wallet:true
      }
    });
    if(!transaction){
      return;
    }
    try {
      if(transaction.type === TransactionType.DEPOSIT){
        await this.isAutoTradingAccountDeposit(transaction)
        await this.isBonusApplicableTransaction(transaction)
      }
    } catch (error) {
      console.error(error)
    }
  }


  async getAutoTradingAccountDepositAndBonusPayload(
    dto:{login?: string,
      code?: string, amount:number,
      isNewTradingAccount:boolean
    },
    userId: number,
    type: TransactionType,
  ) {
    const {login =null, code=null, amount, isNewTradingAccount} = dto;
    const i18n = I18nContext.current();
    let isTradingAccountAutoDeposit = false;
    let isBonusApplicable = false;
    let tradingAccountRef;
    let bonusCode;

    if(!login && !isNewTradingAccount && code){
      throw new BadRequestException("Login or isNewTradingAccount is required when bonus code is applied")
    }

    if (type !== TransactionType.DEPOSIT) {
      return {
        isTradingAccountAutoDeposit,
        isBonusApplicable,
        bonusCode,
        tradingAccountRef,
      };

    }

    if (login) {
      const account = await this.mt5Service.getUserMT5Account(login, userId);
      if (!account) {
        const message = i18n?.t('errors.transaction.accountDoesNotExist');
        throw new NotFoundException(message);
      }
      isTradingAccountAutoDeposit = true;
      tradingAccountRef = login;
    } else if(!login && isNewTradingAccount){
      isTradingAccountAutoDeposit = true;
    }

    if(!code){
      return {
        isTradingAccountAutoDeposit,
        isBonusApplicable,
        bonusCode,
        tradingAccountRef,
      };
    }

    if (code) {
      const isApplicable = await this.bonusService.validate({id:userId} as User , {amount, bonusCode:code});
      if(isApplicable){
        isBonusApplicable = true;
        bonusCode = code
      }
    }

    return {
      isTradingAccountAutoDeposit,
      isBonusApplicable,
      bonusCode,
      tradingAccountRef,
    };
  }

  async isAutoTradingAccountDeposit(transaction: Transaction) {
    if (
      transaction.isTradingAccountAutoDeposit &&
      transaction.tradingAccountRef &&
      transaction.netAmount
    ) {
      await this.transferAmount(
        {
          amount: transaction.netAmount,
          //@ts-expect-error type-error
          transferIn: {
            login: transaction.tradingAccountRef,
          },
          //@ts-expect-error type-error
          transferOut: {
            walletId: transaction.wallet.id,
          },
          tradingPlatformId: transaction.tradingAccountRef,
        },
        transaction.user,
      );
    }
  }

  private async addBonusReward(transaction:Transaction, user:User){
    if (transaction.isBonusApplicable && transaction.tradingAccountRef && transaction.bonusCode) {
      const code = transaction.bonusCode;
      const login = transaction.tradingAccountRef;
      const amount = transaction.netAmount;
      const mt5Account = await this.mt5AccountRepository.findOne({
        where: {
          login,
          user:{
            id:user.id
          }
        }
      });
      if(!mt5Account){
        throw new BadRequestException("MT5 account not found")
      }
    const bonus = await this.bonusService.validateAmount(user , {amount, bonusCode:code});
    const convertedAmount = Number(Number(bonus.bonusAmount / bonus.currency.conversionRate).toFixed(2));
    return this.bonusRewardRepository.save(this.bonusRewardRepository.create({
        mt5Account,
        transaction,
        tradingPlatformRef: login,
        amount:bonus.bonusAmount,
        convertedAmount,
        code,
        user,
        bonus
      }))
    }
    return null

  }

  async isBonusApplicableTransaction(transaction: Transaction) {
      const isRewardAdded = await this.addBonusReward(transaction, transaction.user);
      const operatorUser = await this.userRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });
      if(!operatorUser){
        throw new BadRequestException("System Operator User Not Found")
      }
      if(isRewardAdded && isRewardAdded.convertedAmount){
        await this.mt5Service.addBonus(
          {
            balance:isRewardAdded?.convertedAmount,
            transactionId: transaction.id,
            login: Number(transaction.tradingAccountRef),
            comment: `Bonus against code ${transaction.bonusCode}`,
            internalNote: `Bonus against code ${transaction.bonusCode}`,
            internalReferenceNo:`Bonus against code ${transaction.bonusCode}`
          },
          operatorUser.id,
          transaction.bonusCode
        );
      }
    }
  
  async isTransactionUserAllowedToOperator(userId: number, operatorUserId: number) {
    if (!operatorUserId) {
      throw new ForbiddenException("Operator User Id Not provided")
    }

    if (!userId || isNaN(userId)) {
      throw new ForbiddenException("User Id Not provided")
    }

    const client = await this.clientRepository.getClientWithRoleFilter(operatorUserId, { user: { id: userId } });
    if (!client) {
      throw new ForbiddenException("Not allowed")
    }
    return client
  }
}