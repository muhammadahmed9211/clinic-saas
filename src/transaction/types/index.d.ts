import { DeepPartial } from 'typeorm';
import { Exchange } from '../entities/exchange.entity';
import { PSP } from '../entities/psp.entity';
import { Methods } from '../entities/transaction-method.entity';
import { AdjustmentAccountType, AdjustmentType, RequestVia } from '../entities/transaction.entity';

export interface ICreateTransaction {
  amount: number;
  currency: string;
  userId: number;
  method: Methods;
  walletId?: number;
  login?: string;
  withdrawRequestId?: number;
  country?: string;
  isManual?: boolean;
  hash?: string;
  evidenceId?: string;
  cryptoHashReference?: string;
  externalTransactionId?: string;
  commentForUser?: string;
  internalComment?: string;
  withdrawalSubType?: string;
  userBankId?: number;
  companyBankId?: number;
  creditCardDetailsId?: number;
  pspTransactionId?: string;
  psp?: PSP | null;
  pspId?: number;
  internalReferenceNo?: string;
  tradingPlatformId?: string;
  cryptoClientWalletAddress?: string;
  cryptoCoinName?: string;
  paidCryptoCoin?: number;
  transactionNote?: string;
  internalNote?: string;
  userEWalletId?: number;
  exchange?: DeepPartial<Exchange> | null;
  exchangeId?: number | null;
  relatedTransactionId?: string;
  defaultStatus?: TransactionStatus;
  tradingPlatformBalance?: number;
  pspAccountNo?: string;
  brokerExternalId?: string;
  externalNote?: string;
  transferTo?: string;
  transferFrom?: string;
  network?: string;
  actionById?: number;
  requestVia: RequestVia;
  initiatedById: number;
  clientRemarks?: string;
  adjustmentType?: AdjustmentType;
  adjustmentAccountType?:AdjustmentAccountType,
  isClientVisible?:boolean,
  bonusCode?:string
  mt5AccountLogin?:string
  isNewTradingAccount?:boolean
}

export interface ICreateManualTransaction {
  walletId?: Wallet['id'];
  login?: string;
  externalTransactionId: string;
  commentForUser?: string;
  internalComment: string;
  pspId: number;
  creditCardDetailsId?: number;
  pspTransactionId?: string;
  evidenceId?: string;
  internalReferenceNo?: string;
  tradingPlatformId?: string;
  cryptoHashReference?: string;
  cryptoClientWalletAddress?: string;
  cryptoCoinName?: string;
  paidCryptoCoin?: number;
  userBankId?: number;
  companyBankId?: number;
  userEWalletId?: number;
  exchange?: DeepPartial<Exchange> | null;
  pspAccountNo?: string;
  brokerExternalId?: string;
  externalNote?: string;
}
export interface IUpdateTransactionDetails {
  pspTransactionId: string;
  paymentClientName: string;
  creditCardDetailsId: number;
  userEWalletId: number;
  cryptoCoinName: string;
  subPspName: string;
  pspId?: number;
  clientWalletAddress?: string;
  customParam1?: string;
  network?:string
  companyWalletAddress?:string
  cryptoHashReference?:string
}

export interface ITransactionClientInfo {
  partnerId: number | null;
  partnerName: string | null;

  salesDeskId: number | null;
  salesDeskName: string | null;

  retentionDeskId: number | null;
  retentionDeskName: string | null;

  salesManagerId: number | null;
  salesManagerName: string | null;

  retentionManagerId: number | null;
  retentionManagerName: string | null;

  salesRepId: number | null;
  salesRepName: string | null;

  retentionRepId: number | null;
  retentionRepName: string | null;

  officeId: number | null;
  officeName: string | null;

  leadSource: string | null;

  isTransferToRetention:boolean;
}