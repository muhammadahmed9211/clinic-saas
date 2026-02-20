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
import { TransactionService } from 'src/transaction/transaction.service';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { PspNames } from 'src/transaction/entities/psp.entity';
import { BillingInformationService } from 'src/billing-information/billing-information.service';
import { Methods as TransactionMethods } from 'src/transaction/entities/transaction-method.entity';
import { ClientsService } from 'src/users/clients.service';
import { ICreateDpo } from './config/dpo-config.type';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { ITransactionInfo } from 'src/transaction/dto/create-transaction.dto';

@Injectable()
export class DpoService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
    private readonly billingInformationService: BillingInformationService,
    private readonly pspRepository: PspRepository,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    private readonly transactionNotificationService: TransactionNotificationService,
    private readonly transactionMailService: TransactionMailService,
    private readonly userCreditCardService: UserCreditCardsService,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  private get config() {
    const apiUrl = this.configService.getOrThrow('dpo.apiUrl', {
      infer: true,
    });
    const companyToken = this.configService.getOrThrow('dpo.companyToken', {
      infer: true,
    });
    const companyRef = this.configService.getOrThrow('dpo.companyRef', {
      infer: true,
    });
    const serviceType = this.configService.getOrThrow('dpo.serviceType', {
      infer: true,
    });
    const serviceDescription = this.configService.getOrThrow(
      'dpo.serviceDescription',
      {
        infer: true,
      },
    );
    const paymentLink = this.configService.getOrThrow('dpo.paymentLink', {
      infer: true,
    });
    const redirectUrl = this.configService.getOrThrow('dpo.redirectUrl', {
      infer: true,
    });
    const backUrl = this.configService.getOrThrow('dpo.backUrl', {
      infer: true,
    });
    return {
      backUrl,
      redirectUrl,
      companyRef,
      serviceType,
      serviceDescription,
      paymentLink,
      companyToken,
      apiUrl,
    };
  }

  async createTransaction(dto: ICreateDpo, info:ITransactionInfo) {
    const { amount, userId, walletId } = dto;
    const {
      apiUrl,
      redirectUrl,
      paymentLink,
      companyRef,
      companyToken,
      backUrl,
      serviceDescription,
      serviceType,
    } = this.config;

    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const userData = await this.clientsService.findOne({ id: userId });
    const serviceDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const city = billingDetails.city;
    const country = billingDetails.country;
    const zip = billingDetails.postalCode;
    const email = userData?.email;
    const [fistName, lastName = ''] = billingDetails?.name?.split(' ');
    const currency = 'USD';
    const xmlBody = `<?xml version='1.0' encoding='utf-8'?>
        <API3G>
        <CompanyToken>${companyToken}</CompanyToken>
        <Request>createToken</Request>
        <Transaction>
            <PaymentAmount>${amount}</PaymentAmount>
            <PaymentCurrency>${currency}</PaymentCurrency>
            <customerCity>${city}</customerCity>
            <customerCountry>${country}</customerCountry>
            <customerFirstName>${fistName}</customerFirstName>
            <customerLastName>${lastName}</customerLastName>
            <customerEmail>${email}</customerEmail>
            <customerCardHolderZIP>${zip}</customerCardHolderZIP>
            <CompanyRef>${companyRef}</CompanyRef>
            <RedirectURL>${redirectUrl}</RedirectURL>
            <BackURL>${backUrl}</BackURL>
            <CompanyRefUnique>0</CompanyRefUnique>
            <PTL>5</PTL>
            <PTLtype>hours</PTLtype>
            <TransactionChargeType>1</TransactionChargeType>
            <TransactionSource>API</TransactionSource>
        </Transaction>
        <Services>
            <Service>
                <ServiceType>${serviceType}</ServiceType>
                <ServiceDescription>${serviceDescription}</ServiceDescription>
                <ServiceDate>${serviceDate}</ServiceDate>
            </Service>
        </Services>
      </API3G>`;

    const config = {
      headers: {
        'Content-Type': 'application/xml',
        accept: 'application/xml',
      },
    };
    let token: null | string = null;
    const { data } = await this.httpService.axiosRef.post(
      apiUrl,
      xmlBody,
      config,
    );
    try {
      token = data.match(/<TransToken>(.*?)<\/TransToken>/)[1];
    } catch (error) {
      console.error(error);
    }
    if (!data || !token) {
      throw new UnprocessableEntityException('Failed to create transaction');
    }

    const method = TransactionMethods.CREDIT_CARD;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.DPO,
      },
    });

    const transaction = await this.transactionService.create(
      {
        currency: 'USD',
        country,
        amount,
        method,
        hash: token,
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
    const url = `${paymentLink}${token}`;
    return {
      url,
      transaction,
    };
  }

  async onStatusChange(transaction: Transaction, data: any) {
    // const { companyToken, apiUrl } = this.config;

    // const config = {
    //   headers: {
    //     'Content-Type': 'application/xml',
    //     accept: 'application/xml',
    //   },
    // };

    // const xmlBody = `<?xml version="1.0" encoding="utf-8"?>
    // <API3G>
    //   <CompanyToken>${companyToken}</CompanyToken>
    //   <Request>verifyToken</Request>
    //   <TransactionToken>${token}</TransactionToken>
    // </API3G>`;

    // const { data } = await this.httpService.axiosRef.post(
    //   apiUrl,
    //   xmlBody,
    //   config,
    // );

    try {
      const result = data.match(
        /<ResultExplanation>(.*?)<\/ResultExplanation>/,
      )[1];
      const amount = data.match(
        /<TransactionAmount>(.*?)<\/TransactionAmount>/,
      )[1];
      const currency = data.match(
        /<TransactionCurrency>(.*?)<\/TransactionCurrency>/,
      )[1];
      if (currency !== 'USD') {
        throw new BadRequestException(`Currency ${currency} not allowed`);
      }
      const isPaid = result === 'Transaction Paid';

      if (isPaid) {
        try {
          const holderName = data.match(
            /<CustomerName>(.*?)<\/CustomerName>/,
          )[1];
          const number = data.match(
            /<CustomerCredit>(.*?)<\/CustomerCredit>/,
          )[1];
          const type = data.match(
            /<CustomerCreditType>(.*?)<\/CustomerCreditType>/,
          )[1];
          const expiration = 'N/A';
          if (transaction && transaction.user.id) {
            if (holderName && number && type) {
              const creditCard = await this.userCreditCardService.create(
                {
                  holderName,
                  number,
                  type,
                  expiration,
                },
                transaction.user.id,
              );
              if (creditCard) {
                await this.transactionRepository.update(transaction.id, {
                  creditCardDetails: { id: creditCard.id },
                });
              }
            }
          }
        } catch (error) {
          console.error(error);
        }

        const isApproved = await this.transactionService.approveTransaction(
          transaction,
          amount,
        );

        if (isApproved) {
          this.transactionNotificationService.automaticTransactionApproved(
            transaction,
          );
          await this.transactionMailService.onDepositAutoSuccess(transaction);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async callWebHooks(body: string) {
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

    const eventUrl = this.configService.getOrThrow('dpo.eventUrl', {
      infer: true,
    });

    const config = {
      headers: {
        'Content-Type': 'application/xml',
        accept: 'application/xml',
      },
    };

    const urls = [devUrl, qaUrl, stagingUrl, prodUrl].map((url) => {
      return `${url}/${eventUrl}`;
    });

    for await (const url of urls) {
      try {
        const { data } = await this.httpService.axiosRef.post(
          url,
          body,
          config,
        );
        console.log(`Webhook call to ${url} successful`, data);
      } catch (error) {
        console.log(`Webhook call to ${url} failed`, error);
      }
    }
  }
}
