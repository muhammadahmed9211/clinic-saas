import {
  forwardRef,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { HttpService } from '@nestjs/axios';
import {
  ICreateLegacyTransaction,
  ICreateLegacyTransactionPayload,
} from './config/legacy-config.type';
import { BillingInformationService } from 'src/billing-information/billing-information.service';
import { Methods } from 'src/transaction/entities/transaction-method.entity';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { PSP, PspNames } from 'src/transaction/entities/psp.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  RequestVia,
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';

type Event = 'FAILED' | 'COMPLETED';
@Injectable()
export class LegacyService {
  constructor(
    @Inject(forwardRef(() => TransactionService))
    private readonly transactionService: TransactionService,
    private readonly httpService: HttpService,
    private readonly billingInformationService: BillingInformationService,
    private readonly pspRepository: PspRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async createTransaction(dto: ICreateLegacyTransaction) {
    const { userId, walletId, amount, email } = dto;

    const base_url = this.configService.getOrThrow('legacy.apiBaseUrl', {
      infer: true,
    });

    const create_transaction = this.configService.getOrThrow(
      'legacy.createTransactionEndpoint',
      {
        infer: true,
      },
    );

    let url = `${base_url}/${create_transaction}`;
    console.log(url, 'URL');
    const preferredPsp = this.configService.getOrThrow('legacy.preferredPsp', {
      infer: true,
    });
    if (preferredPsp !== 'none') {
      url = `${url}?psp=${preferredPsp}`;
    }

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }

    const country = billingDetails.country;

    const method = Methods.CREDIT_CARD;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.NONE,
      },
    });
    const finalizeAmount = (amount / 3.67).toFixed(2);
    const transaction = await this.transactionService.create(
      {
        currency: 'USD',
        country,
        amount: Number(finalizeAmount),
        method,
        userId,
        psp,
        walletId: walletId,
        initiatedById: userId,
        requestVia: RequestVia.CLIENT_AREA,
      },

      TransactionType.DEPOSIT,
    );
    const [customerFirstName, customerLastName = ''] =
      billingDetails?.name?.split(' ');
    const orderDescription = 'Marketing Services';
    const countryCode = billingDetails?.phone?.split(' ') || [];
    const body: ICreateLegacyTransactionPayload = {
      customerFirstName,
      customerLastName,
      customerEmail: email,
      customerCountry: country,
      customerCity: billingDetails.city,
      customerCardHolderZIP: billingDetails.postalCode,
      type: 'CC',
      paymentAmount: amount,
      paymentCurrency: 'AED',
      countrycode: countryCode[0].replace('+', ''),
      mobilenumber: countryCode[1],
      orderCurrency: 'AED',
      channelId: 'WEB',
      customerId: transaction.id,
      merchantType: 'ECOMMERCE',
      merchantId: '1707722858922',
      orderID: transaction.id,
      orderDescription,
      crmRefID: transaction.id,
      app: dto.app,
      host: dto.host,
    };

    const { data } = await this.httpService.axiosRef.post(url, body, config);
    const paymentPsp = data?.data?.psp;
    let updatedPsp: PSP | null = null;
    if (paymentPsp) {
      if (paymentPsp.includes('DPO')) {
        updatedPsp = await this.pspRepository.findOne({
          where: {
            name: PspNames.DPO,
          },
        });
      } else if (paymentPsp.includes('Paytap')) {
        updatedPsp = await this.pspRepository.findOne({
          where: {
            name: PspNames.EPay,
          },
        });
      } else if (paymentPsp.includes('GENIUS')) {
        updatedPsp = await this.pspRepository.findOne({
          where: {
            name: PspNames.N_GENIUS,
          },
        });
      }
      if (updatedPsp) {
        await this.transactionRepository.update(transaction.id, {
          psp: {
            id: updatedPsp.id,
          },
        });
      }
    }
    if (data?.data?.result?.url) {
      let url = data?.data?.result?.url;
      if (url?.includes('payments/checkout')) {
        const params = new URLSearchParams({
          email,
          orderAmount: amount.toString(),
          orderCurrency: 'AED',
          channelId: 'WEB',
          customerId: transaction.id,
          merchantType: 'ECOMMERCE',
          merchantId: '1707722858922',
          countrycode: countryCode[0].replace('+', ''),
          mobilenumber: countryCode[1],
          orderID: transaction.id,
          orderDescription,
        });

        const sanitizeUrl = url?.replace(/\/+$/, '');
        const urlWithParams = `${sanitizeUrl}?${params.toString()}`;
        url = urlWithParams;
      }
      return { url, transaction };
    } else {
      throw new UnprocessableEntityException(
        'Error occurred while trying to create transaction',
      );
    }
  }

  async onChangeEvent(transaction: Transaction, event: Event) {
    if (event === 'COMPLETED') {
      await this.transactionService.approveTransaction(
        transaction,
        transaction.amount,
      );
      return 'OK';
    } else if (event === 'FAILED') {
      await this.transactionRepository.update(transaction.id, {
        status: TransactionStatus.FAILED,
      });
      return 'OK';
    }
  }

  async getDpoPaymentStatus(transaction: Transaction) {
    const base_url = this.configService.getOrThrow('legacy.apiBaseUrl', {
      infer: true,
    });

    const url = `${base_url}/payments/dpopay/status`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await this.httpService.axiosRef.post(
      url,
      { id: transaction.id },
      config,
    );
    const paidAmount = Number(data.amount) / 3.67;
    const fixed = paidAmount.toFixed(2);
    if (data.isPaid) {
      await this.transactionService.approveTransaction(
        transaction,
        Number(fixed),
      );
    }
    return data;
  }
}
