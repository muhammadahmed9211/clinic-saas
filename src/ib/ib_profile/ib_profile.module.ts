import { Global, Module } from '@nestjs/common';
import { IbProfileController } from './ib_profile.controller';
import { IbProfileService } from './ib_profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IbCommissionProfile } from './entities/ib_commission_profile.entity';
import { IbCommissionProfileTypeRepository, IbProfileDistributionRepository, IbProfileRepository } from './repositories/ib_profile.repository';
import { IbCommissionProfileType } from './entities/ib_commission_profile_type.entity';
import { IbProfileDistribution } from './entities/ib_profile_distribution.entity';
import { IbConfigRepository } from '../ib_config/repositories/ib_config.repository';
import { IbDistributionValue } from '../ib_config/entities/ib_distribution_value.entity';
import { IbDistribution } from '../ib_config/entities/ib_distribution.entity';
import { IbCommissionProfileConfig } from '../ib_config/entities/ib_commission_profile_config.entity';
import { User } from 'src/users/entities/user.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerCommissionProfile } from 'src/settings/entities/partner-commission-profile.entity';
import { TradingGroup } from 'src/trading-group/entities/trading-group.entity';
import { CommissionProfileKeyFeature } from './entities/ib_commission_profile_key_features.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([IbCommissionProfile,CommissionProfileKeyFeature , IbCommissionProfileType, IbProfileDistribution, IbDistributionValue, IbDistribution, IbCommissionProfileConfig, User, Partner , PartnerCommissionProfile, TradingGroup])],
  controllers: [IbProfileController],
  providers: [IbProfileService, IbProfileRepository, IbCommissionProfileTypeRepository, IbProfileDistributionRepository, IbConfigRepository],
  exports: [
    IbProfileService, 
    IbProfileRepository,
    TypeOrmModule, // Add this to export the repositories created by TypeOrmModule
  ],
})
export class IbProfileModule { }