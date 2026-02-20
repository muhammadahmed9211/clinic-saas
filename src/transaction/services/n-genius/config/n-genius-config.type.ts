export type NGeniusConfig = {
  apiUrl?: string;
  companyToken?: string;
  outletReference?: string;
  redirectUrl?: string;
  backUrl?: string;
  eventUrl?: string;
  allowedCountries?:string[]
};

export interface ICreateNGenius {
  amount: number;
  userId: number;
  walletId: number;
}

export interface IOnStatusChange {
  order: {
    reference: string;
    amount: {
      currencyCode: string;
      value: number;
    };
  };
  eventName: string;
}
