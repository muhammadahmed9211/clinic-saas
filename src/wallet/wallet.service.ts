import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Wallet } from './entities/wallet.entity';
import { Server, ServerName, ServerType } from './entities/server.entity';
import { User } from 'src/users/entities/user.entity';
import { Ledger, LedgerType } from './entities/ledger.entity';
import {
  AccountType,
  AdjustmentType,
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { WalletRepository } from './repositories/wallet.repository';
import { LedgerRepository } from './repositories/ledger.repository';
import { ServerRepository } from './repositories/server.repository';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { MT5Service } from 'src/transaction/services/mt5/mt5.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { I18nContext } from 'nestjs-i18n';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { TransactionService } from 'src/transaction/transaction.service';
@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly ledgerRepository: LedgerRepository,
    private readonly serverRepository: ServerRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly clientRepository: ClientRepository,
    private readonly leadRepository: LeadsRepository,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mt5Service: MT5Service,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService:TransactionService
  ) {}

  get withdrawalFee() {
    const fee = this.configService.getOrThrow('app.withdrawalFee', {
      infer: true,
    });
    return Number(fee);
  }

  get depositFee() {
    const fee = this.configService.getOrThrow('app.depositFee', {
      infer: true,
    });
    return Number(fee);
  }

  async create(currency: string, userId: number) {
    const isExist = await this.walletRepository.findOne({
      where: {
        currency: currency,
        user: { id: userId },
      },
    });
    if (isExist) {
      throw new UnprocessableEntityException('Wallet already exists');
    }
    const newWallet = new Wallet();

    const user = new User();
    user.id = userId;

    newWallet.currency = currency;
    newWallet.balance = 0;
    newWallet.actualBalance = 0;
    newWallet.user = user;

    const server = await this.serverRepository.findOne({
      where: { name: ServerName.WALLET, type: ServerType.SYSTEM },
    });
    if (!server) {
      throw new UnprocessableEntityException('Server for wallet not found');
    }

    const walletServer = new Server();
    walletServer.id = server.id;

    newWallet.server = walletServer;

    const wallet = await this.walletRepository.save(newWallet);

    return wallet;
  }

  async findAllByUserId(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new UnprocessableEntityException('User not found');

    const wallets = await this.walletRepository.findBy({
      user: { id: userId },
    });
    if (!wallets.length) {
      await this.create('USD', userId);
      return this.findAllByUserId(userId);
    }
    return wallets;
  }

  async getUserWalletInfo(userId: number) {
    const entities = await this.transactionRepository.getUserWalletInfo(userId);
    return entities;
  }

  async findById(id: number, userId?: number) {
    const wallet = await this.walletRepository.findOne({
      where: { id, user: { id: userId } },
    });
    return wallet;
  }

  async findOne(currency: string, userId: number) {
    const wallet = await this.walletRepository.findOne({
      where: {
        currency: currency,
        user: {
          id: userId,
        },
      },
    });
    return wallet;
  }

  async getAmount(transaction: Transaction) {
    if (
      transaction.fee &&
      transaction.amount &&
      transaction.paidAmount &&
      transaction.netAmount
    ) {
      const netAmount = transaction.paidAmount - transaction.fee;
      if (netAmount === transaction.netAmount) {
        return {
          fee: transaction.fee,
          netAmount: transaction.netAmount,
          paidAmount: transaction.paidAmount,
        };
      }
    }
    let fee = 0;
    const paidAmount = transaction?.paidAmount || transaction?.amount;
    let netAmount = paidAmount;

    if (transaction.type === TransactionType.DEPOSIT) {
      fee = this.depositFee;
      netAmount = paidAmount - fee;
      await this.transactionRepository.update(transaction.id, {
        fee,
        netAmount,
        paidAmount,
      });
    } else if (transaction.type === TransactionType.WITHDRAW) {
      fee = this.withdrawalFee;
      netAmount = paidAmount - fee;
      await this.transactionRepository.update(transaction.id, {
        fee,
        paidAmount,
        netAmount,
      });
    }
    return {
      fee,
      netAmount,
      paidAmount,
    };
  }

  async credit(transaction: Transaction) {
    const { wallet = null } = transaction;

    if (!wallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    const isPositiveWalletAdjustment =
      transaction.type === TransactionType.ADJUSTMENT &&
      transaction.adjustmentAccountType === AccountType.WALLET &&
      transaction.adjustmentType === AdjustmentType.POSITIVE;

    if (
      transaction.type !== TransactionType.DEPOSIT &&
      transaction.type !== TransactionType.TRANSFER_IN &&
      !isPositiveWalletAdjustment
    ) {
      throw new UnprocessableEntityException('Invalid transaction type');
    }
    const userId = transaction.user.id;
    const userWallet = await this.findById(wallet.id, userId);
    if (!userWallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    const { netAmount } = await this.getAmount(transaction);

    const balanceBefore = userWallet.balance;
    const balanceAfter = balanceBefore + netAmount;

    const actualBalanceBefore = userWallet.actualBalance;
    const actualBalanceAfter = actualBalanceBefore + netAmount;

    userWallet.actualBalance = actualBalanceAfter;
    userWallet.balance = balanceAfter;

    const user = new User();
    user.id = userId;

    const isAlreadyInLedger = await this.ledgerRepository.findOne({
      where: {
        transaction: {
          id: transaction.id,
        },
      },
    });
    if (isAlreadyInLedger) {
      throw new UnprocessableEntityException('Already Credited');
    }

    if (transaction.type === TransactionType.DEPOSIT) {
      if(userWallet.totalDeposit){
        userWallet.rtdAmount += netAmount;
      }
      userWallet.totalDeposit += netAmount;
    } else if (transaction.type === TransactionType.TRANSFER_IN) {
      userWallet.totalTransferIn += netAmount;
    } else if (isPositiveWalletAdjustment) {
      userWallet.positiveAdjustment += netAmount;
    }


    const userTransaction = new Transaction();
    userTransaction.id = transaction.id;

    const ledger = new Ledger();
    ledger.type = LedgerType.CREDIT;
    ledger.user = user;
    ledger.wallet = userWallet;
    ledger.transaction = userTransaction;
    ledger.balanceBefore = balanceBefore;
    ledger.balanceAfter = balanceAfter;

    await this.ledgerRepository.save(ledger);
    const updatedWallet = await this.walletRepository.save(userWallet);
    try {
    if(transaction.type === TransactionType.DEPOSIT){
try {
      let isFTD = false;
      const client = await this.clientRepository.findOne({
        where: { userId },
        loadEagerRelations: false,
        relations: ['regulation', 'user'],
      });

      if (client) {
        if (!client?.FTD) {
          isFTD = true;
          client.FTD = true;
          client.timesOfFTD = new Date();
          client.ftdAmount = netAmount;
          client.adjustedFtdAmount = netAmount;
        }
        client.timesOfLTD = new Date();
        await this.clientRepository.save(client);
        await this.transactionRepository.update(transaction.id, {
          isFtd: isFTD,
        });
        if (client.leadId) {
          this.leadRepository.update(Number(client.leadId), {
            FTD: client.FTD,
            ftdAmount: client.ftdAmount,
            adjustedFtdAmount: client.adjustedFtdAmount,
            timesOfFTD: client.timesOfFTD,
            timesOfLTD: client.timesOfLTD,
          });
        }

        if (isFTD) {
          await this.mt5Service.createMt5AccountOnFTD(
            client.regulation.id,
            client.user,
            client,
            transaction
          );
          const op = await this.operatorRepository.findOne({
            where: {
              id: client.salesRepId,
            },
            loadEagerRelations: false,
          });
          if (typeof op?.weeklyCount === 'number') {
            const newWeeklyCount = op.weeklyCount - 3;
            await this.operatorRepository.update(client.salesRepId, {
              weeklyCount: newWeeklyCount,
            });
          }
        }

        await this.cacheManager.del(`get-me-api-${user.id}`);
      }
    } catch (error) {}
    }} catch (error) { }
    try {
      await this.transactionService.processTransactionEvents(transaction)
    } catch (error) {
      console.error(error)
    }

    return updatedWallet;
  }

  async revertWithdrawal(transaction: Transaction) {
    const { wallet = null } = transaction;

    if (!wallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    if (transaction.type !== TransactionType.WITHDRAW) {
      throw new UnprocessableEntityException('Invalid transaction type');
    }

    if (transaction.status !== TransactionStatus.APPROVED) {
      throw new UnprocessableEntityException('Invalid transaction status');
    }

    const userId = transaction.user.id;
    const userWallet = await this.findById(wallet.id, userId);
    if (!userWallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    const { paidAmount } = await this.getAmount(transaction);

    const balanceBefore = userWallet.balance;
    const balanceAfter = balanceBefore + paidAmount;

    const actualBalanceBefore = userWallet.actualBalance;
    const actualBalanceAfter = actualBalanceBefore + paidAmount;

    userWallet.actualBalance = actualBalanceAfter;
    userWallet.totalWithdraw = userWallet.totalWithdraw - paidAmount;
    userWallet.balance = balanceAfter;

    const user = new User();
    user.id = userId;

    const updatedWallet = await this.walletRepository.save(userWallet);

    const userTransaction = new Transaction();
    userTransaction.id = transaction.id;

    const ledger = new Ledger();
    ledger.type = LedgerType.CREDIT;
    ledger.user = user;
    ledger.wallet = userWallet;
    ledger.transaction = userTransaction;
    ledger.balanceBefore = balanceBefore;
    ledger.balanceAfter = balanceAfter;

    await this.ledgerRepository.save(ledger);
    return updatedWallet;
  }

  async debit(transaction: Transaction) {
    const { wallet = null, user } = transaction;
    if (!wallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    const isNegativeWalletAdjustment =
      transaction.type === TransactionType.ADJUSTMENT &&
      transaction.adjustmentAccountType === AccountType.WALLET &&
      transaction.adjustmentType === AdjustmentType.NEGATIVE;

    if (
      transaction.type !== TransactionType.WITHDRAW &&
      transaction.type !== TransactionType.TRANSFER_OUT &&
      !isNegativeWalletAdjustment
    ) {
      throw new UnprocessableEntityException('Invalid transaction type');
    }

    const { paidAmount } = await this.getAmount(transaction);
    const userWallet = await this.walletRepository.findOne({
      where: {
        id: wallet.id,
        user: {
          id: user.id,
        },
      },
    });
    if (!userWallet) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    if (userWallet.balance < paidAmount) {
      throw new UnprocessableEntityException('Insufficient funds');
    }

    const balanceBefore = userWallet.balance;
    const balanceAfter = balanceBefore - paidAmount;

    const actualBalanceBefore = userWallet.actualBalance;
    const actualBalanceAfter = actualBalanceBefore - paidAmount;

    userWallet.actualBalance = actualBalanceAfter;
    userWallet.balance = balanceAfter;

    const ledger = new Ledger();
    ledger.type = LedgerType.DEBIT;
    ledger.user = user;
    ledger.wallet = userWallet;
    ledger.transaction = transaction;
    ledger.balanceBefore = balanceBefore;
    ledger.balanceAfter = balanceAfter;

    const isAlreadyInLedger = await this.ledgerRepository.findOne({
      where: {
        transaction: {
          id: transaction.id,
        },
      },
    });
    if (isAlreadyInLedger) {
      throw new UnprocessableEntityException('Already Credited');
    }

    await this.ledgerRepository.save(ledger);

    if (transaction.type === TransactionType.WITHDRAW) {
      userWallet.totalWithdraw += paidAmount;
    } else if (transaction.type === TransactionType.TRANSFER_OUT) {
      userWallet.totalTransferOut += paidAmount;
    } else if (isNegativeWalletAdjustment) {
      userWallet.negativeAdjustment += paidAmount;
    }

    const updatedWallet = await this.walletRepository.save(userWallet);
    return updatedWallet;
  }

  async getWalletBalances(user: User) {
    const userWallets = await this.walletRepository.findBy({
      user: { id: user.id },
    });

    if (!userWallets) {
      throw new UnprocessableEntityException('Wallet not found');
    }

    return userWallets.reduce((accumulator, wallet) => {
      return accumulator + wallet.balance;
    }, 0);
  }

  async verifyUserWalletBalance(userId: number, amount: number) {
    const wallet = await this.findOne('USD', userId);
    if (!wallet) {
      throw new BadRequestException('User Wallet not found');
    }

    return this.verifyWalletBalance(wallet, amount);
  }

  async verifyWalletBalance(wallet: Wallet, amount: number) {
    const i18n = I18nContext.current();
    const isAmountExistInWallet =
      wallet.balance >= amount && wallet.actualBalance >= amount;
    if (!isAmountExistInWallet) {
      const message = i18n?.t('errors.transaction.insufficientFunds');
      throw new BadRequestException(message);
    }
    return isAmountExistInWallet;
  }
}
