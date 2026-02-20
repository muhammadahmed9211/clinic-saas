/**
 * Price History Module
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - AllConfigType: src/config/config.types → src/config/config.type
 * - KafkaModule: ../kafka → src/kafka
 * - RedisCoreModule: ../redis → src/redis
 * - Symbol: Use from src/mt5/entities
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import {
  PriceHistoryController,
  PublicPriceHistoryController,
} from './price-history.controller';
import { PriceHistoryService } from './price-history.service';
import { RedisCoreModule } from 'src/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MT5_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka.mt5KafkaClientIdLive', {
                infer: true,
              }),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: configService.getOrThrow('kafka.mt5KafkaGroupIdLive', {
                infer: true,
              }),
            },
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([Mt5Symbol]),
    KafkaModule,
    RedisCoreModule,
  ],
  controllers: [PriceHistoryController, PublicPriceHistoryController],
  providers: [PriceHistoryService],
  exports: [PriceHistoryService],
})
export class PriceHistoryModule {}
