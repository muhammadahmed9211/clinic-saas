interface ApiDataItem {
  AppID: string;
  ID: string;
  ValueInt: string;
  ValueUInt: string;
  ValueDouble: string;
}

export interface PositionData {
  Position: string;
  ExternalID: string;
  Login: string;
  Dealer: string;
  Symbol: string;
  Action: string;
  Digits: string;
  DigitsCurrency: string;
  Reason: string;
  ContractSize: string;
  TimeCreate: string;
  TimeUpdate: string;
  TimeCreateMsc: string;
  TimeUpdateMsc: string;
  ModifyFlags: string;
  PriceOpen: string;
  PriceCurrent: string;
  PriceSL: string;
  PriceTP: string;
  Volume: string;
  VolumeExt: string;
  Profit: string;
  Storage: string;
  RateProfit: string;
  RateMargin: string;
  ExpertID: string;
  ExpertPositionID: string;
  Comment: string;
  ActivationMode: string;
  ActivationTime: string;
  ActivationPrice: string;
  ActivationFlags: string;
  ApiData: ApiDataItem[];
}
