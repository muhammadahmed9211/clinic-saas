import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerSeedService } from './partner.service';
import { Partner } from 'src/settings/entities/partner.entity';
import { User } from 'src/users/entities/user.entity';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Partner, User, PartnerTradingGroups])],
  providers: [PartnerSeedService],
  exports: [PartnerSeedService],
})
export class PartnerSeedModule {}
