/**
 * Market Symbol Information Interfaces
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */

export interface SessionData {
  Open: string; // Minutes from midnight (e.g., "0" = 00:00, "60" = 01:00)
  Close: string; // Minutes from midnight (e.g., "1440" = 24:00, "1439" = 23:59)
}

export interface MT5Symbol {
  Symbol: string;
  Path: string;
  ISIN: string;
  CFI: string;
  Category: string;
  Exchange: string;
  Description: string;
  International: string;
  Sector: string;
  Industry: string;
  Country: string;
  Basis: string;
  Source: string;
  Page: string;
  CurrencyBase: string;
  CurrencyBaseDigits: string;
  CurrencyProfit: string;
  CurrencyProfitDigits: string;
  CurrencyMargin: string;
  CurrencyMarginDigits: string;
  Color: string;
  ColorBackground: string;
  Digits: string;
  Point: string;
  Multiply: string;
  TickFlags: string;
  TickBookDepth: string;
  TickChartMode: string;
  SubscriptionsDelay: string;
  FilterSoft: string;
  FilterSoftTicks: string;
  FilterHard: string;
  FilterHardTicks: string;
  FilterDiscard: string;
  FilterSpreadMax: string;
  FilterSpreadMin: string;
  FilterGap: string;
  FilterGapTicks: string;
  TradeMode: string;
  TradeFlags: string;
  CalcMode: string;
  ExecMode: string;
  GTCMode: string;
  FillFlags: string;
  ExpirFlags: string;
  OrderFlags: string;
  Spread: string;
  SpreadBalance: string;
  SpreadDiff: string;
  SpreadDiffBalance: string;
  TickValue: string;
  TickSize: string;
  ContractSize: string;
  StopsLevel: string;
  FreezeLevel: string;
  QuotesTimeout: string;
  VolumeMin: string;
  VolumeMinExt: string;
  VolumeMax: string;
  VolumeMaxExt: string;
  VolumeStep: string;
  VolumeStepExt: string;
  VolumeLimit: string;
  VolumeLimitExt: string;
  MarginFlags: string;
  MarginInitial: string;
  MarginMaintenance: string;
  MarginInitialBuy: string;
  MarginInitialSell: string;
  MarginInitialBuyLimit: string;
  MarginInitialSellLimit: string;
  MarginInitialBuyStop: string;
  MarginInitialSellStop: string;
  MarginInitialBuyStopLimit: string;
  MarginInitialSellStopLimit: string;
  MarginMaintenanceBuy: string;
  MarginMaintenanceSell: string;
  MarginMaintenanceBuyLimit: string;
  MarginMaintenanceSellLimit: string;
  MarginMaintenanceBuyStop: string;
  MarginMaintenanceSellStop: string;
  MarginMaintenanceBuyStopLimit: string;
  MarginMaintenanceSellStopLimit: string;
  MarginLiquidity: string;
  MarginHedged: string;
  MarginCurrency: string;
  SwapMode: string;
  SwapLong: string;
  SwapShort: string;
  SwapFlags: string;
  Swap3Day: string;
  SwapYearDay: string;
  SwapRateSunday: string;
  SwapRateMonday: string;
  SwapRateTuesday: string;
  SwapRateWednesday: string;
  SwapRateThursday: string;
  SwapRateFriday: string;
  SwapRateSaturday: string;
  TimeStart: string;
  TimeExpiration: string;
  SessionsQuotes: SessionData[][]; // 7-day array, each day can have multiple sessions
  SessionsTrades: SessionData[][]; // 7-day array, each day can have multiple sessions
  REFlags: string;
  RETimeout: string;
  IEFlags: string;
  IECheckMode: string;
  IETimeout: string;
  IESlipProfit: string;
  IESlipLosing: string;
  IEVolumeMax: string;
  IEVolumeMaxExt: string;
  PermissionsFlags: string;
  PermissionsBookdepth: string;
  PriceSettle: string;
  PriceLimitMax: string;
  PriceLimitMin: string;
  PriceStrike: string;
  OptionMode: string;
  FaceValue: string;
  AccruedInterest: string;
  SpliceType: string;
  SpliceTimeType: string;
  SpliceTimeDays: string;
}

export interface MarketStatus {
  symbolId: string;
  isMarketOpen: boolean;
  closesIn: { hours: number; minutes: number; seconds: number } | null;
  opensIn: { hours: number; minutes: number; seconds: number } | null;
  nextSession?: { day: number; open: number; close: number } | null;
}

// Session data interface (for SessionsQuotes and SessionsTrades)
export interface SessionData {
  // Define the structure based on your session data
  // This is a placeholder - you'll need to update based on actual session data structure
  [key: string]: any;
}

// Typed version with proper data types
export interface MT5SymbolTyped {
  Symbol: string;
  Path: string;
  ISIN: string;
  CFI: string;
  Category: string;
  Exchange: string;
  Description: string;
  International: string;
  Sector: number;
  Industry: number;
  Country: string;
  Basis: string;
  Source: string;
  Page: string;
  CurrencyBase: string;
  CurrencyBaseDigits: number;
  CurrencyProfit: string;
  CurrencyProfitDigits: number;
  CurrencyMargin: string;
  CurrencyMarginDigits: number;
  Color: number;
  ColorBackground: number;
  Digits: number;
  Point: number;
  Multiply: number;
  TickFlags: number;
  TickBookDepth: number;
  TickChartMode: number;
  SubscriptionsDelay: number;
  FilterSoft: number;
  FilterSoftTicks: number;
  FilterHard: number;
  FilterHardTicks: number;
  FilterDiscard: number;
  FilterSpreadMax: number;
  FilterSpreadMin: number;
  FilterGap: number;
  FilterGapTicks: number;
  TradeMode: number;
  TradeFlags: number;
  CalcMode: number;
  ExecMode: number;
  GTCMode: number;
  FillFlags: number;
  ExpirFlags: number;
  OrderFlags: number;
  Spread: number;
  SpreadBalance: number;
  SpreadDiff: number;
  SpreadDiffBalance: number;
  TickValue: number;
  TickSize: number;
  ContractSize: number;
  StopsLevel: number;
  FreezeLevel: number;
  QuotesTimeout: number;
  VolumeMin: number;
  VolumeMinExt: number;
  VolumeMax: number;
  VolumeMaxExt: number;
  VolumeStep: number;
  VolumeStepExt: number;
  VolumeLimit: number;
  VolumeLimitExt: number;
  MarginFlags: number;
  MarginInitial: number;
  MarginMaintenance: number;
  MarginInitialBuy: number;
  MarginInitialSell: number;
  MarginInitialBuyLimit: number;
  MarginInitialSellLimit: number;
  MarginInitialBuyStop: number;
  MarginInitialSellStop: number;
  MarginInitialBuyStopLimit: number;
  MarginInitialSellStopLimit: number;
  MarginMaintenanceBuy: number;
  MarginMaintenanceSell: number;
  MarginMaintenanceBuyLimit: number;
  MarginMaintenanceSellLimit: number;
  MarginMaintenanceBuyStop: number;
  MarginMaintenanceSellStop: number;
  MarginMaintenanceBuyStopLimit: number;
  MarginMaintenanceSellStopLimit: number;
  MarginLiquidity: number;
  MarginHedged: number;
  MarginCurrency: number;
  SwapMode: number;
  SwapLong: number;
  SwapShort: number;
  SwapFlags: number;
  Swap3Day: number;
  SwapYearDay: number;
  SwapRateSunday: number;
  SwapRateMonday: number;
  SwapRateTuesday: number;
  SwapRateWednesday: number;
  SwapRateThursday: number;
  SwapRateFriday: number;
  SwapRateSaturday: number;
  TimeStart: string | number; // Could be timestamp
  TimeExpiration: string | number; // Could be timestamp
  SessionsQuotes: SessionData[][];
  SessionsTrades: SessionData[][];
  REFlags: number;
  RETimeout: number;
  IEFlags: number;
  IECheckMode: number;
  IETimeout: number;
  IESlipProfit: number;
  IESlipLosing: number;
  IEVolumeMax: number;
  IEVolumeMaxExt: number;
  PermissionsFlags: number;
  PermissionsBookdepth: number;
  PriceSettle: number;
  PriceLimitMax: number;
  PriceLimitMin: number;
  PriceStrike: number;
  OptionMode: number;
  FaceValue: number;
  AccruedInterest: number;
  SpliceType: number;
  SpliceTimeType: number;
  SpliceTimeDays: number;
}

// Utility type for converting string-based MT5Symbol to typed version
export type ConvertMT5Symbol<T> = {
  [K in keyof T]: T[K] extends string
    ? K extends
        | 'Symbol'
        | 'Path'
        | 'ISIN'
        | 'CFI'
        | 'Category'
        | 'Exchange'
        | 'Description'
        | 'International'
        | 'Country'
        | 'Basis'
        | 'Source'
        | 'Page'
        | 'CurrencyBase'
        | 'CurrencyProfit'
        | 'CurrencyMargin'
        | 'TimeStart'
        | 'TimeExpiration'
      ? string
      : number
    : T[K];
};