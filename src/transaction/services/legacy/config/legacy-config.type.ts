export type LegacyAPIConfig = {
  apiBaseUrl?: string;
  createTransactionEndpoint?: string;
  preferredPsp?: string;
};

export interface ICreateLegacyTransactionPayload {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
  customerCountry: string;
  customerCity: string;
  customerCardHolderZIP: string;
  type: 'CC' | 'CR';
  paymentAmount: number;
  paymentCurrency: 'AED';
  countrycode: string;
  mobilenumber: string;
  orderCurrency: string;
  channelId: string;
  customerId: string;
  merchantType: string;
  merchantId: string;
  orderID: string;
  orderDescription: string;
  merchantLogo?: string;
  crmRefID: string;
  host: string;
  app: string;
}

export interface ICreateLegacyTransaction {
  userId: number;
  walletId: number;
  email: string;
  amount: number;
  host: string;
  app: string;
}
