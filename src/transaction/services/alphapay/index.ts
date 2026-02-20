import { COINS, STANDARDS } from 'src/transaction/dto/create-transaction.dto';

type CurrencyIso = 'USD';

export interface IAlphaPayCreate {
  unit: COINS;
  standard?: STANDARDS;
  amount: number;
  tid: string;
  cid: string;
}
export interface IAlphaPayCreateTransaction {
  currency: COINS;
  standard?: STANDARDS;
  notes?: string;
  amount: number;
  walletId: number;
}

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETE = 'Complete',
  INCOMPLETE = 'Incomplete',
  OVERPAY = 'Overpay',
}
