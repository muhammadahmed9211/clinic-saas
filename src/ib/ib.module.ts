import { Module } from '@nestjs/common';
import { IbService } from './ib.service';
import { IbController } from './ib.controller';
import { ClientsModule } from 'src/admin/client/client.module';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { IbLinks } from './entities/ib-link.entity';
import { PartnerModule } from 'src/admin/partner/partner.module';
import { partner_links } from 'src/admin/partner/entities/partner-links.entity';
import { CommissionModule } from './commission/commission.module';
import { IbCommissionDeals } from './commission/entities/ib-comission-deals.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { IbProfileModule } from './ib_profile/ib_profile.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ClientModule } from 'src/mt5/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      PartnerType,
      Partner,
      IbLinks,
      partner_links,
      IbCommissionDeals,
      Mt5Account,
    ]),
    ClientsModule,
    ClientModule,
    PartnerModule,
    CommissionModule,
    IbProfileModule,
    AuthModule
  ],
  controllers: [IbController],
  providers: [IbService, ClientRepository, LeadsRepository, UserRepository],
  exports: [IbService],
})
export class IbModule {}
