import { SinglePaymentMethod } from 'src/transaction/dto/create-transaction.dto';

interface CustomerData {
  country: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  zip: string;
  state: string;
  city: string;
  address: string;
  street: string;
}

type Intent = 'payment' | 'withdrawal';

type Locale = 'USD';

type OverrideStyles = 1 | 0;

export interface IPraxisCreate {
  cid: string;
  application_key: string;
  domain: string;
  merchant_id: string;
  intent: Intent;
  locale: 'en-GB';
  version: string;
  timestamp: number;
  order_id?: string;
  override_styles: OverrideStyles;
  customer_data: CustomerData;
  currency?: Locale;
  amount: number;
  return_url?: string;
  notification_url?: string;
}

export interface IPraxisCreateTransaction {
  amount: number;
  walletId: number;
  single_payment_method: SinglePaymentMethod;
}
