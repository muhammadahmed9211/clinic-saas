import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IbCommissionProfileConfig } from './entities/ib_commission_profile_config.entity';
import { IbConfigController } from './ib_config.controller';
import { IbConfigService } from './ib_config.service';
import {
  IbConfigRepository,
  IbDistributionRepository,
  IbDistributionValueRepository,
} from './repositories/ib_config.repository';
import { IbDistribution } from './entities/ib_distribution.entity';
import { IbDistributionValue } from './entities/ib_distribution_value.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Client } from 'src/users/entities/client.entity';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerRepository } from 'src/admin/partner/repositories/partner.repository';
import { IbCommissionDeals } from '../entities/ib-commission-deals.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { IbConfigCalculationController } from './ib-config-calculation.controller';
import { AccountModule as Mt5AccountModule } from 'src/mt5/account/account.module';
import { User } from 'src/users/entities/user.entity';
import { Mt5Deal } from 'src/mt5/entities/mt5-deals.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IbCommissionProfileConfig,
      IbDistribution,
      IbDistributionValue,
      Mt5Account,
      Client,
      Partner,
      User,
      IbCommissionDeals,
      Mt5Deal
    ]),
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
    ]),
    KafkaModule,
    Mt5AccountModule,
  ],
  controllers: [IbConfigController, IbConfigCalculationController],
  providers: [
    IbConfigService,
    IbConfigRepository,
    IbDistributionRepository,
    IbDistributionValueRepository,
    Mt5AccountRepository,
    ClientRepository,
    PartnerRepository,
  ],
  exports:[IbConfigService]
})
export class IbConfigModule { }
