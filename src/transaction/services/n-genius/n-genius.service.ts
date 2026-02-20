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
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { PspNames } from 'src/transaction/entities/psp.entity';
import { BillingInformationService } from 'src/billing-information/billing-information.service';
import { Methods as TransactionMethods } from 'src/transaction/entities/transaction-method.entity';
import { ICreateNGenius, IOnStatusChange } from './config/n-genius-config.type';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { ClientsService } from 'src/users/clients.service';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { TransactionUtilsService } from '../utils/utils.service';
import { ITransactionInfo } from 'src/transaction/dto/create-transaction.dto';

interface INgeniusCreate {
  action: string;
  amount: { currencyCode: string; value: number };
  emailAddress?: string | null;
  merchantAttributes?: {
    redirectUrl?: string;
  };
}

@Injectable()
export class NGeniusService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
    private readonly billingInformationService: BillingInformationService,
    private readonly pspRepository: PspRepository,
    private readonly transactionRepository: TransactionRepository,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    private readonly transactionNotificationService: TransactionNotificationService,
    private readonly transactionMailService: TransactionMailService,
    private readonly userCreditCardService: UserCreditCardsService,
    private readonly transactionUtilsService: TransactionUtilsService,
  ) {}

  get config() {
    const apiUrl = this.configService.getOrThrow('nGenius.apiUrl', {
      infer: true,
    });
    const companyToken = this.configService.getOrThrow('nGenius.companyToken', {
      infer: true,
    });
    const outletReference = this.configService.getOrThrow(
      'nGenius.outletReference',
      {
        infer: true,
      },
    );
    const redirectUrl = this.configService.getOrThrow('nGenius.redirectUrl', {
      infer: true,
    });
    const backUrl = this.configService.getOrThrow('nGenius.backUrl', {
      infer: true,
    });

    const allowedCountries = this.configService.getOrThrow('nGenius.allowedCountries', {
      infer: true,
    });
    return {
      backUrl,
      redirectUrl,
      outletReference,
      companyToken,
      apiUrl,
      allowedCountries
    };
  }

  async getAccessToken(): Promise<string> {
    const { apiUrl, companyToken } = this.config;
    const url = `${apiUrl}/identity/auth/access-token`;
    const config = {
      headers: {
        'Content-Type': 'application/vnd.ni-identity.v1+json',
        Authorization: `Basic ${companyToken}`,
      },
    };

    const { data } = await this.httpService.axiosRef.post(url, {}, config);
    const access_token = data?.access_token;
    if (!access_token) {
      throw new UnprocessableEntityException(
        'An error occurred  while trying to authenticate',
      );
    }
    return access_token;
  }

  async createTransaction(dto: ICreateNGenius, info:ITransactionInfo) {
    const { amount, userId, walletId } = dto;
    const { apiUrl, outletReference, redirectUrl } = this.config;
    const access_token = await this.getAccessToken();
    const userData = await this.clientsService.findOne({ id: userId });
    const url = `${apiUrl}/transactions/outlets/${outletReference}/orders`;
    const aedAmount = this.transactionUtilsService.convertUSDToAED(amount);
    const norAmount = (aedAmount * 100).toFixed(2);

    const body: INgeniusCreate = {
      action: 'PURCHASE',
      amount: { currencyCode: 'AED', value: Number(norAmount) },
      emailAddress: userData?.email,
    };

    if (redirectUrl !== 'N/A') {
      body.merchantAttributes = {
        redirectUrl,
      };
    }
    const config = {
      headers: {
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        Accept: 'application/vnd.ni-payment.v2+json',
        Authorization: `Bearer ${access_token}`,
      },
    };
    const { data } = await this.httpService.axiosRef.post(url, body, config);
    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const country = billingDetails.country;

    const method = TransactionMethods.CREDIT_CARD;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.N_GENIUS,
      },
    });

    const transaction = await this.transactionService.create(
      {
        currency: 'USD',
        country,
        amount,
        method,
        userId,
        psp,
        hash: data.reference,
        pspTransactionId: data.reference,
        walletId,
        initiatedById: userId,
        requestVia: RequestVia.CLIENT_AREA,
        ...info
      },
      TransactionType.DEPOSIT,
    );

    if (!transaction) {
      throw new UnprocessableEntityException('An error occurred');
    }

    return {
      url: data._links.payment?.href,
      transaction,
    };
  }

  async onStatusChange(dto: IOnStatusChange, transaction: Transaction) {
    const { order, eventName } = dto;
    const currency = order?.amount?.currencyCode;
    const amount = order?.amount?.value;
    const failedStatus = {
      DECLINED:true,
      AUTHORISATION_FAILED:true,
      FULL_AUTH_REVERSAL_FAILED:true,
      PURCHASE_DECLINED:true,
      PURCHASE_FAILED:true,
      CAPTURE_FAILED:true,
      CAPTURE_VOIDED:true,
      CAPTURE_VOID_FAILED:true,
      CANCELLED:true,
      PARTIAL_CAPTURE_FAILED:true,
      GATEWAY_RISK_PRE_AUTH_REJECTED:true,
      PRE_AUTH_FRAUD_CHECK_REJECTED:true,
      POST_AUTH_FRAUD_CHECK_REJECTED:true
    }
    if (!order || !currency || !amount) {
      throw new UnprocessableEntityException('Invalid Params');
    }
    if (eventName === 'PURCHASED') {
      // if (transaction?.currency !== currency) {
      //   throw new UnprocessableEntityException(
      //     'Transaction amount or currency differs',
      //   );
      // }

      try {
        if (
          //@ts-expect-error data from webhook
          Array.isArray(dto?.order._embedded?.payment) &&
          //@ts-expect-error data from webhook
          dto?.order._embedded?.payment?.length
        ) {
          //@ts-expect-error data from webhook
          const data = dto?.order._embedded?.payment[0];
          const savedCard = data?.paymentMethod;
          if (
            savedCard &&
            savedCard?.pan &&
            savedCard?.expiry &&
            savedCard?.cardholderName &&
            savedCard?.name
          ) {
            const tr = await this.transactionRepository.findOne({
              where: { id: transaction.id },
              relations: ['user'],
            });
            if (tr) {
              const newCard = await this.userCreditCardService.create(
                {
                  number: savedCard?.pan,
                  expiration: savedCard?.expiry,
                  holderName: savedCard?.cardholderName,
                  type: savedCard?.name,
                },
                tr.user.id,
              );
              if (newCard) {
                await this.transactionRepository.update(transaction.id, {
                  creditCardDetails: { id: newCard.id },
                });
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      let norAmount = Number((amount / 100).toFixed(2));
      if (currency !== 'AED' && currency !== 'USD') {
        throw new UnprocessableEntityException('Only AED and USD is Allowed');
      }

      if (currency === 'AED') {
        norAmount = this.transactionUtilsService.convertAEDToUSD(norAmount);
      }
      if (norAmount !== transaction.amount) {
        throw new UnprocessableEntityException('Amount mismatch');
      }
      const isApproved = await this.transactionService.approveTransaction(
        transaction,
        norAmount,
      );
      if (isApproved) {
        this.transactionNotificationService.automaticTransactionApproved(
          transaction,
        );

        await this.transactionMailService.onDepositAutoSuccess(transaction);
      }
    }
    else if(failedStatus[eventName]){
      const tr = await this.transactionRepository.findOne({where:{id:transaction.id}, loadEagerRelations:false})
      if(tr?.status !== TransactionStatus.APPROVED){
        const status = TransactionStatus.FAILED;
        await this.transactionRepository.update(transaction.id, { status });
      }
    }
  }

  async callWebHooks(body: any) {
    const devUrl = this.configService.getOrThrow('app.restApiDevUrl', {
      infer: true,
    });
    const qaUrl = this.configService.getOrThrow('app.restApiQAUrl', {
      infer: true,
    });
    const stagingUrl = this.configService.getOrThrow('app.restApiStagingUrl', {
      infer: true,
    });
    const prodUrl = this.configService.getOrThrow('app.restApiProdUrl', {
      infer: true,
    });

    const eventUrl = this.configService.getOrThrow('nGenius.eventUrl', {
      infer: true,
    });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };

    const urls = [devUrl, qaUrl, stagingUrl, prodUrl].map((url) => {
      return `${url}/${eventUrl}`;
    });

    let isSuccess = false;
    for await (const url of urls) {
      try {
        const { data } = await this.httpService.axiosRef.post(
          url,  
          body,
          config,
        );
        isSuccess = true;
        console.log(`Webhook call to ${url} successful`, data);
      } catch (error) {
        console.log(`Webhook call to ${url} failed`, error);
      }
    }
    return isSuccess ? 'OK' : 'DONE';
  }

  async getStatus(referenceId:string){
    const { apiUrl, outletReference } = this.config;
    const access_token = await this.getAccessToken();
    const config = {
      headers: {
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        Accept: 'application/vnd.ni-payment.v2+json',
        Authorization: `Bearer ${access_token}`,
      },
    };
    const url = `${apiUrl}/transactions/outlets/${outletReference}/orders/${referenceId}`;
    const { data } = await this.httpService.axiosRef.get(url, config);
    if(!data){
      throw new BadRequestException("Data not found")
    }
    const eventName = data?._embedded?.payment[0]?.state;
    if(!eventName){
      throw new BadRequestException("Event name not found")
    }
    const order= data;
    return {
      eventName,
      order
    };
  }
}
