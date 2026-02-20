export type DpoConfig = {
  apiUrl?: string;
  companyToken?: string;
  companyRef?: string;
  redirectUrl?: string;
  backUrl?: string;
  serviceType?: string;
  serviceDescription?: string;
  paymentLink?: string;
  eventUrl?: string;
};

export interface ICreateDpo {
  amount: number;
  userId: number;
  walletId: number;
}

export interface IOnStatusChange {
  token: string;
}
