/**
 * Symbols Service
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates Applied:
 * - AllConfigType: src/config/config.types → src/config/config.type
 * - User: ./entities/user.entity → src/users/entities/user.entity
 * - Symbol: ./entities/symbol.entity → src/mt5/entities/mt5-symbol.entity
 * - FavouriteSymbol: ./entities/favourite-symbol.entity → src/mt5/entities/mt5-favourite-symbol.entity
 * - PopularSymbol: ./entities/popular-symbol.entity → src/mt5/entities/mt5-popular-symbol.entity
 * - KafkaService: ../kafka/kafka.service → src/kafka/kafka.service
 * - RedisCoreService: ../redis/redis.service → src/redis/redis.service
 * - PriceTopics: ../price-history/price.topics.enum → src/mt5-manager/price-history/price.topics.enum
 */

import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { PopularSymbol } from 'src/mt5/entities/mt5-popular-symbol.entity';
import axios from 'axios';
import { convertToTimestamp } from 'src/common/helper';
import { RedisCoreService } from 'src/redis/redis.service';
import { GetAccountByLoginRequest } from './dtos/get-account-by-login-request.dto';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { PriceTopics } from 'src/mt5/price/price.topics.enum';
import { constants } from 'crypto';

@Injectable()
export class SymbolsService {
  private readonly logger = new Logger(SymbolsService.name);

  private readonly symbols = this.configService.getOrThrow('app.symbols', {
    infer: true,
  });

  constructor(
    private readonly kafka: KafkaService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(Mt5Symbol)
    private readonly symbolRepository: Repository<Mt5Symbol>,
    @InjectRepository(FavouriteSymbol)
    private readonly favouriteSymbolRepository: Repository<FavouriteSymbol>,
    @InjectRepository(PopularSymbol)
    private readonly popularSymbolRepository: Repository<PopularSymbol>,
    private readonly redisService: RedisCoreService,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
  ) {}

  //@Cron('*/20 * * * * *') // Run every 20 seconds
  async handleSymbolUpdateCron() {
    console.log('Running symbol update cron job');
    const result = await this.updateSymbols();

    if (result.success) {
      console.log(`Successfully updated ${result.count} symbols`);
    } else {
      console.error(`Failed to update symbols: ${result.error}`);
    }
  }

  async findAll(userId?: number, login?: string): Promise<any[]> {
    let filteredSymbols: any[] = [];

    // Get all active symbols
    const allSymbols = await this.symbolRepository.find({
      where: { isActive: true },
    });

    // Apply tier filtering only if login is provided
    if (login) {
      try {
        // Get MT5 account to extract tier
        const mt5Account = await this.getAccountByLogin({ login });

        if (mt5Account.status === 0 || mt5Account.result) {
          const group = mt5Account.result.Group;

          // Extract tier from group and validate/default to 's'
          const extractedTier = this.extractTierFromGroup(group);
          const groupTier = this.validateAndDefaultTier(extractedTier);

          // Filter symbols by tier matching
          const filteredSymbols = allSymbols.filter((symbol) => {
            const symbolTier = this.extractTierFromSymbolPath(
              symbol.symbolPath,
            );

            // Check if this symbol should be tier-filtered (Forex or Metals)
            const shouldFilter = this.shouldApplyTierFiltering(
              symbol.symbolPath,
            );

            // If not a tier-filtered symbol type, include all symbols
            if (!shouldFilter) {
              return true;
            }

            // Special case: if groupTier is 'demo_no_tier', show symbols without tier prefix
            if (groupTier === 'demo_no_tier') {
              return symbolTier === null; // Show symbols like "Forex\Exotic\AUDSGD"
            }

            // Normal case: exact tier matching
            return symbolTier === groupTier;
          });

          console.log(
            `Filtered ${filteredSymbols.length} symbols out of ${allSymbols.length} based on tier matching`,
          );
        } else {
          console.warn(
            `Account with login ${login} not found, returning all symbols`,
          );
          filteredSymbols = allSymbols;
        }
      } catch (error) {
        console.error('Error fetching MT5 account for tier filtering:', error);
        console.warn('Falling back to returning all symbols');
        filteredSymbols = allSymbols;
      }
    } else {
      // No login provided, return all symbols
      filteredSymbols = allSymbols;
      console.log(
        'No login provided, returning all symbols without tier filtering',
      );
    }

    if (!userId) {
      return filteredSymbols.map((symbol) => ({
        ...symbol,
        isFavourite: false,
      }));
    }

    const favs = await this.favouriteSymbolRepository.find({
      where: { userId },
      select: ['symbolId'],
    });

    const favSymbolIds = new Set(favs.map((f) => f.symbolId));

    return filteredSymbols.map((symbol) => ({
      ...symbol,
      isFavourite: favSymbolIds.has(symbol.id),
    }));
  }

  async findOne(id: number) {
    const symbol = await this.symbolRepository.findOne({
      where: { id, isActive: true },
    });

    if (!symbol) {
      throw new NotFoundException(`Symbol with ID ${id} not found`);
    }

    return symbol;
  }

  async findByPath(path: string, login: string, userId?: number) {
    // Cache key includes path and login for tier-specific caching
    const cacheKey = `symbols:path:${path}:${login || 'no-login'}:${
      userId || 'no-user'
    }`;

    // Try to get from cache first (5 minute cache)
    let cachedResult;
    try {
      cachedResult = await this.redisService.get({ key: cacheKey });
      if (cachedResult) {
        console.log(`Cache HIT for findByPath: ${path}`);
        return JSON.parse(cachedResult);
      }
    } catch (error) {
      console.warn(
        'Cache read failed for findByPath, proceeding with database query',
      );
    }

    console.log(`Cache MISS for findByPath: ${path}`);

    // Get tier info first (with its own caching)
    const groupTier = await this.getGroupTierCached(login);

    const formattedPath = path.replace(/\//g, '\\');

    // Single optimized database query with proper indexing
    let symbols: any[] = [];
    try {
      symbols = await this.symbolRepository
        .createQueryBuilder('symbol')
        .where('symbol.symbolPath LIKE :path', { path: `%${formattedPath}%` })
        .andWhere('symbol.isActive = :isActive', { isActive: true })
        .select([
          'symbol.id',
          'symbol.symbolCode',
          'symbol.symbolPath',
          'symbol.symbolDescription',
          'symbol.symbolSpread',
          'symbol.symbolData',
          'symbol.contractSize',
          'symbol.isTopMover',
          'symbol.multiply',
          'symbol.opening',
          'symbol.minVolume',
          'symbol.maxVolume',
          'symbol.stepVolume',
        ])
        .getMany();
    } catch (err) {
      console.error('Error fetching symbols from DB:', err);
      return [];
    }

    // Apply tier filtering
    const filteredSymbols = symbols.filter((symbol) => {
      const symbolTier = this.extractTierFromSymbolPath(symbol.symbolPath);
      const shouldFilter = this.shouldApplyTierFiltering(symbol.symbolPath);

      if (!shouldFilter) return true;
      if (groupTier === 'demo_no_tier') return symbolTier === null;
      return symbolTier === groupTier;
    });

    // Get favorites in parallel if userId provided
    let favSymbolIds = new Set<number>();
    if (userId) {
      try {
        const favs = await this.favouriteSymbolRepository.find({
          where: { userId },
          select: ['symbolId'],
        });
        favSymbolIds = new Set(favs.map((f) => f.symbolId));
      } catch (err) {
        console.error('Error fetching favourite symbols:', err);
      }
    }

    // Build final result
    const result = filteredSymbols.map((symbol) => {
      const rawData = symbol.symbolData || {};
      const filteredSymbolData = {
        Symbol: rawData.Symbol,
        Bid: rawData.Bid,
        Ask: rawData.Ask,
        Last: rawData.Last,
        Digits: rawData.Digits,
        Volume: rawData.Volume,
        VolumeReal: rawData.VolumeReal,
        Date: rawData.Date,
      };

      return {
        id: symbol.id,
        symbolCode: symbol.symbolCode,
        symbolPath: symbol.symbolPath,
        symbolDescription: symbol.symbolDescription,
        symbolSpread: symbol.symbolSpread,
        symbolData: filteredSymbolData,
        contractSize: symbol.contractSize,
        isTopMover: symbol.isTopMover,
        opening: symbol.opening,
        multiply: symbol.multiply,
        isFavourite: favSymbolIds.has(symbol.id),
        minVolume: symbol.minVolume,
        maxVolume: symbol.maxVolume,
        stepVolume: symbol.stepVolume,
      };
    });

    // Cache the result for 5 minutes
    try {
      await this.redisService.set({
        key: cacheKey,
        value: JSON.stringify(result),
        ttl: 300, // 5 minutes
      });
    } catch (error) {
      console.warn('Failed to cache findByPath result:', error);
    }

    return result;
  }

  private async getGroupTierCached(login: string): Promise<string> {
    if (!login) return 'e';

    const tierCacheKey = `user:tier:${login}`;

    try {
      const cachedTier: any = await this.redisService.get({
        key: tierCacheKey,
      });
      if (cachedTier) {
        return cachedTier;
      }
    } catch (error) {
      console.warn('Failed to read tier from cache');
    }

    // Cache miss - get from MT5
    let groupTier = 'e';
    try {
      const mt5Account = await this.getAccountByLogin({ login });

      if (
        mt5Account.status === 0 &&
        mt5Account.result &&
        !mt5Account.result.retcode
      ) {
        const group = mt5Account.result.Group;
        const extractedTier = this.extractTierFromGroup(group);
        groupTier = this.validateAndDefaultTier(extractedTier);

        // Cache tier for 30 minutes
        try {
          await this.redisService.set({
            key: tierCacheKey,
            value: groupTier,
            ttl: 1800, // 30 minutes
          });
        } catch (error) {
          console.warn('Failed to cache user tier');
        }
      }
    } catch (error) {
      console.error('Error fetching MT5 account for tier:', error);
    }

    return groupTier;
  }

  private extractTierFromGroup(group: string): string | null {
    const parts = group.split('\\');

    // Check if it's a demo account
    if (parts.length >= 2 && parts[0].toLowerCase() === 'demo') {
      // For demo accounts like "demo\USD_S", extract tier from second part
      const demoPart = parts[1];
      if (demoPart && demoPart.includes('_')) {
        // Extract character after underscore
        const tierPart = demoPart.split('_')[1];
        if (tierPart && tierPart.length > 0) {
          return tierPart.charAt(0).toLowerCase();
        }
      } else {
        // Demo without postfix like "demo\USD"
        return 'demo_no_tier';
      }
    }

    // For live accounts like "Live\AA\E", extract from third part
    if (parts.length >= 3) {
      return parts[2].charAt(0).toLowerCase();
    }

    return null;
  }

  private validateAndDefaultTier(tier: string | null): string {
    const validTiers = ['s', 'e', 'p'];

    // Special case for demo without tier
    if (tier === 'demo_no_tier') {
      return 'demo_no_tier';
    }

    if (tier && validTiers.includes(tier)) {
      return tier;
    }
    return 'e'; // Default to standard tier
  }

  private extractTierFromSymbolPath(symbolPath: string): string | null {
    if (!symbolPath || symbolPath.length === 0) {
      return null;
    }

    // Check if symbol path starts with tier prefix (E\, S\, P\)
    if (symbolPath.match(/^[ESP]\\/)) {
      return symbolPath.charAt(0).toLowerCase();
    }

    // For symbols that don't have tier prefix (like "Forex\Exotic\AUDSGD"), return null
    return null;
  }

  async findByCategory(category: string, userId?: number) {
    if (!category) {
      return this.findAll(userId);
    }
    // Convert category from frontend format (forex/major) to database format (Forex\Majors)
    const parts = category.split('/');
    let queryPath = '';
    if (parts.length >= 1) {
      queryPath +=
        parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
      if (parts.length > 1) {
        queryPath += '\\';
        if (parts[1].toLowerCase() === 'major') {
          queryPath += 'Majors';
        } else if (parts[1].toLowerCase() === 'minor') {
          queryPath += 'Minors';
        } else {
          queryPath +=
            parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
        }
        for (let i = 2; i < parts.length; i++) {
          queryPath +=
            '\\' +
            parts[i].charAt(0).toUpperCase() +
            parts[i].slice(1).toLowerCase();
        }
      }
    }
    const symbols = await this.symbolRepository.find({
      where: {
        symbolPath: Like(`%${queryPath}%`),
        isActive: true,
      },
    });
    if (!userId) {
      return symbols.map((symbol) => ({
        ...symbol,
        isFavourite: false,
      }));
    }
    const favs = await this.favouriteSymbolRepository.find({
      where: { userId },
      select: ['symbolId'],
    });
    const favSymbolIds = new Set(favs.map((f) => f.symbolId));
    return symbols.map((symbol) => ({
      ...symbol,
      isFavourite: favSymbolIds.has(symbol.id),
    }));
  }

  async pricebySymbol(data: string[]) {
    return this.kafka.SendMessage(
      this.mt5Client,
      PriceTopics.getPriceBySymbol,
      { symbol: data.join(','), trans_id: 0 },
    );
  }

  async updateSymbols() {
    console.log('Updating symbols from MT5');

    try {
      // First, remove duplicates (if needed)
      await this.removeDuplicateSymbols();

      console.log(`Fetching tick data for ${this.symbols.length} symbols`);

      // Get symbol tick data from MT5
      const { result: tickResponse } = await this.kafka.SendMessage(
        this.mt5Client,
        PriceTopics.getPriceBySymbol,
        { symbol: '*', trans_id: 0 },
      );

      const { answer } = tickResponse;

      console.log(`Received tick data from MT5 for ${answer.length} symbols`);

      if (!answer || !Array.isArray(answer)) {
        throw new Error('Invalid response from MT5 server');
      }

      // Process each symbol tick
      const processPromises = answer.map((tick) =>
        this.processSymbolTick(tick),
      );
      await Promise.all(processPromises);

      console.log('Symbol update completed successfully');
      return { success: true, count: answer.length };
    } catch (error) {
      console.error(`Error updating symbols from MT5: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  private async removeDuplicateSymbols() {
    try {
      // Get list of symbol codes with duplicates
      const duplicateQuery = `
        SELECT symbolCode
        FROM symbol
        GROUP BY symbolCode
        HAVING COUNT(*) > 1
      `;

      const duplicates = await this.symbolRepository.query(duplicateQuery);

      for (const duplicate of duplicates) {
        const { symbolCode } = duplicate;

        // Get all instances of this symbol code
        const symbols = await this.symbolRepository.find({
          where: { symbolCode },
          order: { id: 'DESC' },
        });

        // Keep the first one (newest by ID), delete the rest
        const [keep, ...remove] = symbols;
        const idsToRemove = remove.map((s) => s.id);

        if (idsToRemove.length > 0) {
          await this.symbolRepository.delete(idsToRemove);
          console.log(
            `Removed ${idsToRemove.length} duplicates for symbol ${symbolCode}`,
          );
        }
      }
    } catch (error) {
      console.error(`Error removing duplicate symbols: ${error.message}`);
    }
  }

  private async processSymbolTick(tick: any) {
    const symbolCode = tick.Symbol;
    if (!symbolCode) {
      console.warn('Received tick without Symbol property, skipping');
      return;
    }

    const spread = parseFloat((tick.Ask - tick.Bid).toFixed(5));
    const change = 0;

    try {
      // Check if symbol exists
      const existingSymbol = await this.symbolRepository.findOne({
        where: { symbolCode },
      });

      if (!existingSymbol) {
        // Symbol doesn't exist, fetch details and create it
        await this.createNewSymbol(symbolCode, spread, change, tick);
      } else {
        // Symbol exists, update it
        await this.updateExistingSymbol(existingSymbol, spread, change, tick);
      }
    } catch (error) {
      console.error(`Error processing symbol ${symbolCode}: ${error.message}`);
    }
  }

  private async createNewSymbol(
    symbolCode: string,
    spread: number,
    change: number,
    tick: any,
  ) {
    // Get symbol details from MT5
    const symbolResponse = await this.kafka.SendMessage(
      this.mt5Client,
      PriceTopics.getSymbolData,
      { symbol: symbolCode, trans_id: 0 },
    );

    console.log(`Creating new symbol: ${symbolCode}`, symbolResponse);

    const { Path, Description, ContractSize, Multiply } = symbolResponse.answer;

    // Try to get opening price with retry logic
    const openingPrice = await this.getOpenPrice(
      symbolCode,
      this.extractMainCategory(Path),
    );

    let openingPriceValue = '';
    let openingPriceUpdatedAt: Date | undefined = undefined;

    if (openingPrice !== null) {
      openingPriceValue = openingPrice.toString();
      openingPriceUpdatedAt = new Date();
      console.log(
        `Got opening price for new symbol ${symbolCode}: ${openingPrice}`,
      );
    } else {
      console.warn(
        `Could not get opening price for new symbol ${symbolCode}, will try again later`,
      );
    }

    const newSymbol = this.symbolRepository.create({
      symbolCode,
      symbolPath: Path,
      symbolDescription: Description,
      symbolSpread: spread,
      symbolChange: change,
      symbolData: { ...tick },
      isActive: true,
      contractSize: ContractSize,
      multiply: Multiply,
      opening: openingPriceValue,
      openingPriceUpdatedAt: openingPriceUpdatedAt,
    });

    await this.symbolRepository.save(newSymbol);
    console.log(`Created new symbol: ${symbolCode}`);
  }

  private async updateExistingSymbol(
    symbolEntity: Mt5Symbol,
    spread: number,
    change: number,
    tick: any,
  ) {
    // Apply spread multiplier for Forex symbols
    if (symbolEntity.symbolPath && symbolEntity.symbolPath.includes('Forex')) {
      spread *= 100000;
    }

    if (
      !symbolEntity.minVolume ||
      !symbolEntity.maxVolume ||
      !symbolEntity.stepVolume
    ) {
      const symbolResponse = await this.kafka.SendMessage(
        this.mt5Client,
        PriceTopics.getSymbolData,
        { symbol: symbolEntity.symbolCode, trans_id: 0 },
      );

      symbolEntity.minVolume = +symbolResponse?.answer?.VolumeMin;
      symbolEntity.maxVolume = +symbolResponse?.answer?.VolumeMax;
      symbolEntity.stepVolume = +symbolResponse?.answer?.VolumeStep;
    }

    // Always update the symbol data (every 20 seconds)
    symbolEntity.symbolData = tick;
    symbolEntity.symbolSpread = spread;
    symbolEntity.symbolChange = change;

    // Check if opening price needs to be updated
    const shouldUpdateOpeningPrice =
      !symbolEntity.opening ||
      symbolEntity.opening === '' ||
      (symbolEntity.openingPriceUpdatedAt &&
        this.isNewDay(symbolEntity.openingPriceUpdatedAt)) ||
      !symbolEntity.openingPriceUpdatedAt;

    if (shouldUpdateOpeningPrice) {
      console.log(
        `Attempting to update opening price for ${symbolEntity.symbolCode}`,
      );

      const openingPrice = await this.getOpenPrice(
        symbolEntity.symbolCode,
        symbolEntity.symbolPath,
      );

      if (openingPrice !== null) {
        symbolEntity.opening = openingPrice.toString();
        symbolEntity.openingPriceUpdatedAt = new Date();
        console.log(
          `Opening price updated for ${symbolEntity.symbolCode}: ${openingPrice}`,
        );
      } else {
        console.warn(
          `Skipping opening price update for ${symbolEntity.symbolCode} - all attempts failed`,
        );
        // Don't update openingPriceUpdatedAt so it will try again next time
      }
    }

    // Always save the entity (symbol data gets updated regardless of opening price)
    await this.symbolRepository.save(symbolEntity);
  }

  async findFavouritesByUserId(
    userId: number,
    login: string,
  ): Promise<{ statusText: string; data: Symbol[] }> {
    let groupTier = 'e'; // Default to standard tier

    if (login) {
      try {
        // Get MT5 account to extract tier
        const mt5Account = await this.getAccountByLogin({ login });

        if (
          mt5Account.status === 0 &&
          mt5Account.result &&
          !mt5Account.result.retcode
        ) {
          const group = mt5Account.result.Group;

          // Extract tier from group and validate/default to 's'
          const extractedTier = this.extractTierFromGroup(group);
          groupTier = this.validateAndDefaultTier(extractedTier);
          console.log(
            'Extracted tier:',
            extractedTier,
            'Validated tier:',
            groupTier,
          );
        } else {
          console.warn(
            `Account with login ${login} not found, using default tier 's'`,
          );
        }
      } catch (error) {
        console.error('Error fetching MT5 account for tier filtering:', error);
        console.warn('Falling back to default tier s');
      }
    }

    const favouriteSymbols = await this.favouriteSymbolRepository.find({
      where: { userId },
      relations: ['symbol'],
    });

    const allSymbols = favouriteSymbols.map((fav) => fav.symbol);

    // Filter symbols by tier matching
    const filteredSymbols = allSymbols.filter((sym: any) => {
      const symbolTier = this.extractTierFromSymbolPath(sym.symbolPath);

      // Check if this symbol should be tier-filtered (Forex or Metals)
      const shouldFilter = this.shouldApplyTierFiltering(sym.symbolPath);

      // If not a tier-filtered symbol type, include all symbols
      if (!shouldFilter) {
        return true;
      }
      if (groupTier === 'demo_no_tier') {
        return symbolTier === null; // Show symbols like "Forex\Exotic\AUDSGD"
      }

      // Normal case: exact tier matching
      return symbolTier === groupTier;
    });

    console.log(
      `Filtered ${filteredSymbols.length} favourite symbols out of ${allSymbols.length} based on tier matching`,
    );

    if (!filteredSymbols.length) {
      return {
        statusText: 'No favourite symbol found for your account tier',
        data: [],
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const updatedSymbolsPromises = (filteredSymbols as any[]).map((sym: any) =>
      this.fetchSymbolOpeningPrice(
        sym,
        today,
        this.extractMainCategory(sym.symbolPath),
      ),
    );
    const updatedSymbols = await Promise.all(updatedSymbolsPromises);
    return {
      statusText: 'Favourite symbols retrieved successfully',
      data: updatedSymbols.map((sym) => ({
        ...sym,
        isFavourite: true,
      })),
    };
  }

  async findTopMover(path: string, userId?: number, login?: string) {
    const cacheKey = `symbols:topmovers:${login || 'no-login'}:${
      userId || 'no-user'
    }:path:${path || 'all'}`;

    // Try cache first (shorter cache time for top movers - 1 minute)
    let cachedResult;
    try {
      cachedResult = await this.redisService.get({ key: cacheKey });
      if (cachedResult) {
        console.log('Cache HIT for findTopMover');
        return JSON.parse(cachedResult);
      }
    } catch (error) {
      console.warn(
        'Cache read failed for findTopMover, proceeding with database query',
      );
    }

    console.log('Cache MISS for findTopMover');

    // Get tier info (cached)
    const groupTier = login ? await this.getGroupTierCached(login) : 'e';

    // Single optimized query for top movers
    let queryBuilder = this.symbolRepository
      .createQueryBuilder('symbol')
      .where('symbol.isActive = :isActive', { isActive: true })
      .andWhere('symbol.isTopMover = :isTopMover', { isTopMover: true });

    // Only apply path filter if not "all"
    if (path.toLowerCase() !== 'all') {
      const formattedPath = path.replace(/\//g, '\\');
      queryBuilder = queryBuilder.andWhere('symbol.symbolPath LIKE :path', {
        path: `%${formattedPath}%`,
      });
    }

    let allSymbols: any[] = [];
    try {
      allSymbols = await queryBuilder.getMany();
    } catch (error) {
      console.error('Error fetching top mover symbols:', error);
      return [];
    }

    // Apply tier filtering
    const filteredSymbols = allSymbols.filter((symbol) => {
      const symbolTier = this.extractTierFromSymbolPath(symbol.symbolPath);
      const shouldFilter = this.shouldApplyTierFiltering(symbol.symbolPath);

      if (!shouldFilter) return true;
      if (groupTier === 'demo_no_tier') return symbolTier === null;
      return symbolTier === groupTier;
    });

    // Get favorites in parallel if needed
    let favSymbolIds = new Set<number>();
    if (userId) {
      try {
        const favourites = await this.favouriteSymbolRepository.find({
          where: { userId },
          select: ['symbolId'],
        });
        favSymbolIds = new Set(favourites.map((fav) => fav.symbolId));
      } catch (error) {
        console.error('Error fetching favorites for top movers:', error);
      }
    }

    const result = filteredSymbols.map((symbol) => ({
      ...symbol,
      isFavourite: favSymbolIds.has(symbol.id),
    }));

    // Cache result for 5 minutes
    try {
      await this.redisService.set({
        key: cacheKey,
        value: JSON.stringify(result),
        ttl: 300,
      });
    } catch (error) {
      console.warn('Failed to cache findTopMover result:', error);
    }

    return result;
  }

  async findPopular(
    login?: string,
    userId?: number,
    timeframe?: string,
  ): Promise<any[]> {
    let groupTier = 'e'; // Default to standard tier

    if (login) {
      try {
        // Get MT5 account to extract tier
        const mt5Account = await this.getAccountByLogin({ login });

        if (
          mt5Account.status === 0 &&
          mt5Account.result &&
          !mt5Account.result.retcode
        ) {
          const group = mt5Account.result.Group;

          // Extract tier from group and validate/default to 's'
          const extractedTier = this.extractTierFromGroup(group);
          groupTier = this.validateAndDefaultTier(extractedTier);
          console.log(
            'Extracted tier:',
            extractedTier,
            'Validated tier:',
            groupTier,
          );
        } else {
          console.warn(
            `Account with login ${login} not found, using default tier 's'`,
          );
        }
      } catch (error) {
        console.error('Error fetching MT5 account for tier filtering:', error);
        console.warn('Falling back to default tier s');
      }
    }

    const cacheKey = `symbols:popular:${groupTier}:${timeframe || 'all'}:${
      userId || 'no-user'
    }`;

    let cachedResult;
    try {
      cachedResult = await this.redisService.get({ key: cacheKey });
      if (cachedResult) {
        console.log('Cache HIT for findPopular');
        return JSON.parse(cachedResult);
      }
    } catch (error) {
      console.warn(
        'Cache read failed for findPopular, proceeding with database query',
      );
    }

    console.log('Cache MISS for findPopular');

    const where: any = { isActive: true };

    const TESTING_MODE = true;
    if (!TESTING_MODE && timeframe) {
      const now = new Date();
      let dateFilter: Date | undefined;

      switch (timeframe.toUpperCase()) {
        case '1D':
          dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '12H':
          dateFilter = new Date(now.getTime() - 12 * 60 * 60 * 1000);
          break;
        case '1W':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '1M':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '1Y':
          dateFilter = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          break;
      }

      if (dateFilter) {
        where.lastActiveAt = MoreThanOrEqual(dateFilter); // Changed from popularSince
      }
    }

    const popularSymbols = await this.popularSymbolRepository.find({
      where,
      relations: ['symbol'],
      order: {
        lastActiveAt: 'DESC', // Order by most recently active
      },
    });

    const allSymbols = popularSymbols.map((pop) => pop.symbol);

    // Filter symbols by tier matching
    const filteredSymbols = allSymbols.filter((symbol) => {
      const symbolTier = this.extractTierFromSymbolPath(symbol?.symbolPath);

      // Check if this symbol should be tier-filtered (Forex or Metals)
      const shouldFilter = this.shouldApplyTierFiltering(symbol?.symbolPath);

      // If not a tier-filtered symbol type, include all symbols
      if (!shouldFilter) {
        return true;
      }
      if (groupTier === 'demo_no_tier') {
        return symbolTier === null; // Show symbols like "Forex\Exotic\AUDSGD"
      }

      // Normal case: exact tier matching
      return symbolTier === groupTier;
    });

    console.log(
      `Filtered ${filteredSymbols.length} popular symbols out of ${allSymbols.length} based on tier matching`,
    );

    if (!filteredSymbols.length) {
      return [];
    }

    // Get favorites in parallel if needed
    let favSymbolIds = new Set<number>();
    if (userId) {
      try {
        const favourites = await this.favouriteSymbolRepository.find({
          where: { userId },
          select: ['symbolId'],
        });
        favSymbolIds = new Set(favourites.map((fav) => fav.symbolId));
      } catch (error) {
        console.error('Error fetching favorites for popular:', error);
      }
    }

    const result = filteredSymbols.map((symbol) => ({
      ...symbol,
      isFavourite: favSymbolIds.has(symbol.id),
    }));

    // Cache result for 5 minutes
    try {
      await this.redisService.set({
        key: cacheKey,
        value: JSON.stringify(result),
        ttl: 300, // 5 minutes
      });
    } catch (error) {
      console.warn('Failed to cache findPopular result:', error);
    }

    return result;
  }

  async fetchSymbolOpeningPrice(
    symbol: any,
    today: any,
    category: any,
  ): Promise<any> {
    const redisKey = `${symbol.symbolCode}-open-price-${convertToTimestamp(
      today.toString(),
    )}`;
    let opening = await this.redisService.get({ key: redisKey });
    if (!opening) {
      opening = await this.getOpenPrice(symbol.symbolCode, category);
    }
    return { ...symbol, opening: opening?.toString() || '' };
  }

  async getOpenPrice(
    symbol: string,
    category: string,
    attempt: number = 1,
  ): Promise<string | null> {
    const maxAttempts = 3;
    const timeoutMs = 10000; // 10 seconds timeout

    try {
      const mt5Url = this.configService.getOrThrow('app.siliconfortMt5ManagerUrl', {
        infer: true,
      });

      function isDST(date: Date): boolean {
        const dtf = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York',
          timeZoneName: 'short',
        });
        const parts = dtf.formatToParts(date);
        const timeZone =
          parts.find((p) => p.type === 'timeZoneName')?.value || '';
        return timeZone.includes('EDT');
      }

      const getPreviousTradingDay = (base: Date): Date => {
        const date = new Date(base);
        const day = date.getUTCDay();
        if (day === 1) date.setUTCDate(date.getUTCDate() - 3);
        else if (day === 0) date.setUTCDate(date.getUTCDate() - 2);
        else if (day === 6) date.setUTCDate(date.getUTCDate() - 1);
        else date.setUTCDate(date.getUTCDate() - 1);
        return date;
      };

      const now = new Date();
      const day = now.getUTCDay();
      let from: Date;
      let to: Date;

      // Weekend fallback
      if (day === 0 || day === 6) {
        const lastWorkingDay = getPreviousTradingDay(now);
        from = new Date(
          Date.UTC(
            lastWorkingDay.getUTCFullYear(),
            lastWorkingDay.getUTCMonth(),
            lastWorkingDay.getUTCDate(),
            16,
            30,
            0,
          ),
        );
        to = new Date(
          Date.UTC(
            lastWorkingDay.getUTCFullYear(),
            lastWorkingDay.getUTCMonth(),
            lastWorkingDay.getUTCDate(),
            17,
            35,
            0,
          ),
        );
      } else {
        // Weekday logic
        const nowUTC = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
          ),
        );
        const marketOpenHour = isDST(now) ? 16 : 17;
        const marketOpenUTC = new Date(
          Date.UTC(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            marketOpenHour,
            30,
            0,
          ),
        );

        if (nowUTC < marketOpenUTC) {
          const lastTradingDay = getPreviousTradingDay(nowUTC);
          from = new Date(
            Date.UTC(
              lastTradingDay.getUTCFullYear(),
              lastTradingDay.getUTCMonth(),
              lastTradingDay.getUTCDate(),
              marketOpenHour,
              30,
              0,
            ),
          );
          to = new Date(
            Date.UTC(
              lastTradingDay.getUTCFullYear(),
              lastTradingDay.getUTCMonth(),
              lastTradingDay.getUTCDate(),
              marketOpenHour,
              32,
              0,
            ),
          );
        } else {
          from = marketOpenUTC;
          to = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              marketOpenHour,
              32,
              0,
            ),
          );
        }
      }

      // Log attempt number
      if (attempt > 1) {
        console.log(
          `Attempting to get opening price for ${symbol} - attempt ${attempt}/${maxAttempts}`,
        );
      }

      // Make the HTTP request with timeout
      const result = await axios.get(`${mt5Url}/forex/m1-history`, {
        params: {
          symbol,
          from: convertToTimestamp(from.toISOString()),
          to: convertToTimestamp(to.toISOString()),
          data: 'o',
        },
        timeout: timeoutMs,
      });

      const res = result.data;
      if (
        res.result.retcode !== '0 Done' ||
        res?.result?.answer?.length === 0
      ) {
        console.warn(
          `getOpenPrice failed for ${symbol}: No data returned (attempt ${attempt})`,
        );
        return null;
      }

      const openPrice = res.result?.answer[0][0];

      // Cache in Redis on successful fetch
      await this.redisService.set({
        key: `${symbol}-open-price-${convertToTimestamp(from.toISOString())}`,
        value: JSON.stringify(openPrice),
      });

      // Log success if it was a retry
      if (attempt > 1) {
        console.log(
          `Successfully got opening price for ${symbol} on attempt ${attempt}`,
        );
      }

      return openPrice;
    } catch (error) {
      const isTimeoutError =
        error.code === 'ETIMEDOUT' ||
        error.message?.includes('timeout') ||
        error.message?.includes('operation timed out');

      if (isTimeoutError && attempt < maxAttempts) {
        console.warn(
          `Timeout for ${symbol} on attempt ${attempt}/${maxAttempts}, retrying...`,
        );

        // Wait before retry (exponential backoff: 1s, 2s, 4s)
        const waitTime = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        // Recursive retry
        return this.getOpenPrice(symbol, category, attempt + 1);
      } else {
        // Max attempts reached or non-timeout error, skip this symbol
        if (isTimeoutError) {
          console.error(
            `Skipping opening price for ${symbol} after ${maxAttempts} timeout attempts`,
          );
        } else {
          console.error(
            `Error getting opening price for ${symbol}: ${error.message}`,
          );
        }
        return null;
      }
    }
  }

  async findAllCategories() {
    try {
      // Query all active symbols from the database
      const symbols = await this.symbolRepository.find({
        select: ['symbolPath'],
        where: { isActive: true },
        order: { symbolPath: 'ASC' },
      });

      // Initialize the categories structure
      const categoriesMap: any = new Map();

      // Process each symbol to build the category hierarchy
      symbols.forEach((symbol) => {
        if (!symbol.symbolPath) return;

        const pathParts = symbol.symbolPath.split('\\');
        const mainCategory = pathParts[0];
        const subCategory = pathParts.length > 1 ? pathParts[1] : 'General';

        // Create main category if it doesn't exist
        if (!categoriesMap.has(mainCategory)) {
          categoriesMap.set(mainCategory, {
            name: mainCategory,
            subCategories: new Map(),
          });
        }

        // Add the subcategory
        const mainCategoryObj = categoriesMap.get(mainCategory);

        if (!mainCategoryObj.subCategories.has(subCategory)) {
          mainCategoryObj.subCategories.set(subCategory, {
            name: subCategory,
            count: 0,
          });
        }

        // Increment symbol count in the subcategory
        const subCategoryObj = mainCategoryObj.subCategories.get(subCategory);
        subCategoryObj.count++;
      });

      // Convert the map to an array structure for the response
      const result: any[] = [];

      categoriesMap.forEach((category) => {
        const subCategories: any[] = [];

        category.subCategories.forEach((subCategory) => {
          subCategories.push({
            name: subCategory.name,
            symbolCount: subCategory.count,
          });
        });

        // Sort subcategories alphabetically
        const sortedSubCategories = subCategories.sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        result.push({
          name: category.name,
          subCategoryCount: sortedSubCategories.length,
          symbolCount: sortedSubCategories.reduce(
            (count, subCat) => count + subCat.symbolCount,
            0,
          ),
          subCategories: sortedSubCategories,
        });
      });

      // Sort main categories alphabetically
      const sortedResult = result.sort((a, b) => a.name.localeCompare(b.name));

      return {
        status: 0,
        statusCode: 200,
        message: 'OK',
        result: {
          categoryCount: sortedResult.length,
          categories: sortedResult,
        },
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        status: 0,
        statusCode: 200,
        message: 'Failed to fetch categories',
        result: null,
      };
    }
  }

  extractMainCategory(path: string): string {
    if (!path) return '';
    const parts = path.split('\\');
    return parts[0];
  }

  async getAccountByLogin<T = any>(
    getAccountByLoginDto: GetAccountByLoginRequest,
  ): Promise<T> {
    const server = await this.checkAccountServer(getAccountByLoginDto.login);

    return this.kafka.SendMessage(
      this.mt5Client,
      'get-account-by-login',
      getAccountByLoginDto,
      server,
    );
  }

  async checkAccountServer(login: string) {
    const [account] = await this.symbolRepository.query(
      `SELECT TOP 1 * FROM mt5_account LEFT JOIN server ON mt5_account.serverId = server.id WHERE login = '${login}'`,
    );
    if (!account) throw new NotFoundException('Account not found');
    return account?.name?.toLowerCase();
  }

  async findByPathPublic(
    path: string,
    page?: number,
    pageSize?: number,
    topStocks?: boolean,
  ) {
    const dateKey = new Date().toISOString().split('T')[0];
    const cacheKey = `symbols:path:${path}:${page || 'all'}:${
      pageSize || 'all'
    }${topStocks ? ':topstocks' : ''}:${dateKey}`;

    // Try cache first
    let cachedResult;
    try {
      cachedResult = await this.redisService.get({ key: cacheKey });
      if (cachedResult) {
        console.log('Cache HIT for findByPathPublic');
        return JSON.parse(cachedResult);
      }
    } catch (error) {
      console.warn(
        'Cache read failed for findByPathPublic, proceeding with database query',
      );
    }

    console.log('Cache MISS for findByPathPublic');

    const formattedPath = path.replace(/\//g, '\\');
    let symbols: any[] = [];
    const skip = page && pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize || undefined;
    try {
      if (formattedPath == 'stocks' && topStocks) {
        symbols = await this.symbolRepository.find({
          where: {
            symbolCode: In([
              'NVIDIA',
              'Microsoft',
              'Apple',
              'Amazon',
              'Alphabet',
              'Facebook',
              'Tesla',
              'Berkshire.H',
            ]),
            isActive: true,
          },
          select: [
            'id',
            'symbolCode',
            'symbolPath',
            'symbolDescription',
            'symbolSpread',
            'symbolData',
            'deletedAt',
            'contractSize',
            'isTopMover',
            'multiply',
            'opening',
          ],
        });
      } else {
        symbols = await this.symbolRepository.find({
          where: {
            symbolPath: Like(`%${formattedPath}%`),
            isActive: true,
          },
          select: [
            'id',
            'symbolCode',
            'symbolPath',
            'symbolDescription',
            'symbolSpread',
            'symbolData',
            'deletedAt',
            'contractSize',
            'isTopMover',
            'multiply',
            'opening',
          ],
          skip,
          take,
        });
      }
    } catch (err) {
      console.error('Error fetching symbols from DB:', err);
      return [];
    }

    // Filter symbols by tier matching
    const filteredSymbols = symbols.filter((symbol) => {
      const shouldFilter = this.shouldApplyTierFiltering(symbol.symbolPath);
      if (!shouldFilter) {
        return true;
      }
      const symbolTier = this.extractTierFromSymbolPath(symbol.symbolPath);
      // Normal case: exact tier matching
      return symbolTier === 's';
    });

    console.log(
      `Filtered ${filteredSymbols.length} symbols out of ${symbols.length} based on tier matching`,
    );

    const result = filteredSymbols.map((symbol) => {
      const rawData = symbol.symbolData || {};
      const filteredSymbolData = {
        Symbol: rawData.Symbol,
        Bid: rawData.Bid,
        Ask: rawData.Ask,
        Last: rawData.Last,
      };

      return {
        id: symbol.id,
        symbolCode: symbol.symbolCode,
        symbolPath: symbol.symbolPath,
        symbolDescription: symbol.symbolDescription,
        symbolSpread: symbol.symbolSpread,
        symbolData: filteredSymbolData,
        deletedAt: symbol.deletedAt,
        contractSize: symbol.contractSize,
        isTopMover: symbol.isTopMover,
        opening: symbol.opening || '', // From DB
        multiply: symbol.multiply,
        isFavourite: false,
      };
    });

    try {
      await this.redisService.set({
        key: cacheKey,
        value: JSON.stringify(result),
        ttl: 300,
      });
    } catch (error) {
      console.warn('Failed to cache findByPathPublic result:', error);
    }

    return result;
  }

  private isNewDay(lastUpdated: Date): boolean {
    const today = new Date();
    const lastUpdateDate = new Date(lastUpdated);

    // Compare year, month, and day
    return (
      today.getFullYear() !== lastUpdateDate.getFullYear() ||
      today.getMonth() !== lastUpdateDate.getMonth() ||
      today.getDate() !== lastUpdateDate.getDate()
    );
  }

  private shouldApplyTierFiltering(symbolPath: string): boolean {
    if (!symbolPath) return false;

    const lowerPath = symbolPath.toLowerCase();
    return (
      lowerPath.includes('forex') ||
      lowerPath.includes('metals') ||
      lowerPath.includes('indices') ||
      lowerPath.includes('indicies') ||
      lowerPath.includes('gold') ||
      lowerPath.includes('energies')
    );
  }
}
