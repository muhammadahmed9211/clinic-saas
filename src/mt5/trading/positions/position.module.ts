import { Module } from '@nestjs/common';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { Mt5HttpModule } from 'src/mt5/http/mt5-http.module';

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
          },
        }),
        inject: [ConfigService],
      },
    ]),
    // TypeOrmModule.forFeature([Mt5Account]),
    KafkaModule,
    Mt5HttpModule,
  ],
  controllers: [PositionController],
  providers: [PositionService, Mt5AccountRepository],
  exports: [PositionService],
})
export class TradingPositionModule {}
