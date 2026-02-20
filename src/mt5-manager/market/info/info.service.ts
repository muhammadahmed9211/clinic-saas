/**
 * Market Info Service
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - KafkaService: src/modules/kafka → src/kafka
 * - RedisCoreService: src/modules/redis → src/redis
 * - PriceTopics: src/modules/price-history → src/mt5-manager/price-history
 */

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { RedisCoreService } from 'src/redis/redis.service';
import {
  MarketStatus,
  MT5Symbol,
  SessionData,
} from '../interfaces/symbol-info.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';

@Injectable()
export class InfoService {
  constructor(
    private readonly redisService: RedisCoreService,
    private readonly kafka: KafkaService,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  private readonly timezoneDifference: number = this.configService.getOrThrow(
    'app.timezoneDifference',
    { infer: true },
  );

  async getMarketStatus(symbolId: string): Promise<MarketStatus> {
    const now = new Date();
    const serverNow = new Date(
      now.getTime() + this.timezoneDifference * 60 * 60 * 1000,
    );

    const currentDay = serverNow.getUTCDay();
    const currentTimeInMinutes =
      serverNow.getUTCHours() * 60 + serverNow.getUTCMinutes();

    const symbol = await this.getSymbolInfo(symbolId);
    const sessions = symbol.SessionsTrades; // MT5 sessions are always UTC

    const todaySessions = sessions[currentDay] || [];

    // --- CHECK IF MARKET IS OPEN ---
    for (const s of todaySessions) {
      const open = parseInt(s.Open, 10);
      const close = parseInt(s.Close, 10);

      let isOpen = false;

      if (close > open) {
        // Same-day session
        isOpen = currentTimeInMinutes >= open && currentTimeInMinutes < close;
      } else {
        // Overnight session (closing after midnight)
        isOpen = currentTimeInMinutes >= open || currentTimeInMinutes < close;
      }

      if (isOpen) {
        const closesIn = this.timeUntilUTC(serverNow, close, currentDay, open);

        return {
          symbolId: symbol.Symbol,
          isMarketOpen: true,
          closesIn,
          opensIn: null,
          nextSession: null,
        };
      }
    }

    // --- MARKET IS CLOSED: FIND NEXT SESSION ---
    const nextSession = this.findNextSession(
      sessions,
      currentDay,
      currentTimeInMinutes,
    );

    if (!nextSession) {
      // No sessions found at all
      return {
        symbolId: symbol.Symbol,
        isMarketOpen: false,
        closesIn: null,
        opensIn: null,
        nextSession: null,
      };
    }

    const opensIn = this.timeUntilNextOpen(serverNow, nextSession);

    return {
      symbolId: symbol.Symbol,
      isMarketOpen: false,
      closesIn: null,
      opensIn,
      nextSession,
    };
  }

  private calculateClosesIn(
    now: Date,
    closeMinutes: number,
    openMinutes: number,
    currentDay: number,
    currentTimeInMinutes: number,
  ): { hours: number; minutes: number; seconds: number } {
    const closeTimeToday = closeMinutes;
    let closeDay = currentDay;

    if (closeMinutes <= openMinutes && currentTimeInMinutes >= openMinutes) {
      // We're in a session that closes tomorrow
      closeDay = (currentDay + 1) % 7;
    }

    const closeDate = new Date(now);
    if (closeDay !== currentDay) {
      closeDate.setUTCDate(closeDate.getUTCDate() + 1);
    }
    closeDate.setUTCHours(
      Math.floor(closeTimeToday / 60),
      closeTimeToday % 60,
      0,
      0,
    );

    const diffMs = closeDate.getTime() - now.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  private calculateOpensIn(
    now: Date,
    nextSession: { day: number; open: number; close: number },
    currentDay: number,
  ): { hours: number; minutes: number; seconds: number } {
    const openDate = new Date(now);
    const daysToAdd =
      nextSession.day === currentDay
        ? 0
        : nextSession.day > currentDay
          ? nextSession.day - currentDay
          : 7 - currentDay + nextSession.day;

    openDate.setUTCDate(openDate.getUTCDate() + daysToAdd);
    openDate.setUTCHours(
      Math.floor(nextSession.open / 60),
      nextSession.open % 60,
      0,
      0,
    );

    const diffMs = openDate.getTime() - now.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { hours, minutes, seconds };
  }

  private findNextOpenSession(
    sessions: SessionData[][],
    currentDay: number,
    currentTimeInMinutes: number,
  ): { day: number; open: number; close: number } | null {
    // First check remaining sessions today
    const todaySessions = sessions[currentDay] || [];
    for (const session of todaySessions) {
      const openMinutes = parseInt(session.Open);
      if (openMinutes > currentTimeInMinutes) {
        return {
          day: currentDay,
          open: openMinutes,
          close: parseInt(session.Close),
        };
      }
    }

    // Check next 7 days
    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const checkDay = (currentDay + dayOffset) % 7;
      const daySessions = sessions[checkDay] || [];

      if (daySessions.length > 0) {
        const firstSession = daySessions[0];
        return {
          day: checkDay,
          open: parseInt(firstSession.Open),
          close: parseInt(firstSession.Close),
        };
      }
    }

    return null;
  }

  async getProductSpecification(symbolId: string) {
    const symbol = await this.getSymbolInfo(symbolId);

    return {
      symbolId,
      sector: symbol.Sector,
      industry: Number(symbol.Industry), // ensure it's a number
      digits: String(symbol.Digits), // convert to string if needed
      contractSize: Number(symbol.ContractSize),
      spread: Number(symbol.Spread),
      stopsLevel: Number(symbol.StopsLevel),
      marginCurrency: Number(symbol.MarginCurrency), // convert currency codes to numbers
      profitCurrency: Number(symbol.CurrencyProfit), // convert currency codes to numbers
      calculation: Number(symbol.CalcMode),
      chartMode: Number(symbol.TickChartMode),
      trade: Number(symbol.TradeMode),
      execution: Number(symbol.ExecMode),
      gtcMode: Number(symbol.GTCMode),
      filling: Number(symbol.FillFlags),
      expiration: Number(symbol.ExpirFlags),
      orders: Number(symbol.OrderFlags),
      minimalVolume: Number(symbol.VolumeMin),
      maximalVolume: Number(symbol.VolumeMax),
      volumeStep: Number(symbol.VolumeStep),
      volumeLimit: Number(symbol.VolumeLimit),
      swapType: Number(symbol.SwapMode),
      swapLong: Number(symbol.SwapLong),
      swapShort: Number(symbol.SwapShort),
    };
  }

  getSwapRates(symbolId: string) {
    return {
      symbolId: symbolId,
      Monday: 1,
      Tuesday: 1,
      Wednesday: 3,
      Thursday: 1,
      Friday: 1,
    };
  }

  async getQuotes(symbolId: string) {
    const symbol = await this.getSymbolInfo(symbolId);

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const sessions = symbol.SessionsQuotes;

    const formattedSessions = {};

    sessions.forEach((daySessions, dayIndex) => {
      const dayName = dayNames[dayIndex];

      if (!daySessions || daySessions.length === 0) {
        formattedSessions[dayName] = '-';
        return;
      }

      const sessionStrings = daySessions.map((session) => {
        const openMinutes = parseInt(session.Open);
        const closeMinutes = parseInt(session.Close);

        const openTime = this.minutesToTimeString(openMinutes);
        const closeTime = this.minutesToTimeString(closeMinutes);

        return `${openTime} - ${closeTime}`;
      });

      formattedSessions[dayName] = sessionStrings.join(', ');
    });

    return {
      symbolId: symbol.Symbol,
      session: formattedSessions,
    };
  }

  private minutesToTimeString(minutes: number): string {
    if (minutes === 1440) return '24:00';

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    const time = `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;

    return time;
  }

  getMarginInfo(symbolId: string) {
    return {
      symbolId,
      displayUnit: 'usd/lot',
      type: ['Floating', 'Volume'],
      marketBuy: [
        { range: '0 - 50', initial: 227.87, maintenance: 227.87 },
        { range: '50 - 100', initial: 569.68, maintenance: 569.68 },
        { range: '100 - 200', initial: 1139.35, maintenance: 1139.35 },
        { range: '>= 200', initial: 2278.7, maintenance: 2278.7 },
      ],
      marketSell: [
        { range: '0 - 50', initial: 227.87, maintenance: 227.87 },
        { range: '50 - 100', initial: 569.68, maintenance: 569.68 },
        { range: '100 - 200', initial: 1139.35, maintenance: 1139.35 },
        { range: '>= 200', initial: 2278.7, maintenance: 2278.7 },
      ],
    };
  }
  getLiveAnalytics(symbolId: string) {
    return {
      symbolId: symbolId,
      metrics: {
        hour: { change: 0.05, direction: 'up' },
        today: { change: 0.17, direction: 'up' },
        week: { change: 1.88, direction: 'down' },
        month: { change: 1.77, direction: 'down' },
        year: { change: 5.3, direction: 'up' },
      },
      max: {
        value: 1.1573,
        date: '21 Apr at 13:00',
        additionalValue: 14.5143,
      },
      min: {
        value: 1.10647,
        date: '12 May at 21:00',
      },
      range: {
        start: '14 Apr at 01:00',
        end: '14 May at 09:00',
      },
    };
  }

  async getSymbolInfo(symbolCode: string): Promise<MT5Symbol> {
    const cacheKey = `symbolInfo:${symbolCode}`;
    let cacheData = await this.redisService.get({ key: cacheKey });

    if (cacheData && typeof cacheData === 'string') {
      try {
        return JSON.parse(cacheData);
      } catch (e) {
        console.error('Failed to parse cached result:', e);
        cacheData = null; // Reset if parsing fails
      }
    }

    const symbolInfo: { retcode: string; answer: MT5Symbol } =
      await this.kafka.SendMessage(this.mt5Client, PriceTopics.getSymbolData, {
        symbol: symbolCode,
      });

    await this.redisService.set({
      key: cacheKey,
      value: JSON.stringify(symbolInfo.answer),
      ttl: 60 * 60 * 24 * 7,
    });

    return symbolInfo.answer;
  }

  /* ----------------------------------------------------------
   Calculate time until close (diff in hours/min/sec)
-----------------------------------------------------------*/
  private timeUntilUTC(
    now: Date,
    closeMinutes: number,
    day: number,
    openMinutes: number,
  ) {
    let closeDay = day;

    if (closeMinutes <= openMinutes) {
      // closes next day
      closeDay = (day + 1) % 7;
    }

    const close = new Date(now);
    if (closeDay !== day) {
      close.setUTCDate(close.getUTCDate() + 1);
    }
    close.setUTCHours(Math.floor(closeMinutes / 60), closeMinutes % 60, 0, 0);

    return this.diff(now, close);
  }

  /* ----------------------------------------------------------
   Calculate time until market opens
-----------------------------------------------------------*/
  private timeUntilNextOpen(now: Date, next: { day: number; open: number }) {
    const openTime = new Date(now);

    const daysAhead =
      next.day >= now.getUTCDay()
        ? next.day - now.getUTCDay()
        : 7 - now.getUTCDay() + next.day;

    openTime.setUTCDate(openTime.getUTCDate() + daysAhead);
    openTime.setUTCHours(Math.floor(next.open / 60), next.open % 60, 0, 0);

    return this.diff(now, openTime);
  }

  /* ----------------------------------------------------------
   Return diff {hours, minutes, seconds}
-----------------------------------------------------------*/
  private diff(from: Date, to: Date) {
    const totalSec = Math.floor((to.getTime() - from.getTime()) / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    return { hours, minutes, seconds };
  }

  /* ----------------------------------------------------------
   Find next session by scanning today + next 6 days
-----------------------------------------------------------*/
  private findNextSession(
    sessions: SessionData[][],
    currentDay: number,
    currentTime: number,
  ) {
    // Check today's remaining sessions
    for (const s of sessions[currentDay] || []) {
      const open = parseInt(s.Open, 10);
      if (open > currentTime) {
        return { day: currentDay, open, close: parseInt(s.Close, 10) };
      }
    }

    // Check next days
    for (let i = 1; i <= 7; i++) {
      const day = (currentDay + i) % 7;
      if ((sessions[day] || []).length > 0) {
        const s = sessions[day][0];
        return {
          day,
          open: parseInt(s.Open, 10),
          close: parseInt(s.Close, 10),
        };
      }
    }

    return null;
  }
}
