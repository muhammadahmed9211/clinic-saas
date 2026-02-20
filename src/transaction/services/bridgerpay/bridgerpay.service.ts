import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import {
  RequestVia,
  Transaction,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { ClientsService } from 'src/users/clients.service';
import crypto from 'crypto';
import { CreateTransactionDto, ITransactionInfo } from 'src/transaction/dto/create-transaction.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { PSP, PspNames } from 'src/transaction/entities/psp.entity';
import { BillingInformationService } from 'src/billing-information/billing-information.service';
import { Methods as TransactionMethods } from 'src/transaction/entities/transaction-method.entity';
import { IBridgerPayCreate } from './types/index';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { UserEWalletService } from 'src/user-ewallet/user-ewallet.service';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { AggregatorService } from 'src/aggregator/aggregator.service';
@Injectable()
export class BridgerPayService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
    private readonly billingInformationService: BillingInformationService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    private readonly userCreditCardService: UserCreditCardsService,
    private readonly userEWalletService: UserEWalletService,
    private readonly pspRepository: PspRepository,
    private readonly transactionNotificationService: TransactionNotificationService,
    private readonly transactionMailService: TransactionMailService,
    private readonly aggregatorService: AggregatorService,
  ) {}

  private get config() {
    const base_url = this.configService.getOrThrow('bridgerpay.base_url', {
      infer: true,
    });
    const user_name = this.configService.getOrThrow('bridgerpay.user_name', {
      infer: true,
    });
    const password = this.configService.getOrThrow('bridgerpay.password', {
      infer: true,
    });
    const host = this.configService.getOrThrow('bridgerpay.host', {
      infer: true,
    });
    const cashier_key = this.configService.getOrThrow(
      'bridgerpay.cashier_key',
      {
        infer: true,
      },
    );
    const api_key = this.configService.getOrThrow('bridgerpay.api_key', {
      infer: true,
    });

    const checkout_url = this.configService.getOrThrow(
      'bridgerpay.checkout_url',
      {
        infer: true,
      },
    );
    return {
      base_url,
      user_name,
      password,
      host,
      cashier_key,
      api_key,
      checkout_url,
    };
  }

  async getAccessToken(): Promise<string> {
    const { base_url, user_name, password } = this.config;
    const url = `${base_url}/auth/login`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const body = {
      user_name,
      password,
    };
    const { data } = await this.httpService.axiosRef.post(url, body, config);

    const access_token = data?.result?.access_token?.token || null;
    if (!access_token) {
      throw new UnprocessableEntityException(
        'An error occurred  while trying to authenticate',
      );
    }
    return access_token;
  }

  async createPaymentURL(body: IBridgerPayCreate, access_token: string) {
    const { base_url, api_key, host, checkout_url, cashier_key } = this.config;
    const { single_payment_method } = body;
    const url = `${base_url}/cashier/session/create/${api_key}`;
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        host,
      },
    };
    return new Promise((resolve, reject) => {
      this.httpService.axiosRef
        .post(url, body, requestConfig)
        .then((response) => {
          const cashierToken = response?.data?.result?.cashier_token;
          const paymentURL = `${checkout_url}?cashierKey=${cashier_key}&cashierToken=${cashierToken}&single_payment_method=${single_payment_method}`;
          resolve(paymentURL);
        })
        .catch(async (error) => {
          console.error(error);
          if (body.order_id) {
            await this.transactionService.delete(body.order_id);
          }
          console.log(error?.response?.data);
          const errors = error?.response?.data?.result;
          let msg = 'Error creating transaction';
          if (Array.isArray(errors) && errors.length > 0) {
            if (typeof errors[0]?.message === 'string') {
              msg = errors[0].message;
            }
          }
          reject(msg);
        });
    });
  }

  async createTransaction(
    dto: CreateTransactionDto,
    currency: string,
    userId: number,
    info:ITransactionInfo
  ) {
    const access_token = await this.getAccessToken();

    const { cashier_key } = this.config;
    const { amount, single_payment_method } = dto;

    const userData = await this.clientsService.findOne({ id: userId });

    const hashBuffer = crypto.randomBytes(16);

    const genHash = crypto.createHash('sha256');
    genHash.update(hashBuffer);

    const hash = genHash.digest('hex');

    const genMd5Hash = crypto.createHash('md5');
    genMd5Hash.update(hash);

    const md5Hash = genMd5Hash.digest('hex');

    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const country = billingDetails.country;

    let method = TransactionMethods.CREDIT_CARD;
    if (single_payment_method === 'crypto') {
      method = TransactionMethods.CRYPTO;
    } else if (single_payment_method === 'apm') {
      method = TransactionMethods.E_WALLET;
    }

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.BridgerPay,
      },
    });

    const transaction = await this.transactionService.create(
      {
        currency,
        country,
        amount,
        method,
        hash: md5Hash,
        userId,
        psp,
        walletId: dto.walletId,
        initiatedById: userId,
        requestVia: RequestVia.CLIENT_AREA,
        ...info
      },
      TransactionType.DEPOSIT,
    );

    if (!transaction) {
      throw new UnprocessableEntityException('An error occurred');
    }
    const [first_name, last_name = ''] = billingDetails?.name?.split(' ');

    const body = {
      order_id: transaction.id,
      email: userData?.email,
      single_payment_method,
      theme: 'bright',
      payload: hash,
      cashier_key,
      currency,
      country,
      amount,

      currency_lock: true,
      amount_lock: true,
      hide_card_holder_name_when_full_name_is_available: true,

      first_name,
      last_name,
      city: billingDetails.city,
      state: userData?.state,
      address: billingDetails?.address,
      zip_code: billingDetails.postalCode,

      button_mode: 'tab',
      deposit_button_text: 'Deposit',
      button_text: 'Please proceed on open tab',
    };
    return this.createPaymentURL(body, access_token)
      .then((url) => {
        return { url, transaction };
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async onStatusChange(
    transaction: Transaction,
    type: string,
    amount: number,
    data: any,
  ) {
    if (type === 'cashier.session.init') {
      await this.transactionService.initTransaction(transaction, type);
    } else if (type === 'approved') {
      await this.updateData(data, transaction, transaction.user.id);
      const isApproved = await this.transactionService.approveTransaction(
        transaction,
        amount,
        type,
      );
      if (isApproved) {
        this.transactionNotificationService.automaticTransactionApproved(
          transaction,
        );
        await this.transactionMailService.onDepositAutoSuccess(transaction);
      }
    } else if (type === 'declined') {
      await this.transactionService.failTransaction(transaction, type);
    } else {
      await this.transactionService.updateLastStatus(transaction, type);
    }
    return 'OK';
  }

  async updateData(data, transaction: Transaction, userId: number) {
    const paymentClientName: string = data?.charge?.attributes?.source?.name;
    const pspTransactionId = data?.charge?.psp_order_id;
    const subPspName = data?.psp_name;
    let psp: PSP | null = null;
    let pspDisplayName = subPspName;
    try {
      if (subPspName && pspDisplayName) {
        pspDisplayName = pspDisplayName.replace(/_/g, ' ');
        pspDisplayName = pspDisplayName.replace(/\b\w/g, (char) =>
          char.toUpperCase(),
        );
        const isExist = await this.pspRepository.findOneBy({
          name: subPspName,
        });
        if (isExist) {
          psp = isExist;
        } else {
          // const aggregator = this.

          const aggregator =
            await this.aggregatorService.getBridgerPayAggregator();
          if (aggregator) {
            const newPspData = this.pspRepository.create({
              name: subPspName,
              displayName: pspDisplayName,
              aggregatorName: aggregator.name,
              aggregator: { id: aggregator.id },
              description: `${aggregator.description} PSP ${pspDisplayName}`,
              isActive: true,
            });
            psp = await this.pspRepository.save(newPspData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching PSP from data:', error);
      return;
    }
    const payload: any = {
      paymentClientName,
      pspTransactionId,
      subPspName,
    };

    const isEWalletTransaction = this.userEWalletService.isEWalletPayment(data);
    const isCardPayment = this.userCreditCardService.isCardPayment(data);
    const isCryptoPayment =
      data?.charge?.attributes?.payment_method === 'crypto';

    if (isCardPayment) {
      const cardDetails = this.userCreditCardService.getCardPayload(data);
      const card = await this.userCreditCardService.create(cardDetails, userId);
      payload.creditCardDetailsId = card.id;
    } else if (isEWalletTransaction) {
      const eWalletDetails = this.userEWalletService.getEWalletPayload(data);
      const eWallet = await this.userEWalletService.create(
        eWalletDetails,
        userId,
      );
      payload.userEWalletId = eWallet.id;
    } else if (isCryptoPayment) {
      const cryptoCoinName = data?.charge?.attributes?.crypto_currency;
      payload.cryptoCoinName = cryptoCoinName;
    }
    const updatePayload = {};
    if (psp) {
      updatePayload['pspId'] = psp.id;
    }
    await this.transactionService.update(
      updatePayload,
      transaction.id,
      undefined,
      {
        ...payload,
      },
    );
  }
}
