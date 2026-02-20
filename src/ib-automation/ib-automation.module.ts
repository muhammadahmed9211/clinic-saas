import { Module } from '@nestjs/common';
import { IbAutomationService } from './ib-automation.service';
import { IbAutomationController } from './ib-automation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { PartnerModule } from 'src/admin/partner/partner.module';
import { AccountModule } from 'src/mt5/account/account.module';
import { AdminKycModule } from 'src/admin/kyc/kyc.module';
import { Client } from 'src/users/entities/client.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailModule } from 'src/mail/mail.module';
import { FileEntity } from 'src/files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, IbCommissionProfile, Client, Operator, FileEntity]),
    PartnerModule,
    AccountModule,
    AdminKycModule,
    MailerModule,
    MailModule  
  ],
  controllers: [IbAutomationController],
  providers: [IbAutomationService],
  exports:[IbAutomationService]
})
export class IbAutomationModule {}
