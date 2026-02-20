import { Inject, Injectable } from '@nestjs/common';
import { SetRedisValueDto } from './dtos/set-redis-value.dto';
import { GetRedisValueDto } from './dtos/get-redis-value.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCoreService {
  private redisClient: any;
  constructor(@Inject(CACHE_MANAGER) private readonly redisService: Cache) {}

  async set(dto: SetRedisValueDto) {
    if (dto.ttl && this.redisClient) {
      // Use Redis client directly for TTL support
      await this.redisClient.setex(dto.key, dto.ttl, JSON.stringify(dto.value));
    } else {
      await this.redisService.set(dto.key, dto.value);
    }
  }

  async get(dto: GetRedisValueDto) {
    return this.redisService.get(dto.key);
  }

  async key(dto: GetRedisValueDto) {
    if (this.redisClient && this.redisClient.keys) {
      return await this.redisClient.keys(dto.key);
    }
    return await this.redisService.store.keys(dto.key);
  }

  async remove(dto: GetRedisValueDto) {
    if (this.redisClient && this.redisClient.del) {
      return await this.redisClient.del(dto.key);
    }
    return await this.redisService.store.del(dto.key);
  }

  onModuleInit() {
    const store = this.redisService.store as any;
    this.redisClient = store.client;
  }
}
