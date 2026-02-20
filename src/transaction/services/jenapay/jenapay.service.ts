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
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { ClientsService } from 'src/users/clients.service';
import { TransactionNotificationService } from '../transcation-notification/transaction-notification.service';
import { TransactionMailService } from '../transcation-email/transaction-mail.service';
import { UserCreditCardsService } from 'src/user-credit-cards/user-credit-cards.service';
import { TransactionUtilsService } from '../utils/utils.service';
import crypto from 'crypto';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { User } from 'src/users/entities/user.entity';
import { ICreateJenaPay, IOnStatusChange } from './config/jenapay-config.type';
import { ITransactionInfo } from 'src/transaction/dto/create-transaction.dto';

@Injectable()
export class JenaPayService {
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
    const merchantKey = this.configService.get('jenapay.merchantKey', {
      infer: true,
    });

    const password = this.configService.get('jenapay.password', {
      infer: true,
    });


    const checkoutUrl = this.configService.get('jenapay.checkoutUrl', {
      infer: true,
    });

    const frontendDomain = this.configService.get('app.frontendDomain', {
      infer: true,
    });

    const baseSuccessUrl = this.configService.get('jenapay.successUrl', {
      infer: true,
    });

    const baseCancelUrl = this.configService.get('jenapay.cancelUrl', {
      infer: true,
    });

    const successUrl = `${frontendDomain}${baseSuccessUrl}`;
    const cancelUrl = `${frontendDomain}${baseCancelUrl}`;

    return {
      merchantKey,
      successUrl,
      cancelUrl,
      password,
      checkoutUrl,
    };
  }

  private getHash(
    number: string,
    amount: string,
    currency: string,
    description: string,
  ): string {
    const { password } = this.config;
    const combined = (
      number +
      amount +
      currency +
      description +
      password
    ).toUpperCase();
    const md5Hash = crypto
      .createHash('md5')
      .update(combined, 'utf8')
      .digest('hex');
    const sha1Hash = crypto
      .createHash('sha1')
      .update(md5Hash, 'utf8')
      .digest('hex');
    return sha1Hash;
  }

  private getCreateTransactionPayload(
    amount: number,
    transactionId: string,
    billingDetails: BillingInformation,
    userData: User,
  ) {
    const { merchantKey, successUrl, cancelUrl } = this.config;

    const currency = 'USD';
    const methods = ['card'];
    const operation = 'purchase';
    const description = `Client Deposit ${userData.id}`;
    const orderAmount = amount.toFixed(2)
    const hash = this.getHash(
      transactionId,
      orderAmount,
      currency,
      description,
    );
    const payload = {
      merchant_key: merchantKey,
      operation,
      methods,
      order: {
        number: transactionId,
        amount: orderAmount,
        currency,
        description,
      },
      cancel_url: cancelUrl,
      success_url: successUrl,
      customer: {
        name: billingDetails.name,
        email: userData?.email,
      },
      billing_address: {
        country: billingDetails.country,
        city: billingDetails.city,
        address: billingDetails.address,
        zip: billingDetails.postalCode,
        phone: billingDetails.phone,
      },
      hash,
    };
    return payload;
  }

  async createTransaction(dto: ICreateJenaPay , info:ITransactionInfo) {
    const { userId, walletId } = dto;
    const amount = Number(dto.amount.toFixed(2))
    const { checkoutUrl } = this.config;

    const billingDetails = await this.billingInformationService.findOne(userId);
    if (!billingDetails) {
      throw new UnprocessableEntityException('User billing details not found');
    }
    const userData = await this.clientsService.findOne({ id: userId });

    if (!userData) {
      throw new BadRequestException('User Data Not Found');
    }

    const url = `${checkoutUrl}/api/v1/session`;

    const country = billingDetails.country;

    const method = TransactionMethods.CREDIT_CARD;

    const psp = await this.pspRepository.findOne({
      where: {
        name: PspNames.JENAPAY,
      },
    });

    const hashBuffer = crypto.randomBytes(16);

    const genHash = crypto.createHash('sha256');
    genHash.update(hashBuffer);

    const hash = genHash.digest('hex');

    const genMd5Hash = crypto.createHash('md5');
    genMd5Hash.update(hash);

    const md5Hash = genMd5Hash.digest('hex');
    const body = this.getCreateTransactionPayload(
      amount,
      md5Hash,
      billingDetails,
      userData,
    );
    console.log(body , "JENA PAY PAYLOAD")
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let paymentUrl = null;
    try {
      const { data } = await this.httpService.axiosRef.post(url, body, config);
      if (data?.redirect_url) {
        paymentUrl = data.redirect_url;
      } else {
        throw new BadRequestException('Payment URL not found in response');
      }
    } catch (error) {
      console.error(error, 'JENAPAY ERROR');
      throw new BadRequestException(error);
    }

    const transaction = await this.transactionService.create(
      {
        currency: 'USD',
        country,
        amount,
        method,
        userId,
        psp,
        hash: md5Hash,
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
      url: paymentUrl,
      transaction,
    };
  }

  async onStatusChange(body: IOnStatusChange, transaction: Transaction) {
    const { order_amount, order_currency, order_number } = body;
    console.log(body , "BODY")
    if (!order_number) {
      throw new UnprocessableEntityException('order_number not found');
    }

    if (!order_currency) {
      throw new UnprocessableEntityException('order_currency not found');
    }

    if (!order_amount) {
      throw new UnprocessableEntityException('order_amount not found');
    }

    if (transaction?.currency !== order_currency) {
      throw new UnprocessableEntityException('Transaction currency differs');
    }

    if (transaction?.amount !== Number(order_amount)) {
      throw new UnprocessableEntityException('Transaction amount differs');
    }

    const { user } = transaction;
    const holderName = `${user.firstName} ${user.lastName}`;
    const userId = user.id;

    try {
      if (body.card && body.card_expiration_date) {
        // TODO:DISCUSS TYPE NOT BEING SENT
        const newCard = await this.userCreditCardService.create(
          {
            number: body?.card,
            expiration: body?.card_expiration_date,
            holderName,
            type: 'N/A',
          },
          userId,
        );
        if (newCard) {
          await this.transactionRepository.update(transaction.id, {
            creditCardDetails: { id: newCard.id },
          });
        }
      }
    } catch (error) {
      console.error('ERROR WHILE CREATING USER CREDIT CARD - JENA PAY', error);
    }
    const isPaid = body.status === 'success' && body.type === 'sale';
    if (isPaid) {
      const isApproved = await this.transactionService.approveTransaction(
        transaction,
        Number(order_amount),
      );

      if (isApproved) {
        this.transactionNotificationService.automaticTransactionApproved(
          transaction,
        );
        await this.transactionMailService.onDepositAutoSuccess(transaction);
      }
    }
  }
}
