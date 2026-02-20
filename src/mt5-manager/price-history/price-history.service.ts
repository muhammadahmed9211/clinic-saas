/**
 * Price History Service
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - AllConfigType: src/config/config.types → src/config/config.type
 * - KafkaService: ../kafka/kafka.service → src/kafka/kafka.service
 * - RedisCoreService: ../redis/redis.service → src/redis/redis.service
 * - Symbol: Injected via TypeORM from src/mt5/entities
 */

import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from 'src/kafka/kafka.service';
import { AllConfigType } from 'src/config/config.type';
import {
  GetHistoryQuery,
  GetSymbolInfoQuery,
  SymbolPriceDto,
} from './dto/get-price.dto';
import { RedisCoreService } from 'src/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';

@Injectable()
export class PriceHistoryService {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @InjectRepository(Mt5Symbol)
    private symbolRepository: Repository<Mt5Symbol>,
    private readonly kafka: KafkaService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly redisService: RedisCoreService,
  ) {}

  getConfig() {
    return {
      supported_resolutions: this.configService.getOrThrow('priceHistory', {
        infer: true,
      }).supportedResolutions,
      supports_group_request: this.configService.getOrThrow('priceHistory', {
        infer: true,
      }).supportsGroupRequest,
      supports_marks: this.configService.getOrThrow('priceHistory', {
        infer: true,
      }).supportsMarks,
      supports_search: this.configService.getOrThrow('priceHistory', {
        infer: true,
      }).supportsSearch,
      supports_timescale_marks: this.configService.getOrThrow('priceHistory', {
        infer: true,
      }).supportsTimescaleMarks,
      supports_time: true,
      exchanges: [
        { value: '', name: 'All', desc: '' },
        { value: 'FOREX', name: 'FOREX', desc: 'Foreign Exchange' },
        { value: 'METALS', name: 'METALS', desc: 'Precious & Base Metals' },
        { value: 'ENERGY', name: 'ENERGY', desc: 'Oil, Gas, and Energy CFDs' },
        { value: 'INDEX', name: 'INDEX', desc: 'Global Indices & CFDs' },
        { value: 'STOCKS', name: 'STOCKS', desc: 'Equity Markets' },
        { value: 'SHARES', name: 'SHARES', desc: 'Company Shares' },
        { value: 'NASDAQ', name: 'NASDAQ', desc: 'NASDAQ Exchange' },
        { value: 'NYSE', name: 'NYSE', desc: 'New York Stock Exchange' },
        { value: 'BATS', name: 'BATS', desc: 'BATS Exchange' },
        { value: 'UNKNOWN', name: 'UNKNOWN', desc: 'Unclassified' },
      ],
      symbols_types: [
        { name: 'All types', value: '' },
        { name: 'Forex', value: 'forex' },
        { name: 'Index', value: 'index' },
        { name: 'Commodity', value: 'commodity' },
        { name: 'ETF', value: 'etf' },
        { name: 'Stock', value: 'stock' },
      ],
      timezone_difference:
        this.configService.getOrThrow('app.timezoneDifference', {
          infer: true,
        }) ?? 0,
    };
  }

  async pricebySymbol(data: SymbolPriceDto) {
    return this.kafka.SendMessage(
      this.mt5Client,
      PriceTopics.getPriceBySymbol,
      data,
    );
  }

  async getQuotes(data: SymbolPriceDto) {
    return this.kafka.SendMessage(this.mt5Client, 'get-price-symbol', data);
  }

  async getGroupQuotes(data: {
    symbol?: string;
    group?: string;
    trans_id?: number;
  }) {
    return this.kafka.SendMessage(this.mt5Client, 'quotes/group', data);
  }

  async getStatistics(data: SymbolPriceDto) {
    return this.kafka.SendMessage(this.mt5Client, 'statistic', data);
  }

  async getTickHistory(data: {
    symbol?: string;
    from?: string;
    to?: string;
    data?: string;
  }) {
    return this.kafka.SendMessage(this.mt5Client, 'tick', data);
  }

  async getMarketDepth(data: { symbol?: string }) {
    return this.kafka.SendMessage(this.mt5Client, 'market', data);
  }

  async getPriceHistory(query: GetHistoryQuery) {
    const resolution = query.resolution || '1';

    try {
      // For 1-minute resolution, directly use the chart/get endpoint
      if (resolution === '1') {
        return await this.getM1Data(query);
      }

      // For other resolutions, calculate appropriate time range
      const extendedQuery = this.extendTimeRangeForAggregation(
        query,
        resolution,
      );

      // Get M1 data with appropriate caching
      const m1Data = await this.getM1DataWithCache(extendedQuery);

      if (m1Data.s !== 'ok' || !m1Data.t || m1Data.t.length === 0) {
        return m1Data; // Return error or empty result
      }

      // Aggregate M1 candles to the requested timeframe
      return this.aggregateCandles(m1Data, resolution);
    } catch (error) {
      console.error('Error in getPriceHistory:', error);
      return {
        s: 'error',
        errmsg: error.message || 'Failed to fetch price history',
      };
    }
  }

  // Calculate appropriate time range extension based on resolution
  private extendTimeRangeForAggregation(
    query: GetHistoryQuery,
    resolution: string,
  ) {
    const periodMinutes = this.resolutionToMinutes(resolution);

    // Make a copy of the query to avoid modifying the original
    const extendedQuery = { ...query };

    // Extend the "from" time to ensure we get complete candles
    // Convert from timestamp to date, subtract the period, convert back to timestamp
    if (extendedQuery.from) {
      const fromDate = new Date(parseFloat(extendedQuery.from) * 1000);
      fromDate.setMinutes(fromDate.getMinutes() - periodMinutes);
      extendedQuery.from = Math.floor(fromDate.getTime() / 1000).toString();
    }

    return extendedQuery;
  }

  // Implement caching for M1 data
  async getM1DataWithCache(query: any): Promise<any> {
    const cacheKey = `m1_data:${query.symbol}:${query.from}:${query.to}`;

    // Try to get from cache first
    try {
      const cachedData: any = await this.redisService.get({ key: cacheKey });
      if (cachedData) {
        console.log('getting from cache');
        return JSON.parse(cachedData);
      }
    } catch (error) {
      console.warn('Cache retrieval error:', error.message);
      // Continue execution if cache fails - don't let cache issues break functionality
    }

    // If not in cache, fetch fresh data
    const data = await this.getM1Data(query);

    // Store in cache if successful
    if (data.s === 'ok' && data.t && data.t.length > 0) {
      try {
        // Cache for 5 minutes - adjust TTL based on your needs
        await this.redisService.set({
          key: cacheKey,
          value: JSON.stringify(data),
        });
      } catch (error) {
        console.warn('Cache storage error:', error.message);
        // Continue even if caching fails
      }
    }

    return data;
  }

  async getM1Data(query): Promise<any> {
    // Implement retry logic with exponential backoff
    const maxRetries = 3;
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const mt5Url = this.configService.getOrThrow('app.siliconfortMt5ManagerUrl', {
          infer: true,
        });
        const result = await axios.get(`${mt5Url}/forex/m1-history`, {
          params: {
            symbol: query.symbol,
            from: query.from,
            to: query.to,
            data: 'dohlcv', // Request date, OHLC and volume
          },
          timeout: 50000, // Reduced timeout for faster error detection
        });

        const res = result.data;

        if (!res || !res.result || res.result.retcode !== '0 Done') {
          throw new Error(res?.result?.retcode || 'Invalid M1 data response');
        }

        // Parse the response into TradingView format
        const bars = res.result.answer || [];

        return {
          t: bars.map((bar) => bar[0]), // Timestamp
          o: bars.map((bar) => bar[1]), // Open
          h: bars.map((bar) => bar[2]), // High
          l: bars.map((bar) => bar[3]), // Low
          c: bars.map((bar) => bar[4]), // Close
          v: bars.map((bar) => bar[5] || 0), // Volume
          s: 'ok',
        };
      } catch (error) {
        lastError = error.message;

        // If not the last attempt, wait before retrying
        if (attempt < maxRetries) {
          // Exponential backoff: 500ms, 1000ms, 2000ms, etc.
          const delay = Math.pow(2, attempt - 1) * 500;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries failed
    console.error('M1 data fetch failed after retries:', lastError);
    return {
      s: 'error',
      errmsg:
        lastError?.message || 'Failed to fetch M1 data after multiple attempts',
    };
  }

  // Improved aggregation with better time alignment
  private aggregateCandles(m1Data: any, resolution: string): any {
    const periodInMinutes = this.resolutionToMinutes(resolution);

    const result: any = {
      t: [],
      o: [],
      h: [],
      l: [],
      c: [],
      v: [],
      s: 'ok',
    };

    // Edge case: empty data
    if (!m1Data.t.length) return result;

    let currentCandle: any = null;
    let currentCandleTime = 0;

    // Process each M1 candle
    for (let i = 0; i < m1Data.t.length; i++) {
      const timestamp = m1Data.t[i];
      const open = m1Data.o[i];
      const high = m1Data.h[i];
      const low = m1Data.l[i];
      const close = m1Data.c[i];
      const volume = m1Data.v[i] || 0;

      // Calculate which aggregated candle this M1 candle belongs to
      const candleTime = this.getAlignedCandleTime(timestamp, periodInMinutes);

      // If this is a new candle, push the previous one to results and start a new one
      if (candleTime !== currentCandleTime) {
        if (currentCandle) {
          result.t.push(currentCandleTime);
          result.o.push(currentCandle.open);
          result.h.push(currentCandle.high);
          result.l.push(currentCandle.low);
          result.c.push(currentCandle.close);
          result.v.push(currentCandle.volume);
        }

        // Start a new candle
        currentCandle = {
          open: open,
          high: high,
          low: low,
          close: close,
          volume: volume,
        };
        currentCandleTime = candleTime;
      } else {
        // Update existing candle
        currentCandle.high = Math.max(currentCandle.high, high);
        currentCandle.low = Math.min(currentCandle.low, low);
        currentCandle.close = close;
        currentCandle.volume += volume;
      }
    }

    // Don't forget to add the last candle
    if (currentCandle) {
      result.t.push(currentCandleTime);
      result.o.push(currentCandle.open);
      result.h.push(currentCandle.high);
      result.l.push(currentCandle.low);
      result.c.push(currentCandle.close);
      result.v.push(currentCandle.volume);
    }

    return result;
  }

  // Get a properly aligned timestamp for the candle
  private getAlignedCandleTime(
    timestamp: number,
    periodInMinutes: number,
  ): number {
    const date = new Date(timestamp * 1000);

    // For daily/weekly/monthly data
    if (periodInMinutes >= 1440) {
      if (periodInMinutes === 1440) {
        // Daily
        date.setHours(0, 0, 0, 0);
      } else if (periodInMinutes === 10080) {
        // Weekly
        const dayOfWeek = date.getDay();
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to start on Monday
        date.setDate(date.getDate() - daysToSubtract);
        date.setHours(0, 0, 0, 0);
      } else if (periodInMinutes === 43200) {
        // Monthly
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
      }
    } else {
      // For intraday data, align to the proper interval
      const minutes = date.getHours() * 60 + date.getMinutes();
      const intervalIndex = Math.floor(minutes / periodInMinutes);
      date.setHours(0, intervalIndex * periodInMinutes, 0, 0);
    }

    return Math.floor(date.getTime() / 1000);
  }

  private resolutionToMinutes(resolution: string): number {
    switch (resolution) {
      case '1':
        return 1;
      case '5':
        return 5;
      case '15':
        return 15;
      case '30':
        return 30;
      case '60':
        return 60;
      case '240':
        return 240;
      case '1D':
        return 1440;
      case '1W':
        return 10080;
      case '1M':
        return 43200;
      default:
        return 1;
    }
  }

  async getSymbolInfoFormatted(query: GetSymbolInfoQuery): Promise<any> {
    const symbolInfos: any[] = await this.symbolRepository.query(
      `SELECT * FROM symbol_info;`,
    );

    const result: any = {
      symbol: [],
      description: [],
      'exchange-listed': symbolInfos[0]?.exchange_listed || '',
      'exchange-traded': symbolInfos[0]?.exchange_traded || '',
      minmovement: symbolInfos[0]?.minmovement || 0,
      minmovement2: symbolInfos[0]?.minmovement2 || 0,
      pricescale: [],
      'has-dwm': symbolInfos[0]?.has_dwm || false,
      'has-intraday': symbolInfos[0]?.has_intraday || false,
      type: [],
      ticker: [],
      timezone: 'UTC',
      'session-regular': '0000-2359:1234567',
    };

    // Populate the arrays
    symbolInfos.forEach((info) => {
      result.symbol.push(info.symbol);
      result.description.push(info.description);
      result.pricescale.push(info.pricescale);
      result.type.push(info.type);
      result.ticker.push(info.ticker);
    });

    return result;
  }

  async onModuleInit() {
    const dummy = {
      t: [
        1374796800, 1375056000, 1375142400, 1375228800, 1375315200, 1375401600,
        1375660800, 1375747200, 1375833600, 1375920000, 1376006400, 1376265600,
        1376352000, 1376438400, 1376524800, 1376611200, 1376870400, 1376956800,
        1377043200, 1377129600, 1377216000, 1377475200, 1377561600, 1377648000,
        1377734400, 1377820800, 1378166400, 1378252800, 1378339200, 1378425600,
        1378684800, 1378771200, 1378857600, 1378944000, 1379030400, 1379289600,
        1379376000, 1379462400, 1379548800, 1379635200, 1379894400, 1379980800,
        1380067200, 1380153600, 1380240000, 1380499200, 1380585600, 1380672000,
        1380758400, 1380844800, 1381104000, 1381190400, 1381276800, 1381363200,
        1381449600, 1381708800, 1381795200, 1381881600, 1381968000, 1382054400,
        1382313600, 1382400000, 1382486400, 1382572800, 1382659200, 1382918400,
        1383004800, 1383091200, 1383177600, 1383264000, 1383523200, 1383609600,
        1383696000, 1383782400, 1383868800, 1384128000, 1384214400, 1384300800,
        1384387200, 1384473600, 1384732800, 1384819200, 1384905600, 1384992000,
        1385078400, 1385337600, 1385424000, 1385510400, 1385683200, 1385942400,
        1386028800, 1386115200, 1386201600, 1386288000, 1386547200, 1386633600,
        1386720000, 1386806400, 1386892800, 1387152000, 1387238400, 1387324800,
        1387411200, 1387497600, 1387756800, 1387843200, 1388016000, 1388102400,
        1388361600, 1388448000, 1388620800, 1388707200, 1388966400, 1389052800,
        1389139200, 1389225600, 1389312000, 1389571200, 1389657600, 1389744000,
        1389830400, 1389916800, 1390262400, 1390348800, 1390435200, 1390521600,
        1390780800, 1390867200, 1390953600, 1391040000, 1391126400, 1391385600,
        1391472000, 1391558400, 1391644800, 1391731200, 1391990400, 1392076800,
        1392163200, 1392249600, 1392336000, 1392681600, 1392768000, 1392854400,
        1392940800, 1393200000, 1393286400, 1393372800, 1393459200, 1393545600,
        1393804800, 1393891200, 1393977600, 1394064000, 1394150400, 1394409600,
        1394496000, 1394582400, 1394668800, 1394755200, 1395014400, 1395100800,
        1395187200, 1395273600, 1395360000, 1395619200, 1395705600, 1395792000,
        1395878400, 1395964800, 1396224000, 1396310400, 1396396800, 1396483200,
        1396569600, 1396828800, 1396915200, 1397001600, 1397088000, 1397174400,
        1397433600, 1397520000, 1397606400, 1397692800, 1398038400, 1398124800,
        1398211200, 1398297600, 1398384000, 1398643200, 1398729600, 1398816000,
        1398902400, 1398988800, 1399248000, 1399334400, 1399420800, 1399507200,
        1399852800, 1399939200, 1400025600, 1400112000, 1400198400, 1400457600,
        1400544000, 1400630400, 1400716800, 1400803200, 1401148800, 1401235200,
        1401321600, 1401408000, 1401667200, 1401753600, 1401840000, 1401926400,
        1402012800, 1402272000, 1402358400, 1402444800, 1402531200, 1402617600,
        1402876800, 1402963200, 1403049600, 1403136000, 1403222400, 1403481600,
        1403568000, 1403654400, 1403740800, 1403827200, 1404086400, 1404172800,
        1404259200, 1404345600, 1404691200, 1404777600, 1404864000, 1404950400,
        1405036800, 1405296000, 1405382400, 1405468800, 1405555200, 1405900800,
        1405987200, 1406073600, 1406160000, 1406246400, 1406505600, 1406592000,
        1406678400, 1406764800, 1406851200, 1407110400, 1407196800, 1407283200,
        1407369600, 1407456000, 1407715200, 1407801600, 1407888000, 1407974400,
        1408060800, 1408320000, 1408406400, 1408492800, 1408579200, 1408665600,
        1408924800, 1409011200, 1409097600, 1409184000, 1409270400, 1409616000,
        1409702400, 1409788800, 1409875200, 1410134400, 1410220800, 1410307200,
        1410393600, 1410480000, 1410739200, 1410825600, 1410912000, 1410998400,
        1411084800, 1411344000, 1411430400, 1411516800, 1411603200, 1411689600,
        1411948800, 1412035200, 1412121600, 1412294400, 1412553600, 1412640000,
        1412726400, 1412812800, 1412899200, 1413158400, 1413244800, 1413331200,
        1413417600, 1413504000, 1413763200, 1413849600, 1413936000, 1414022400,
        1414108800, 1414368000, 1414454400, 1414540800, 1414627200, 1414713600,
        1414972800, 1415059200, 1415145600, 1415232000, 1415318400, 1415577600,
        1415664000, 1415750400, 1415836800, 1415923200, 1416182400, 1416268800,
      ],
      o: [
        4.5, 4.44, 4.35, 4.51, 4.6, 4.56, 4.61, 5.25, 4.94, 4.75, 3.82, 3.46,
        3.28, 3.15, 3.17, 3.15, 3.18, 3.16, 3.2, 3.17, 3.03, 2.82, 2.89, 2.83,
        2.83, 2.9, 2.87, 2.93, 2.92, 2.87, 2.9, 3.13, 3, 3.01, 3.12, 3.06, 3.3,
        3.25, 3.3, 3.23, 3.04, 3.05, 2.99, 2.99, 3.06, 2.97, 2.94, 2.92, 2.89,
        2.8, 2.77, 2.75, 2.65, 2.61, 2.65, 2.62, 2.64, 2.61, 2.64, 2.56, 2.45,
        2.4, 2.35, 2.27, 2.45, 2.98, 2.8, 2.7, 2.64, 2.66, 2.62, 2.55, 2.56,
        2.45, 2.41, 2.6, 2.62, 2.46, 2.5, 2.54, 2.54, 2.7, 2.99, 2.86, 2.8, 2.8,
        2.84, 2.88, 2.95, 2.96, 2.9, 2.96, 3.07, 3.04, 3, 2.99, 2.94, 3.09,
        3.21, 3.31, 3.29, 3.18, 3.35, 3.42, 3.47, 3.4, 3.33, 3.27, 3.15, 2.99,
        2.93, 3.04, 3.09, 3.02, 2.88, 2.9, 2.9, 3.24, 3.31, 3.41, 3.25, 3.14,
        3.25, 3.23, 3, 2.89, 2.86, 2.69, 2.73, 2.9, 2.79, 2.76, 2.68, 2.69,
        2.68, 2.67, 2.75, 2.82, 2.9, 2.85, 2.9, 2.95, 3.02, 2.96, 3.05, 2.99,
        2.97, 3, 2.95, 2.98, 3.11, 3.24, 3.06, 3.2, 3.06, 2.98, 2.94, 2.89, 3,
        2.96, 3, 3.01, 3.02, 2.96, 3, 3, 3.02, 3.02, 2.97, 3, 2.98, 3.03, 2.99,
        3, 2.92, 2.82, 2.78, 2.83, 2.9, 2.76, 2.75, 2.71, 2.71, 2.69, 2.65,
        2.66, 2.69, 2.68, 2.65, 2.58, 2.52, 2.54, 2.57, 2.54, 2.48, 2.5, 2.41,
        2.5, 1.97, 2.04, 2.05, 2.17, 2.08, 2.13, 2.33, 2.31, 2.17, 2.21, 2.24,
        2.25, 2.19, 2.21, 2.15, 2.02, 1.95, 1.99, 1.99, 2.1, 2.05, 2.05, 2.02,
        2.01, 2.01, 2.02, 2.02, 2.07, 2.09, 2.02, 2.03, 2.06, 2.09, 2.28, 2.36,
        2.29, 2.3, 2.32, 2.26, 2.4, 2.3, 2.25, 2.27, 2.29, 2.3, 2.17, 2.17,
        2.12, 2.14, 2.1, 2.18, 2.17, 2.14, 2.13, 2.1, 2.09, 2.08, 2.07, 2.03,
        2.04, 2.03, 1.99, 2.05, 1.67, 1.3, 1.42, 1.4, 1.4, 1.38, 1.33, 1.35,
        1.34, 1.31, 1.33, 1.4, 1.36, 1.35, 1.34, 1.4, 1.37, 1.32, 1.38, 1.37,
        1.35, 1.36, 1.39, 1.39, 1.5, 1.46, 1.48, 1.46, 1.5, 1.55, 1.51, 1.52,
        1.48, 1.51, 1.51, 1.41, 1.34, 1.38, 1.31, 1.23, 1.13, 1, 0.9, 0.91,
        0.95, 0.9318, 1.15, 1.12, 1.13, 1.09, 1.06, 1.04, 1.05, 1.01, 1.06,
        1.02, 1.05, 0.978, 1.01, 0.99, 0.92, 0.8022, 0.2899, 0.192, 0.154,
        0.161, 0.12, 0.11, 0.16,
      ],
      h: [
        4.52, 4.49, 4.52, 4.69, 4.64, 4.69, 5.38, 5.34, 5, 5.08, 3.87, 3.47,
        3.34, 3.26, 3.2, 3.25, 3.28, 3.2, 3.25, 3.24, 3.08, 2.89, 2.9, 2.83,
        2.94, 2.96, 2.94, 2.97, 2.97, 2.93, 3.15, 3.14, 3.05, 3.13, 3.13, 3.08,
        3.41, 3.34, 3.32, 3.23, 3.06, 3.07, 3.04, 3, 3.1, 2.97, 2.94, 2.93, 2.9,
        2.81, 2.83, 2.78, 2.65, 2.76, 2.73, 2.65, 2.65, 2.73, 2.67, 2.58, 2.51,
        2.47, 2.39, 2.42, 2.7, 3.02, 2.83, 2.78, 2.64, 2.66, 2.63, 2.62, 2.59,
        2.49, 2.57, 2.62, 2.73, 2.55, 2.52, 2.54, 2.82, 2.98, 3.07, 2.93, 2.86,
        2.93, 2.92, 2.98, 3.03, 3, 3.12, 3.08, 3.15, 3.05, 3.08, 3, 3.07, 3.23,
        3.34, 3.33, 3.34, 3.32, 3.52, 3.45, 3.51, 3.41, 3.39, 3.28, 3.2, 3.08,
        3.07, 3.13, 3.11, 3.02, 2.88, 2.91, 3.06, 3.48, 3.4, 3.47, 3.26, 3.27,
        3.26, 3.24, 3.07, 2.89, 2.86, 2.77, 2.79, 2.94, 2.84, 2.78, 2.74, 2.69,
        2.71, 2.77, 2.83, 2.9, 2.94, 2.88, 3.01, 3.07, 3.06, 3.04, 3.06, 3.02,
        3.01, 3, 2.98, 3.01, 3.46, 3.28, 3.21, 3.2, 3.06, 2.98, 3, 2.99, 3.02,
        3.02, 3.05, 3.05, 3.08, 3.03, 3.03, 3.08, 3.04, 3.07, 3.04, 3.11, 3.02,
        3.04, 3.03, 3.03, 2.94, 2.85, 2.86, 2.93, 2.91, 2.86, 2.75, 2.85, 2.75,
        2.73, 2.69, 2.74, 2.73, 2.68, 2.65, 2.58, 2.56, 2.6, 2.6, 2.54, 2.54,
        2.5199, 2.44, 2.54, 2.07, 2.08, 2.245, 2.215, 2.14, 2.2, 2.45, 2.35,
        2.23, 2.24, 2.27, 2.25, 2.24, 2.2155, 2.19, 2.03, 1.99, 2.02, 2.18,
        2.15, 2.14, 2.09, 2.09, 2.05, 2.05, 2.04, 2.07, 2.0901, 2.09, 2.06,
        2.12, 2.12, 2.3, 2.37, 2.38, 2.32, 2.34, 2.32, 2.34, 2.49, 2.34, 2.37,
        2.31, 2.34, 2.32, 2.23, 2.21, 2.15, 2.19, 2.17, 2.22, 2.2, 2.17, 2.135,
        2.161, 2.13, 2.11, 2.1, 2.04, 2.06, 2.06, 2.05, 2.14, 1.73, 1.42, 1.42,
        1.42, 1.43, 1.41, 1.36, 1.38, 1.34, 1.39, 1.43, 1.44, 1.38, 1.37, 1.4,
        1.4, 1.37, 1.39, 1.39, 1.37, 1.39, 1.39, 1.39, 1.58, 1.53, 1.5, 1.5,
        1.59, 1.57, 1.64, 1.56, 1.54, 1.53, 1.53, 1.52, 1.43, 1.42, 1.38, 1.31,
        1.25, 1.14, 1.02, 0.96, 1.07, 0.97, 1.11, 1.24, 1.2, 1.16, 1.09, 1.06,
        1.05, 1.06, 1.06, 1.065, 1.03, 1.05, 1.02, 1.02, 1, 0.92, 1, 0.34,
        0.229, 0.1775, 0.17, 0.1251, 0.1698, 0.174,
      ],
      l: [
        4.35, 4.32, 4.29, 4.49, 4.5, 4.54, 4.61, 4.79, 4.63, 4.59, 3.38, 3.1,
        3.15, 3.15, 3.11, 3.15, 3.13, 3.13, 3.15, 3.15, 2.84, 2.79, 2.76, 2.69,
        2.79, 2.84, 2.85, 2.89, 2.84, 2.86, 2.87, 2.97, 2.97, 2.97, 2.99, 2.96,
        3.1, 3.18, 3.17, 3.01, 2.97, 2.97, 2.97, 2.96, 2.98, 2.9, 2.88, 2.88,
        2.78, 2.75, 2.72, 2.55, 2.48, 2.59, 2.6, 2.55, 2.55, 2.56, 2.4, 2.42,
        2.39, 2.31, 2.23, 2.24, 2.4, 2.73, 2.65, 2.61, 2.46, 2.51, 2.55, 2.52,
        2.44, 2.35, 2.38, 2.44, 2.42, 2.43, 2.45, 2.46, 2.54, 2.66, 2.79, 2.75,
        2.72, 2.75, 2.75, 2.81, 2.91, 2.89, 2.87, 2.96, 3, 2.98, 2.97, 2.92,
        2.88, 3.02, 3.2, 3.25, 3.17, 3.16, 3.27, 3.31, 3.32, 3.3, 3.23, 3.17, 3,
        2.96, 2.89, 3, 2.98, 2.8, 2.78, 2.75, 2.83, 3.08, 3.21, 3.32, 3.08,
        3.12, 3.16, 2.97, 2.85, 2.8, 2.61, 2.67, 2.65, 2.78, 2.76, 2.65, 2.61,
        2.52, 2.64, 2.65, 2.74, 2.82, 2.8, 2.81, 2.85, 2.94, 2.97, 2.96, 2.92,
        2.94, 2.94, 2.92, 2.9, 2.8, 3.11, 3.03, 3, 3.04, 2.91, 2.88, 2.88, 2.82,
        2.92, 2.92, 2.96, 2.98, 2.96, 2.96, 2.97, 2.97, 2.96, 2.96, 2.96, 2.97,
        2.97, 2.97, 2.97, 2.91, 2.8, 2.74, 2.78, 2.83, 2.75, 2.7, 2.62, 2.62,
        2.66, 2.62, 2.62, 2.66, 2.66, 2.58, 2.55, 2.41, 2.42, 2.47, 2.5, 2.47,
        2.45, 2.41, 2.33, 2.04, 1.81, 1.96, 2.04, 2.05, 2.04, 2.12, 2.25, 2.16,
        2.15, 2.16, 2.195, 2.16, 2.17, 2.14, 2.02, 1.92, 1.9, 1.95, 1.99,
        2.0501, 2.02, 2.03, 2, 1.98, 1.975, 1.97, 1.96, 2, 2.02, 2, 2.0101,
        2.05, 2.08, 2.18, 2.27, 2.23, 2.25, 2.2599, 2.15, 2.28, 2.2, 2.21,
        2.235, 2.25, 2.16, 2.12, 2.01, 2.0795, 2.075, 2.1, 2.14, 2.13, 2.06,
        2.05, 2.09, 2.06, 2.02, 2.01, 2, 1.99, 1.98, 1.97, 2.03, 1.33, 1.24,
        1.36, 1.36, 1.35, 1.35, 1.32, 1.33, 1.32, 1.31, 1.33, 1.36, 1.35, 1.32,
        1.33, 1.34, 1.32, 1.32, 1.36, 1.345, 1.34, 1.35, 1.355, 1.38, 1.44,
        1.45, 1.41, 1.38, 1.46, 1.51, 1.48, 1.47, 1.46, 1.49, 1.44, 1.35, 1.34,
        1.31, 1.22, 1.05, 1.01, 0.9, 0.8898, 0.91, 0.92, 0.93, 1.11, 1.1, 1.09,
        1.01, 1.02, 1, 1, 1.01, 1.01, 0.99, 0.97, 0.975, 0.979, 0.93, 0.8012,
        0.8, 0.1738, 0.14, 0.153, 0.12, 0.106, 0.1099, 0.127,
      ],
      c: [
        4.42, 4.34, 4.48, 4.59, 4.59, 4.6, 5.23, 4.99, 4.66, 4.59, 3.39, 3.37,
        3.17, 3.18, 3.15, 3.18, 3.15, 3.19, 3.17, 3.19, 2.91, 2.87, 2.77, 2.79,
        2.91, 2.84, 2.92, 2.93, 2.85, 2.88, 3.07, 2.99, 3.03, 3.1, 3.02, 2.98,
        3.13, 3.24, 3.21, 3.05, 3.04, 2.98, 2.97, 2.98, 2.99, 2.93, 2.94, 2.9,
        2.82, 2.78, 2.73, 2.62, 2.56, 2.68, 2.65, 2.64, 2.6, 2.71, 2.53, 2.44,
        2.4, 2.33, 2.25, 2.41, 2.53, 2.81, 2.68, 2.61, 2.56, 2.56, 2.57, 2.58,
        2.45, 2.38, 2.57, 2.5, 2.58, 2.53, 2.49, 2.54, 2.69, 2.95, 2.83, 2.83,
        2.79, 2.86, 2.87, 2.94, 2.97, 2.92, 2.97, 3.05, 3.02, 3.01, 3, 2.96,
        3.07, 3.21, 3.32, 3.31, 3.28, 3.28, 3.38, 3.32, 3.33, 3.35, 3.28, 3.23,
        3.05, 2.99, 3.04, 3.08, 2.98, 2.87, 2.85, 2.91, 2.99, 3.26, 3.3, 3.33,
        3.12, 3.18, 3.22, 3.01, 2.88, 2.82, 2.69, 2.74, 2.79, 2.83, 2.79, 2.67,
        2.65, 2.67, 2.66, 2.73, 2.81, 2.86, 2.86, 2.88, 2.95, 3.01, 2.99, 3.01,
        2.97, 2.99, 2.99, 2.98, 2.97, 2.88, 3.31, 3.07, 3.16, 3.04, 2.98, 2.95,
        2.91, 2.97, 2.96, 2.99, 2.99, 3.04, 2.98, 3, 3.02, 3, 3, 2.98, 3.02,
        2.97, 2.99, 3, 2.99, 2.93, 2.84, 2.78, 2.82, 2.9, 2.78, 2.7, 2.69, 2.69,
        2.69, 2.65, 2.66, 2.68, 2.67, 2.64, 2.55, 2.46, 2.53, 2.58, 2.51, 2.5,
        2.5, 2.41, 2.41, 2.08, 2.06, 2.05, 2.16, 2.09, 2.12, 2.14, 2.31, 2.18,
        2.19, 2.22, 2.25, 2.18, 2.21, 2.16, 2.02, 1.94, 1.98, 2.01, 2.11, 2.15,
        2.08, 2.04, 2.01, 2.04, 2.02, 2.03, 2.06, 2.07, 2.04, 2.02, 2.08, 2.11,
        2.3, 2.37, 2.3, 2.3, 2.3, 2.29, 2.33, 2.31, 2.27, 2.28, 2.28, 2.31,
        2.17, 2.17, 2.05, 2.14, 2.1, 2.17, 2.19, 2.14, 2.09, 2.1, 2.1, 2.07,
        2.07, 2.04, 2.04, 2.03, 2.01, 2.02, 2.12, 1.4, 1.42, 1.41, 1.4, 1.38,
        1.35, 1.35, 1.345, 1.32, 1.34, 1.4, 1.37, 1.36, 1.36, 1.4, 1.34, 1.32,
        1.38, 1.37, 1.36, 1.37, 1.39, 1.39, 1.52, 1.47, 1.48, 1.42, 1.5, 1.54,
        1.51, 1.54, 1.47, 1.53, 1.52, 1.44, 1.35, 1.36, 1.31, 1.23, 1.12, 1.02,
        0.9, 0.92, 0.97, 0.95, 1.1, 1.14, 1.13, 1.1, 1.03, 1.04, 1.03, 1.01,
        1.06, 1.03, 1.03, 0.9795, 1.01, 0.979, 0.93, 0.83, 0.9421, 0.18, 0.1502,
        0.161, 0.1278, 0.1122, 0.147, 0.127,
      ],
      v: [
        2362500, 1613000, 2829000, 3934900, 2151500, 3018800, 10986200, 5146500,
        6335700, 10064700, 28574200, 13865700, 7859800, 3653700, 3229900,
        3638300, 3604900, 2675300, 2903100, 1972300, 11196400, 4778700, 3290000,
        2896300, 3067200, 1650500, 2306200, 2173900, 2531100, 2141900, 6632000,
        3918200, 2449700, 2903900, 2133600, 2840300, 15165200, 7337000, 3275300,
        10801400, 2577000, 2447600, 1668900, 1650700, 3104700, 3454900, 2836600,
        2049400, 2842800, 3269700, 2305600, 4087600, 3135600, 2478300, 2402600,
        2020500, 2237400, 3772100, 10561900, 15102500, 3399800, 4255100,
        4475000, 6325000, 7585400, 22593700, 4760200, 3184900, 3627000, 3259300,
        1829300, 2033600, 2473500, 2068600, 3209000, 3188400, 9249800, 3496000,
        2392400, 3343900, 6891000, 8985700, 6874700, 2649300, 2115700, 1980000,
        1742700, 2180900, 1605400, 2078000, 5597200, 3681800, 2080000, 2203800,
        2154000, 1876600, 3595400, 5957900, 4208900, 2887900, 3361300, 2440100,
        4545800, 8392700, 5693000, 2169100, 3614900, 3244400, 5758700, 4188300,
        2998600, 2404000, 3204700, 6186500, 4841400, 5616500, 5686400, 17186800,
        5056500, 4721200, 5753800, 3585000, 2391600, 9164800, 7451100, 4018300,
        6612400, 3910000, 2140400, 2674700, 1679100, 3026500, 2233000, 2547800,
        1428300, 1850500, 1887800, 1575500, 1674600, 1381500, 3244900, 2552800,
        2018300, 1742500, 2551100, 2325300, 1394700, 1269000, 2518100, 3460900,
        25920600, 10118300, 6228100, 3912500, 3868500, 3366700, 2604800,
        3343200, 2911800, 2082400, 2280200, 2186700, 1819300, 1915400, 4248100,
        4580200, 5518900, 3413200, 2153500, 3903800, 2732600, 3278300, 2706900,
        3511800, 2977100, 2296400, 1524600, 1584300, 2016200, 2386800, 2201100,
        2573780, 2244867, 2183472, 1571677, 2615420, 1789295, 1812306, 2142660,
        2353209, 1854444, 1845232, 2015517, 1142445, 1040925, 1949065, 2826999,
        6169231, 4020327, 3274316, 2836731, 1799243, 1664450, 1333969, 7374975,
        2547484, 1083798, 1182132, 1268385, 1502186, 1395196, 2138275, 2170670,
        2733150, 1274706, 1039492, 3502221, 1319851, 2606104, 1978965, 1838982,
        1783546, 1770536, 1746741, 1663154, 1856241, 4656408, 1643772, 2666005,
        1285729, 4006543, 2824805, 1349897, 1757194, 1354975, 1057684, 2920396,
        4015141, 1666149, 1665201, 1138857, 1223378, 2578999, 1456482, 2516741,
        1160215, 1532906, 1535330, 1891811, 956422, 1367181, 1420663, 1193137,
        1231898, 1552581, 1444902, 1134149, 925644, 976557, 1050354, 2268831,
        21460443, 8289896, 3467923, 3301446, 2191228, 2339838, 1976079, 1439251,
        1228423, 2015776, 2482322, 2043373, 943624, 1262753, 1770977, 1493259,
        1395428, 1949906, 2317055, 1593374, 1137575, 1131499, 1342235, 4646639,
        1400619, 973974, 1355880, 11962141, 3453694, 2493793, 1043490, 1028780,
        860401, 902968, 2618776, 1454488, 1418718, 1311392, 2811862, 3436455,
        1913786, 3063761, 2546963, 3168417, 1393554, 1834415, 2439049, 1167670,
        1119632, 1653034, 897679, 1010191, 1012970, 1366901, 915716, 1332134,
        2447157, 979791, 1146042, 1652007, 3687706, 2320854, 64340385, 42130690,
        17187590, 18661437, 13200437, 26465112, 22761308,
      ],
      s: 'ok',
    };

    await this.redisService.set({
      key: `tradingview-dummy-data`,
      value: JSON.stringify(dummy),
    });
  }
}
