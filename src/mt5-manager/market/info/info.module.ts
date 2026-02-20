/**
 * Market Info Module
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - KafkaModule: src/modules/kafka → src/kafka
 * - AllConfigType: src/config/config.types → src/config/config.type
 */

import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { RedisCoreModule } from 'src/redis/redis.module';
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
      {
        name: 'MT5_SERVICE_DEMO',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka.mt5KafkaClientIdDemo', {
                infer: true,
              }),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: configService.getOrThrow('kafka.mt5KafkaGroupIdDemo', {
                infer: true,
              }),
            },
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KafkaModule,
    RedisCoreModule,
  ],
  controllers: [InfoController],
  providers: [InfoService],
  exports: [InfoService],
})
export class InfoModule {}
