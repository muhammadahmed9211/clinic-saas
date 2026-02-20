import { Module } from '@nestjs/common';
import { AdminKycService } from './kyc.service';
import { AdminKycController } from './kyc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { required_kyc_documents } from './entities/admin-kyc.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { UserAnswer } from 'src/users/entities/user_kyc_answers.entity';
import { User } from 'src/users/entities/user.entity';
import { UserKYCDocumentDetail } from './entities/user_kyc_document_detail.entity';
import { RejectedReason } from './entities/rejected_reasons.entity';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { FilesService } from 'src/files/files.service';
import { FileEntity } from 'src/files/entities/file.entity';
import { notes } from './entities/kycNotes.entity';
import { UserKycDocumentsRepository } from './repositories/user-kyc-documents.repository';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { UserKycModule } from 'src/user-kyc-docs/user-kyc-documents.module';
import { Session } from 'src/session/entities/session.entity';
import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { EmailAttachments } from 'src/mail/entities/emailAttachments.entity';
import { Client } from 'src/users/entities/client.entity';
import { Lead } from '../leads/entities/lead.entity';
import { CustomStatus } from '../client/entities/custom_status.entity';
import { AutomationConfig } from '../automation/entities/automation-config.entity';

@Module({
  imports: [
    UserKycModule,
    TypeOrmModule.forFeature([
      required_kyc_documents,
      UserAnswer,
      User,
      UserKYCDocumentDetail,
      RejectedReason,
      user_kyc_documents,
      FileEntity,
      notes,
      Operator,
      Session,
      Tickets,
      EmailAttachments,
      Client,
      Lead,
      CustomStatus,
      AutomationConfig,
    ]),
  ],
  controllers: [AdminKycController],
  providers: [
    IsExist,
    IsNotExist,
    AdminKycService,
    FilesService,
    UserKycDocumentsRepository,
  ],
  exports: [AdminKycService],
})
export class AdminKycModule {}
