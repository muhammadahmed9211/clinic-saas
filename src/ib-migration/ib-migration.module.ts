import { Module } from '@nestjs/common';
import { IbMigrationService } from './ib-migration.service';
import { IbMigrationController } from './ib-migration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { Classification } from 'src/classification/entities/classification.entity';
import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';
import { IbConfigModule } from 'src/ib/ib_config/ib_config.module';
import { Server } from 'src/wallet/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    IbCommissionProfile,
    Classification,
    TradingGroup,
    Server
  ]), IbConfigModule],
  providers: [IbMigrationService],
})
export class IbMigrationModule { }
