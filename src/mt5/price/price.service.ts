import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { SymbolPriceDto } from './dto/get-price.dto';
import { PriceTopics } from './price.topics.enum';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisCoreService } from 'src/redis/redis.service';
import { MT5Symbol } from 'src/mt5-manager/market/interfaces/symbol-info.interface';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';

@Injectable()
export class PriceService {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    private readonly kafka: KafkaService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FavouriteSymbol)
    private readonly favouriteSymbolRepository: Repository<FavouriteSymbol>,
    private readonly redisService: RedisCoreService,
    @InjectRepository(Mt5Symbol)
    private readonly symbolRepository: Repository<Mt5Symbol>,
  ) {}

  async pricebySymbol(data: SymbolPriceDto) {
    return this.kafka.SendMessage(
      this.mt5Client,
      PriceTopics.getPriceBySymbol,
      data,
    );
  }

  async getQuotes(data: SymbolPriceDto) {
    return this.kafka.SendMessage(
      this.mt5Client,
      PriceTopics.getPriceBySymbol,
      data,
    );
  }

  async getGroupQuotes(data: {
    symbol?: string;
    group?: string;
    trans_id?: number;
  }) {
    return this.kafka.SendMessage(
      this.mt5Client,
      PriceTopics.quotesGroup,
      data,
    );
  }

  async getStatistics(data: SymbolPriceDto) {
    return this.kafka.SendMessage(this.mt5Client, PriceTopics.statistic, data);
  }

  async getTickHistory(data: {
    symbol?: string;
    from?: string;
    to?: string;
    data?: string;
  }) {
    return this.kafka.SendMessage(this.mt5Client, PriceTopics.tick, data);
  }

  async getM1History(data: {
    symbol?: string;
    from?: string;
    to?: string;
    data?: string;
  }) {
    return this.kafka.SendMessage(this.mt5Client, PriceTopics.m1History, data);
  }

  async getMarketDepth(data: { symbol?: string }) {
    return this.kafka.SendMessage(this.mt5Client, PriceTopics.market, data);
  }

  async toggleFavouriteSymbol(
    userId: number,
    symbolId: number,
    isFavourite: boolean,
  ) {
    if (isFavourite) {
      const existingEntry = await this.favouriteSymbolRepository.findOne({
        where: { userId, symbolId },
      });
      if (existingEntry) {
        throw new ConflictException(
          `Symbol is already marked as favourite by this user`,
        );
      }
      await this.favouriteSymbolRepository.insert({
        userId,
        symbolId,
        isActive: true,
      });

      // Invalidate cache after adding favorite
      await this.invalidateUserSymbolCache(userId);

      return this.favouriteSymbolRepository.findOne({
        where: { userId, symbolId },
        relations: ['symbol', 'user'],
      });
    } else {
      const deleteResult = await this.favouriteSymbolRepository.delete({
        userId,
        symbolId,
      });
      if (deleteResult.affected === 0) {
        throw new NotFoundException(
          `Favourite symbol with ID ${symbolId} not found for user`,
        );
      }
      // Invalidate cache after removing favorite
      await this.invalidateUserSymbolCache(userId);
      return { message: `Symbol ${symbolId} removed from favourites.` };
    }
  }
  private async invalidateUserSymbolCache(userId: number) {
    try {
      const pattern = `symbols:path:*:*:${userId}`;
      const keys = await this.redisService.key({ key: pattern });
      if (keys && keys.length > 0) {
        await Promise.all(keys.map((key) => this.redisService.remove({ key })));
        console.log(
          `Invalidated ${keys.length} cache entries for user ${userId}`,
        );
      }
    } catch (error) {
      console.warn('Failed to invalidate user symbol cache:', error);
    }
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

  /**
   * Calculate traders' sentiments based on price movement
   * @param symbol - The symbol code (e.g., 'XAUUSD.e')
   * @param currentPrice - The current price of the symbol
   * @returns Object containing buyers and sellers percentages
   */
  private async calculateTradersSentiments(
    symbol: string,
    currentPrice: number,
  ): Promise<{ buyers: number; sellers: number }> {
    let buyersPercentage = 50;
    let sellersPercentage = 50;

    try {
      if (currentPrice > 0) {
        // Get symbol entity from database to fetch opening price
        const symbolEntity = await this.symbolRepository.findOne({
          where: { symbolCode: symbol },
        });

        if (symbolEntity && symbolEntity.symbolData) {
          // Extract opening price from symbolData
          // Check common field names for opening price
          const openingPrice = symbolEntity.opening;

          console.log('openingPrice', openingPrice);

          if (openingPrice !== undefined && openingPrice !== null) {
            const openingPriceValue = parseFloat(
              typeof openingPrice === 'string'
                ? openingPrice
                : String(openingPrice),
            );

            if (!isNaN(openingPriceValue) && openingPriceValue > 0) {
              // Calculate the percentage change (increase/decrease)
              const percentageChange =
                ((currentPrice - openingPriceValue) / openingPriceValue) * 100;

              console.log('percentageChange', percentageChange);

              // Use the percentage change as adjustment
              const percentageAdjustment = percentageChange;

              // Calculate buyer and seller percentages
              // Base is 50%, add percentage change to buyers, subtract from sellers
              buyersPercentage = 50 + percentageAdjustment * 5;
              sellersPercentage = 50 - percentageAdjustment * 5;

              // Ensure percentages stay within valid bounds (0-100)
              buyersPercentage =
                Math.round(Math.max(0, Math.min(100, buyersPercentage)) * 1e5) /
                1e5;
              sellersPercentage =
                Math.round(
                  Math.max(0, Math.min(100, sellersPercentage)) * 1e5,
                ) / 1e5;
            }
          }
        }
      }
    } catch (error) {
      console.warn(
        `Failed to calculate traders sentiments for ${symbol}:`,
        error,
      );
      // Use default values on error
      buyersPercentage = 50;
      sellersPercentage = 50;
    }

    return {
      buyers: buyersPercentage,
      sellers: sellersPercentage,
    };
  }

  async getGoldInfo() {
    const cacheKey = 'goldInfo';
    let cacheData = await this.redisService.get({ key: cacheKey });

    if (cacheData && typeof cacheData === 'string') {
      try {
        return JSON.parse(cacheData);
      } catch (e) {
        console.error('Failed to parse cached result:', e);
        cacheData = null; // Reset if parsing fails
      }
    }

    const symbolInfo = await this.getSymbolInfo('XAUUSD.e');

    // Get current price to calculate spread percentage
    const priceData = await this.pricebySymbol({ symbol: 'XAUUSD.e' });

    const { result: priceResponse } = priceData as any;
    let currentPrice = 0;

    // Extract bid/ask from price response
    if (priceResponse?.answer) {
      const answer = Array.isArray(priceResponse.answer)
        ? priceResponse.answer[0]
        : priceResponse.answer;

      const bid = parseFloat(answer?.Bid || answer?.bid || '0');
      const ask = parseFloat(answer?.Ask || answer?.ask || '0');
      currentPrice = bid > 0 ? bid : ask;
    }

    // Calculate traders' sentiments based on price movement
    const tradersSentiments = await this.calculateTradersSentiments(
      'XAUUSD.e',
      currentPrice,
    );

    // Convert spread from points to actual value
    const spreadPoints = parseFloat(symbolInfo.Spread || '0');
    const point = parseFloat(symbolInfo.Point);
    const spread = spreadPoints * point;

    // Calculate spread percentage
    const spreadPercentage =
      currentPrice > 0 ? ((spread / currentPrice) * 100).toFixed(5) : '0.00';

    // Convert swap rates (overnight funding)
    const swapLongPoints = parseFloat(symbolInfo.SwapLong || '0');
    const swapShortPoints = parseFloat(symbolInfo.SwapShort || '0');

    const overnightFundingBuy =
      swapLongPoints / parseFloat(symbolInfo.SwapYearDay);
    const overnightFundingSell =
      swapShortPoints / parseFloat(symbolInfo.SwapYearDay);

    // Margin values
    const initialMargin = parseFloat(symbolInfo.MarginInitialBuy);
    const maintenanceMargin = parseFloat(symbolInfo.MarginMaintenanceBuy);

    // Calculate leverage from initial margin
    const leverageValue =
      initialMargin > 0 ? Math.round(100 / initialMargin) : 300;

    // Check if daily expiry (ExpirFlags)
    const hasDailyExpiry = symbolInfo.TimeStart !== symbolInfo.TimeExpiration;

    // Check swap/islamic account (SwapMode)
    const swapMode = parseInt(symbolInfo.SwapMode || '0', 10);
    const hasSwap = swapMode !== 0;

    const res = {
      tradersSentiments,
      information: {
        spread: spread.toFixed(5),
        spreadPercentage: `${spreadPercentage}%`,
        overnightFundingBuy: `${Math.abs(overnightFundingBuy).toFixed(5)}%`,
        overnightFundingSell: `${Math.abs(overnightFundingSell).toFixed(5)}%`,
        initialMargin: `${initialMargin * 100}%`,
        maintenanceMargin: `${maintenanceMargin * 100}%`,
        leverage: `1:${leverageValue}`,
        dailyExpiry: hasDailyExpiry ? 'Yes' : 'No',
        swapFreeIslamicAccount: hasSwap ? 'Yes' : 'No',
      },
    };

    await this.redisService.set({
      key: 'goldInfo',
      value: JSON.stringify(res),
      ttl: 60, // 1 minute
    });

    return res;
  }
}
