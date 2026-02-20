export type JenaPayConfig = {
  merchantKey?: string;
  password?: string;
  checkoutUrl?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export interface ICreateJenaPay {
  amount: number;
  userId: number;
  walletId: number;
}

export interface IOnStatusChange {
  order_number: string;
  order_amount:string;
  order_currency:string
  order_status:string;
  type:string;
  status:string
  card:string;
  card_expiration_date:string;
  hash:string
}
