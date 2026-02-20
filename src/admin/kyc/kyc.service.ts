import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Repository, UpdateResult } from 'typeorm';
import { required_kyc_documents } from './entities/admin-kyc.entity';
import {
  CreateDocumentDto,
  CreateKycNoteDto,
  LeadNotesType,
  NotesType,
  PaginationDto,
  UpdateKycNoteDto,
} from './dto/admin-kyc.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { UserAnswer } from 'src/users/entities/user_kyc_answers.entity';
import { UserAnswerDTO } from './dto/admin-userAnswer.dto';
import {
  GetUserKycDocumentDetailDto,
  UpdateUserKycDocumentDetailDto,
} from './dto/userKycDocumentDetail.dto';
import { UserKYCDocumentDetail } from './entities/user_kyc_document_detail.entity';
import { User } from 'src/users/entities/user.entity';
import { RejectedReason } from './entities/rejected_reasons.entity';
import { FilesService } from 'src/files/files.service';
import { FileEntity } from 'src/files/entities/file.entity';
import { notes } from './entities/kycNotes.entity';
import { I18nContext } from 'nestjs-i18n';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { UserKycDocumentsRepository } from './repositories/user-kyc-documents.repository';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { Session } from 'src/session/entities/session.entity';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { Client } from 'src/users/entities/client.entity';
import { Lead } from '../leads/entities/lead.entity';
import { entityType, performerType } from '../active-log/active-log.type';
import { CustomStatus, StatusType } from '../client/entities/custom_status.entity';
import { AutomationConfig } from '../automation/entities/automation-config.entity';

@Injectable()
export class AdminKycService {
  constructor(
    @InjectRepository(required_kyc_documents)
    private adminKycRepository: Repository<required_kyc_documents>,
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
    @InjectRepository(UserKYCDocumentDetail)
    private userKYCDocumentDetailRepository: Repository<UserKYCDocumentDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(RejectedReason)
    private rejectedReasonRepository: Repository<RejectedReason>,
    private userKycDocumentsRepository: UserKycDocumentsRepository,
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
    @InjectRepository(notes)
    private notesRepository: Repository<notes>,
    private readonly filesService: FilesService,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(Tickets)
    private ticketRepository: Repository<Tickets>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(AutomationConfig)
    private readonly automationConfigRepository: Repository<AutomationConfig>,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async createDocument(
    data: CreateDocumentDto,
  ): Promise<required_kyc_documents> {
    try {
      const serializedMetaData = JSON.stringify(data.meta_data);
      const document = this.adminKycRepository.create({
        name: data.name,
        description: data.description,
        meta_data: serializedMetaData,
        languageIso: data.languageIso,
      });
      const savedDocument = await this.adminKycRepository.save(document);
      return savedDocument;
    } catch (error) {
      throw error;
    }
  }

  // async createUserKycDocumentDetail(
  //   data: UserKycDocumentDetailDto,
  // ): Promise<any> {
  //   try {

  //     const user = await this.userRepository.findOne({
  //       where: { id: data.userId },
  //     });

  //     const rejectedResons = await this.rejectedReasonRepository.find()
  //

  //     //if(rejectedResons.includes(data.rejectedReasonIds)) {

  //     // If user does not exist, throw an error
  //     if (!user) {
  //       throw new Error(`User with ID ${data.userId} not found`);
  //     }
  //     const serializedMetaData = JSON.stringify(data.rejectedReasonIds);
  //     const document = this.userKYCDocumentDetailRepository.create({
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       type: data.type,
  //       classification: data.classification,
  //       idNumber: data.idNumber,
  //       nationality: data.nationality,
  //       dateOfBirth: data.dateOfBirth,
  //       documentExpiryDate: data.documentExpiryDate,
  //       rejectedReasonIds: serializedMetaData,
  //       user,
  //     });
  //     const savedDocument = await this.userKYCDocumentDetailRepository.save(document);
  //     return savedDocument;
  //   } catch (error) {
  //
  //     throw error;
  //   }
  // }

  async updateDocument(
    id: number,
    data: CreateDocumentDto,
  ): Promise<UpdateResult> {
    return await this.adminKycRepository.update(id, {
      name: data.name,
      description: data.description,
      meta_data: JSON.stringify(data.meta_data),
      languageIso: data.languageIso,
    });
  }

  async updateUserKycDocumentDetail(
    id: number,
    data: UpdateUserKycDocumentDetailDto,
    userId?: number,
  ): Promise<any> {
    const userKYCDocuments = await this.userKycDocumentsRepository.find({
      where: { userId: data.userId, field_id: data.fieldId, status: 'active' },
      relations: {
        userKYCDocumentDetails: true,
        user: true,
      },
    });

    const documents = [] as any;
    for (const doc of userKYCDocuments) {
      if (doc) {
        const detailId = doc.id;
        documents.push(detailId);
      }
    }

    const userKYCDocumentDetail =
      await this.userKYCDocumentDetailRepository.findOne({
        where: { userKYCDocuments: { id: In(documents) } },
      });

    const newId = userKYCDocumentDetail?.id;

    if (!userKYCDocuments) {
      throw new NotFoundException(`User KYC Documents not found`);
    }

    if (!userKYCDocumentDetail) {
      throw new NotFoundException(`User KYC Document Detail not found`);
    }

    const rejectedReasons = await this.rejectedReasonRepository.find();
    let rejectedReasonIds: number[] | null = null;
    if (userKYCDocumentDetail?.rejectedReasonIds) {
      try {
        rejectedReasonIds = JSON.parse(
          userKYCDocumentDetail?.rejectedReasonIds,
        );
      } catch (error) {
        // Handle parsing error, log it, or set a default value
      }
    }
    if (!rejectedReasonIds) {
      // Handle the absence of rejectedReasonIds, perhaps by setting a default value
      rejectedReasonIds = [];
    }
    if (data.rejectedReasonIds && data.rejectedReasonIds.length > 0) {
      const isValidRejectedReasonIds = data.rejectedReasonIds.every((id) =>
        rejectedReasons.some((reason) => reason.id === id),
      );

      if (!isValidRejectedReasonIds) {
        throw new NotFoundException(`Invalid rejected reason ID provided`);
      }
      rejectedReasonIds = data.rejectedReasonIds;
    }
    const serializedMetaData = JSON.stringify(rejectedReasonIds);
    if (newId) {
      const data2 = {
        classification: data.classification,
        idNumber: data.idNumber,
        nationality: data.nationality,
        dateOfBirth: data.dateOfBirth,
        documentExpiryDate: data.documentExpiryDate,
        rejectedReasonIds: serializedMetaData,
        rejectedReasonOther: data?.rejectedReasonOther ?? ''
      }
      console.log(data2,"dara")
      const updatedRedord = await this.userKYCDocumentDetailRepository.update(newId, data2);
      const getOperator = await this.userRepository.findOne({
        where: {
          id: userId
        },
        relations:{
          operator:true
        }
      })
      console.log(getOperator,"operator")
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: data2,
        oldData: userKYCDocumentDetail,
        entityId: data.userId,
        entityType: 'User',
        performerId: getOperator?.operator?.id,
        performerType: 'Operator',
        field: 'Details Update',
        rejectedReasonOther: data?.rejectedReasonOther ?? '',
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'DetailsUpdated',
        entity_id: id,
        entity_type: 'KycDocument',
        parent_id: userId,
        parent_type: 'User',
        json_object: data2,
        performer_id: userId,
        performer_type: 'User',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      return updatedRedord;
    }
  }

  async getKycDocumentDetails(isPartner?: boolean): Promise<any> {
    const i18n = I18nContext.current();

    let document;
    if (isPartner) {
      document = await this.adminKycRepository.find();
    } else {
      document = await this.adminKycRepository.find({
        where: { isPartner: isPartner ?? false },
      });
    }

    if (!document || document.length === 0) {
      const message = i18n?.t('errors.kyc.detailsNotFound');
      return {
        message: message,
        document,
      };
    }
    return document.map((d) => {
      return {
        id: d.id,
        name: d.name,
        description: d.description,
        meta_data: JSON.parse(d.meta_data.replace(/\\"/g, '"')),
        languageIso: d.languageIso,
      };
    });
  }

  async softDelete(id: required_kyc_documents['id']): Promise<void> {
    await this.adminKycRepository.softDelete(id);
  }

  async getKycDocumentById(id: required_kyc_documents['id']): Promise<any> {
    const i18n = I18nContext.current();
    const document = await this.adminKycRepository.findOne({
      where: { id },
    });
    if (!document) {
      const message = i18n?.t('errors.kyc.noDocumentFound');
      return {
        message: message,
        document,
      };
    }
    return {
      id: document.id,
      name: document.name,
      description: document.description,
      meta_data: JSON.parse(document.meta_data.replace(/\\"/g, '"')),
      languageIso: document.languageIso,
    };
  }

  async getAllKycDocumentDetailById(userId: number): Promise<any> {
    //Implemented Advance Filters
    const documents = await this.userKycDocumentsRepository.find({
      where: {
        userId,
        status: 'active',
      },
      relations: {
        userKYCDocumentDetails: true,
        approvedBy: true,
        customKycStatus: true,
        file: true,
        user: true,
      },
    });
    const updatedDocuments = await Promise.all(
      documents.map(async (item) => {
        const rejectedReasons =
          item?.userKYCDocumentDetails?.['rejectedReasonIds'];
        const latestNoteAll = await this.notesRepository.findOne({
          where: {
            user_kyc_document_id: { id: item.id }
          },
          relations: {
            user_id: true,
            created_by: true
          },
          order: { created_at: 'DESC' },
        });
        const latestNote = latestNoteAll?.note ?? null
        const fileId = latestNoteAll?.file_id;
        const noteCreatedAt = latestNoteAll?.created_at ?? null
        const noteAttchementUrl = fileId
          ? await this.filesService.getSignedUrl(fileId)
          : null;
        let noteCreatorFullName: null | string = null;
        if (latestNoteAll?.created_by?.firstName && latestNoteAll?.created_by?.lastName) {
          noteCreatorFullName = `${latestNoteAll?.created_by?.firstName} ${latestNoteAll?.created_by?.lastName}`;
        }
        const noteCreatorProfile = latestNoteAll?.created_by?.photo?.id || null;
        const noteProfileUrl = noteCreatorProfile
          ? await this.filesService.getSignedUrl(noteCreatorProfile as string)
          : null;
        const noteCreatedBy = latestNoteAll?.created_by?.id ?? null;
        if (
          !rejectedReasons ||
          rejectedReasons.length === 0 ||
          rejectedReasons == 'null'
        ) {
          return {
            ...item,
            RejectedReasons: [],
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
            latestNote,
            noteCreatedBy,
            noteAttchementUrl,
            noteProfileUrl,
            noteCreatorFullName,
            noteCreatedAt
          };
        } else {
          return {
            ...item,
            RejectedReasons: await this.rejectedReasonRepository.find({
              where: {
                id: In(JSON.parse(rejectedReasons.replace(/\\"/g, '"'))),
              },
            }),
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
            latestNote,
            noteCreatedBy,
            noteAttchementUrl,
            noteProfileUrl,
            noteCreatorFullName,
            noteCreatedAt
          };
        }
      }),
    );
    const data = this.transformData(updatedDocuments);
    return { result: data };
  }

  async getKycDocumentDetailById(
    userId: number,
    dto: GetUserKycDocumentDetailDto,
  ): Promise<any> {
    //Implemented Advance Filters
    const documents = await this.userKycDocumentsRepository.find({
      where: {
        userId,
        status: 'active',
        field_id: dto.fieldId,
      },
      relations: {
        userKYCDocumentDetails: true,
        approvedBy: true,
        customKycStatus: true,
        file: true,
        user: true,
      },
    });
    const updatedDocuments = await Promise.all(
      documents.map(async (item) => {
        const rejectedReasons =
          item?.userKYCDocumentDetails?.['rejectedReasonIds'];
        if (
          !rejectedReasons ||
          rejectedReasons.length === 0 ||
          rejectedReasons == 'null'
        ) {
          return {
            ...item,
            RejectedReasons: [],
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
          };
        } else {
          return {
            ...item,
            RejectedReasons: await this.rejectedReasonRepository.find({
              where: {
                id: In(JSON.parse(rejectedReasons.replace(/\\"/g, '"'))),
              },
            }),
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
          };
        }
      }),
    );
    return this.transformData(updatedDocuments);
    // return { result: data };
  }

  async getAllKycDocumentDetail(
    userId: number,
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    const filters: FilterItem[] = [
      {
        name: 'status',
        operation: FilterOperation.EQUALS,
        value: ['active'],
      },
      {
        name: 'side',
        operation: FilterOperation.EQUALS,
        value: ['front'],
      },
    ];
    const { result, ...rest } =
      await this.userKycDocumentsRepository.advanceFilters({
        filters,
        limit,
        page,
        userId,
        listName: ListNames.USER_KYC_DOCUMENTS,
        filterList: dto.filters || undefined,
        sortList: dto.sort || undefined,
        relations: [
          'customKycStatus',
          'userKYCDocumentDetails',
          'approvedBy',
          'file',
          'user',
          'user.client',
          'user.client.partner',
        ],
        defaultSortKey: 'created_at',
        listViewId: dto.listViewId,
      });

    //Implemented Advance Filters
    const documents = result;
    // console.log(documents, 'DOCUMENTSSSSS', documents.length);
    let updatedDocuments = await Promise.all(
      documents.map(async (item) => {
        const rejectedReasons =
          item?.userKYCDocumentDetails?.['rejectedReasonIds'];
        if (
          !rejectedReasons ||
          rejectedReasons.length === 0 ||
          rejectedReasons == 'null'
        ) {
          return {
            ...item,
            RejectedReasons: [],
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
          };
        } else {
          return {
            ...item,
            RejectedReasons: await this.rejectedReasonRepository.find({
              where: {
                id: In(JSON.parse(rejectedReasons.replace(/\\"/g, '"'))),
              },
            }),
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
          };
        }
      }),
    );
    updatedDocuments = updatedDocuments.map((item) => {
      return {
        ...item,
      };
    });
    const allUsers = documents.map((item) => item.userId);
    const uniqueUsers = [...new Set(allUsers)];
    const allDocuments: any[] = [];
    for (const user of uniqueUsers) {
      const result = updatedDocuments.filter((item) => item.userId === user);
      const finalResult: any[] = this.transformDataWithAdvanceFilters(result);
      allDocuments.push(...finalResult);
    }
    return { result: allDocuments, ...rest };
  }

  private transformData = (data) => {
    const uniqueFields = new Set(data.map((elem) => elem.field_id)); //cnic, pas, licence
    const result: any[] = [];
    uniqueFields.forEach((field) => {
      const filteredData = data.filter((item) => item.field_id === field);
      const {
        id,
        field_id,
        documentId,
        userId,
        approvedBy,
        status,
        kycStatus,
        kycNote,
        created_at,
        updated_at,
        userKYCDocumentDetails,
        customKycStatus,
        RejectedReasons,
        latestNote,
        noteCreatedBy,
        noteAttchementUrl,
        noteProfileUrl,
        noteCreatorFullName,
        noteCreatedAt
      } = filteredData[0];
      const attachments = filteredData.reduce((result, item) => {
        const key = `${item.side}`;
        result[key] = item.fileUrl;
        const key2 = `${item.side}Name`;
        result[key2] = item.file.fileName;
        return result;
      }, {});
      result.push({
        id,
        field_id,
        documentId,
        userId,
        approvedBy,
        status,
        kycStatus,
        kycNote,
        created_at,
        updated_at,
        attachments,
        userKYCDocumentDetails,
        customKycStatus,
        RejectedReasons,
        latestNote,
        noteCreatedBy,
        noteAttchementUrl,
        noteProfileUrl,
        noteCreatorFullName,
        noteCreatedAt
      });
    });

    return result;
  };

  private transformDataWithAdvanceFilters = (data) => {
    const uniqueFields = new Set(data.map((elem) => elem.field_id)); //cnic, pas, licence
    const result: any[] = [];
    uniqueFields.forEach((field) => {
      const filteredData = data.filter((item) => item.field_id === field);
      const {
        id,
        field_id,
        documentId,
        userId,
        approvedBy,
        status,
        kycStatus,
        kycNote,
        created_at,
        updated_at,
        userKYCDocumentDetails,
        customKycStatus,
        RejectedReasons,
        user,
      } = filteredData[0];
      const attachments = filteredData.reduce((result, item) => {
        const key = `${item.side}`;
        result[key] = item.fileUrl;
        return result;
      }, {});
      result.push({
        id,
        field_id,
        documentId,
        userId,
        approvedBy,
        status,
        kycStatus,
        kycNote,
        created_at,
        updated_at,
        attachments,
        userKYCDocumentDetails,
        customKycStatus,
        RejectedReasons,
        user,
      });
    });

    return result;
  };

  async findAllWithPagination({
    userId,
    paginationOptions,
  }: {
    userId: number;
    paginationOptions: IPaginationOptions;
  }): Promise<UserAnswerDTO[]> {
    const where: FindOptionsWhere<UserAnswer> = {
      userId,
    };
    const data = await this.userAnswerRepository.find({
      relations: {
        question: true,
      },
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
    });
    return data.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { question, ...rest } = item;
      return {
        questionName: item.question.name!,
        questionDescription: item.question.desc!,
        questionType: item.question.type!,
        questionTitle: item.question.title!,
        questionGroup: item.question.group!,
        ...rest,
      };
    });
  }

  async createNote(
    createKycNoteDto: CreateKycNoteDto,
    createdBy: any,
  ): Promise<any> {
    // console.log('createKycNoteDto: ', createKycNoteDto);
    const lead = await this.clientRepository.findOne({
      where: { userId: createKycNoteDto.user_id },
    });

    if (createKycNoteDto.user_id) {
      const user = await this.userRepository.findOne({
        where: { id: createKycNoteDto.user_id },
      });

      if (!user) {
        throw new NotFoundException('Invalid user_id');
      }
    }

    if (createKycNoteDto.file_id) {
      const file = await this.fileRepository.findOne({
        where: { id: createKycNoteDto.file_id },
      });
      if (!file) {
        throw new NotFoundException('Invalid file_id');
      }
    }

    if (createKycNoteDto.user_kyc_document_id) {
      const kycDocument = await this.userKycDocumentsRepository.findOne({
        where: { id: createKycNoteDto.user_kyc_document_id },
        relations: {
          user: true,
        },
      });
      if (!kycDocument) {
        throw new NotFoundException('Invalid user_kyc_document_id');
      }

      if (createKycNoteDto.type === NotesType.KYC_GENERAL) {
        throw new BadRequestException(
          'Type cannot be kyc-general when user_kyc_document_id is provided',
        );
      }
    }

    if (
      createKycNoteDto.type === NotesType.KYC_DOC &&
      !createKycNoteDto.user_kyc_document_id
    ) {
      throw new BadRequestException(
        'user_kyc_document_id is required when type is kyc-doc',
      );
    }

    if (createKycNoteDto.ticket_id) {
      const ticket = await this.ticketRepository.findOne({
        where: { id: createKycNoteDto.ticket_id },
      });
      if (!ticket) {
        throw new NotFoundException('Invalid ticket_id');
      }

      if (createKycNoteDto.type !== NotesType.TICKET_GENERAL) {
        throw new BadRequestException(
          'Type cannot be other ticket-general when ticket_id is provided',
        );
      }
    }

    if (
      createKycNoteDto.type === NotesType.TICKET_GENERAL &&
      !createKycNoteDto.ticket_id
    ) {
      throw new BadRequestException(
        'ticket_id is required when type is ticket-general',
      );
    }

    const newKycNote = this.notesRepository.create({
      ...createKycNoteDto,
      user_id: { id: createKycNoteDto?.user_id },
      lead_id:{id: lead?.leadId},
      partner_id: { id: createKycNoteDto?.partner_id },
      user_kyc_document_id:
        { id: createKycNoteDto?.user_kyc_document_id },
      ticket:{id:createKycNoteDto?.ticket_id},
      created_by: createdBy ?? null,
      isPublic: true,
    });


    const savedNote = await this.notesRepository.save(newKycNote);
    const getOperator = await this.userRepository.findOne({
      where: {
        id: createdBy
      },
      relations: {
        operator: true
      }
    })
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savedNote,
      oldData: null,
      entityId: savedNote?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Note Created',
      parentId: lead?.leadId,
      parentType:  entityType.LEAD
    });
    if(createKycNoteDto.user_id){
    await this.leadRepository.update(lead?.leadId as any,{
      latestNote: createKycNoteDto.note,
      lastNoteAt: savedNote?.updated_at,
    })}
    return savedNote
  }

  async blockUnblockUser(id: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id, isClient: true, userType: 2 },
    });
    if (!user) throw new NotFoundException('User not found');

    const newIsDeletedStatus = !user.isDeleted;
    await this.userRepository.update(id, {
      isDeleted: newIsDeletedStatus,
    });

    return newIsDeletedStatus;
  }

  async forceLogout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId, isClient: true, userType: 2 },
    });
    if (!user) throw new NotFoundException('User not found');
    const sessions = await this.sessionRepository.find({
      where: { user: { id: userId } },
    });

    if (!sessions.length) {
      throw new NotFoundException('No active sessions found for this user');
    }

    await this.sessionRepository.delete({
      user: { id: userId },
    });
  }

  async updateKycNote(
    id: number,
    updateData: UpdateKycNoteDto,
    createdBy: any,
  ): Promise<any> {
    const kycNote = await this.notesRepository.findOne({ where: { id },relations:{
      user_id: true,
      lead_id:true
    } });
    const getOperator = await this.userRepository.findOne({
      where: {
        id: createdBy
      },
      relations: {
        operator: true
      }
    })
    if (!kycNote) {
      throw new NotFoundException('KYC note not found');
    }
    if (kycNote.created_by.id !== createdBy) {
      throw new BadRequestException('Note can only be edited by creator');
    }

    if (updateData.file_id) {
      const file = await this.fileRepository.findOne({
        where: { id: updateData.file_id },
      });
      if (!file) {
        throw new NotFoundException('Invalid file_id');
      }
    }
    await this.notesRepository.update(id, updateData);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updateData,
      oldData: kycNote,
      entityId: kycNote.user_id?.id ? kycNote.user_id?.id : kycNote.lead_id?.id,
      entityType: kycNote.user_id?  entityType.USER :  entityType.LEAD,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Note Updated',
      parentId: kycNote?.lead_id?.id ,
      parentType:  entityType.LEAD
    });
    if(kycNote?.lead_id?.id){
      await this.leadRepository.update(kycNote?.lead_id.id,{
        latestNote: updateData.note,
        lastNoteAt: kycNote?.updated_at
      })
    }
    return await this.notesRepository.findOne({ where: { id } });
  }

  async getKycNotes(
    userId: number,
    type: NotesType,
    did?: number,
    ticketId?:number,
    paginationOptions?: PaginationDto,
  ): Promise<any> {
    const whereClause: any = {
      user_id: { id: userId },
      type: type,
    };

    if (did !== undefined) {
      whereClause.user_kyc_document_id = { id: did };
    }

    if (ticketId !== undefined) {
      whereClause.ticket = { id: ticketId };
    }

    let kycNotes;
    let totalCount;

    if (
      paginationOptions &&
      paginationOptions.limit !== undefined &&
      paginationOptions.page !== undefined
    ) {
      const { page, limit } = paginationOptions;
      [kycNotes, totalCount] = await this.notesRepository.findAndCount({
        where: whereClause,
        relations: {
          user_id: true,
          created_by: true,
          ticket:true
        },
        take: limit,
        skip:
          (parseInt(page as unknown as string) - 1) *
          parseInt(limit as unknown as string),
        order: {
          created_at: 'DESC',
        },
      });
    } else {
      kycNotes = await this.notesRepository.find({
        where: whereClause,
        relations: {
          user_id: true,
          created_by: true,
          ticket:true,
        },
        order: {
          created_at: 'DESC',
        },
      });
      totalCount = kycNotes.length;
    }

    if (!kycNotes || kycNotes.length === 0) {
      return {
        data: [],
        totalCount: 0,
        hasNextPage: false,
        page: 1,
        limit: paginationOptions?.limit ?? null,
      };
    }

    const fileIDs = await Promise.all(
      kycNotes.map(async (kycNote) => {
        const fileId = kycNote?.file_id;
        const attchementUrl = fileId
          ? await this.filesService.getSignedUrl(fileId)
          : null;
        let clientFullName: null | string = null;
        let creatorFullName: null | string = null;
        if (kycNote?.user_id?.firstName && kycNote?.user_id?.lastName) {
          clientFullName = `${kycNote?.user_id?.firstName} ${kycNote?.user_id?.lastName}`;
        }
        if (kycNote?.created_by?.firstName && kycNote?.created_by?.lastName) {
          creatorFullName = `${kycNote?.created_by?.firstName} ${kycNote?.created_by?.lastName}`;
        }
        const creatorProfile = kycNote?.created_by?.photo?.id || null;
        const profileUrl = creatorProfile
          ? await this.filesService.getSignedUrl(creatorProfile as string)
          : null;
        const userId = kycNote?.user_id?.id ?? null;
        const userKycDocumentId = kycNote?.user_kyc_document_id?.id ?? null;
        const createdBy = kycNote?.created_by?.id ?? null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          file_id: _, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          created_by, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user_kyc_document_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...docWithoutFileId // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } = kycNote; // eslint-disable-next-line @typescript-eslint/no-unused-vars

        return {
          ...docWithoutFileId,
          fileId,
          attchementUrl,
          clientFullName,
          creatorFullName,
          profileUrl,
          userId,
          userKycDocumentId,
          createdBy,
        };
      }),
    );

    const hasNextPage =
      (paginationOptions &&
        totalCount >
        parseInt(paginationOptions.page as unknown as string) *
        parseInt(paginationOptions.limit as unknown as string)) ??
      false;

    return {
      data: fileIDs,
      totalCount,
      hasNextPage,
      page: parseInt(paginationOptions?.page as unknown as string) ?? 1,
      limit: parseInt(paginationOptions?.limit as unknown as string) ?? null,
    };
  }


  async getSingleNote(noteId: number): Promise<any> {
    const Note = await this.notesRepository.findOne({
      where: {
        id: noteId,
      },
      relations: {
        user_id: true,
        created_by: true,
        partner_id: true,
        lead_id: true,
      },
    });
  
    if (!Note) {
      throw new NotFoundException(`Note with ID ${noteId} not found.`);
    }
  
    const fileId = Note?.file_id;
    const attchementUrl = fileId
      ? await this.filesService.getSignedUrl(fileId)
      : null;
    let clientFullName: null | string = null;
    let creatorFullName: null | string = null;
    let leadFullName : null | string = null;
    let partnerFullName : null | string = null;
    let clientEmail: null | string = null;
    let leadEmail : null | string = null;
    let partnerEmail : null | string = null;
    let fullName: null | string = null;
    let email: null | string = null;
    let relatedTo: null | string = null;

    const clientNameParts = [
      Note?.user_id?.firstName,
      Note?.user_id?.lastName,
    ];
    const creatorNameParts = [
      Note?.created_by?.firstName,
      Note?.created_by?.lastName,
    ];
    const leadNameParts = [
      Note?.lead_id?.firstName,
      Note?.lead_id?.lastName,
    ];
    const partnerNameParts = [
      Note?.partner_id?.firstName,
      Note?.partner_id?.lastName,
    ];
    leadFullName = leadNameParts?.filter(Boolean).join(' ').trim() || null;
    creatorFullName = creatorNameParts?.filter(Boolean).join(' ').trim() || null;
    clientFullName = clientNameParts?.filter(Boolean).join(' ').trim() || null;
    partnerFullName = partnerNameParts?.filter(Boolean).join(' ').trim() || null;
    clientEmail = Note?.user_id?.email || null;
    partnerEmail = Note?.partner_id?.email || null;
    leadEmail = Note?.lead_id?.email || null;
    if(Note?.type in LeadNotesType){
      fullName = leadFullName
      email = leadEmail
      relatedTo = Note?.relatedToName ? Note?.relatedToName : Note?.type.toLocaleLowerCase().replace(/_/g, ' ') || null
    }
    else if(Note?.type == NotesType.PARTNER_GENERAL){
      fullName = partnerFullName
      email = partnerEmail
      relatedTo = Note?.relatedToName ? Note?.relatedToName : Note?.type.toLocaleLowerCase().replace(/_/g, ' ') || null
    }
    else{
      fullName = clientFullName;
      email = clientEmail
      relatedTo = Note?.relatedToName ? Note?.relatedToName : Note?.type.toLocaleLowerCase().replace(/_/g, ' ') || null
    }
    const leadId = Note?.lead_id?.id || null;

  
    const {
      file_id: _, // Exclude file_id
      user_id, // Exclude user_id
      user_kyc_document_id, // Exclude user_kyc_document_id
      partner_id,
      meeting_id,
      call_id,
      partner_kyc_document_id,
      opportunity_id,
      transaction,
      ...docWithoutFileId
    } = Note;
  
    return {
      ...docWithoutFileId,
      fileId,
      attchementUrl,
      creatorFullName,
      fullName,
      email,
      leadId,
    };
  }
  

  async getKycNotesWithPartner(
    userId: number,
    type: NotesType,
    did?: number,
    paginationOptions?: PaginationDto,
  ): Promise<any> {
    const whereClause: any = {
      partner_id: { id: userId },
      type: type,
    };

    if (did !== undefined) {
      whereClause.user_kyc_document_id = { id: did };
    }

    let kycNotes;
    let totalCount;

    if (
      paginationOptions &&
      paginationOptions.limit !== undefined &&
      paginationOptions.page !== undefined
    ) {
      const { page, limit } = paginationOptions;
      [kycNotes, totalCount] = await this.notesRepository.findAndCount({
        where: whereClause,
        relations: {
          user_id: true,
          created_by: true,
          partner_id: true,
        },
        take: limit,
        skip:
          (parseInt(page as unknown as string) - 1) *
          parseInt(limit as unknown as string),
        order: {
          created_at: 'DESC',
        },
      });
    } else {
      kycNotes = await this.notesRepository.find({
        where: whereClause,
        relations: {
          user_id: true,
          created_by: true,
          partner_id: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
      totalCount = kycNotes.length;
      console.log('kycNotes: ', kycNotes);
    }

    if (!kycNotes || kycNotes.length === 0) {
      return {
        data: [],
        totalCount: 0,
        hasNextPage: false,
        page: 1,
        limit: paginationOptions?.limit ?? null,
      };
    }

    const fileIDs = await Promise.all(
      kycNotes.map(async (kycNote) => {
        const partnerId = kycNote?.partner_id?.id ?? null;
        const fileId = kycNote?.file_id ?? null;
        const attchementUrl = fileId
          ? await this.filesService.getSignedUrl(fileId)
          : null;
        let clientFullName: null | string = null;
        let creatorFullName: null | string = null;
        if (kycNote?.user_id?.firstName && kycNote?.user_id?.lastName) {
          clientFullName = `${kycNote?.user_id?.firstName} ${kycNote?.user_id?.lastName}`;
        }
        if (kycNote?.created_by?.firstName && kycNote?.created_by?.lastName) {
          creatorFullName = `${kycNote?.created_by?.firstName} ${kycNote?.created_by?.lastName}`;
        }
        const partnerFullName = kycNote?.partner_id?.name ?? null;
        const creatorProfile = kycNote?.created_by?.photo?.id ?? null;
        const profileUrl = creatorProfile
          ? await this.filesService.getSignedUrl(creatorProfile as string)
          : null;
        const userId = kycNote?.user_id?.id ?? null;
        const userKycDocumentId = kycNote?.user_kyc_document_id?.id ?? null;
        const createdBy = kycNote?.created_by?.id ?? null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          partner_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          file_id: _, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          created_by, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user_kyc_document_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...docWithoutFileId // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } = kycNote; // eslint-disable-next-line @typescript-eslint/no-unused-vars

        return {
          ...docWithoutFileId,
          fileId,
          attchementUrl,
          clientFullName,
          partnerFullName,
          creatorFullName,
          profileUrl,
          userId,
          partnerId,
          userKycDocumentId,
          createdBy,
        };
      }),
    );

    const hasNextPage =
      (paginationOptions &&
        totalCount >
        parseInt(paginationOptions.page as unknown as string) *
        parseInt(paginationOptions.limit as unknown as string)) ??
      false;

    return {
      data: fileIDs,
      totalCount,
      hasNextPage,
      page: parseInt(paginationOptions?.page as unknown as string) ?? 1,
      limit: parseInt(paginationOptions?.limit as unknown as string) ?? null,
    };
  }

  async softDeleteKycNote(id: number,userId?:number): Promise<void> {
    const kycNote = await this.notesRepository.findOne({ where: { id },relations:{
      user_id:true,
      lead_id:{
        salesStatus:true,
      },
    } });
    if (!kycNote) {
      throw new NotFoundException('KYC note not found');
    }
    kycNote.deleted_at = new Date();
    const savedNote = await this.notesRepository.save(kycNote);
    const getOperator = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        operator: true
      }
    })
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: savedNote,
      entityId: savedNote?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Note Deleted',
      parentId: savedNote?.lead_id?.id,
      parentType:  entityType.LEAD
    });
    if(kycNote?.lead_id?.id){
      const previousNotes = await this.notesRepository.find({
        where:{
          lead_id:{id:kycNote?.lead_id?.id}
        },
        order:{updated_at:'DESC'},
        take: 1,
      })
      const previousNote = previousNotes[0];

      await this.leadRepository.update(kycNote?.lead_id?.id,{
        latestNote : previousNote?.note,
        lastNoteAt: previousNote?.updated_at
      })
  }
}

  async isKycVerified(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { client: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (
      user.client.porVerificationStatus === 'Approved' &&
      user.client.idVerificationStatus === 'Approved'
    ) {
      return true;
    }
    return false;
  }

  async isUserKycApproved(userId: number) {
    const client = await this.userRepository.findOne({
      where: {
        id: userId, client: {
          customKycStatus: {
            name: "Approved"
          }
        }
      },
      relations: {
        client: {
          customKycStatus: true,
        }
      },
    });
    return !!client
  }
}
