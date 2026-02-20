import { Module, forwardRef } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { Client } from './entities/client.entity';
import { Communication } from 'src/admin/client/entities/communication.entity';
import { TwilioModule } from 'nestjs-twilio';
import { ConfigModule } from '@nestjs/config';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Session } from 'src/session/entities/session.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailModule } from 'src/mail/mail.module';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { ClientModule as Mt5ClientModule } from 'src/mt5/client/client.module';
import { AccountModule as Mt5AccountModule } from 'src/mt5/account/account.module';
import { TradingModule } from 'src/trading/trading.module';
import { UserKYCDocumentDetail } from 'src/admin/kyc/entities/user_kyc_document_detail.entity';
import { TableColumnOrder } from 'src/table-order/entities/table-order.entity';
import { UserAnswer } from './entities/user_kyc_answers.entity';
import { QuestionService } from 'src/kyc/question-answer.service';
import { Question } from 'src/kyc/entities/default_questions.entity';
import { Answer } from 'src/kyc/entities/default_answers.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from '../notification/entity/notification.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { ClientRepository } from './repositories/client.repository';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { NotificationService } from 'src/notification/notification.service';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { FileEntity } from 'src/files/entities/file.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { AdminKycModule } from 'src/admin/kyc/kyc.module';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { RoleFilterRel } from 'src/roles/entities/role_filter_rel.entity';
import { UserKycModule } from 'src/user-kyc-docs/user-kyc-documents.module';
import { TaskModule } from 'src/admin/task/task.module';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { UserTask } from 'src/tasks/entities/user_task.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Template } from 'src/mail/entities/template.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { RoleModule } from 'src/roles/role.module';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailVariable } from 'src/mail/entities/email-variable.entity';
import { templateRepository } from './repositories/template.repository';
import { layoutRepository } from './repositories/layout.repository';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';
import { UserRepository } from './repositories/user.repository';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { NotificationLabelRepository } from 'src/notification/repositories/notification_label.repository';
import { NotificationMessages } from 'src/notification/entity/notification_messages.entity';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { WalletModule } from 'src/wallet/wallet.module';
import { SettingsModule } from 'src/settings/settings.module';
import { TradingService } from 'src/trading/trading.service';
import { WalletService } from 'src/wallet/wallet.service';
import { PositionService } from 'src/mt5/trading/positions/position.service';
import { DealService } from 'src/mt5/trading/deals/deal.service';
import { DashboardModule } from 'src/admin/dashboard/dashboard.module';
import { DemoModule } from 'src/crm-website/demo/demo.module';

import { FreshDeskLogs } from 'src/fresh-desk/entities/freshdesk-logs.entity';
import { FreshDeskModule } from 'src/fresh-desk/fresh-desk.module';
import { IbAutomationModule } from 'src/ib-automation/ib-automation.module';
import { Countries } from 'src/psp/entities/countries.entity';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
@Module({
  imports: [
    ConfigModule,
    MailerModule,
    MailModule,
    RoleModule,
    IbAutomationModule,
    TypeOrmModule.forFeature([
      User,
      Client,
      Communication,
      CustomStatus,
      Desk,
      Operator,
      Session,
      Wallet,
      BillingInformation,
      TableColumnOrder,
      UserKYCDocumentDetail,
      UserAnswer,
      Question,
      Answer,
      Label,
      LabelTranslation,
      notifications,
      Office,
      Partner,
      PartnerTradingGroups,
      AdminTask,
      FileEntity,
      Mt5Account,
      RejectedReason,
      RoleFilterRel,
      Transaction,
      Template,
      Layout,
      EmailEntity,
      EmailVariable,
      TransactionMethod,
      Regulations,
      NotificationMessages,
      EmailAttachments,
      Countries,
      IbCommissionProfile
    ]),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    Mt5ClientModule,
    Mt5AccountModule,
    forwardRef(() => TradingModule),
    NotificationModule,
    FilesModule,
    AdminKycModule,
    UserKycModule,
    TaskModule,
    forwardRef(() => WalletModule),
    SettingsModule,
    DemoModule,
  ],
  controllers: [ClientsController],
  providers: [
    UserRepository,
    ClientRepository,
    IsExist,
    IsNotExist,
    ClientsService,
    QuestionService,
    NotificationService,
    FilesService,
    LeadsRepository,
    UserTask,
    templateRepository,
    layoutRepository,
    NotificationLabelRepository,
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
