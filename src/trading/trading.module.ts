import { Module, forwardRef } from '@nestjs/common';
import {
  AdminTradingController,
  ClientTradingController,
  TradingController,
} from './trading.controller';
import { TradingService } from './trading.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { ClientModule as Mt5ClientModule } from 'src/mt5/client/client.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import {
  AccountModule,
  AccountModule as Mt5AccountModule,
} from 'src/mt5/account/account.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TradingDealModule } from 'src/mt5/trading/deals/deal.module';
import { TradingPositionModule } from 'src/mt5/trading/positions/position.module';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/users/entities/user.entity';
import { LeverageRequest } from './entities/leverage-request.entity';
import { TradeRequestModule } from 'src/mt5/trading/trade-requests/trade-requests.module';
import { PositionService } from 'src/mt5/trading/positions/position.service';
import { DealService } from 'src/mt5/trading/deals/deal.service';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { Mt5HttpModule } from 'src/mt5/http/mt5-http.module';
import { Mt5UsersReplicated } from 'src/mt5/entities/mt5-users.entity';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';
import { InfoModule } from 'src/mt5-manager/market/info/info.module';
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
          },
        }),
        inject: [ConfigService],
      },
    ]),
    TypeOrmModule.forFeature([
      Mt5Account,
      User,
      LeverageRequest,
      Mt5UsersReplicated,
      Mt5Symbol,
    ]),
    forwardRef(() => WalletModule),
    forwardRef(() => Mt5ClientModule),
    forwardRef(() => Mt5AccountModule),
    KafkaModule,
    TradingDealModule,
    TradingPositionModule,
    MailModule,
    TradeRequestModule,
    forwardRef(() => AccountModule),
    Mt5HttpModule,
    InfoModule,
  ],
  controllers: [
    TradingController,
    ClientTradingController,
    AdminTradingController,
  ],
  providers: [
    TradingService,
    PositionService,
    DealService,
    Mt5AccountRepository,
  ],
  exports: [TradingService, PositionService, DealService],
})
export class TradingModule {}
