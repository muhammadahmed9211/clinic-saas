export interface MT5DealData {
    Action: number
    Comment: string
    Commission: number
    ContractSize: number
    Deal?: number
    Dealer: number
    Digits: number
    DigitsCurrency: number
    Entry: number
    ExpertID: number
    ExternalID: string
    Fee: number
    Flags: number
    Gateway: string
    Login: number
    MarketAsk: number
    MarketBid: number
    MarketLast: number
    ModificationFlags: number
    Order: number
    PositionID: number
    Price: number
    PriceGateway: number
    PricePosition: number
    PriceSL: number
    PriceTP: number
    Print: string
    Profit: number
    ProfitRaw: number
    RateMargin: number
    RateProfit: number
    Reason: number
    Storage: number
    Symbol: string
    TickSize: number
    TickValue: number
    Time: number
    TimeMsc: number
    Value: number
    Volume: number
    VolumeClosed: number
    VolumeClosedExt: number
    VolumeExt: number
    // PartnerId: number
    // client: number
}


export interface CreateCommissionDealDto {
    clientLogin: number;
    ibLogin: number;
    commission: number;
    commissionType: string;
    dealId: string;
    symbol: string;
}