import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
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
import { TransactionService } from 'src/transaction/transaction.service';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { PSP, PspNames } from 'src/transaction/entities/psp.entity';
import { BillingInformationService } from 'src/billing-information/billing-information.service';
import {
  Methods,
  Methods as TransactionMethods,
} from 'src/transaction/entities/transaction-method.entity';
import { Intent, IPraxisCreate, IPraxisCreateTransaction } from './types/index';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { UserEWalletService } from 'src/user-ewallet/user-ewallet.service';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { AggregatorService } from 'src/aggregator/aggregator.service';
import crypto from 'crypto';
import { ITransactionInfo, SinglePaymentMethod } from 'src/transaction/dto/create-transaction.dto';
import { TransactionUtilsService } from '../utils/utils.service';
@Injectable()
export class PraxisService {
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
    private readonly transactionUtilsService: TransactionUtilsService,
  ) {}

  private config(method: TransactionMethods) {
    const api_url = this.configService.getOrThrow('praxis.api_url', {
      infer: true,
    });
    const application_key = this.configService.getOrThrow(
      'praxis.application_key',
      {
        infer: true,
      },
    );
    const domain = this.configService.getOrThrow('praxis.domain', {
      infer: true,
    });

    const version = this.configService.getOrThrow('praxis.version', {
      infer: true,
    });

    let merchant_secret = this.configService.getOrThrow(
      'praxis.merchantSecretCreditCard',
      {
        infer: true,
      },
    );

    let merchant_id = this.configService.getOrThrow(
      'praxis.merchantIdCreditCard',
      {
        infer: true,
      },
    );

    if (method === TransactionMethods.CRYPTO) {
      merchant_secret = this.configService.getOrThrow(
        'praxis.merchantSecretCrypto',
        {
          infer: true,
        },
      );
      merchant_id = this.configService.getOrThrow('praxis.merchantIdCrypto', {
        infer: true,
      });
    } else if (method === TransactionMethods.E_WALLET) {
      merchant_secret = this.configService.getOrThrow(
        'praxis.merchantSecretEWallet',
        {
          infer: true,
        },
      );
      merchant_id = this.configService.getOrThrow('praxis.merchantIdEWallet', {
        infer: true,
      });
    }

    const returnUrl = this.configService.getOrThrow('praxis.returnUrl', {
      infer: true,
    });

    const notificationUrl = this.configService.getOrThrow(
      'praxis.notificationUrl',
      {
        infer: true,
      },
    );

    return {
      api_url,
      application_key,
      domain,
      merchant_id,
      version,
      merchant_secret,
      returnUrl,
      notificationUrl,
    };
  }

  signature(
    cid: string,
    timestamp: number,
    intent: Intent,
    orderId: string,
    method: TransactionMethods,
  ) {
    const { merchant_id, application_key, merchant_secret } =
      this.config(method);
    console.log(orderId);
    const str = `${merchant_id}${application_key}${timestamp}${intent}${cid}${orderId}${merchant_secret}`;
    const hash = crypto.createHash('sha384').update(str, 'utf8').digest('hex');
    return hash;
  }

  async createPaymentURL(
    body: IPraxisCreate,
    signature: string,
    method: TransactionMethods,
  ) {
    const { api_url } = this.config(method);
    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Gt-Authentication': signature,
      },
    };
    return new Promise((resolve, reject) => {
      this.httpService.axiosRef
        .post(api_url, body, requestConfig)
        .then((response) => {
          console.log(response , "PRAXIS RESPONSE")
          if (response?.data?.redirect_url) {
            resolve(response?.data?.redirect_url);
          } else {
            console.error(response, 'PRAXIS ERROR');
            throw new BadRequestException('Error creating transaction');
          }
        })
        .catch(async (error) => {
          console.error(error, 'PRAXIS ERROR');
          if (body.order_id) {
            await this.transactionService.delete(body.order_id);
          }
          const msg = 'Error creating transaction';
          reject(msg);
        });
    });
  }

  async createTransaction(
    dto: IPraxisCreateTransaction,
    currency: string,
    userId: number,
    info:ITransactionInfo
  ) {
    const amount = Math.ceil(dto.amount)
    const userData = await this.clientsService.findOne({ id: userId });

    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const country = billingDetails.country;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.Praxis,
      },
    });

    let method: TransactionMethods = TransactionMethods.CREDIT_CARD;
    if (dto.single_payment_method === SinglePaymentMethod.apm) {
      method = TransactionMethods.E_WALLET;
    } else if (dto.single_payment_method === SinglePaymentMethod.crypto) {
      method = TransactionMethods.CRYPTO;
    }
    const transaction = await this.transactionService.create(
      {
        currency,
        country,
        amount,
        method,
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
    const {
      application_key,
      merchant_id,
      domain,
      version,
      returnUrl,
      notificationUrl,
    } = this.config(method);
    const intent = 'payment';
    const timestamp = Math.floor(Date.now() / 1000);

    const order_id = transaction.id;
    const cid = userId.toString();
    const baseUrl = this.configService.get('app.frontendDomain', {
      infer: true,
    });
    const return_url = `${baseUrl}${returnUrl}`;
    const body: IPraxisCreate = {
      cid,
      order_id,
      application_key,
      merchant_id,
      domain,
      intent,
      locale: 'en-GB',
      currency: 'USD',
      amount: amount * 100,
      return_url,
      notification_url: notificationUrl,
      override_styles: 1,
      version,
      timestamp,
      customer_data: {
        first_name,
        last_name,
        country,
        phone: `${userData?.telephonePrefix}${userData?.telephone}`,
        city: billingDetails.city,
        street: billingDetails.city,
        address: billingDetails.city,
        state: userData?.state || 'N/A',
        zip: billingDetails.postalCode,
        email: userData?.email || 'N/A',
      },
    };

    const signature = this.signature(cid, timestamp, intent, order_id, method);
    return this.createPaymentURL(body, signature, method)
      .then((url) => {
        return { url, transaction };
      })
      .catch((error) => {
        throw new BadRequestException(error);
      });
  }

  async onStatusChange(transaction: Transaction, data: any) {
    const transaction_status = data?.transaction?.transaction_status;
    const status_details = data?.transaction?.status_details;
    const status = `Status Details:${status_details}, Status:${transaction_status}`;
    try {
      await this.updateData(data, transaction, transaction.user.id);
    } catch (error) {
      console.log('Error While Updating Transaction Data');
    }

    if (transaction_status === 'approved') {
      const trAmount: number = data?.transaction?.processed_amount;
      const trCurrencyAmount: number = data?.transaction?.amount;
      if(!data?.transaction?.conversion_rate){
        throw new BadRequestException('Conversion Rate is Required');
      }
      const conversion_rate: number = Number(data?.transaction?.conversion_rate);
      const trCurrency: string = data?.transaction?.currency;

      if(trCurrency !== "USD"){
        throw new BadRequestException('Only USD is Allowed is Transaction Currency');
      }

      if (!trAmount) {
        throw new BadRequestException('Amount not found');
      }

      if (!trCurrencyAmount) {
        throw new BadRequestException('Currency Amount not found');
      }

      //Converting Processed Amount Into USD amount by Conversion Rate
      let amount = trAmount;
      if(!conversion_rate || typeof conversion_rate !== "number" || isNaN(conversion_rate)){
        throw new BadRequestException("Conversion Rate not found")
      }else {
          amount = Number(((amount/conversion_rate)/100).toFixed(2))
      }

      // const norTrCurrencyAmount = Number((trCurrencyAmount/100).toFixed(2))
      // if(norTrCurrencyAmount !== amount){
      //   throw new BadRequestException("Amount mismatched")
      // }

      const depositFee = this.configService.getOrThrow('app.depositFee', {
        infer: true,
      });

      if (depositFee > amount) {
        throw new BadRequestException('Deposit Fee is greater than amount');
      }

      const isApproved = await this.transactionService.approveTransaction(
        transaction,
        amount,
        status,
      );
      if (isApproved) {
        this.transactionNotificationService.automaticTransactionApproved(
          transaction,
        );
        await this.transactionMailService.onDepositAutoSuccess(transaction);
      }
    } else if (
      transaction_status === 'rejected' ||
      transaction_status === 'declined' ||
      transaction_status === 'error'
    ) {
      await this.transactionService.failTransaction(transaction, status);
    } else {
      await this.transactionService.updateLastStatus(transaction, status);
    }
    return 'OK';
  }

  async updateData(data, transaction: Transaction, userId: number) {
    const paymentClientName: string = `${data?.customer?.first_name} ${data?.customer?.last_name}`;
    const pspTransactionId = data?.transaction?.transaction_id;
    const subPspName = data?.transaction?.payment_processor || 'N/A';
    let psp: PSP | null = null;

    let pspDisplayName = subPspName;
    const payload: any = {
      paymentClientName,
      pspTransactionId,
      subPspName,
    };
    if (subPspName !== 'N/A') {
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
        const aggregator = await this.aggregatorService.getPraxisAggregator();
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

      const isEWalletTransaction =
        transaction.method?.method === Methods.E_WALLET;
      const isCryptoPayment = transaction.method?.method === Methods.CRYPTO;
      const isCardPayment = data?.session?.payment_method === 'Credit Card';

      if (isCardPayment) {
        const cardData = data?.transaction?.card;
        if (cardData) {
          const cardDetails = {
            type: cardData?.card_type,
            number: cardData?.card_number,
            holderName: cardData?.card_holder,
            expiration: cardData?.card_exp,
          };
          if (
            cardDetails?.expiration &&
            cardDetails.expiration &&
            cardDetails.type
          ) {
            let holderName = cardData?.card_holder;
            if (!holderName) {
              holderName = `${data?.customer?.first_name} ${data?.customer?.last_name}`;
            }
            const card = await this.userCreditCardService.create(
              { ...cardDetails, holderName },
              userId,
            );
            payload.creditCardDetailsId = card.id;
          }
        }
      } else if (isEWalletTransaction) {
        const eWalletId = data?.transaction?.wallet?.account_identifier;
        const name = data?.transaction?.payment_processor;
        const first_name = data?.customer?.first_name;
        const last_name = data?.customer?.last_name;
        let title;
        if (first_name && last_name) {
          title = `${first_name} ${last_name}`;
        }
        const eWalletDetails = {
          title,
          eWalletId,
          name,
        };
        if (
          eWalletDetails?.eWalletId &&
          eWalletDetails?.name &&
          eWalletDetails.title
        ) {
          const eWallet = await this.userEWalletService.create(
            eWalletDetails,
            userId,
          );
          payload.userEWalletId = eWallet.id;
        }
      } else if (isCryptoPayment) {
        const cryptoCoinName =
          data?.transaction?.wallet?.data?.paid_amount_crypto_currency;
        const network = data?.transaction?.wallet?.data?.transactions_0_network;
        const clientWalletAddress =
          data?.transaction?.wallet?.account_identifier;
        const companyWalletAddress =
          data?.transaction?.wallet?.data?.output_address;
        const customParam1 = data?.transaction?.wallet?.wallet_token;
        const cryptoHashReference =
          data?.transaction?.wallet?.data?.transactions_0_txid;
        if (cryptoCoinName) {
          payload.cryptoCoinName = cryptoCoinName;
        }
        if (clientWalletAddress) {
          payload.clientWalletAddress = clientWalletAddress;
        }
        if (customParam1) {
          payload.customParam1 = customParam1;
        }
        if (network) {
          payload.network = network;
        }
        if (companyWalletAddress) {
          payload.companyWalletAddress = companyWalletAddress;
        }
        if (cryptoHashReference) {
          payload.cryptoHashReference = cryptoHashReference;
        }
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

    await this.transactionService.update(
      {},
      transaction.id,
      undefined,
      {
        ...payload,
      },
    );
  }

  async getStatus(transaction: Transaction) {
    return;
    const { application_key, merchant_id, version, api_url } = this.config(transaction.method.method);
    const timestamp = Math.floor(Date.now() / 1000);
    const order_id = transaction.id;
    const method = transaction.method.method;
    const cid = transaction.user.id.toString();
    const apiUrl = api_url.replace("cashier/cashier", "agent/find-order")
    const intent = 'payment';
    const signature = this.signature(cid, timestamp, intent, order_id, method);

    const requestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Gt-Authentication': signature,
      },
    };

    const body = {
      merchant_id,
      application_key,
      order_id,
      version,
      timestamp,
    }
    const { data } = await this.httpService.axiosRef.post(apiUrl, body, requestConfig);
    console.log("STATUS DATA" , data)
    return data;
  }
}
