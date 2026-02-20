import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsService } from 'src/users/clients.service';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/users/entities/client.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { FilesService } from 'src/files/files.service';
import { Communication } from './entities/communication.entity';
import { BankDetailsService } from 'src/bank-details/bank-details.service';
import { BankDetail } from 'src/bank-details/entities/bank-detail.entity';
import { BankInfoController } from './bank-info/bank-info.controller';
import { BankDetailRepository } from 'src/bank-details/repositories/bank-detail.repository';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionController } from './transcation/transcation.controller';
import { ConfigModule } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';
import { WalletModule } from 'src/wallet/wallet.module';
import { ClientModule as Mt5ClientModule } from 'src/mt5/client/client.module';
import { CustomStatus } from './entities/custom_status.entity';
import { AccountModule as Mt5AccountModule } from 'src/mt5/account/account.module';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { Session } from 'src/session/entities/session.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailModule } from 'src/mail/mail.module';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { TradingModule } from 'src/trading/trading.module';
import { UserKYCDocumentDetail } from '../kyc/entities/user_kyc_document_detail.entity';
import { TableColumnOrder } from 'src/table-order/entities/table-order.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { TradingDealModule } from 'src/mt5/trading/deals/deal.module';
import { TradingPositionModule } from 'src/mt5/trading/positions/position.module';
import { AdminKycModule } from '../kyc/kyc.module';
import { UserAnswer } from 'src/users/entities/user_kyc_answers.entity';
import { QuestionService } from 'src/kyc/question-answer.service';
import { Question } from 'src/kyc/entities/default_questions.entity';
import { Answer } from 'src/kyc/entities/default_answers.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { notifications } from 'src/notification/entity/notification.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { TaskModule } from '../task/task.module';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { AdminTask } from '../task/entities/task.entity';
import { UserEWalletModule } from 'src/user-ewallet/user-ewallet.module';
import { UserCreditCardsModule } from 'src/user-credit-cards/user-credit-cards.module';
import { NotificationService } from 'src/notification/notification.service';
import { RejectedReason } from '../kyc/entities/rejected_reasons.entity';
import { RoleFilterRel } from 'src/roles/entities/role_filter_rel.entity';
import { LeadsRepository } from '../leads/repositories/lead.repository';
import { UserTask } from 'src/tasks/entities/user_task.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Template } from 'src/mail/entities/template.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { RoleModule } from 'src/roles/role.module';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailVariable } from 'src/mail/entities/email-variable.entity';
import { templateRepository } from 'src/users/repositories/template.repository';
import { layoutRepository } from 'src/users/repositories/layout.repository';
import { UserRepository } from 'src/users/repositories/user.repository';
import { Regulations } from '../regulations/entities/regulations.entity';
import { NotificationLabelRepository } from 'src/notification/repositories/notification_label.repository';
import { NotificationMessages } from 'src/notification/entity/notification_messages.entity';
import { Lead } from '../leads/entities/lead.entity';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { SettingsModule } from 'src/settings/settings.module';
import { DemoModule } from 'src/crm-website/demo/demo.module';
import { FreshDeskLogs } from 'src/fresh-desk/entities/freshdesk-logs.entity';
import { IbAutomationModule } from 'src/ib-automation/ib-automation.module';
import { Countries } from 'src/psp/entities/countries.entity';

@Module({
  imports: [
    MailerModule,
    MailModule,
    IbAutomationModule,
    TypeOrmModule.forFeature([
      User,
      Client,
      user_kyc_documents,
      required_kyc_documents,
      FileEntity,
      Communication,
      BankDetail,
      CustomStatus,
      Desk,
      Operator,
      Session,
      Wallet,
      TableColumnOrder,
      BillingInformation,
      UserKYCDocumentDetail,
      Mt5Account,
      Wallet,
      UserAnswer,
      Question,
      Answer,
      notifications,
      Label,
      LabelTranslation,
      Office,
      Partner,
      PartnerTradingGroups,
      AdminTask,
      CustomStatus,
      Mt5Account,
      RejectedReason,
      RoleFilterRel,
      UserTask,
      Transaction,
      Template,
      Layout,
      EmailEntity,
      EmailVariable,
      Regulations,
      NotificationMessages,
      Regulations,
      Lead,
      Regulations,
      Lead,
      EmailAttachments,
      Countries
    ]),
    TransactionModule,
    ConfigModule,
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    WalletModule,
    Mt5ClientModule,
    Mt5AccountModule,
    TradingModule,
    TradingDealModule,
    TradingPositionModule,
    AdminKycModule,
    NotificationModule,
    TaskModule,
    UserEWalletModule,
    UserCreditCardsModule,
    RoleModule,
    SettingsModule,
    DemoModule,
  ],
  controllers: [TransactionController, BankInfoController, ClientController],
  providers: [
    UserRepository,
    ClientRepository,
    IsExist,
    IsNotExist,
    ClientService,
    ClientsService,
    UserKycDocumentsService,
    BankDetailsService,
    FilesService,
    BankDetailRepository,
    QuestionService,
    NotificationService,
    LeadsRepository,
    templateRepository,
    layoutRepository,
    NotificationLabelRepository,
  ],
  exports: [
    ClientService,
    ClientsService,
    UserKycDocumentsService,
    FilesService,
    NotificationService,
  ],
})
export class ClientsModule {}
