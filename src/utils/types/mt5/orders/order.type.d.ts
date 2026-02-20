export type TradingOpenCloseTicket = {
  Order: string;
  ExternalID: string;
  Login: string;
  Dealer: string;
  Symbol: string;
  Digits: string;
  DigitsCurrency: string;
  ContractSize: string;
  State: string;
  Reason: string;
};

export type TradingOpenPaged = {
  retcode: string;
  answer: Order[];
};

export type DealTicket = {
  retcode: string;
  answer: {
    Deal: string;
    ExternalID: string;
    Login: string;
    Dealer: string;
    Order: string;
    Action: string;
    Entry: string;
    Reason: string;
  };
};

export type OpenMultipleResponse = {
  retcode: string;
  answer: Order[];
};

export type UpdateOrderResponse = {
  retcode: string;
  answer: Order;
};

export type Order = {
  Order: number;
  ExternalID: string;
  Login: number;
  Dealer: number;
  Symbol: string;
  Digits: number;
  DigitsCurrency: number;
  ContractSize: number;
  State: number;
  Reason: number;
  TimeSetup: number;
  TimeExpiration: number;
  TimeDone: number;
  Type: number;
  TypeFill: number;
  TypeTime: number;
  PriceOrder: number;
  PriceTrigger: number;
  PriceCurrent: number;
  PriceSL: number;
  PriceTP: number;
  VolumeInitial: number;
  VolumeInitialExt: number;
  VolumeCurrent: number;
  VolumeCurrentExt: number;
  ExpertID: number;
  PositionID: number;
  PositionByID: number;
  Comment: string;
  ActivationMode: number;
  ActivationTime: number;
  ActivationPrice: number;
  ActivationFlags: number;
  TimeSetupMsc: number;
  TimeDoneMsc: number;
  RateMargin: number;
  ModificationFlags: number;
};
