import { Module, forwardRef } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/users/entities/client.entity';
import { Mt5Account } from '../entities/mt5-account.entity';
import { Server } from 'src/wallet/entities/server.entity';
import { User } from 'src/users/entities/user.entity';
import { ClientModule as Mt5ClientModule } from '../client/client.module';
import { MailModule } from 'src/mail/mail.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { RandomPasswordService } from 'src/utils/random-password.service';
import { TransactionModule } from 'src/transaction/transaction.module';
import { Partitioners } from 'kafkajs';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { Mt5AccountRepository } from './repositories/mt5-account.repository';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { TradingGroupModule } from 'src/trading-group/trading-group.module';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { TradeRequestModule } from '../trading/trade-requests/trade-requests.module';
import { TradingDealModule } from '../trading/deals/deal.module';
import { TransactionUtilsService } from 'src/transaction/services/utils/utils.service';
import { PartnerRepository } from 'src/admin/partner/repositories/partner.repository';
import { PlugitModule } from 'src/plugit/plugit.module';
import { RegulationsConfigModule } from 'src/admin/regulations/regulations-config/regulations-config.module';
import { AdminKycModule } from 'src/admin/kyc/kyc.module';
import { Mt5AccountTradingType } from '../entities/mt5-account-trading-type.entity';
import { Mt5HttpModule } from '../http/mt5-http.module';
import { HttpSocketClientModule } from 'src/sockets/http-socket-client.module';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';

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
    TypeOrmModule.forFeature([
      Client,
      Mt5Account,
      Server,
      User,
      CustomStatus,
      Operator,
      Label,
      Wallet,
      PartnerTradingGroups,
      Partner,
      Mt5AccountTradingType,
      IbCommissionProfile,
    ]),
    KafkaModule,
    forwardRef(() => TransactionModule),
    forwardRef(() => Mt5ClientModule),
    MailModule,
    WalletModule,
    MailModule,
    NotificationModule,
    TradingGroupModule,
    TradeRequestModule,
    TradingDealModule,
    PlugitModule,
    RegulationsConfigModule,
    AdminKycModule,
    Mt5HttpModule,
    HttpSocketClientModule,
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    RandomPasswordService,
    Mt5AccountRepository,
    TransactionUtilsService,
    PartnerRepository,
  ],
  exports: [AccountService],
})
export class AccountModule {}
