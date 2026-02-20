import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { user_kyc_documents } from './entities/user-kyc-documents.entity';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { UserKycDocuments } from './user-kyc-documents.controller';
import { UserKycDocumentsService } from './user-kyc-documents.service';
import { FilesService } from 'src/files/files.service';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { UserKYCDocumentDetail } from 'src/admin/kyc/entities/user_kyc_document_detail.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { notifications } from 'src/notification/entity/notification.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { Client } from 'src/users/entities/client.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { NotificationService } from 'src/notification/notification.service';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { UserTask } from 'src/tasks/entities/user_task.entity';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { NotificationLabelRepository } from 'src/notification/repositories/notification_label.repository';
import { NotificationMessages } from 'src/notification/entity/notification_messages.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { AdminTask } from 'src/admin/task/entities/task.entity';
import { ShuftiModule } from 'src/kyc-shufti/shufti.module';
import {ClientRepository} from 'src/users/repositories/client.repository'

@Module({
  imports: [
    MailerModule,
    MailModule,
    forwardRef(() => ShuftiModule),
    ConfigModule,
    TypeOrmModule.forFeature([
      user_kyc_documents,
      required_kyc_documents,
      FileEntity,
      CustomStatus,
      UserKYCDocumentDetail,
      User,
      notifications,
      Label,
      Client,
      Operator,
      LabelTranslation,
      RejectedReason,
      UserTask,
      Transaction,
      NotificationMessages,
      Lead,
      EmailAttachments,
      AdminTask,
    ]),
    NotificationModule,
  ],
  controllers: [UserKycDocuments],
  providers: [
    UserKycDocumentsService,
    FilesService,
    NotificationService,
    NotificationLabelRepository,
    TransactionRepository,
    ClientRepository
  ],
  exports: [UserKycDocumentsService],
})
export class UserKycModule {}
