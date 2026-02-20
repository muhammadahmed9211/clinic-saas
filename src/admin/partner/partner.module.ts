import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerController } from './partner.controller';
import { PartnerService } from './partner.service';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerRepository } from './repositories/partner.repository';
import { TaskModule } from '../task/task.module';
import { AdminKycModule } from '../kyc/kyc.module';
import { partner_links } from './entities/partner-links.entity';
import { User } from 'src/users/entities/user.entity';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { DeskType } from '../custom-dropdown/custom-dropdown/entities/desk_type.entity';
import { OperatorDeskRel } from '../custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { Client } from 'src/users/entities/client.entity';
import { PlugitModule } from 'src/plugit/plugit.module';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { IbProfileModule } from 'src/ib/ib_profile/ib_profile.module';
import { PartnerCommissionProfile } from 'src/settings/entities/partner-commission-profile.entity';
import { PartnerType } from '../custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { LeadsRepository } from '../leads/repositories/lead.repository';
import { ClientsModule } from '../client/client.module';

@Module({
  controllers: [PartnerController],
  imports: [
    forwardRef(() => AdminKycModule),
    TypeOrmModule.forFeature([
      Partner,
      partner_links,
      User,
      Operator,
      PartnerTradingGroups,
      Desk,
      Office,
      DeskType,
      OperatorDeskRel,
      Client,
      Mt5Account,
      Regulations,
      PartnerCommissionProfile,
      PartnerType
    ]),
    TaskModule,
    PlugitModule,
    IbProfileModule,
    forwardRef(() => ClientsModule)
  ],
  providers: [PartnerService, PartnerRepository, LeadsRepository],
  exports: [PartnerService],
})
export class PartnerModule { }
