import { DataUploadRepository } from 'src/upload-data/repositries/data-upload.repositries';
import { Lead } from './entities/lead.entity';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './repositories/lead.repository';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module';
import { LeadAnswer } from './entities/lead-answer.entity';
import { LeadQuestionRepository } from '../questions/repositories/question.repository';
import { PartnerModule } from '../partner/partner.module';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { PartnerRepository } from '../partner/repositories/partner.repository';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { OperatorRepository } from '../operator/repositories/operator.repository';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { CustomStatus } from '../client/entities/custom_status.entity';
import { JobModule } from 'src/jobs-processor/job.module';
import { SettingsModule } from 'src/settings/settings.module';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import { User } from 'src/users/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { Client } from 'src/users/entities/client.entity';
import { RoleModule } from 'src/roles/role.module';
import { Permission } from 'src/roles/entities/permissoin.entity';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';
import { OperatorDeskRel } from '../custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { Session } from 'src/session/entities/session.entity';
import { ClientsModule } from 'src/users/clients.module';
import { Regulations } from '../regulations/entities/regulations.entity';
import { DashboardModule } from '../dashboard/dashboard.module';
import { RegulationBlockedCountries } from '../regulations/entities/regulation-blocked-countries.entity';
import { AdminTask } from '../task/entities/task.entity';
import { Meetings } from './meetings/entities/meetings.entity';
import { notes } from '../kyc/entities/kycNotes.entity';
import { LeadsCallLog } from '../leads-call-logs/entities/leads-call-log.entity';
import { Opportunity } from './opportunity/entities/opportunity.entity';
// import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { SendEmailService } from 'src/common/services/send-email.service';
import { MailerService } from 'src/mailer/mailer.service';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailEvent } from '../email-mapping/entity/email-event.entity';
import { EmailMapping } from '../email-mapping/entity/email-mapping.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { Template } from 'src/mail/entities/template.entity';
import { KafkaModule } from 'src/kafka/kafka.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Communication } from '../client/entities/communication.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { AccountModule } from 'src/mt5/account/account.module';
import { OpportunityModule } from './opportunity/opportunity.module';
import { Role } from 'src/roles/entities/role.entity';
import { AutomationConfig } from '../automation/entities/automation-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      LeadAnswer,
      PartnerTradingGroups,
      Office,
      Desk,
      CustomStatus,
      Label,
      User,
      notifications,
      Client,
      Permission,
      PermissionRoleRel,
      OperatorDeskRel,
      Session,
      Regulations,
      RegulationBlockedCountries,
      AdminTask,
      Meetings,
      notes,
      LeadsCallLog,
      Opportunity,
      // Tickets,
      EmailEntity,
      EmailEvent,
      EmailMapping,
      Template,
      Transaction,
      Communication,
      Mt5Account,
      Role,
      user_kyc_documents,
      AutomationConfig,
    ]),
    TaskModule,
    PartnerModule,
    MailModule,
    MailerModule,
    TaskModule,
    JobModule,
    SettingsModule,
    RoleModule,
    KafkaModule,
    ClientsModule,
    ConfigModule,
    AccountModule,
    OpportunityModule,
    forwardRef(() => DashboardModule),
  ],
  controllers: [LeadsController],
  providers: [
    LeadsService,
    LeadQuestionRepository,
    DataUploadRepository,
    LeadsRepository,
    LeadQuestionRepository,
    PartnerRepository,
    OperatorRepository,
    SendEmailService,
    ClientRepository
  ],
  exports: [LeadsService],
})
export class LeadsModule {}
