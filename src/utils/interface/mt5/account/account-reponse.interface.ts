// Define the ApiData interface
export interface ApiData {
  AppID: string;
  ID: string;
  ValueInt: string;
  ValueUInt: string;
  ValueDouble: string;
}

// Define the Result interface
export interface AccountData {
  Login: string;
  Group: string;
  CertSerialNumber: string;
  Rights: string;
  MQID: string;
  Registration: string;
  LastAccess: string;
  LastPassChange: string;
  LastIP: string;
  Name: string;
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Company: string;
  Account: string;
  Country: string;
  Language: string;
  ClientID: string;
  City: string;
  State: string;
  ZipCode: string;
  Address: string;
  Phone: string;
  Email: string;
  ID: string;
  Status: string;
  Comment: string;
  Color: string;
  PhonePassword: string;
  Leverage: string;
  Agent: string;
  LimitPositions: string;
  LimitOrders: string;
  CurrencyDigits: string;
  Balance: string;
  Credit: string;
  InterestRate: string;
  CommissionDaily: string;
  CommissionMonthly: string;
  CommissionAgentDaily: string;
  CommissionAgentMonthly: string;
  BalancePrevDay: string;
  BalancePrevMonth: string;
  EquityPrevDay: string;
  EquityPrevMonth: string;
  TradeAccounts: string;
  ApiData: ApiData[];
  LeadCampaign: string;
  LeadSource: string;
  FreeMargin: string;
}
