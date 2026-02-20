import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { IAlphaPayCreate, IAlphaPayCreateTransaction, PaymentStatus } from '.';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  RequestVia,
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { Methods } from 'src/transaction/entities/transaction-method.entity';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { PspNames } from 'src/transaction/entities/psp.entity';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { LedgerRepository } from 'src/wallet/repositories/ledger.repository';
import { ITransactionInfo } from 'src/transaction/dto/create-transaction.dto';

@Injectable()
export class AlphaPayService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly pspRepository: PspRepository,
    private readonly httpService: HttpService,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionNotificationService: TransactionNotificationService,
    private readonly transactionMailService: TransactionMailService,
    private readonly ledgerRepository: LedgerRepository
  ) { }

  private get config() {
    const apiKey = this.configService.getOrThrow('alphaPay.apiKey', {
      infer: true,
    });
    const apiUrl = this.configService.getOrThrow('alphaPay.apiUrl', {
      infer: true,
    });
    return {
      apiKey,
      apiUrl,
    };
  }

  get headers() {
    const { apiKey } = this.config;
    const config = {
      headers: {
        'secret-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    };
    return config;
  }

  async createTransaction(
    createPaymentDto: IAlphaPayCreateTransaction,
    userId: number,
    info:ITransactionInfo
  ) {
    const {
      amount,
      currency,
      standard = null,
      walletId,
    } = createPaymentDto;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.AlphaPay,
      },
    });

    const transaction = await this.transactionService.create(
      {
        currency: 'USD',
        cryptoCoinName: currency,
        network: standard || undefined,
        amount,
        method: Methods.CRYPTO,
        userId,
        psp,
        walletId,
        initiatedById: userId,
        requestVia: RequestVia.CLIENT_AREA,
        ...info
      },
      TransactionType.DEPOSIT,
    );

    const passthrough = JSON.stringify({
      transactionId: transaction.id,
      userId,
    });

    const payload: IAlphaPayCreate = {
      standard:standard ? standard:undefined,
      amount,
      cid:userId.toString(),
      tid:transaction.id,
      unit:currency
    };

    const url = `${this.config.apiUrl}/merchant/transaction/deposit`;
    try {
      const { data } = await this.httpService.axiosRef.post(
        url,
        payload,
        this.headers,
      );
      console.log({ data });
      if (data && data?.wallet) {
        const url = {
          ...data.wallet,
          qrcode:data.wallet.qr_code
        };
        return { transaction, url: url as string };
      }
      return null;
    } catch (error) {
      await this.transactionService.delete(transaction.id);
      console.log(error);
      return null;
    }
  }

  async onStatusChange(body: any, tr: Transaction) {

    if(tr.status === TransactionStatus.APPROVED){
      throw new BadRequestException("Transaction is already approved")
    }

    const isAlreadyInLedger = await this.ledgerRepository.findOne({
      where: {
        transaction: {
          id: tr.id,
        },
      },
    });
    if (isAlreadyInLedger) {
      throw new UnprocessableEntityException('Already Credited');
    }
    const transactionId: string = tr.id;
    const status = body.status;
    const isPaid =
      status === PaymentStatus.COMPLETE ||
      status === PaymentStatus.INCOMPLETE ||
      status === PaymentStatus.OVERPAY;
    if (!isPaid) {
      throw new BadRequestException('Invalid Status');
    }
    const cryptoTransaction = Array.isArray(body.transaction)
      ? body.transaction[0]
      : null;
    if (!cryptoTransaction) {
      throw new BadRequestException('Crypto Transaction not found');
    }
    let paidAmount = body?.paid_amount?.fait?.amount
      ? Number(body?.paid_amount?.fait?.amount)
      : null;
    const currency = body?.paid_amount?.fait?.currency;
    if (!currency || !paidAmount) {
      throw new BadRequestException('Invalid currency or amount');
    }
    if (currency !== 'USD') {
      throw new BadRequestException('Only USD is allowed');
    }

    if(paidAmount){
      paidAmount = Number(paidAmount.toFixed(2))
    }

    if(paidAmount <=0){
     throw new BadRequestException("Paid amount is invalid")
    }
    
    const cryptoCoinName = body?.paid_amount?.crypto?.currency;
    const cryptoCoinAmount = body?.paid_amount?.crypto?.amount;

    if (!cryptoCoinName) {
      throw new BadRequestException("Crypto Coin not found")
    }
    const updateData = {
      cryptoHashReference: cryptoTransaction?.trxid,
      cryptoClientWalletAddress: body?.sender_address,
      pspTransactionId: body.id ? body.id.toString() : null,
      customParam1: body?.address,
      customParam2: cryptoCoinAmount,
      cryptoCoinName
    };

    if (paidAmount < tr.fee) {
      throw new BadRequestException('Fee is greater than paid amount');
    }

    const { affected } = await this.transactionRepository.update(
      transactionId,
      { ...updateData, paidAmount },
    );
    const isUpdated = affected === 1;
    if (!isUpdated) {
      throw new BadRequestException('Error while updating paid amount');
    }

    const isCoinAllowed = this.isCoinAllowed(cryptoCoinName);
    if (!isCoinAllowed) {
      throw new BadRequestException(`${cryptoCoinName} not allowed`)
    };

    const transaction = await this.transactionService.getById(transactionId);

    // await this.updateData(data, transaction, transaction.user.id);
    const isApproved = await this.transactionService.approveTransaction(
      transaction,
      paidAmount,
    );

    if (isApproved) {
      this.transactionNotificationService.automaticTransactionApproved(
        transaction,
      );
      await this.transactionMailService.onDepositAutoSuccess(transaction);
    }
  }

  verifySecret(secret: string): boolean {
    const webhookSecret = this.configService.getOrThrow('alphaPay.webhookSecret', {
      infer: true,
    });

    const isSecretDisabled = webhookSecret.toLowerCase() === 'none';
    if (isSecretDisabled) {
      return isSecretDisabled
    }
    return secret === webhookSecret
  }

  isCoinAllowed(coin: string): boolean {
    let isCoinAllowed = false;
    try {
      const coins = this.configService.getOrThrow('alphaPay.allowedCoins', {
        infer: true,
      });

      const isAllowed = coins.split(",").find((c) => c === coin)
      if (isAllowed) {
        isCoinAllowed = true
      }
    }
    catch (error) {
      console.error(error)
      throw new Error(error)
    }
    return isCoinAllowed
  }
}
