import { CacheModule, CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-ioredis-yet'; // Changed import
import { AllConfigType } from 'src/config/config.type';
import { RedisCoreService } from './redis.service';

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async (configService: ConfigService<AllConfigType>) => {
    return {
      store: redisStore, // No need to wrap in function
      host: configService.getOrThrow('redis.host', { infer: true }),
      port: configService.getOrThrow('redis.port', { infer: true }),
      password: configService.getOrThrow('redis.password', { infer: true }),
      ttl: 0, // 0 means no default TTL, rely on individual operations
    };
  },
  inject: [ConfigService],
};

@Global()
@Module({
  imports: [ConfigModule, CacheModule.registerAsync(RedisOptions)],
  exports: [CacheModule, RedisCoreService],
  providers: [RedisCoreService],
})
export class RedisCoreModule {}
