import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { parseStringPromise } from 'xml2js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { SentimentType, SignalsQueryDto } from './dto/signals.query.dto';
import { RedisCoreService } from 'src/redis/redis.service';

@Injectable()
export class HomeService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
    private readonly redisService: RedisCoreService,
  ) {}

  // private readonly token = this.configService.getOrThrow('app.tcToken', {
  //   infer: true,
  // });

  private readonly token = 'QkoRbuL%2fVd0yFd4CFSZ5Iw%3d%3d';
  private readonly baseUrl = 'https://feed.tradingcentral.com';

  appInfo() {
    return { name: this.configService.get('app.name', { infer: true }) };
  }

  private generateCacheKey(prefix: string, params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as any);

    const paramString = JSON.stringify(sortedParams);
    return `${prefix}-${Buffer.from(paramString).toString('base64')}`;
  }

  async fetchSignalsAsJson(
    dto: SignalsQueryDto,
    term: string,
    lang: string,
  ): Promise<any> {
    try {
       // Map short language codes to full locale codes
      const localeMap: Record<string, string> = {
        'en': 'en-US',
        'ar': 'ar-AE',
      };
      // Normalize and map the language
      const normalizedLang = lang?.toLowerCase().trim() || 'en';
      const culture = localeMap[normalizedLang] || 'en-US';
    
      const cacheKey = this.generateCacheKey('signals-json', {
        term,
        symbol: dto.symbol,
        marketType: dto.marketType,
        sentiment: dto.sentiment,
        pageNumber: dto.pageNumber,
        pageSize: dto.pageSize,
        search: dto.search,
        culture: culture,
      });
      // Try to get from cache first
      let cachedResult: any = await this.redisService.get({ key: cacheKey });

      if (cachedResult && typeof cachedResult === 'string') {
        try {
          cachedResult = JSON.parse(cachedResult);
        } catch (e) {
          console.error('Failed to parse cached result:', e);
          cachedResult = null; // Reset if parsing fails
        }
      }

      if (cachedResult) {
        return {
          ...cachedResult,
          metadata: {
            ...cachedResult.metadata,
            fromCache: true,
            fetchedAt: cachedResult?.metadata?.fetchedAt,
          },
        };
      }

      // Always fetch all data first, then filter and paginate
      const allSignals = await this.fetchAllSignalsForTerm({
        term,
        product: dto.symbol || null,
        productType: dto.marketType || null,
        culture: culture,
        // search: dto.search || null,   (will only work if we search like AUD/USD not like AUDUSD)
      });

      // Filter by sentiment if provided
      let filteredSignals = allSignals;
      if (dto.sentiment && Array.isArray(allSignals) && allSignals.length > 0) {
        filteredSignals = allSignals.filter((article: any) => {
          return (
            this.getSentiment(article, term?.toUpperCase()) === dto.sentiment
          );
        });
      }

      // Normalize helper
      const normalize = (text: string) =>
        text.replace(/[\/\s]/g, '').toLowerCase();

      // Apply flexible search on keywords only
      if (dto.search) {
        const searchTerm = normalize(dto.search);
        filteredSignals = filteredSignals.filter(
          (article: any, index: number) => {
            const keywords = article?.analysis?.content?.story?.keywords || '';
            const normalizedKeyword = normalize(keywords);
            const match = normalizedKeyword.includes(searchTerm);
            // console.log(`[MatchCheck #${index}] Raw: "${keywords}", Normalized: "${normalizedKeyword}", Match: ${match}`);
            return match;
          },
        );
      }
      // Apply pagination to filtered results
      const startIndex = (dto.pageNumber - 1) * dto.pageSize;
      const endIndex = startIndex + dto.pageSize;
      let paginatedResults = filteredSignals.slice(startIndex, endIndex);

      // Calculate pagination metadata
      const totalResults = filteredSignals.length;
      const totalPages = Math.ceil(totalResults / dto.pageSize);
      const hasNextPage = dto.pageNumber < totalPages;
      const hasPreviousPage = dto.pageNumber > 1;

      paginatedResults = paginatedResults.map((article: any) => {
        return {
          ...article,
          analysis: {
            ...article.analysis,
            content: {
              ...article.analysis.content,
              story: {
                ...article.analysis.content.story,
                paragraph: article.analysis.content.story.paragraph.filter(
                  (item: any) => typeof item === 'string' && item.trim() !== '',
                ),
              },
            },
          },
        };
      });

      const result = {
        items: {
          article: paginatedResults,
        },
        pagination: {
          currentPage: dto.pageNumber,
          pageSize: dto.pageSize,
          totalResults: totalResults,
          totalPages: totalPages,
          hasNextPage: hasNextPage,
          hasPreviousPage: hasPreviousPage,
          sentimentFilter: dto.sentiment || null,
          termFilter: term,
        },
        metadata: {
          totalUnfilteredResults: allSignals.length,
          fetchedAt: new Date(),
          fromCache: false,
        },
      };

      // Cache the result for 30 minutes (signals data changes frequently)

      await this.redisService.set({
        key: cacheKey,
        value: JSON.stringify(result),
        ttl: 120, //
      });

      return result;
    } catch (error) {
      console.error('Failed to fetch signals:', error);
      throw new Error('Failed to fetch trading signals');
    }
  }

  private async fetchAllSignalsForTerm({
    term,
    product = null,
    productType = null,
    search = null,
    culture = 'en-US',
  }: {
    term: string;
    product?: string | null;
    productType?: string | null;
    search?: string | null;
    culture?: string;
  }): Promise<any[]> {
    // Create cache key for raw signals data
    const cacheKey = this.generateCacheKey('signals-raw', {
      term,
      product,
      productType,
      culture
    });

    // Try to get from cache first
    let cachedSignals: any = await this.redisService.get({ key: cacheKey });

    if (cachedSignals && typeof cachedSignals === 'string') {
      try {
        cachedSignals = JSON.parse(cachedSignals);
        return cachedSignals;
      } catch (e) {
        console.error('Failed to parse cached result:', e);
        cachedSignals = null; // Reset if parsing fails
      }
    }

    let allSignals: any[] = [];
    let currentPage = 1;
    let hasMoreData = true;
    const maxPages = 50; // Increased safety limit since we're fetching all data

    console.log(`Fetching all signals for term: ${term}`);

    while (hasMoreData && currentPage <= maxPages) {
      try {
        const url = `${
          this.baseUrl
        }/ws_ta.asmx/GetFeed?culture=${culture}&type_product=${productType}&product=${
          product || null
        }&term=${term}&days=1&last_ta=false&partner=2116&token=${
          this.token
        }&pageNumber=${currentPage}&pageSize=100${
          search ? `&title=${search}` : ''
        }`;

        console.log(
          `Fetching page ${currentPage} for term ${term} from URL: ${url}`,
        );

        const response = await firstValueFrom(
          this.httpService.get(url, {
            responseType: 'text',
            timeout: 15000, // Increased timeout for larger requests
          }),
        );

        const xmlData = response.data;
        const jsonData = await parseStringPromise(xmlData, {
          explicitArray: false,
          trim: true,
          mergeAttrs: true,
        });

        if (!jsonData?.items?.article) {
          console.log(
            `No articles found on page ${currentPage}, stopping fetch`,
          );
          hasMoreData = false;
          break;
        }

        const articles = Array.isArray(jsonData.items.article)
          ? jsonData.items.article
          : [jsonData.items.article];

        if (articles.length === 0) {
          console.log(
            `Empty articles array on page ${currentPage}, stopping fetch`,
          );
          hasMoreData = false;
        } else {
          allSignals = [...allSignals, ...articles];
          console.log(
            `Added ${articles.length} articles from page ${currentPage}. Total: ${allSignals.length}`,
          );

          // If we got fewer results than requested page size, we've reached the end
          if (articles.length < 100) {
            console.log(
              `Received ${articles.length} articles (less than 100), reached end of data`,
            );
            hasMoreData = false;
          }

          currentPage++;
        }

        // Small delay to be respectful to the API
        await this.delay(200); // Slightly longer delay since we're making more requests
      } catch (error) {
        console.error(`Error fetching page ${currentPage}:`, error.message);

        // If it's a timeout or server error, we might want to retry once
        if (error.code === 'ECONNABORTED' || error.response?.status >= 500) {
          console.log(`Retrying page ${currentPage} after error...`);
          await this.delay(1000); // Wait 1 second before retry
          continue; // Retry the same page
        }

        hasMoreData = false;
      }
    }

    console.log(
      `Finished fetching. Total signals collected: ${allSignals.length}`,
    );

    // Cache the raw signals data for 15 minutes
    await this.redisService.set({
      key: cacheKey,
      value: JSON.stringify(allSignals),
      ttl: 120, // 2 minutes
    });

    return allSignals;
  }

  private getSentiment(article: any, termFilter?: string): SentimentType {
    const watchOptions =
      article?.analysis?.content?.header?.option?.watch || [];

    // Get the term from the actual data
    const dataTerm = article?.analysis?.content?.header?.term;

    let opinionType: string;

    if (termFilter) {
      // If specific term filter is passed, use that
      const termToOpinionMap = {
        INTRADAY: 'opinionIntraday',
        ST: 'opinionST',
        MT: 'opinionMT',
      };
      opinionType = termToOpinionMap[termFilter] || 'opinionIntraday';
    } else {
      // Otherwise, determine from the data's term
      const dataTermToOpinionMap = {
        INTRADAY: 'opinionIntraday',
        ST: 'opinionST',
        MT: 'opinionMT',
        SHORT: 'opinionST',
        MEDIUM: 'opinionMT',
        LONG: 'opinionMT',
      };
      opinionType = dataTermToOpinionMap[dataTerm] || 'opinionIntraday';
    }

    const opinion = watchOptions.find(
      (watch: any) => watch.type === opinionType,
    );

    if (!opinion) {
      return SentimentType.NEUTRAL;
    }

    const opinionValue = parseInt(opinion._);

    if (opinionValue > 0) {
      return SentimentType.BULLISH;
    } else if (opinionValue < 0) {
      return SentimentType.BEARISH;
    } else {
      return SentimentType.NEUTRAL;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Enhanced method with performance metrics
  // async fetchSignalsWithMetrics(
  //   dto: SignalsQueryDto,
  //   term: string,
  // ): Promise<any> {
  //   const startTime = Date.now();

  //   try {
  //     const result = await this.fetchSignalsAsJson(dto, term);

  //     const endTime = Date.now();
  //     const executionTime = endTime - startTime;

  //     return {
  //       ...result,
  //       performance: {
  //         executionTimeMs: executionTime,
  //         totalApiCalls: result.metadata.fromCache
  //           ? 0
  //           : Math.ceil(result.metadata.totalUnfilteredResults / 100), // Assuming 100 per page
  //         averageTimePerCall: result.metadata.fromCache
  //           ? 0
  //           : executionTime /
  //             Math.ceil(result.metadata.totalUnfilteredResults / 100),
  //         dataEfficiency: `${(
  //           (result.pagination.totalResults /
  //             result.metadata.totalUnfilteredResults) *
  //           100
  //         ).toFixed(1)}%`,
  //         cacheHit: result.metadata.fromCache,
  //       },
  //     };
  //   } catch (error) {
  //     const endTime = Date.now();
  //     const executionTime = endTime - startTime;

  //     console.error(`Failed after ${executionTime}ms:`, error);
  //     throw error;
  //   }
  // }

  // Method to get summary statistics for all sentiments
  // async getSentimentSummary(term: string): Promise<any> {
  //   const cacheKey = this.generateCacheKey('sentiment-summary', { term });

  //   // Try to get from cache first
  //   let cachedSummary = await this.redisService.get({ key: cacheKey });

  //   if (cachedSummary && typeof cachedSummary === 'string') {
  //     try {
  //       cachedSummary = JSON.parse(cachedSummary);
  //     } catch (e) {
  //       console.error('Failed to parse cached result:', e);
  //       cachedSummary = null;
  //     }
  //   }

  //   if (cachedSummary) {
  //     return {
  //       ...cachedSummary,
  //       fromCache: true,
  //     };
  //   }

  //   const allSignals = await this.fetchAllSignalsForTerm({ term });

  //   const summary = {
  //     total: allSignals.length,
  //     bullish: 0,
  //     bearish: 0,
  //     neutral: 0,
  //     term: term,
  //     generatedAt: new Date(),
  //     fromCache: false,
  //   };

  //   allSignals.forEach((article) => {
  //     const sentiment = this.getSentiment(article, term?.toUpperCase());
  //     summary[sentiment]++;
  //   });

  //   // Calculate percentages
  //   const percentages = {
  //     bullishPercent: ((summary.bullish / summary.total) * 100).toFixed(1),
  //     bearishPercent: ((summary.bearish / summary.total) * 100).toFixed(1),
  //     neutralPercent: ((summary.neutral / summary.total) * 100).toFixed(1),
  //   };

  //   const result = { ...summary, ...percentages };

  // Cache sentiment summary for 20 minutes
  // await this.redisService.set({
  //   key: cacheKey,
  //   value: JSON.stringify(result),
  //   ttl: 120, // 2 minutes
  // });

  //   return result;
  // }

  getInfo() {
    const withdrawalFee = this.configService.getOrThrow('app.withdrawalFee', {
      infer: true,
    });
    const depositFeeFee = this.configService.getOrThrow('app.depositFee', {
      infer: true,
    });

    const depositMinValue = this.configService.getOrThrow(
      'app.depositMinValue',
      {
        infer: true,
      },
    );
    const depositMaxValue = this.configService.getOrThrow(
      'app.depositMaxValue',
      {
        infer: true,
      },
    );

    let withdrawalMinValue = this.configService.getOrThrow(
      'app.withdrawalMinValue',
      {
        infer: true,
      },
    );

    const withdrawalMaxValue = this.configService.getOrThrow(
      'app.withdrawalMaxValue',
      {
        infer: true,
      },
    );

    const defaultCryptoPsp = this.configService.getOrThrow(
      'app.defaultCryptoPsp',
      {
        infer: true,
      },
    );

    const paymentGatewayCrypto = this.configService.getOrThrow(
      'app.paymentGatewayCrypto',
      {
        infer: true,
      },
    );

    const cryptoCurrency = this.configService.getOrThrow('app.cryptoCurrency', {
      infer: true,
    });

    const cryptoStandard = this.configService.getOrThrow('app.cryptoStandard', {
      infer: true,
    });

    const cryptoStandardCond = this.configService.getOrThrow(
      'app.cryptoStandardCond',
      {
        infer: true,
      },
    );

    return {
      withdrawalFee,
      withdrawalMinValue,
      withdrawalMaxValue,
      depositFeeFee,
      depositMinValue,
      depositMaxValue,
      defaultCryptoPsp,
      paymentGatewayCrypto,
      cryptoCurrency,
      cryptoStandard,
      cryptoStandardCond,
    };
  }

  // Cache management methods
  async clearCache(
    type: 'signals-json' | 'signals-raw' | 'sentiment-summary' | 'all',
    params?: any,
  ) {
    try {
      if (type === 'all') {
        // Clear all signals-related cache
        const keys = await this.redisService.key({ key: 'signals-*' });
        for (const key of keys) {
          await this.redisService.remove({ key });
        }
        return { message: 'All signals cache cleared successfully' };
      }

      const cacheKey = this.generateCacheKey(type, params || {});
      await this.redisService.remove({ key: cacheKey });

      return { message: `${type} cache cleared successfully` };
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  // Method to warm up cache for commonly used terms
  async warmUpCache(terms: string[], marketTypes?: string[]) {
    const results: any = [];

    for (const term of terms) {
      try {
        if (marketTypes) {
          for (const marketType of marketTypes) {
            console.log(
              `Warming up cache for term: ${term}, marketType: ${marketType}`,
            );
            await this.fetchAllSignalsForTerm({
              term,
              productType: marketType,
            });
            results.push({ term, marketType, status: 'success' });
          }
        } else {
          console.log(`Warming up cache for term: ${term}`);
          await this.fetchAllSignalsForTerm({ term });
          results.push({ term, status: 'success' });
        }
      } catch (error) {
        console.error(`Failed to warm up cache for term: ${term}`, error);
        results.push({ term, status: 'failed', error: error.message });
      }
    }

    return {
      message: 'Cache warm-up completed',
      results,
    };
  }

  // Get cache statistics
  async getCacheStats() {
    try {
      const signalsKeys = await this.redisService.key({ key: 'signals-*' });

      const stats = {
        totalCacheKeys: signalsKeys.length,
        cacheKeys: signalsKeys,
        generatedAt: new Date(),
      };

      return stats;
    } catch (error) {
      console.error('Error getting cache stats:', error);
      throw error;
    }
  }
}
