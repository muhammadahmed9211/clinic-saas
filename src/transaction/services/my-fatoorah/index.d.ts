interface CustomerAddress {
  Block: string;
  Street: string;
  HouseBuildingNo: string;
  AddressInstructions: string;
}

type DisplayCurrencyIso = 'AED';

export interface IMyFatoorahCreate {
  PaymentMethodId: number;
  CustomerName?: string;
  DisplayCurrencyIso: DisplayCurrencyIso;
  MobileCountryCode?: string;
  CustomerMobile?: string;
  CustomerEmail?: string;
  InvoiceValue: number;
  Language: string;
  CustomerReference: string;
  CallBackUrl?: string;
  ErrorUrl?: string;
  CustomerAddress?: CustomerAddress;
}

export interface CreateMyFatoorahDto {
  userId: number;
  walletId: number;
  amount: number;
}
interface Invoice {
    Status:string
    ExternalIdentifier:string
}

interface Data {
  Invoice:Invoice
  Amount:Amount
  Transaction:Transaction
  Invoice:Invoice
}

interface Amount {
  PayCurrency:string,
  ValueInPayCurrency:string
}

interface Transaction {
  Status:string
  Card:Card
}

interface Card {
  NameOnCard:string,
  Number:string,
  ExpiryMonth:string,
  ExpiryYear:string,
  Brand:string
}

interface Invoice {
  Status:string
}

export interface IOnMyFatoorahStatusChange {
  Data: Data;
}
