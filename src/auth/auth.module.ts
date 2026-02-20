import { forwardRef, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Communication } from 'src/admin/client/entities/communication.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { AdminKycModule } from 'src/admin/kyc/kyc.module';
import { LeadsModule } from 'src/admin/leads/leads.module';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { partner_links } from 'src/admin/partner/entities/partner-links.entity';
import { PartnerModule } from 'src/admin/partner/partner.module';
import { LeadQuestionRepository } from 'src/admin/questions/repositories/question.repository';
import { TaskModule } from 'src/admin/task/task.module';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { EventHandlService } from 'src/common/services/event.service';
import { ActivityLogType } from 'src/events/entities/active-log-type.entity';
import { ActivityLog } from 'src/events/entities/active-log.entity';
import { Event } from 'src/events/entities/events.entity';
import { UserLog } from 'src/events/entities/user-log.entity';
import { EventModule } from 'src/events/event.module';
import { EventService } from 'src/events/event.service';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';
import { Question } from 'src/kyc/entities/default_questions.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { AccountModule } from 'src/mt5/account/account.module';
import { notifications } from 'src/notification/entity/notification.entity';
import { NotificationService } from 'src/notification/notification.service';
import { Role } from 'src/roles/entities/role.entity';
import { RoleModule } from 'src/roles/role.module';
import { Partner } from 'src/settings/entities/partner.entity';
import { SettingsModule } from 'src/settings/settings.module';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { MasterTaskModule } from 'src/tasks/task.module';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { UserKycModule } from 'src/user-kyc-docs/user-kyc-documents.module';
import { Client } from 'src/users/entities/client.entity';
import { ResetPassword } from 'src/users/entities/reset_password.entity';
import { User } from 'src/users/entities/user.entity';
import { UserAnswer } from 'src/users/entities/user_kyc_answers.entity';
import { UserVerification } from 'src/users/entities/user_verification.entity';
import { RandomPasswordService } from 'src/utils/random-password.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { QuestionModule } from '../kyc/question-answer.module';
import { MailModule } from '../mail/mail.module';
import { SessionModule } from '../session/session.module';
import { ClientsModule } from '../users/clients.module';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import {
  AdminAuthController,
  AuthController,
  ClientAuthController,
} from './auth.controller';
import { AuthService } from './auth.service';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { WorldCheckModule } from 'src/world-check/worldCheck.module';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { OtpModule } from 'src/otp/otp.module';
import { Otp } from 'src/users/entities/otp.entity';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';
import { RegulationBlockedCountries } from 'src/admin/regulations/entities/regulation-blocked-countries.entity';
import { NotificationLabelRepository } from 'src/notification/repositories/notification_label.repository';
import { NotificationMessages } from 'src/notification/entity/notification_messages.entity';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { zapier_webhook_logs } from './entities/zapier-webhook-logs.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { ReferralProgramModule } from 'src/referral-program/referral-program.module';
import { Session } from 'src/session/entities/session.entity';
import { DeviceInfo } from 'src/push-notification/entities/device-info.entity';
import { RegulationsCountries } from 'src/admin/regulations/entities/regulations-countries.entity';
import { BankAccountModule } from 'src/admin/bank-account/bank-account.module';
import { Currencies } from 'src/currencies/entities/currencies.entity';
import { Countries } from 'src/psp/entities/countries.entity';

@Module({
  imports: [
    ClientsModule,
    WorldCheckModule,
    SessionModule,
    PassportModule,
    WalletModule,
    MailModule,
    QuestionModule,
    AdminKycModule,
    FilesModule,
    EventModule,
    MailerModule,
    MasterTaskModule,
    forwardRef(() => OtpModule),
    JwtModule.register({}),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([
      UserAnswer,
      Question,
      required_kyc_documents,
      Client,
      FileEntity,
      UserVerification,
      Communication,
      CustomStatus,
      Role,
      Event,
      User,
      ActivityLog,
      ActivityLogType,
      BillingInformation,
      UserLog,
      ResetPassword,
      Operator,
      Partner,
      notifications,
      Label,
      LabelTranslation,
      PartnerType,
      Transaction,
      partner_links,
      Regulations,
      RegulationBlockedCountries,
      Otp,
      TransactionMethod,
      NotificationMessages,
      EmailAttachments,
      zapier_webhook_logs,
      Desk,
      Session,
      DeviceInfo,
      RegulationsCountries,
      Currencies,
      Countries
    ]),
    TaskModule,
    RoleModule,
    AccountModule,
    UserKycModule,
    PartnerModule,
    SettingsModule,
    LeadsModule,
    NotificationModule,
    ReferralProgramModule,
    BankAccountModule
  ],
  controllers: [AuthController, AdminAuthController, ClientAuthController],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
    RandomPasswordService,
    FilesService,
    EventService,
    EventHandlService,
    NotificationService,
    LeadsRepository,
    LeadQuestionRepository,
    NotificationLabelRepository,
  ],
  exports: [AuthService],
})
export class AuthModule {}
