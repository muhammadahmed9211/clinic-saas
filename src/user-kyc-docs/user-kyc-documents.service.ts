import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { user_kyc_documents } from './entities/user-kyc-documents.entity';
import { CreateUserKycDocumentsDto } from './dto/user-kyc-documents.dto';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FilesService } from 'src/files/files.service';
import { UserKycDocumentDTO } from './dto/getKycDocumentsUrl.dto';
import { KycInfoDto } from 'src/admin/client/dto/clientKycInfo.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { I18nContext } from 'nestjs-i18n';
import { User } from 'src/users/entities/user.entity';
import { UserKYCDocumentDetail } from 'src/admin/kyc/entities/user_kyc_document_detail.entity';
import { MailService } from 'src/mail/mail.service';
import { MailerService } from 'src/mailer/mailer.service';
import { notifications } from 'src/notification/entity/notification.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { Client } from 'src/users/entities/client.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { NotificationService } from 'src/notification/notification.service';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import {
  KYCEmailDto,
  KycTemplateNames,
  KycTemplateSubject_AR,
  KycTemplateSubject_EN,
} from 'src/admin/kyc/dto/admin-kyc.dto';
import { MailSenderType } from 'src/email/dto/mail.send.dto';
import { UserTask } from 'src/tasks/entities/user_task.entity';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { AdminTask, TaskEntityType } from 'src/admin/task/entities/task.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';

@Injectable()
export class UserKycDocumentsService {
  constructor(
    @InjectRepository(user_kyc_documents)
    private readonly userKycDocsRepository: Repository<user_kyc_documents>,
    @InjectRepository(required_kyc_documents)
    private required_kyc_documents: Repository<required_kyc_documents>,
    @InjectRepository(FileEntity)
    private fileEntity: Repository<FileEntity>,
    private readonly filesService: FilesService,
    @InjectRepository(CustomStatus)
    private customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserKYCDocumentDetail)
    private userKYCDocumentDetailRepository: Repository<UserKYCDocumentDetail>,
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
    @InjectRepository(notifications)
    private notificationRepository: Repository<notifications>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    private readonly notificationService: NotificationService,
    @InjectRepository(RejectedReason)
    private readonly rejectedReasonRepository: Repository<RejectedReason>,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(UserTask)
    private readonly userTaskRepository: Repository<UserTask>,
    private readonly eventEmitter: EventEmitter2,
    // private socketGateway: SocketGateway,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(AdminTask)
    private readonly adminTaskRepository: Repository<AdminTask>,
  ) {}

  async createUserKycDocs(
    docs: CreateUserKycDocumentsDto[],
    userId?: number,
    roleId?: number,
    operatorId?: number,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const kycData: any[] = [];
    const message = i18n?.t('success.kyc.documentSavedSuccessfully');
    const loggedInUser = await this.userRepository.findOne({ where: { id: operatorId } });

    for await (const document of docs) {
      if (!document.side) {
        const message = i18n?.t('errors.kyc.documentSideNoteFound');
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: {
              msg: message,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }
      const { documentId, fileId, field_id, side } = document;

      const existingDocuments = await this.required_kyc_documents.findOne({
        where: { id: documentId },
      });

      if (!existingDocuments) {
        const message = await i18n?.t('errors.kyc.documentNotFound');
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: {
              msg: message,
            },
          },
          HttpStatus.NOT_FOUND,
        );
      }
    const shufiReportDoc = await this.required_kyc_documents.findOne({
    where: { name: 'Shufi Report' }, 
  });

     // Condition to decide whether to proceed
if ((documentId !== shufiReportDoc?.id && side === 'front') || documentId === shufiReportDoc?.id) {
  // Build dynamic where condition
  const whereCondition: any = { documentId, userId, field_id };
console.log("true1")
  if (documentId === shufiReportDoc?.id) {
    whereCondition.side = side;
    console.log("true2") // side bhi match kare sirf documentId 7 ke liye
  }
console.log("true3")
  const existingDocuments = await this.userKycDocsRepository.find({
    where: whereCondition,
    order: { id: 'DESC' },
  });
if (existingDocuments && existingDocuments.length > 0) {
  const idsToDeactivate = existingDocuments.map((doc) => doc.id);

  await this.userKycDocsRepository.update(idsToDeactivate, { status: 'inactive' });
}
}


      const kycStatusPending = await this.customStatusRepository.findOne({
        where: { type: 'kyc_status' as any, name: 'Pending Review' },
      });

      const kycStatusApproved = await this.customStatusRepository.findOne({
        where: { type: 'kyc_status' as any, name: 'Approved' },
      });

      const existingDetailDocumentNew =
        await this.userKycDocsRepository.findOne({
          where: { userId, status: 'active', field_id: field_id },
          order: { id: 'DESC' },
        });

      const newDocument = await this.userKycDocsRepository.save({
        userId,
        documentId,
        fileId,
        field_id,
        side,
        status: 'active',
        state: 'pending',
        kycStatus: kycStatusPending?.id,
      });
      kycData.push(newDocument);

      const existingDetailDocument = await this.userKycDocsRepository.findOne({
        where: { userId, status: 'active', field_id: field_id },
        order: { id: 'DESC' },
      });

      const newDetailDocumentId = existingDetailDocument?.id;
      const userDetails = await this.userRepository.findOne({
        where: { id: userId },
      });
      const updatedLang = userDetails?.languageIso.toLocaleUpperCase();
      const newType = `${existingDetailDocument?.field_id
        .toUpperCase()
        .replace('_', ' ')}`;
      if (
        !userDetails?.firstName ||
        !userDetails?.lastName ||
        !newDetailDocumentId ||
        !newType
      ) {
        throw new UnprocessableEntityException('');
      }
      let isExistDocument = false;
      if (existingDetailDocumentNew?.id) {
        const detailDocument =
          await this.userKYCDocumentDetailRepository.findOne({
            where: { userKYCDocuments: { id: existingDetailDocumentNew.id } },
          });
        isExistDocument = Boolean(detailDocument);
      }
      if (!isExistDocument) {
        const detDocument = await this.userKYCDocumentDetailRepository.save({
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          userKYCDocuments: { id: newDetailDocumentId },
          type: newType,
        });
        if(roleId != 2) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: detDocument,
          oldData: null,
          entityId: detDocument.id,
          entityType: 'KycDocument',
          performerId: loggedInUser?.operator?.id,
          performerType: 'Operator',
          field: 'Record Created',
        });
    
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordCreated',
          entity_id: detDocument.id,
          entity_type: 'KycDocument',
          json_object: detDocument,
          performer_id: loggedInUser?.operator?.id,
          parent_id: userId,
          parent_type: 'User',
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default',
        });
      }
      else{
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: detDocument,
          oldData: null,
          entityId: detDocument.id,
          entityType: 'KycDocument',
          performerId: userId,
          performerType: 'User',
          field: 'Record Created',
        });
    
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordCreated',
          entity_id: detDocument.id,
          entity_type: 'KycDocument',
          json_object: detDocument,
          parent_id: userId,
          parent_type: 'User',
          performer_id: userId,
          performer_type: 'User',
          is_from_archive: 0,
          trigger_type: 'Default',
        });

      }
      }
      const operator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });
      if(roleId != 2) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: newDocument,
          oldData: null,
          entityId: newDocument.id,
          entityType: 'KycDocument',
          performerId: loggedInUser?.operator?.id,
          performerType: 'Operator',
          field: 'Record Created',
        });
    
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordCreated',
          entity_id: newDocument.id,
          entity_type: 'KycDocument',
          parent_id: userId,
          parent_type: 'User',
          json_object: newDocument,
          performer_id: loggedInUser?.operator?.id,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default',
        }); 
      }
      else{
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: newDocument,
          oldData: null,
          entityId: newDocument.id,
          entityType: 'KycDocument',
          performerId: userId,
          performerType: 'User',
          field: 'Record Created',
        });
    
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordCreated',
          entity_id: newDocument.id,
          entity_type: 'KycDocument',
          parent_id: userId,
          parent_type: 'User',
          json_object: newDocument,
          performer_id: userId,
          performer_type: 'User',
          is_from_archive: 0,
          trigger_type: 'Default',
        }); 
      }
      if (document.documentId === 1 && document.side == 'front') {
        await this.clientRepository.update(userId as any, {
          idVerificationStatus: kycStatusPending?.name,
        })
        const label = await this.labelRepository.findOne({
          where: {
            description:
              NotificationMessages.clientregistration_identity_document_upload,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_identity_document_upload_title,
          },
        });

        const notificationData = {
          entity_id: userDetails?.id,
          entity_name: 'clients',
          title_label_id: labelTitle?.id,
          description_label_id: label?.id,
          created_by: 'system',
          is_read: false,
          is_deleted: false,
          user_id: userDetails?.id,
          creator_id: operator?.id,
        };

        await this.notificationService.createNotification({
          ...notificationData,
        });

        if (roleId != 2) {
          const userTask = await this.userTaskRepository.findOne({
            where: {
              user: { id: userId },
              isCompleted: false,
            },
            relations: ['task'],
            select: {
              task: {
                id: true,
                name: true,
              },
            },
          });

          if (userTask) {
            await this.userTaskRepository.update(userTask.id, {
              isCompleted: true,
            });
          }
        }
      }
      if (document.documentId === 2 && document.side == 'front') {
        await this.clientRepository.update(userId as any, {
          porVerificationStatus: kycStatusPending?.name,
        })
        const label = await this.labelRepository.findOne({
          where: {
            description:
              NotificationMessages.clientregistration_address_document_upload,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_address_document_upload_title,
          },
        });

        const notificationData = {
          entity_id: userDetails?.id,
          entity_name: 'clients',
          title_label_id: labelTitle?.id,
          description_label_id: label?.id,
          created_by: 'system',
          is_read: false,
          is_deleted: false,
          user_id: userDetails?.id,
          creator_id: operator?.id,
        };

        await this.notificationService.createNotification({
          ...notificationData,
        });

        if (roleId != 2) {
          const userTask = await this.userTaskRepository.findOne({
            where: {
              user: { id: userId },
              isCompleted: false,
            },
            relations: ['task'],
            select: {
              task: {
                id: true,
                name: true,
              },
            },
          });

          if (userTask) {
            await this.userTaskRepository.update(userTask.id, {
              isCompleted: true,
            });
          }
        }
      }
      if (document.documentId === 3 && document.side == 'front') {
        const label = await this.labelRepository.findOne({
          where: {
            description:
              NotificationMessages.clientregistration_payment_doc_upload_success,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_payment_doc_upload_success_title,
          },
        });

        const notificationData = {
          entity_id: userDetails?.id,
          entity_name: 'clients',
          title_label_id: labelTitle?.id,
          description_label_id: label?.id,
          created_by: 'system',
          is_read: false,
          is_deleted: false,
          user_id: userDetails?.id,
          creator_id: operator?.id,
        };

        await this.notificationService.createNotification({
          ...notificationData,
        });
      }
      const identityDocs = await this.userKycDocsRepository.find({
        where: {
          userId,
          field_id: In(['id_card', 'passport', 'driving_license']),
          status: 'active',
          side: 'front',
        },
      });

      const addressDocs = await this.userKycDocsRepository.find({
        where: {
          userId,
          field_id: In(['utility_bill', 'bank_statement', 'other']),
          status: 'active',
          side: 'front',
        },
      });

      const hasIdentityDocs = identityDocs.length > 0;
      const hasAddressDocs = addressDocs.length > 0;

      const overallKycStatus = await this.clientRepository.findOne({
        where: { userId: userId },
      });

      if (overallKycStatus?.kycStatus !== kycStatusApproved?.id) {
        if (
          hasIdentityDocs &&
          hasAddressDocs &&
          overallKycStatus?.email_sent_for_review === false
        ) {
          if (updatedLang === 'AR') {
            await this.sendEmailKyc({
              template: KycTemplateNames.KYC_UNDER_REVIEW,
              title: KycTemplateSubject_AR.KYC_UNDER_REVIEW,
              userId: userDetails?.id,
            });
          } else if (updatedLang === 'EN') {
            await this.sendEmailKyc({
              template: KycTemplateNames.KYC_UNDER_REVIEW,
              title: KycTemplateSubject_EN.KYC_UNDER_REVIEW,
              userId: userDetails?.id,
            });
          }
          const label = await this.labelRepository.findOne({
            where: {
              description:
                NotificationMessages.clientregistration_kyc_documents_underreview,
            },
          });

          const labelTitle = await this.labelRepository.findOne({
            where: {
              description:
                NotificationTitles.clientregistration_kyc_doc_underreview_title,
            },
          });

          const notificationData = {
            entity_id: userDetails?.id,
            entity_name: 'clients',
            title_label_id: labelTitle?.id,
            description_label_id: label?.id,
            created_by: 'system',
            is_read: false,
            is_deleted: false,
            user_id: userDetails?.id,
            creator_id: operator?.id,
          };

          await this.notificationService.createNotification({
            ...notificationData,
          });
          await this.clientRepository.update(
            { user: { id: userId } },
            {
              kycStatus: kycStatusPending?.id,
            },
          );
          //await this.sendUnderReviewEmail(user);
          await this.leadRepository.update(
            { clientID: userId?.toString() },
            {
              kycStatus: kycStatusPending?.id,
            },
          );
          await this.markEmailSentForReview(userId as number);
        }
      } else if (
        overallKycStatus?.kycStatus === kycStatusApproved?.id &&
        document.side === 'front'
      ) {
        if (updatedLang === 'AR') {
          await this.sendEmailKyc({
            template: KycTemplateNames.KYC_UNDER_REVIEW,
            title: KycTemplateSubject_AR.KYC_UNDER_REVIEW,
            userId: userDetails?.id,
          });
        } else if (updatedLang === 'EN') {
          await this.sendEmailKyc({
            template: KycTemplateNames.KYC_UNDER_REVIEW,
            title: KycTemplateSubject_EN.KYC_UNDER_REVIEW,
            userId: userDetails?.id,
          });
        }
        const label = await this.labelRepository.findOne({
          where: {
            description:
              NotificationMessages.clientregistration_kyc_documents_underreview,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_kyc_doc_underreview_title,
          },
        });

        const notificationData = {
          entity_id: userDetails?.id,
          entity_name: 'clients',
          title_label_id: labelTitle?.id,
          description_label_id: label?.id,
          created_by: 'system',
          is_read: false,
          is_deleted: false,
          user_id: userDetails?.id,
          creator_id: operator?.id,
        };

        await this.notificationService.createNotification({
          ...notificationData,
        });
      }
    }

    return {
      message,
      data: kycData,
    };
  }


  findAllWithPagination({
    userId,
    paginationOptions,
  }: {
    userId: number;
    paginationOptions: IPaginationOptions;
  }): Promise<user_kyc_documents[]> {
    const where: FindOptionsWhere<user_kyc_documents> = {
      userId,
    };
    return this.userKycDocsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      relations: ['customKycStatus'],
    });
  }

  async markEmailSentForReview(userId: number) {
    await this.clientRepository.update(userId, {
      email_sent_for_review: true,
    });
  }

  async findAllUserKycDocs(userId: number): Promise<UserKycDocumentDTO[]> {
    const documents = await this.userKycDocsRepository.find({
      where: {
        userId,
        status: 'active',
      },
      relations: ['customKycStatus'],
    });

    if (!documents || documents.length === 0) {
      return [];
    }

    const documentsWithDetails = await Promise.all(
      documents.map(async (document) => {
        const fileId = document.fileId;
        const url = await this.filesService.getSignedUrl(fileId);
        const kycStatusName = document.customKycStatus?.name;

        const documentDetails = await this.userKYCDocumentDetailRepository.find(
          {
            where: { userKYCDocuments: { id: document.id } },
            select: ['rejectedReasonIds'],
          },
        );

        const rejectedReasonIds = documentDetails.flatMap((detail) => {
          if (Array.isArray(detail.rejectedReasonIds)) {
            return detail.rejectedReasonIds.map(Number);
          }
          if (typeof detail.rejectedReasonIds === 'string') {
            try {
              const parsedIds = JSON.parse(detail.rejectedReasonIds);
              if (Array.isArray(parsedIds)) {
                return parsedIds.map(Number);
              }
            } catch (error) {
              console.error('Error parsing rejectedReasonIds:', error);
            }
          }
          return [];
        });

        const rr = await this.rejectedReasonRepository.find({
          where: {
            id: In(rejectedReasonIds),
          },
        });

        const rejectedReasons = rr.map((reason) => reason.name.toLowerCase());

        const { ...docWithoutFileId } = document;

        return {
          ...docWithoutFileId,
          kycStatusName,
          url,
          rejectedreasons: rejectedReasons,
        };
      }),
    );

    return documentsWithDetails;
  }

  async removeDocument(id: number, roleId: number,userId?:number): Promise<any> {
    const i18n = I18nContext.current();
    try {
      const document = await this.userKycDocsRepository.findOneBy({ id });
      const operator = await this.userRepository.findOneBy({ id: userId });

      if (!document) {
        const message = i18n?.t('errors.kyc.noDocumentFound');
        throw new NotFoundException(message);
      }

      if (roleId == 2) {
        // Client Role
        const kycStatusDetails = await this.customStatusRepository.findOne({
          where: { name: 'Approved', type: 'kyc_status' as any },
        });

        if (document.kycStatus === kycStatusDetails?.id) {
          const message = i18n?.t('errors.kyc.documentCannotDeleted');
          throw new BadRequestException(message);
        }
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: null,
          oldData: document,
          entityId: document.id,
          entityType: 'KycDocument',
          performerId: userId,
          performerType: 'User',
          field: 'Record Deleted',
        });
    
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordDeleted',
          entity_id: document.id,
          entity_type: 'KycDocument',
          parent_id: document.userId,
          parent_type: 'User',
          json_object: document,
          performer_id: userId,
          performer_type: 'User',
          is_from_archive: 0,
          trigger_type: 'Default',
        });
      }else{
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: null,
          oldData: document,
          entityId: document.id,
          entityType: 'KycDocument',
          performerId: operator ? operator?.operator?.id : userId,
          performerType: 'Operator',
          field: 'Record Deleted',
        });
    
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordDeleted',
          entity_id: document.id,
          entity_type: 'KycDocument',
          parent_id: document.userId,
          parent_type: 'User',
          json_object: document,
          performer_id: operator ? operator?.operator?.id : userId,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default',
        });

      }

      document.status = 'inactive';
      await this.userKycDocsRepository.save(document);
      return { message: i18n?.t('success.kyc.documentDeletedSuccessfully') };
    } catch (error) {
      throw error;
    }
  }
async updateClientKycInfo(
  id: number,
  user_kyc_id: number,
  kycInfoDto: KycInfoDto,
  approverId: number,
): Promise<NullableType<any>> {
  const client = await this.userKycDocsRepository.find({
    where: { id: user_kyc_id, userId: id, status: 'active' },
  });
  const user = await this.getUser(id);
  const session_operator = await this.getUser(approverId);
  const updatedLang = user?.languageIso.toUpperCase();

  const [kycStatusDetails, approvedkycStatusDetails, system_operator] =
    await this.getStatusesAndOperator(kycInfoDto);

  const docDetailArray = await this.getDocDetails(client);

  for (const item of client) {
    const safeItem = { id: item.id, side: item.side, status: item.status };
    try {
      await this.updateKycDocument(
        safeItem,
        approverId,
        kycStatusDetails,
        kycInfoDto.kycNote as any,
      );
    } catch (err) {
      console.error('Error in updateKycDocument for item:', item.id, err);
    }

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: kycInfoDto,
        oldData: item,
        entityId: user?.id,
        entityType: 'User',
        performerId: session_operator?session_operator.operator?.id : id,
        performerType: 'Operator',
        field: 'Details Update',
      });
  
      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'DetailsUpdated',
        entity_id: user?.id,
        entity_type: 'User',
        parent_id: id,
        parent_type: 'User',
        json_object: kycInfoDto,
        performer_id: session_operator?session_operator.operator?.id : id,
        performer_type: 'Operator',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

    if (
      kycInfoDto.kycStatus === approvedkycStatusDetails?.name &&
      item.side === 'front'
    ) {
      try {
        await this.handleApproval(id, kycInfoDto, user, system_operator);
        await this.completeAdminTask(user);
        await this.updateUserLifeCycle(id);
      } catch (err) {
        console.error('Error in approval flow for item:', item.id, err);
      }
    }
     if (kycInfoDto.kycStatus === 'Rejected' && item.side === 'front') {
        // const message = await this.handleRejectionWithReasons(
        //   docDetailArray,
        //   updatedLang as any
        // )
        await this.handleRejection(
          id,
          kycInfoDto,
          docDetailArray,
          user,
          system_operator,
          updatedLang as any,
        );
      }
  }

  return kycInfoDto;
}

  // async updateClientKycInfo(
  //   id: number,
  //   user_kyc_id: number,
  //   kycInfoDto: KycInfoDto,
  //   approverId: number,
  // ): Promise<NullableType<any>> {
  //   const client = await this.getClient(id, kycInfoDto);
  //   const user = await this.getUser(id);
  //   const session_operator = await this.getUser(approverId);
  //   const updatedLang = user?.languageIso.toLocaleUpperCase();
  //   //const lowerLang  = i18n?.lang.toLocaleUpperCase();
  //   const [kycStatusDetails, approvedkycStatusDetails, system_operator] =
  //     await this.getStatusesAndOperator(kycInfoDto);
  //   const docDetailArray = await this.getDocDetails(client);

  //   for (const item of client) {
  //     const safeItem = { id: item.id, side: item.side, status: item.status };
  //   try {
  //     await this.updateKycDocument(
  //       safeItem,
  //       approverId,
  //       kycStatusDetails,
  //       kycInfoDto.kycNote as any,
  //     );
  //   } catch (err) {
  //     console.error('Error in updateKycDocument for item:', item.id, err);
  //   }
  //     this.eventEmitter.emit(EventTypes.USER_LOG, {
  //       newData: kycInfoDto,
  //       oldData: item,
  //       entityId: item.id,
  //       entityType: 'KycDocument',
  //       performerId: session_operator?session_operator.operator?.id : id,
  //       performerType: 'Operator',
  //       field: 'Details Update',
  //     });
  
  //     this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
  //       action: 'DetailsUpdated',
  //       entity_id: item.id,
  //       entity_type: 'KycDocument',
  //       parent_id: id,
  //       parent_type: 'User',
  //       json_object: kycInfoDto,
  //       performer_id: session_operator?session_operator.operator?.id : id,
  //       performer_type: 'Operator',
  //       is_from_archive: 0,
  //       trigger_type: 'Default',
  //     });
  //     if (
  //       kycInfoDto.kycStatus === approvedkycStatusDetails?.name &&
  //       item.side === 'front'
  //     ) {
  //       await this.handleApproval(id, kycInfoDto, user, system_operator);
  //       await this.completeAdminTask(user)
  //       await this.updateUserLifeCycle(id);
  //     }

  //     if (kycInfoDto.kycStatus === 'Rejected' && item.side === 'front') {
  //       // const message = await this.handleRejectionWithReasons(
  //       //   docDetailArray,
  //       //   updatedLang as any
  //       // )
  //       await this.handleRejection(
  //         id,
  //         kycInfoDto,
  //         docDetailArray,
  //         user,
  //         system_operator,
  //         updatedLang as any,
  //       );
  //     }
  //   }

  //   return kycInfoDto;
  // }

  private async getClient(id: number, kycInfoDto: KycInfoDto) {
    const client = await this.userKycDocsRepository.find({
      where: { userId: id, field_id: kycInfoDto.fieldId, status: 'active' },
    });
    if (!client) {
      const i18n = I18nContext.current();
      throw new NotFoundException(i18n?.t('errors.auth.clientNotFound'));
    }
    return client;
  }

  private async getUser(id: number) {
    return this.userRepository.findOneBy({ id });
  }


  private async getStatusesAndOperator(kycInfoDto: KycInfoDto) {
    return Promise.all([
      this.customStatusRepository.findOne({
        where: { name: kycInfoDto.kycStatus, type: kycInfoDto.type as any },
      }),
      this.customStatusRepository.findOne({
        where: { type: 'kyc_status' as any, name: 'Approved' },
      }),
      this.operatorRepository.findOne({ where: { full_name: 'System' } }),
    ]);
  }

  private async getDocDetails(client: any[]) {
    const docDetailArray = [] as any;
    for (const item of client) {
      const docDetail = await this.userKYCDocumentDetailRepository.findOne({
        where: { userKYCDocuments: { id: item.id } },
      });
      if (docDetail) {
        docDetailArray.push(docDetail);
      }
    }
    return docDetailArray;
  }

  private async updateKycDocument(
    item: any,
    approverId: number,
    kycStatusDetails: any,
    kycNote: string,
  ) {
    await this.userKycDocsRepository.update(item.id, {
      approvedBy: { id: approverId },
      kycStatus: kycStatusDetails?.id,
      kycNote: kycNote ?? '',
    });
  }

  private async handleApproval(
    id: number,
    kycInfoDto: KycInfoDto,
    user: any,
    system_operator: any,
  ) {
    const POIfieldIds = ['passport', 'driving_license', 'id_card'];
    const PORfieldIds = ['bank_statement', 'utility_bill', 'other'];
    if (POIfieldIds.includes(kycInfoDto.fieldId)) {
      await this.updateClientVerificationStatus(id, 'idVerificationStatus');
      await this.createApprovalNotification(
        user,
        system_operator,
        NotificationMessages.clientcompliance_kyc_docs_identity_approved,
        NotificationTitles.clientcompliance_kyc_docs_identity_approved_title,
      );
    } else if (PORfieldIds.includes(kycInfoDto.fieldId)) {
      await this.updateClientVerificationStatus(id, 'porVerificationStatus');
      await this.createApprovalNotification(
        user,
        system_operator,
        NotificationMessages.clientcompliance_kyc_docs_address_approved,
        NotificationTitles.clientcompliance_kyc_docs_address_approved_title,
      );
    } else if (kycInfoDto.fieldId === 'payment') {
      await this.createApprovalNotification(
        user,
        system_operator,
        NotificationMessages.clientregistration_payment_doc_approved,
        NotificationTitles.clientregistration_payment_doc_approved_title,
      );
    }

    return true;
  }

  private async updateUserLifeCycle(
    id: number,
  ) {
    const client = await this.clientRepository.findOne({
      where: { userId:id },
      relations: {
        lead:true
      },
    });
    if(client?.idVerificationStatus == 'Approved' && client?.porVerificationStatus == 'Approved' ){
      if (client?.lead?.id && client?.lead?.applicantCreatedTime == null) {
        await this.leadRepository.update(client.lead.id,{
          userLifeCycle: UserLifeCycle.APPLICANT,
          applicantCreatedTime: client?.lead?.applicantCreatedTime ?? new Date(),})
      }
      if (
        client &&
        (client.userLifeCycle === UserLifeCycle.LEAD ||
          client.userLifeCycle === UserLifeCycle.REGISTERED)
      ) {
        await this.clientRepository.update(client?.userId,{ userLifeCycle: UserLifeCycle.APPLICANT})
      }
    }
  }

  private async completeAdminTask(user: any) {
    const client = await this.clientRepository.findOne({
      where: { userId:user?.id },
      relations: {
        lead:true
      },
    });
    if(client?.idVerificationStatus == 'Approved' && client?.porVerificationStatus == 'Approved' ){
    const adminTask = await this.adminTaskRepository.find({
      where: {
        entity: TaskEntityType.LEAD,
        entityId: client?.lead?.id as any,
        contact:{id:client?.lead?.id},
        subject: 'Update KYC'
      }
    })
    if (adminTask.length > 0) {
      adminTask.forEach(async (item) => {
        await this.adminTaskRepository.update(item.id, {
          status: 'COMPLETED'
        })
      })
    }
  }
}

  private async handleRejectionWithReasons(
    docDetailArray: any[],
    language: string,
  ) {
    let consolidatedMessage = '';
    let otherReason = '';

    for (const docDetail of docDetailArray) {
      const reasonsArray = JSON.parse(docDetail?.rejectedReasonIds) ?? [];
      const rejectedReasons = await this.rejectedReasonRepository.find({
        relations: { label: true },
        where: { id: In(reasonsArray) },
      });
      otherReason = docDetail?.rejectedReasonOther;

      const detailedData = await Promise.all(
        rejectedReasons.map(async (dat) => {
          const labelTranslation =
            await this.labelTranslationRepository.findOne({
              where: {
                label: { id: dat.label.id },
                langCode: language.toLocaleLowerCase(),
              },
            });
          return {
            translationText: labelTranslation ? labelTranslation.text : null,
          };
        }),
      );

      detailedData.forEach((reason, i, arr) => {
        const postfix = i === arr.length - 1 ? '.' : ',';
        consolidatedMessage += `${reason.translationText?.toLowerCase()}${postfix}\n`;
      });
    }

    return {
      consolidatedMessage: consolidatedMessage,
      otherReason: otherReason,
    };
  }

  private async handleRejection(
    id: number,
    kycInfoDto: KycInfoDto,
    docDetailArray: any[],
    user: any,
    system_operator: any,
    language: string,
  ) {
    const POIfieldIds = ['passport', 'driving_license', 'id_card'];
    const PORfieldIds = ['bank_statement', 'utility_bill', 'other'];
    const message = await this.handleRejectionWithReasons(
      docDetailArray,
      language as any,
    );

    const consolidatedMessage = message?.consolidatedMessage ?? '';
    const otherReason = message?.otherReason ?? '';
    if (POIfieldIds.includes(kycInfoDto.fieldId)) {
      await this.createRejectionNotification(
        user,
        system_operator,
        NotificationMessages.clientcompliance_kyc_docs_pending,
        NotificationTitles.clientcompliance_kyc_docs_pending_title,
      );
      if (language === 'AR') {
        await this.sendEmailKyc({
          template: KycTemplateNames.KYC_REJECTION_ID,
          title: KycTemplateSubject_AR.KYC_REJECTION_ID,
          userId: id,
          message: consolidatedMessage,
          otherReason,
        });
      } else if (language === 'EN') {
        await this.sendEmailKyc({
          template: KycTemplateNames.KYC_REJECTION_ID,
          title: KycTemplateSubject_EN.KYC_REJECTION_ID,
          userId: id,
          message: consolidatedMessage,
          otherReason,
        });
      }
    } else if (PORfieldIds.includes(kycInfoDto.fieldId)) {
      await this.createRejectionNotification(
        user,
        system_operator,
        NotificationMessages.clientcompliance_kyc_docs_pending,
        NotificationTitles.clientcompliance_kyc_docs_pending_title,
      );
      if (language === 'AR') {
        await this.sendEmailKyc({
          template: KycTemplateNames.KYC_REJECTION_RESIDENCY,
          title: KycTemplateSubject_AR.KYC_REJECTION_RESIDENCY,
          userId: id,
          message: consolidatedMessage,
          otherReason,
        });
      } else if (language === 'EN') {
        await this.sendEmailKyc({
          template: KycTemplateNames.KYC_REJECTION_RESIDENCY,
          title: KycTemplateSubject_EN.KYC_REJECTION_RESIDENCY,
          userId: id,
          message: consolidatedMessage,
          otherReason,
        });
      }
    } else if (kycInfoDto.fieldId === 'payment') {
      await this.createRejectionNotification(
        user,
        system_operator,
        NotificationMessages.clientregistration_payment_doc_rejected,
        NotificationTitles.clientregistration_payment_doc_rejected_title,
      );
      if (language === 'AR') {
        await this.sendEmailKyc({
          template: KycTemplateNames.KYC_PAYMENT_REJECTION,
          title: KycTemplateSubject_AR.KYC_PAYMENT_REJECTION,
          userId: id,
          message: consolidatedMessage,
          otherReason,
        });
      } else if (language === 'EN') {
        await this.sendEmailKyc({
          template: KycTemplateNames.KYC_PAYMENT_REJECTION,
          title: KycTemplateSubject_EN.KYC_PAYMENT_REJECTION,
          userId: id,
          message: consolidatedMessage,
          otherReason,
        });
      }
    }
    return true;
  }

  private async updateClientVerificationStatus(
    id: number,
    statusField: string,
  ) {
    await this.clientRepository.update(id, { [statusField]: 'Approved' });
  }

  private async createApprovalNotification(
    user: any,
    system_operator: any,
    message: string,
    title: string,
  ) {
    const [label, labelTitle] = await Promise.all([
      this.labelRepository.findOne({ where: { description: message } }),
      this.labelRepository.findOne({ where: { description: title } }),
    ]);

    await this.createNotification(user, system_operator, label, labelTitle);
  }

  private async createRejectionNotification(
    user: any,
    system_operator: any,
    message: string,
    title: string,
  ) {
    const [label, labelTitle] = await Promise.all([
      this.labelRepository.findOne({ where: { description: message } }),
      this.labelRepository.findOne({ where: { description: title } }),
    ]);

    await this.createNotification(user, system_operator, label, labelTitle);
  }

  private async createNotification(
    user: any,
    system_operator: any,
    label: any,
    labelTitle: any,
  ) {
    const notificationData = {
      entity_id: user?.id,
      entity_name: 'clients',
      title_label_id: labelTitle?.id,
      description_label_id: label?.id,
      created_by: 'system',
      is_read: false,
      is_deleted: false,
      user_id: user?.id,
      creator_id: system_operator?.id,
    };
    notificationData.entity_id = notificationData.entity_id.toString();
    const notification = this.notificationRepository.create(notificationData);
    // this.socketGateway.sendNotificationToUser(user?.id, notification);
    return this.notificationRepository.save(notification);
  }

  private formatFieldId(fieldId: string) {
    return fieldId.toUpperCase().replace('_', ' ');
  }

  // private async sendEmail(
  //   user: any,
  //   message: string,
  //   id: number,
  //   approverId: number,
  //   updatedLang: string,
  // ) {
  //   if (user?.email) {
  //     await this.mailService.sendTextViaEmail({
  //       to: user.email,
  //       data: {
  //         text: message,
  //         subject: 'KYC Status',
  //         userId: id,
  //         operatorId: approverId,
  //         languageIso: updatedLang,
  //       },
  //     });
  //   }
  // }

  async sendEmailKyc(data: KYCEmailDto) {
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    const { title, template } = data;

    if (data.userId) {
      const client = await this.userRepository.findOne({
        where: { id: data.userId },
        relations: ['client','client.regulation'],
      });
      const updatedLang = client?.languageIso;

      if (client?.email) {
        await this.mailerService.sendEmailKyc({
          from: MailSenderType.NO_REPLY,
          to: client?.email,
          subject: title,
          context: {
            title: title,
            actionTitle: title,
            app_name,
            firstName: client?.firstName as any,
            Phone: '+971600554433',
            phone: '+971600554433',
            message: data?.message ?? '',
            otherReason: data?.otherReason ?? '',
            accessLink: `${this.configService.getOrThrow('app.frontendDomain', {
              infer: true,
            })}/login`,
          },
          templateName: template,
          userId: client.id,
          languageIso: updatedLang,
          regulation: client?.client?.regulations,
          regulationId: client?.client?.regulation?.id,
          ...(data?.data ? { ...data.data } : {}),
        });
      }
    }
  }

  // async createNotification(notificationData: any): Promise<any> {
  //   notificationData.entity_id = notificationData.entity_id.toString()
  //   const notification = this.notificationRepository.create(notificationData);
  //   return this.notificationRepository.save(notification);
  // }

  async isProofOfPaymentExist(userId: number) {
    const isExist = await this.userKycDocsRepository.findOneBy({
      documentId: 3,
      userId,
      status: 'active',
      customKycStatus: {
        name: 'Approved',
      },
    });
    return Boolean(isExist);
  }

  async isAnyDocumentUploaded(userId: number) {
    const user = await this.getUser(userId);
    if (!user) throw new NotFoundException('User not found');
    //const i18n = I18nContext.current();
    //const updatedLang = i18n?.lang.toLocaleUpperCase();
    const isPOIExist = await this.userKycDocsRepository.findOne({
      where: {
        documentId: 1,
        field_id: In(['id_card', 'passport', 'driving_license']),
        userId,
        side: 'front',
        status: 'active',
        customKycStatus: {
          name: 'Pending Review',
        },
      },
    });
    const isPORExist = await this.userKycDocsRepository.findOne({
      where: {
        documentId: 2,
        field_id: In(['bank_statement', 'utility_bill', 'other']),
        userId,
        side: 'front',
        status: 'active',
        customKycStatus: {
          name: 'Pending Review',
        },
      },
    });
    const bothExist = isPOIExist || isPORExist;
    return bothExist;
  }

  async isBothDocumentUploaded(userId: number) {
    const user = await this.getUser(userId);
    if (!user) throw new NotFoundException('User not found');
    //const i18n = I18nContext.current();
    //const updatedLang = i18n?.lang.toLocaleUpperCase();
    const isPOIExist = await this.userKycDocsRepository.findOne({
      where: {
        documentId: 1,
        field_id: In(['id_card', 'passport', 'driving_license']),
        userId,
        side: 'front',
        status: 'active',
        customKycStatus: {
          name: 'Pending Review',
        },
      },
    });
    const isPORExist = await this.userKycDocsRepository.findOne({
      where: {
        documentId: 2,
        field_id: In(['bank_statement', 'utility_bill', 'other']),
        userId,
        side: 'front',
        status: 'active',
        customKycStatus: {
          name: 'Pending Review',
        },
      },
    });
    const bothExist = isPOIExist && isPORExist;
    return bothExist;
  }

async getClientById(clientId: number): Promise<User | null> {
  return await this.userRepository.findOne({
    where: { id: clientId, client: { isActive: true } },relations:{client:true},
  });
}

}
