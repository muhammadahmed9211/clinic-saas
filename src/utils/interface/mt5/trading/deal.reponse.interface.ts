interface ApiDataItem {
  AppID: string;
  ID: string;
  ValueInt: string;
  ValueUInt: string;
  ValueDouble: string;
}

export interface DealData {
  Deal: string;
  ExternalID: string;
  Login: string;
  Dealer: string;
  Order: string;
  Action: string;
  Entry: string;
  Reason: string;
  Digits: string;
  DigitsCurrency: string;
  ContractSize: string;
  Time: string;
  TimeMsc: string;
  Symbol: string;
  Price: string;
  Volume: string;
  VolumeExt: string;
  Profit: string;
  Storage: string;
  Commission: string;
  Fee: string;
  RateProfit: string;
  RateMargin: string;
  ExpertID: string;
  PositionID: string;
  Comment: string;
  ProfitRaw: string;
  PricePosition: string;
  PriceSL: string;
  PriceTP: string;
  VolumeClosed: string;
  VolumeClosedExt: string;
  TickValue: string;
  TickSize: string;
  Flags: string;
  Gateway: string;
  PriceGateway: string;
  ModifyFlags: string;
  Value: string;
  ApiData: ApiDataItem[];
  MarketBid: string;
  MarketAsk: string;
  MarketLast: string;
}
