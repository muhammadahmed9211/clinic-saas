import { forwardRef, Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { AccountModule } from '../account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/users/entities/client.entity';
import { Mt5Account } from '../entities/mt5-account.entity';
import { TradingService } from 'src/trading/trading.service';
import { WalletService } from 'src/wallet/wallet.service';
import { PositionService } from '../trading/positions/position.service';
import { DealService } from '../trading/deals/deal.service';
import { TradingModule } from 'src/trading/trading.module';
import { WalletModule } from 'src/wallet/wallet.module';

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
    TypeOrmModule.forFeature([Client, Mt5Account]),
    KafkaModule,
    forwardRef(() => AccountModule),
    forwardRef(() => TradingModule),
    forwardRef(() => WalletModule),
  ],
  controllers: [ClientController],
  providers: [
    ClientService,
  ],
  exports: [ClientService],
})
export class ClientModule {}
