import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AllConfigType } from 'src/config/config.type';
import { MailSenderType } from 'src/email/dto/mail.send.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { MailService } from 'src/mail/mail.service';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from 'src/transaction/entities/transaction.entity';
import { Client } from 'src/users/entities/client.entity';
import { Repository } from 'typeorm';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { User } from 'src/users/entities/user.entity';
import { Methods } from 'src/transaction/entities/transaction-method.entity';
import { BankDetail } from 'src/bank-details/entities/bank-detail.entity';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { WithdrawRequest } from 'src/transaction/entities/withdraw-request.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { ServerName, ServerType } from 'src/wallet/entities/server.entity';
import { TranscationStatusEnumAdded1716535044581 } from 'src/database/migrations/1716535044581-TranscationStatusEnumAdded';
import { SendEmailService } from 'src/common/services/send-email.service';

enum TransactionTemplateNames {
  WITHDRAW_REQUEST_APPROVED = 'WITHDRAW_REQUEST_APPROVED',
  WITHDRAW_REQUEST_REJECTED = 'WITHDRAW_REQUEST_REJECTION',
  WITHDRAW_REQUEST_DECLINE = 'WITHDRAW_REQUEST_DECLINE',
  WITHDRAW_REQUEST_CREATION = 'WITHDRAW_REQUEST_CREATION',
  WITHDRAW_REQUEST_CANCELLATION = 'WITHDRAW_REQUEST_CANCELLATION',
  MANUAL_DEPOSIT_APPROVED = 'DEPOSIT_MANUAL_APPROVED',
  MANUAL_DEPOSIT_REJECTION = 'DEPOSIT_MANUAL_REJECTION',
  DEPOSIT_AUTO_SUCCESS = 'DEPOSIT_AUTO_SUCCESS',
  TRANSFER_IN_AND_OUT = 'TRANSFER_IN_AND_OUT',
  TRANSACTION_EXPORT = 'TRANSACTION_EXPORT',
  SEND_TEXT_WITH_LINK = 'SEND_TEXT_WITH_LINK',
  DEPOSIT_CREDIT_CARD = 'DEPOSIT_CREDIT_CARD',
  DEPOSIT_BANK = 'DEPOSIT_BANK',
  DEPOSIT_BANK_CONFIRM = 'DEPOSIT_BANK_CONFIRM',
  DEPOSIT_CRYPTO_INSTANT = 'DEPOSIT_CRYPTO_INSTANT',
  DEPOSIT_CRYPTO_MANUAL = 'DEPOSIT_CRYPTO_MANUAL',
  DEPOSIT_CRYPTO_MANUAL_SUCCESS = 'DEPOSIT_CRYPTO_MANUAL_SUCCESS',
  DEPOSIT_CRYPTO_MANUAL_CREATION = 'DEPOSIT_CRYPTO_MANUAL_CREATION',
  WITHDRAW_REQUEST_BANK = 'WITHDRAW_REQUEST_BANK',
  WITHDRAW_REQUEST_CONFIRM = 'WITHDRAW_REQUEST_CONFIRM',
  WITHDRAW_REQUEST_CREDIT_CARD = 'WITHDRAW_REQUEST_CREDIT_CARD',
  WITHDRAW_REQUEST_CRYPTO = 'WITHDRAW_REQUEST_CRYPTO',
  WITHDRAW_REQUEST_WALLET = 'WITHDRAW_REQUEST_WALLET',
  BONUS_IN = 'BONUS_IN',
  BONUS_OUT = 'BONUS_OUT',
  CREDIT_IN = 'CREDIT_IN',
  CREDIT_OUT = 'CREDIT_OUT',
  WITHDRAW_REQUEST_CONFIRMATION_CRYPTO='WITHDRAW_REQUEST_CONFIRMATION_CRYPTO',
  WITHDRAW_REQUEST_CONFIRMATION_CREDIT_CARD = 'WITHDRAW_REQUEST_CONFIRMATION_CREDIT_CARD',
  WITHDRAW_REQUEST_APPROVAL_CRYPTO='WITHDRAW_REQUEST_APPROVAL_CRYPTO',
  WITHDRAW_REQUEST_DECLINE_V2 = 'WITHDRAW_REQUEST_DECLINE',

}

enum TransactionTemplateSubject {
  WITHDRAW_REQUEST_APPROVED = 'Withdrawal Request Approved',
  WITHDRAW_REQUEST_REJECTED = 'Withdrawl Request Rejected',
  WITHDRAW_REQUEST_DECLINE = 'Withdrawl Request Decline',
  WITHDRAW_REQUEST_CREATION = 'Withdrawl Request Created',
  WITHDRAW_REQUEST_CANCELLATION = 'Withdrawl Request Cancelled',
  MANUAL_DEPOSIT_APPROVED = 'Manual Deposit Approved',
  MANUAL_DEPOSIT_REJECTION = 'Manual Deposit Rejected',
  DEPOSIT_AUTO_SUCCESS = 'Deposit Successful',
  TRANSFER_IN_AND_OUT = 'Transfer Successful',
  TRANSACTION_EXPORT = 'Client Transaction Data Report - Ready for Download',
  NEW_MANUAL_BY_CLIENT = 'New Manual Deposit by Client',
  NEW_WITHDRAWAL_BY_CLIENT = 'New Withdrawal by Client',
  NEW_DEPOSIT_BY_CLIENT = 'New Deposit by Client',
  WITHDRAW_REQUEST_CONFIRMATION_CRYPTO='New Withdraw Request',
  DEPOSIT_CRYPTO_MANUAL_CREATION='New Withdraw Request',

  //eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPOSIT_CREDIT_CARD = 'Thank You for Your Payment!',
  //eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPOSIT_BANK = 'Thank You for Your Payment!',
  //eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPOSIT_BANK_CONFIRM = 'Thank You for Your Payment!',
  //eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPOSIT_CRYPTO_INSTANT = 'Thank You for Your Payment!',
  //eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPOSIT_CRYPTO_MANUAL = 'Thank You for Your Payment!',
  //eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DEPOSIT_CRYPTO_MANUAL_SUCCESS = 'Thank You for Your Payment!',
  WITHDRAW_REQUEST_BANK = 'Your Bank Withdrawal Request',
  WITHDRAW_REQUEST_CONFIRM = 'WITHDRAW_REQUEST_CONFIRM',
  WITHDRAW_REQUEST_CREDIT_CARD = 'Your Credit Card Withdrawal Request',
  WITHDRAW_REQUEST_CRYPTO = 'Your Crypto Withdrawal Request',
  WITHDRAW_REQUEST_WALLET = 'Your Wallet Withdrawal Request',
  BONUS_IN = 'Great News! Bonus Credited to Your Account!',
  BONUS_OUT = 'Important Information Regarding Your Trading Account',
  CREDIT_IN = 'Account Credit - Important Information Regarding Your Account',
  CREDIT_OUT = ' Great News! Bonus Credited to Your Account!',
  WITHDRAW_REQUEST_CONFIRMATION_CREDIT_CARD = 'WITHDRAW_REQUEST_CONFIRMATION_CREDIT_CARD',
  WITHDRAW_REQUEST_APPROVAL_CRYPTO='WITHDRAW_REQUEST_APPROVAL_CRYPTO',
  WITHDRAW_REQUEST_DECLINE_V2 = 'WITHDRAW_REQUEST_DECLINE',


}

interface ISendTransactionEmail {
  transaction: Transaction;
  title: string;
  template: TransactionTemplateNames;
  data?: { [key: string]: string | undefined };
  userId?: number;
  email?: string;
  skipCommunication?:boolean
  isV2Template?:boolean
}
interface ISendTransactionsExportEmail {
  title: string;
  template: TransactionTemplateNames;
  data?: object;
  userId?: number;
  url?: string;
}

interface ISendTransactionTextEmail {
  transaction: Transaction;
  text: string;
  subject: string;
  email?: string;
}

@Injectable()
export class TransactionMailService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(Mt5Account)
    private mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    private readonly mailService: MailService,
    private readonly sendEmailService:SendEmailService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(BankDetail)
    private readonly bankDetailRepository: Repository<BankDetail>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(WithdrawRequest)
    private readonly withdrawRequestRepository: Repository<WithdrawRequest>,
  ) {}

  promisefy(promise: Promise<any>) {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    promise.then().catch();
  }

  async send(data: ISendTransactionEmail) {
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    const { transaction, title, template } = data;
    const userId = transaction?.user?.id;
    const operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });
    if (userId && operator &&operator.id) {
      const client = await this.clientRepository.findOne({
        where: { userId },
        relations:{
          regulation:true
        }
      });
      if (client?.email) {
        if(!data.isV2Template){
          await this.mailerService.sendEmail({
            skipCommunication:data?.skipCommunication || false,
            from: MailSenderType.NO_REPLY,
            to: data.email || client?.email,
            subject: title,
            context: {
              title: title,
              actionTitle: title,
              app_name,
              firstName: client?.firstName,
              ...(data?.data ? { ...data.data } : {}),
            },
            templateName: template,
            userId: client.userId,
            regulation: client?.regulations,
            regulationId: client?.regulation?.id,
            ...(data?.data ? { ...data.data } : {}),
          });
        }else {
          await this.sendEmailService.sendEmailToClient({
            entityName: 'transaction',
            entityValue: transaction.id,
            createdForId: userId,
            emailEventName: template,
            operatorId: operator.id,
          });
          
        }
      }
    }
  }

  async sendEmailToOperator(
    operatorId: number,
    transactionId: string,
    userType: string,
    userRefId: number,
    client: Client,
    userId: number,
    title: TransactionTemplateSubject,
  ) {
    const clientFullName = `${client.firstName}  ${client.lastName}`;
    const baseUrl = this.configService.get('app.crmFrontEndUrl', {
      infer: true,
    });

    const app_name = this.configService.get('app.name', {
      infer: true,
    });

    const transaction = await this.transactionRepository.findOne({
      where: { id: transactionId },
      loadEagerRelations: false,
    });

    const operator = await this.operatorRepository.findOne({
      where: { id: Number(operatorId) },
    });

    if (!transaction || !operator) {
      return;
    }

    const mt5Accounts = await this.mt5AccountRepository.find({
      where: {
        user: { id: userId },
        server: {
          type: ServerType.MT5,
          name: ServerName.LIVE,
        },
      },
    });

    let mt5AccountList = '';
    mt5Accounts.forEach((account) => {
      if (mt5AccountList) {
        mt5AccountList = `${mt5AccountList}, ${account.login}`;
      } else {
        mt5AccountList = account.login.toString();
      }
    });
    if (!mt5AccountList) {
      mt5AccountList = 'N/A';
    }

    const withdrawalFee = this.configService.getOrThrow('app.withdrawalFee', {
      infer: true,
    });

    const depositFee = this.configService.getOrThrow('app.depositFee', {
      infer: true,
    });

    let paidAmount = transaction?.netAmount;
    const trPaidAmount = transaction.paidAmount || transaction.amount;
    if (!paidAmount) {
      if (transaction?.type === TransactionType.DEPOSIT) {
        paidAmount = trPaidAmount - depositFee;
      } else if (transaction?.type === TransactionType.WITHDRAW) {
        paidAmount = trPaidAmount - withdrawalFee;
      }
    }

    const type =
      transaction.type === TransactionType.DEPOSIT ? 'deposit' : 'withdrawal';
    const isApproved = transaction.status === TransactionStatus.APPROVED;
    const content = `It is to inform you that a new ${type} request has been made by a ${userType}. Please assist with this matter at your earliest convenience.`;
    const linkText = 'Click here to review';
    const userLink = `${baseUrl}/${userType}s/${userRefId}`;
    const link = `${userLink}?fid=${transactionId}`;
    const userTypeTitle = userType.charAt(0).toUpperCase() + userType.slice(1);
    const data = {
      link,
      linkText,
      text: content,
      userRefId: userRefId.toString(),
      clientFullName,
      type: type.toUpperCase(),
      status: isApproved ? 'Approved' : 'Created',
      amount: transaction.amount.toString(),
      paidAmount: paidAmount.toString(),
      mt5AccountList,
      userLink,
      userType: userTypeTitle,
    };

    let cc: string[] = [];
    if(client.officeId){
      const excludeOfficeIds = this.configService.get('app.financialEmailCCExcluseOfficeIds', {
        infer: true,
      });

      if(excludeOfficeIds){
        const isExist = excludeOfficeIds.find((officeId) => officeId === client.officeId);
        if(!isExist){
          const ccList = this.configService.get('app.financialCCList', {
            infer: true,
          });
          if(ccList?.length){
            cc = ccList
          }
        }
      }
    }

      if (operator?.email && clientFullName) {
      await this.mailerService.sendEmail({
        from: MailSenderType.NO_REPLY,
        skipCommunication:true,
        to: operator?.email,
        cc,
        subject: title,
        context: {
          title: title,
          actionTitle: title,
          app_name,
          firstName: clientFullName,
          ...data,
        },
        templateName: 'SEND_TRANSACTION_EMAIL_TO_OPERATOR',
        userId: userId,
        ...data,
      });
    }
  }

  async sendEmailToRetentionAndSalesRep(
    transaction: Transaction,
    isApproved: boolean,
    isManual: boolean,
  ) {
    const userId = transaction?.user?.id;
    if (!userId) {
      return;
    }
    console.log(isApproved);

    const client = await this.clientRepository.findOne({
      where: { userId },
    });

    if (!client) {
      return;
    }



    const userTypes = {
      lead: 'lead',
      registered: 'lead',
      applicant: 'applicant',
      client: 'client',
    };

    const userType = userTypes[client?.userLifeCycle] || 'client';

    const refId = userType === 'lead' ? client?.leadId : userId;
    if (!refId) {
      return;
    }

    const salesRepId = client?.salesRepId;
    const retentionRepId = client?.retentionRepId;

    let title = TransactionTemplateSubject.NEW_MANUAL_BY_CLIENT;
    if (!isManual) {
      title = TransactionTemplateSubject.NEW_DEPOSIT_BY_CLIENT;
    }
    const isWithdrawal = transaction.type === TransactionType.WITHDRAW;
    if (isWithdrawal) {
      title = TransactionTemplateSubject.NEW_WITHDRAWAL_BY_CLIENT;
    }

    if (title && userType) {
      const userTypeTitle =
        userType.charAt(0).toUpperCase() + userType.slice(1);
      title = title.replace(
        'Client',
        userTypeTitle,
      ) as TransactionTemplateSubject;
    }

    const transactionId = transaction?.id;
    const clientName = `${client.firstName}  ${client.lastName}`;

    if (salesRepId) {
      await this.sendEmailToOperator(
        salesRepId,
        transactionId,
        userType,
        refId,
        client,
        userId,
        title,
      );
    }

    if (retentionRepId) {
      await this.sendEmailToOperator(
        retentionRepId,
        transactionId,
        userType,
        refId,
        client,
        userId,
        title,
      );
    }
  }

  async sendTransactionExport(data: ISendTransactionsExportEmail) {
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    const { title, template, url } = data;

    const client = await this.userRepository.findOne({
      where: { id: data.userId, isOperator: true },
    });
    if (client?.email) {
      await this.mailerService.sendEmail({
        from: MailSenderType.NO_REPLY,
        skipCommunication:true,
        to: client?.email,
        subject: title,
        context: {
          title: title,
          actionTitle: title,
          app_name,
          firstName: client?.firstName as any,
          url,
        },
        templateName: template,
        userId: client.id,
        ...(data?.data ? { ...data.data } : {}),
      });
    }
  }

  async sendText(data: ISendTransactionTextEmail) {
    const operator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });
    const supportEmail = this.configService.getOrThrow('mail.supportEmail', {
      infer: true,
    });
    const userId = data?.transaction?.user?.id;
    if (operator?.id && userId && supportEmail) {
      await this.mailService.sendTextViaEmail({
        to: supportEmail,
        data: {
          skipCommunication:true,
          text: data.text,
          subject: data.subject,
          userId,
          operatorId: operator.id,
          languageIso: 'en',
        },
      });
    }
  }

  async onWithdrawApproval(tr: Transaction) {
    let title = TransactionTemplateSubject.WITHDRAW_REQUEST_CONFIRM;
    let template = TransactionTemplateNames.WITHDRAW_REQUEST_CONFIRM;
    let isV2Template = false;
    const transaction = await this.transactionRepository.findOne({
      where: {
        id: tr.id,
      },
      relations: {
        userBank: true,
        withdrawRequest: true,
        method: true,
        user: true,
        creditCardDetails: true,
        eWallet: true,
      },
    });
    const data: any = {
      amount: transaction?.amount,
      method: transaction?.method?.method,
      date: new Date().toDateString(),
      referenceNo: transaction?.id,
    };
    let lastFourDigits;
    if (transaction?.method?.method === Methods.WIRE) {
      let userBank: any = null;
      if (transaction?.userBank) {
        userBank = transaction?.userBank;
      } else if (transaction?.withdrawRequest?.bankDetail) {
        userBank = transaction?.withdrawRequest?.bankDetail;
      }
      if (userBank) {
        lastFourDigits = userBank.iban.substring(userBank.iban.length - 4);
      }
    } else if (transaction?.method?.method === Methods.CREDIT_CARD) {
      if (transaction?.creditCardDetails) {
        lastFourDigits = transaction?.creditCardDetails?.number;
      }
    } else if (transaction?.method?.method === Methods.E_WALLET) {
      if (transaction?.eWallet) {
        lastFourDigits = transaction?.eWallet?.title;
      }
    } else if (transaction?.method?.method === Methods.CRYPTO) {
      title = TransactionTemplateSubject.WITHDRAW_REQUEST_APPROVAL_CRYPTO;
      template = TransactionTemplateNames.WITHDRAW_REQUEST_APPROVAL_CRYPTO;
      isV2Template = true;
      if (transaction?.cryptoClientWalletAddress) {
        lastFourDigits = transaction?.cryptoClientWalletAddress;
      }
    }
    if (data && transaction && lastFourDigits) {
      console.log(transaction, data);
      this.promisefy(
        this.send({
          transaction,
          title,
          template,
          data: { ...data, lastFourDigits },
          isV2Template
        }),
      );
    }
  }

  async onManualDepositCreation(transaction: Transaction) {
    const transactionId = transaction?.id;
    const userId = transaction?.user?.id;
    const baseUrl = this.configService.get('app.crmFrontEndUrl', {
      infer: true,
    });
    const link = `${baseUrl}/clients/${userId}?fid=${transactionId}`;
    const text = `I am writing to inform you about a new manual deposit made by a client. Please assist with this matter at your earliest convenience.`;
    const linkText = 'Click here to review';
    const data = {
      link,
      linkText,
      text,
    };
    const supportEmail = this.configService.getOrThrow('mail.supportEmail', {
      infer: true,
    });
    const title = TransactionTemplateSubject.NEW_MANUAL_BY_CLIENT;

    const template = TransactionTemplateNames.SEND_TEXT_WITH_LINK;
    this.promisefy(
      this.send({ transaction, title, template, data, email: supportEmail, skipCommunication:true }),
    );

    if (transaction?.method?.method === Methods.CRYPTO) {
      const title = TransactionTemplateSubject.DEPOSIT_CRYPTO_MANUAL_CREATION;
      const template = TransactionTemplateNames.DEPOSIT_CRYPTO_MANUAL_CREATION;
      const payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          amount: transaction?.amount?.toString(),
          coin: transaction?.cryptoCoinName || 'N/A', //to be changed
          network: transaction?.network || 'N/A', //to be changed
          clientWalletAddress: transaction?.cryptoClientWalletAddress || 'N/A', //to be changed,
          paymentHashReference: transaction?.cryptoHashReference,
        },
      };
      this.promisefy(this.send(payload));
    } else if (transaction?.method?.method === Methods.WIRE) {
      const userBank = await this.bankDetailRepository.findOne({
        where: {
          id: transaction?.userBank?.id,
        },
      });
      const companyBank = await this.bankAccountRepository.findOne({
        where: {
          id: transaction?.companyBank?.id,
        },
      });
      const title = TransactionTemplateSubject.DEPOSIT_BANK;
      const template = TransactionTemplateNames.DEPOSIT_BANK;
      const payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          currency: transaction?.currency,
          amount: transaction?.amount?.toString(),
          bankName: userBank?.name || 'N/A',
          accountName: userBank?.beneficiaryName || 'N/A',
          transferFromBank: userBank?.iban || 'N/A',
          transferToBank: companyBank?.bankName,
          transactionTime: transaction?.createdAt.toDateString(),
        },
      };
      this.promisefy(this.send(payload));
    }
  }

  onWithdrawRejection(transaction: Transaction) {
    const title = TransactionTemplateSubject.WITHDRAW_REQUEST_DECLINE_V2;
    const template = TransactionTemplateNames.WITHDRAW_REQUEST_DECLINE_V2;
    this.promisefy(this.send({ transaction, title, template  , isV2Template:true}));
  }

  onWithdrawCreation(transaction: Transaction) {
    let data: any = null;
    let isV2Template = false;
    let title, template;
    if (transaction.method?.method === Methods.WIRE) {
      title = TransactionTemplateSubject.WITHDRAW_REQUEST_BANK;
      template = TransactionTemplateNames.WITHDRAW_REQUEST_BANK;
      const userBank = transaction?.withdrawRequest?.bankDetail;
      data = {
        walletId: transaction?.wallet?.id?.toString(),
        currency: transaction?.currency,
        amount: transaction?.amount?.toString(),
        bankName: userBank?.name || 'N/A',
        accountName: userBank?.beneficiaryName || 'N/A',
        transferFromBank: userBank?.iban || 'N/A',
        transactionTime: transaction?.createdAt.toDateString(),
      };
    } else if (transaction.method?.method === Methods.CRYPTO) {
      title = TransactionTemplateSubject.WITHDRAW_REQUEST_CRYPTO;
      template = TransactionTemplateNames.WITHDRAW_REQUEST_CONFIRMATION_CRYPTO;
      data = {
        amount: transaction?.amount?.toString(),
        walletAddress: transaction?.cryptoClientWalletAddress || 'N/A',
        refId:transaction.id,
        netAmount:transaction.netAmount,
        walletId: transaction?.wallet?.id?.toString(),
        coin: transaction?.cryptoCoinName || 'N/A',
        network: transaction?.network || 'N/A',
        transactionDate: transaction?.createdAt.toDateString(),
      };
    } else if (transaction.method?.method === Methods.E_WALLET) {
      title = TransactionTemplateSubject.WITHDRAW_REQUEST_WALLET;
      template = TransactionTemplateNames.WITHDRAW_REQUEST_WALLET;
      data = {
        walletId: transaction?.wallet?.id?.toString(),
        amount: transaction?.amount?.toString(),
        pspName: transaction?.eWallet?.title,
        walletAddress: transaction?.eWallet?.eWalletId,
        transactionDate: transaction?.createdAt.toDateString(),
      };
    }
    else if (transaction.method?.method === Methods.CREDIT_CARD) {
      isV2Template = true;
      const creditCard = transaction?.creditCardDetails;
      title = TransactionTemplateSubject.WITHDRAW_REQUEST_CONFIRMATION_CREDIT_CARD;
      template = TransactionTemplateNames.WITHDRAW_REQUEST_CONFIRMATION_CREDIT_CARD;
      data = {
        walletId: transaction?.wallet?.id?.toString(),
        currency: transaction?.currency,
        amount: transaction?.amount?.toString(),
        cardType: creditCard?.type,
        lastFourDigits: creditCard?.number,
        accountHolderName: creditCard?.holderName,
        transactionDate: transaction?.createdAt.toDateString(),
      };
    }

    if (data && title && template) {
      this.promisefy(
        this.send({
          transaction,
          title,
          template,
          data,
          isV2Template
        }),
      );
    }
  }

  onWithdrawCancellation(transaction: Transaction) {
    const title = TransactionTemplateSubject.WITHDRAW_REQUEST_CANCELLATION;
    const template = TransactionTemplateNames.WITHDRAW_REQUEST_CANCELLATION;
    this.promisefy(this.send({ transaction, title, template }));
  }

  async onManualDepositApproval(tr: Transaction, method?: string) {
    let payload;
    let title;
    let template;
    const transaction = await this.transactionRepository.findOne({
      where: { id: tr.id },
      relations: {
        method: true,
        wallet: true,
        creditCardDetails: true,
        userBank: true,
        companyBank: true,
        user: true,
      },
    });

    const checkMethod = transaction?.method?.method || method;
    if (checkMethod === Methods.CREDIT_CARD) {
      title = TransactionTemplateSubject.DEPOSIT_CREDIT_CARD;
      template = TransactionTemplateNames.DEPOSIT_CREDIT_CARD;
      payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          currency: transaction?.currency,
          amount: transaction?.amount?.toString(),
          cardType: transaction?.creditCardDetails?.type,
          last4Digits: transaction?.creditCardDetails?.number,
          transactionTime: transaction?.createdAt.toDateString(),
        },
      };
    } else if (checkMethod === Methods.WIRE) {
      title = TransactionTemplateSubject.DEPOSIT_BANK_CONFIRM;
      template = TransactionTemplateNames.DEPOSIT_BANK_CONFIRM;
      const userBank = transaction?.userBank;
      const companyBank = transaction?.companyBank;
      payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          currency: transaction?.currency,
          amount: transaction?.amount?.toString(),
          bankName: userBank?.name || 'N/A',
          accountName: userBank?.beneficiaryName || 'N/A',
          transferFromBank: userBank?.iban || 'N/A',
          transferToBank: companyBank?.bankName,
          transactionTime: transaction?.createdAt.toDateString(),
        },
      };
    } else if (checkMethod === Methods.CRYPTO) {
      title = TransactionTemplateSubject.DEPOSIT_CRYPTO_MANUAL_SUCCESS;
      template = TransactionTemplateNames.DEPOSIT_CRYPTO_MANUAL_SUCCESS;
      payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          amount: transaction?.amount?.toString(),
          coin: transaction?.cryptoCoinName || 'N/A', //to be changed
          network: transaction?.network || 'N/A', //to be changed
          clientWalletAddress: transaction?.cryptoClientWalletAddress || 'N/A', //to be changed,
          paymentHashReference: transaction?.cryptoHashReference,
        },
      };
    }
    // console.clear();
    console.log(payload, title, template);
    if (payload && title && template) {
      this.promisefy(this.send(payload));
    }
  }

  onManualDepositRejection(transaction: Transaction) {
    const title = TransactionTemplateSubject.MANUAL_DEPOSIT_REJECTION;
    const template = TransactionTemplateNames.MANUAL_DEPOSIT_REJECTION;
    this.promisefy(this.send({ transaction, title, template }));
  }

  async onDepositAutoSuccess(transaction: Transaction) {
    let payload;
    let title;
    let template;

    if (transaction.method.method === Methods.CREDIT_CARD) {
      const tr = await this.transactionRepository.findOne({
        where: { id: transaction.id },
        loadEagerRelations: false,
        relations: { user: true, creditCardDetails: true },
      });
      if (tr) {
        transaction.user = tr.user;
      }

      title = TransactionTemplateSubject.DEPOSIT_CREDIT_CARD;
      template = TransactionTemplateNames.DEPOSIT_CREDIT_CARD;
      payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          currency: transaction?.currency,
          amount: transaction?.amount?.toString(),
          cardType: tr?.creditCardDetails?.type || "NIL",
          last4Digits: tr?.creditCardDetails?.number || "NIL",
          transactionTime: tr?.createdAt.toDateString(),
        },
      };
    } else if (transaction.method.method === Methods.CRYPTO) {
      title = TransactionTemplateSubject.DEPOSIT_CRYPTO_INSTANT;
      template = TransactionTemplateNames.DEPOSIT_CRYPTO_INSTANT;
      payload = {
        transaction,
        title,
        template,
        data: {
          walletId: transaction?.wallet?.id?.toString(),
          amount: transaction?.amount?.toString(),
          coin: transaction?.cryptoCoinName || 'N/A', //to be changed
          network: transaction?.network || 'N/A', //to be changed
          clientWalletAddress: transaction?.cryptoClientWalletAddress || 'N/A', //to be changed,
          paymentHashReference: transaction?.cryptoHashReference,
        },
      };
    }
    if (payload && title && template) {
      this.promisefy(this.send(payload));
    }
    this.promisefy(
      this.sendEmailToRetentionAndSalesRep(transaction, true, false),
    );
  }

  onTransferInOut(transaction: Transaction) {
    const title = TransactionTemplateSubject.TRANSFER_IN_AND_OUT;
    const template = TransactionTemplateNames.TRANSFER_IN_AND_OUT;

    let walletId;
    let lastFourDigits;
    let accountType;
    let lastFourDigitsTradingAccount;
    if (transaction?.transferFrom?.includes('MT5')) {
      walletId = 'MT5 - ' + transaction.mt5Account?.server?.name;
      lastFourDigits = transaction?.mt5Account.login;
    } else if (
      transaction?.transferFrom?.includes('Wallet') ||
      transaction?.transferTo?.includes('WALLET')
    ) {
      walletId = 'Wallet';
      lastFourDigits = transaction?.wallet.id;
    }

    if (transaction?.transferTo?.includes('MT5')) {
      accountType = 'MT5 - ' + transaction.mt5Account?.server?.name;
      lastFourDigitsTradingAccount = transaction?.mt5Account.login;
    } else if (
      transaction?.transferTo?.includes('Wallet') ||
      transaction?.transferTo?.includes('WALLET')
    ) {
      accountType = 'Wallet';
      lastFourDigitsTradingAccount = transaction?.wallet.id;
    }

    const data = {
      amount: transaction.amount.toString(),
      date: transaction.createdAt.toDateString(),
      time: transaction.createdAt.toTimeString(),
      walletId,
      lastFourDigits,
      accountType,
      lastFourDigitsTradingAccount,
    };
    console.clear();
    console.log(data, 'DATA', transaction.transferTo);
    if (
      walletId &&
      lastFourDigits &&
      accountType &&
      lastFourDigitsTradingAccount
    ) {
      this.promisefy(this.send({ transaction, title, template, data }));
    }
  }

  onTransactionExport(userId: number, url: string) {
    const title = TransactionTemplateSubject.TRANSACTION_EXPORT;
    const template = TransactionTemplateNames.TRANSACTION_EXPORT;
    this.promisefy(
      this.sendTransactionExport({ title, template, userId, url }),
    );
  }

  onBonusInAndOut(transaction: Transaction) {
    let title, template;
    if (transaction.type === TransactionType.BONUS_IN) {
      title = TransactionTemplateSubject.BONUS_IN;
      template = TransactionTemplateNames.BONUS_IN;
    } else if (transaction.type === TransactionType.BONUS_OUT) {
      title = TransactionTemplateSubject.BONUS_OUT;
      template = TransactionTemplateNames.BONUS_OUT;
    }
    const mt5 = transaction.mt5Account;
    const data = {
      amount: transaction.amount.toString(),
      accountType: 'MT5 - ' + mt5?.server?.name,
      lastFourDigitsTradingAccount: mt5.login.substring(mt5.login.length - 4),
      date: transaction.createdAt.toDateString(),
      time: transaction.createdAt.toTimeString(),
    };
    if (mt5 && mt5?.server) {
      if (title && template) {
        this.promisefy(this.send({ title, template, transaction, data }));
      }
    }
  }

  onCreditInAndOut(transaction: Transaction) {
    let title, template;
    if (transaction.type === TransactionType.CREDIT_IN) {
      title = TransactionTemplateSubject.CREDIT_IN;
      template = TransactionTemplateNames.CREDIT_IN;
    } else if (transaction.type === TransactionType.CREDIT_OUT) {
      title = TransactionTemplateSubject.CREDIT_OUT;
      template = TransactionTemplateNames.CREDIT_OUT;
    }
    const mt5 = transaction.mt5Account;

    const data = {
      amount: transaction.amount.toString(),
      date: transaction.createdAt.toDateString(),
      lastFourDigits: mt5.login.substring(mt5.login.length - 4),
    };
    if (title && template) {
      this.promisefy(this.send({ title, template, transaction, data }));
    }
  }
}
