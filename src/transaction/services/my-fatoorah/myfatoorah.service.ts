import { HttpService } from '@nestjs/axios';
import {
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
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { ClientsService } from 'src/users/clients.service';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { TransactionUtilsService } from '../utils/utils.service';
import {
  CreateMyFatoorahDto,
  IMyFatoorahCreate,
  IOnMyFatoorahStatusChange,
} from '.';
import { ITransactionInfo } from 'src/transaction/dto/create-transaction.dto';

@Injectable()
export class MyFatoorahService {
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

  private get config() {
    const apiKey = this.configService.getOrThrow('myFatoorah.apiKey', {
      infer: true,
    });
    const apiUrl = this.configService.getOrThrow('myFatoorah.apiUrl', {
      infer: true,
    });

    const callbackUrl = this.configService.getOrThrow(
      'myFatoorah.callbackUrl',
      {
        infer: true,
      },
    );

    const errorUrl = this.configService.getOrThrow('myFatoorah.errorUrl', {
      infer: true,
    });

    const paymentMethodId = this.configService.getOrThrow(
      'myFatoorah.paymentMethodId',
      {
        infer: true,
      },
    );

    return {
      apiKey,
      apiUrl,
      callbackUrl,
      errorUrl,
      paymentMethodId,
    };
  }

  get headers() {
    const { apiKey } = this.config;
    const config = {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };
    return config;
  }

  async createTransaction(dto: CreateMyFatoorahDto, info:ITransactionInfo) {
    const { amount, userId, walletId } = dto;
    const { apiUrl, callbackUrl, errorUrl, paymentMethodId } = this.config;
    const url = `${apiUrl}/v2/ExecutePayment`;
    const aedAmount = this.transactionUtilsService.convertUSDToAED(amount);

    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const country = billingDetails.country;

    const method = TransactionMethods.CREDIT_CARD;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.MyFatoorah,
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

    const body: IMyFatoorahCreate = {
      InvoiceValue: Number(aedAmount),
      PaymentMethodId: Number(paymentMethodId),
      Language: 'en',
      // ErrorUrl: errorUrl,
      // CallBackUrl: callbackUrl,
      CustomerReference: transaction.id,
      DisplayCurrencyIso: 'AED',
    };
    console.log(callbackUrl, errorUrl);
    try {
      // const initiateUrl = `${apiUrl}/v2/InitiatePayment`;
      // const initiateBody = {
      //   InvoiceAmount: body.InvoiceValue,
      //   currencyIso: 'AED',
      // };

      // const { data: initiateData } = await this.httpService.axiosRef.post(
      //   initiateUrl,
      //   initiateBody,
      //   this.headers,
      // );
      const { data } = await this.httpService.axiosRef.post(
        url,
        body,
        this.headers,
      );
      console.log(data , "My Fatoorah Response")
      try {
        const invoiceId = data?.Data?.InvoiceId;
        if (invoiceId) {
          await this.transactionRepository.update(transaction.id, {
            hash: invoiceId.toString(),
          });
        }
      } catch (error) {
        console.error(error);
      }
      return { url: data?.Data?.PaymentURL, transaction };
    } catch (error) {
      console.log(error);
      await this.transactionService.delete(transaction.id);
      throw error;
    }
  }

  async onStatusChange(
    dto: IOnMyFatoorahStatusChange,
    transaction: Transaction,
  ) {
    const { Data } = dto;
    const { Amount , Transaction, Invoice } = Data;
    const { Card } = Transaction;
    const currency = Amount?.PayCurrency;
    const amount = Amount?.ValueInPayCurrency;
    const status = Transaction?.Status;
    const invoiceStatus = Invoice?.Status;

    const isPaid = invoiceStatus === 'PAID' && status === 'SUCCESS';

    const tr = await this.transactionRepository.findOne({
      where: { id: transaction.id },
      relations: ['user'],
    });

    if (!currency || !amount) {
      throw new UnprocessableEntityException('Invalid Params');
    }

    if (isPaid) {
      let norAmount = Number(Number(amount).toFixed(2));

      if (currency !== 'AED') {
        throw new UnprocessableEntityException('Only AED is Allowed');
      }

      const number = Card.Number;
      const expiration = `${Card.ExpiryMonth}/${Card.ExpiryYear}`;
      const type = Card.Brand;
      const holderName = Card.NameOnCard;
      if (
        number &&
        expiration &&
        type &&
        holderName &&
        tr?.user?.id
      ) {
        const newCard = await this.userCreditCardService.create(
          {
            number,
            expiration,
            holderName,
            type,
          },
          tr.user.id,
        );
        if (newCard) {
          await this.transactionRepository.update(transaction.id, {
            creditCardDetails: { id: newCard.id },
          });
        }
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
    } else {
      if(status === 'FAILED'){
        const status = TransactionStatus.FAILED;
        await this.transactionRepository.update(transaction.id, { status });
      }
    }
  }
}
