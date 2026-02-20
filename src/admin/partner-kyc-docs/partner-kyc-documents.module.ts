import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { User } from 'src/users/entities/user.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { MailModule } from 'src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { notifications } from 'src/notification/entity/notification.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { PartnerKycDocsController } from './partner-kyc-documents.controller';
import { PartnerKycDocsService } from './partner-kyc-documents.service';
import { partner_kyc_documents } from './entities/partner_kyc_docs.entity';
import { PartnerKYCDocumentDetail } from './entities/partner_kyc_document_details.entity';
import { PartnerKycDocumentsRepository } from './repositories/partner-kyc-documents.repository';
import { Partner } from 'src/settings/entities/partner.entity';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationService } from 'src/notification/notification.service';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { RejectedReason } from '../kyc/entities/rejected_reasons.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { NotificationLabelRepository } from 'src/notification/repositories/notification_label.repository';
import { NotificationMessages } from 'src/notification/entity/notification_messages.entity';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';

@Module({
  imports: [
    MailerModule,
    MailModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      partner_kyc_documents,
      required_kyc_documents,
      FileEntity,
      CustomStatus,
      User,
      notifications,
      PartnerKYCDocumentDetail,
      Label,
      Partner,
      Operator,
      LabelTranslation,
      RejectedReason,
      Transaction,
      NotificationMessages,
      EmailAttachments
    ]),
    NotificationModule,
  ],
  controllers: [PartnerKycDocsController],
  providers: [
    PartnerKycDocsService,
    FilesService,
    PartnerKycDocumentsRepository,
    NotificationService,
    NotificationLabelRepository,
  ],
  exports: [PartnerKycDocsService],
})
export class PartnerKycModule {}
