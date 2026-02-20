import { Module } from '@nestjs/common';
import { PartnerGroupsService } from './partner-groups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { PartnerListSeedModule } from '../partner-list/create-partner-list-seed.module';
import { Partner } from 'src/settings/entities/partner.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PartnerTradingGroups, Partner, Desk]),
    PartnerListSeedModule,
  ],
  providers: [PartnerGroupsService],
})
export class PartnerGroupsModule {}
