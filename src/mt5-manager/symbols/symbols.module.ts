/**
 * Symbols Module
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 *
 * Import Updates:
 * - AllConfigType: src/config/config.types → src/config/config.type
 * - KafkaModule: ../kafka → src/kafka
 * - RedisCoreModule: ../redis → src/redis
 * - Symbol: ./entities/symbol.entity → src/mt5/entities/mt5-symbol.entity
 * - FavouriteSymbol: ./entities/favourite-symbol.entity → src/mt5/entities/mt5-favourite-symbol.entity
 * - User: ./entities/user.entity → src/users/entities/user.entity
 * - PopularSymbol: ./entities/popular-symbol.entity → src/mt5/entities/mt5-popular-symbol.entity
 */

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import {
  SymbolsController,
  PublicSymbolsController,
} from './symbols.controller';
import { SymbolsService } from './symbols.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { User } from 'src/users/entities/user.entity';
import { RedisCoreModule } from 'src/redis/redis.module';
import { PopularSymbol } from 'src/mt5/entities/mt5-popular-symbol.entity';
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
    TypeOrmModule.forFeature([Mt5Symbol]),
    KafkaModule,
    TypeOrmModule.forFeature([FavouriteSymbol, User, Mt5Symbol, PopularSymbol]),
    RedisCoreModule,
  ],
  controllers: [SymbolsController, PublicSymbolsController],
  providers: [SymbolsService],
  exports: [SymbolsService],
})
export class SymbolsModule {}
