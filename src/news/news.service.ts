import { Injectable } from '@nestjs/common';
import { NewsDetailDto, NewsHotDto, NewsListDto } from './dtos/news.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { NewsHttpService } from './http/news-http.service';
import { YahooNewsRoutes } from './http/routes.enum';
import { RedisCoreService } from 'src/redis/redis.service';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

@Injectable()
export class NewsService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly httpService: NewsHttpService,
    private readonly redisService: RedisCoreService,
  ) {}

  private readonly yahooNewsUrl = this.configService.getOrThrow(
    'app.yahooNewsUrl',
    { infer: true },
  );

  private paginate<T>(
    data: T[],
    page: number = 1,
    limit: number = 10,
  ): PaginatedResponse<T> {
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);
    const total = data.length;
    const totalPages = Math.ceil(total / limit);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
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

  async getList(query: NewsListDto) {
    try {
      const { page = 1, limit = 10, ...apiParams } = query;
      const cacheKey = this.generateCacheKey('yahoo-news-list', apiParams);

      // Try to get from cache first
      let newsData: any = await this.redisService.get({ key: cacheKey });

      if (typeof newsData === 'string') {
        newsData = JSON.parse(newsData);
      }

      if (!newsData) {
        // Fetch from API if not in cache
        const res: any = await this.httpService.makeRequest(
          'GET',
          `${this.yahooNewsUrl}/${YahooNewsRoutes.LIST}`,
          {},
          { ...apiParams, limit: 100 },
        );

        if (!res?.success) {
          return {
            status: 1,
            statusCode: res?.code || 400,
            message: res?.message || 'Failed to fetch news list',
            data: null,
          };
        }

        newsData = res.data;

        // Add source to each item
        if (newsData?.main?.stream) {
          newsData.main.stream = newsData.main.stream.map((item: any) => ({
            ...item,
            source: 'Yahoo News',
          }));
        }

        // Cache the data for 24 hours
        await this.redisService.set({
          key: cacheKey,
          value: newsData,
          ttl: 60 * 60 * 24,
        });
      }

      // Paginate the results
      const streamData = newsData?.main?.stream || [];
      const paginatedResult = this.paginate(streamData, page, limit);

      return {
        status: 0,
        statusCode: 200,
        message: 'News list fetched successfully',
        result: {
          ...newsData,
          main: {
            ...newsData.main,
            stream: paginatedResult.data,
          },
        },
        pagination: paginatedResult.pagination,
      };
    } catch (error) {
      console.error('Error in getList:', error);
      throw error;
    }
  }

  async getDetail(query: NewsDetailDto) {
    try {
      const cacheKey = this.generateCacheKey('yahoo-news-detail', query);

      // Try to get from cache first
      let cachedData = await this.redisService.get({ key: cacheKey });

      if (cachedData) {
        return {
          status: 0,
          statusCode: 200,
          message: 'News detail fetched successfully (from cache)',
          result: cachedData,
        };
      }

      // Fetch from API if not in cache
      const res: any = await this.httpService.makeRequest(
        'GET',
        `${this.yahooNewsUrl}/${YahooNewsRoutes.DETAIL}`,
        {},
        query,
      );

      if (!res?.success) {
        return {
          status: 1,
          statusCode: res?.code || 400,
          message: res?.message || 'Failed to fetch news detail',
          result: null,
        };
      }

      // Cache the detail for 12 hours (details might change less frequently)
      await this.redisService.set({
        key: cacheKey,
        value: res.data,
        ttl: 60 * 60 * 12,
      });

      return {
        status: 0,
        statusCode: 200,
        message: 'News detail fetched successfully',
        result: res.data,
      };
    } catch (error) {
      console.error('Error in getDetail:', error);
      throw error;
    }
  }

  async getHot(query: NewsHotDto) {
    try {
      const { page = 1, limit = 10, ...apiParams } = query;
      const cacheKey = this.generateCacheKey('yahoo-news-hot', apiParams);

      // Try to get from cache first
      let hotNewsData: any = await this.redisService.get({ key: cacheKey });

      if (typeof hotNewsData === 'string') {
        hotNewsData = JSON.parse(hotNewsData);
      }

      if (!hotNewsData) {
        // Fetch from API if not in cache
        try {
        
        const res: any = await this.httpService.makeRequest(
          'GET',
          `${this.yahooNewsUrl}/${YahooNewsRoutes.HOT_NEWS}`,
          {},
          { ...apiParams, limit: 100 },
        );

        if (!res?.success) {
          return {
            status: 1,
            statusCode: res?.code || 400,
            message: res?.message || 'Failed to fetch hot news',
            result: null,
          };
        }

        hotNewsData = res.data;

        // Add source to each item
        if (Array.isArray(hotNewsData)) {
          hotNewsData = hotNewsData.map((item: any) => ({
            ...item,
            source: 'Yahoo News',
          }));
        }

        // Cache hot news for 2 hours (hot news changes more frequently)
        await this.redisService.set({
          key: cacheKey,
          value: hotNewsData,
          ttl: 60 * 60 * 2,
        });  
        } catch (error) {
           return {
            status: 0,
            statusCode: 200,
            message: 'Hot news fetched successfully',
            result: [],
          };
        }
      }

      // Paginate the results
      const newsArray = Array.isArray(hotNewsData) ? hotNewsData : [];
      const paginatedResult = this.paginate(newsArray, page, limit);

      return {
        status: 0,
        statusCode: 200,
        message: 'Hot news fetched successfully',
        result: paginatedResult.data,
        pagination: paginatedResult.pagination,
      };
    } catch (error) {
      console.error('Error in getHot:', error);
      throw error;
    }
  }

  async clearCache(type: 'list' | 'detail' | 'hot' | 'all', params?: any) {
    try {
      if (type === 'all') {
        // Clear all news-related cache (you might need to implement a pattern-based delete)
        const keys = await this.redisService.key({ key: 'yahoo-news-*' });
        for (const key of keys) {
          await this.redisService.remove({ key });
        }
        return { message: 'All news cache cleared successfully' };
      }

      const cacheKey = this.generateCacheKey(
        `yahoo-news-${type}`,
        params || {},
      );
      await this.redisService.remove({ key: cacheKey });

      return { message: `${type} cache cleared successfully` };
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }
}
