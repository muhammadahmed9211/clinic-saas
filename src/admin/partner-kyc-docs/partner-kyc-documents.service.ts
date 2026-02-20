import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PartnerKYCDocumentDetail } from './entities/partner_kyc_document_details.entity';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { FilesService } from 'src/files/files.service';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import { I18nContext } from 'nestjs-i18n';
import {
  CreatePartneKycDto,
  UpdatePartnerKycDocumentDetailDto,
  partnerKycInfoDto,
} from './dto/createPartnerKycDocs.dto';
import { PartnerKycDocumentsRepository } from './repositories/partner-kyc-documents.repository';
import { partner_kyc_documents } from 'src/admin/partner-kyc-docs/entities/partner_kyc_docs.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { RejectedReason } from '../kyc/entities/rejected_reasons.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PartnerKycDocsService {
  constructor(
    @InjectRepository(partner_kyc_documents)
    private readonly partnerKycRepository: Repository<partner_kyc_documents>,
    @InjectRepository(required_kyc_documents)
    private required_kyc_documents: Repository<required_kyc_documents>,
    private readonly filesService: FilesService,
    @InjectRepository(CustomStatus)
    private customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    private partnerKycDocsRepository: PartnerKycDocumentsRepository,
    @InjectRepository(PartnerKYCDocumentDetail)
    private partnerKycDocumentDetailRepository: Repository<PartnerKYCDocumentDetail>,
    @InjectRepository(RejectedReason)
    private rejectedReasonRepository: Repository<RejectedReason>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createPartnerKycDocs(
    docs: CreatePartneKycDto[],
    user: User,
    partnerId?: number,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const kycData: any[] = [];
    const message = i18n?.t('success.kyc.documentSavedSuccessfully');

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

      const existingDocument = await this.partnerKycDocsRepository.findOne({
        where: { documentId, partner: { id: partnerId }, side, field_id },
        order: { id: 'DESC' },
      });

      if (existingDocument) {
        await this.partnerKycDocsRepository.update(existingDocument.id, {
          status: 'inactive',
        });
      }

      const kycStatus = await this.customStatusRepository.findOne({
        where: { type: 'kyc_status' as any, name: 'Pending Review' },
      });

      const existingDetailDocumentNew =
        await this.partnerKycDocsRepository.findOne({
          where: {
            partner: { id: partnerId },
            status: 'active',
            field_id: field_id,
          },
          order: { id: 'DESC' },
        });

      const newDocument = await this.partnerKycDocsRepository.save({
        partner: { id: partnerId },
        documentId,
        fileId,
        field_id,
        side,
        status: 'active',
        state: 'pending',
        kycStatus: kycStatus?.id,
      });
      kycData.push(newDocument);

      const existingDetailDocument =
        await this.partnerKycDocsRepository.findOne({
          where: {
            partner: { id: partnerId },
            status: 'active',
            field_id: field_id,
          },
          order: { id: 'DESC' },
        });

      const newDetailDocumentId = existingDetailDocument?.id;
      const partnerDetails = await this.partnerRepository.findOne({
        where: { id: partnerId },
      });

      const newType = `${existingDetailDocument?.field_id
        .toUpperCase()
        .replace('_', ' ')}`;
      if (!partnerDetails?.name || !newDetailDocumentId || !newType) {
        throw new UnprocessableEntityException('');
      }
      let isExistDocument = false;
      if (existingDetailDocumentNew?.id) {
        const detailDocument =
          await this.partnerKycDocumentDetailRepository.findOne({
            where: {
              partnerKYCDocuments: { id: existingDetailDocumentNew.id },
            },
          });
        isExistDocument = Boolean(detailDocument);
      }
      if (!isExistDocument) {
        await this.partnerKycDocumentDetailRepository.save({
          name: partnerDetails?.name,
          partnerKYCDocuments: { id: newDetailDocumentId },
          type: newType,
        });
      }
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: newDocument,
        oldData: '',
        entityId: newDocument.id,
        entityType: 'KycDocument',
        parentId: partnerId,
        parentType: 'Affiliate',
        performerId: user.id,
        performerType: 'Operator',
        field: 'Create Partner KYC Doc',
      });
    }
    return {
      message,
      data: kycData,
    };
  }

  // async findAllPartnerKycDocs(userId: number): Promise<any> {
  //   const documents = await this.partnerKycRepository.find({
  //     where: {
  //       uploadedBy: userId,
  //       status: 'active',
  //     },
  //     relations: ['customKycStatus'],
  //   });

  //   if (!documents || documents.length === 0) {
  //     return [];
  //   }

  //   const fileIDs = await Promise.all(
  //     documents.map(async (document) => {
  //       const fileId = document.fileId;
  //       const url = await this.filesService.getSignedUrl(fileId);

  //       const kycStatusName = document.customKycStatus?.name;
  //       // eslint-disable-next-line
  //       const {
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         fileId: _,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         state,
  //         // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //         customKycStatus,
  //         ...docWithoutFileId
  //       } = document;
  //       return { ...docWithoutFileId, kycStatusName, url };
  //     }),
  //   );
  //   console.log('fileIDs: ', fileIDs);
  //   return fileIDs;
  // }

  async removeDocument(uploadedBy: number): Promise<any> {
    const document = await this.partnerKycRepository.findOneBy({
      id: uploadedBy,
    });
    if (!document) {
      throw new NotFoundException('Document not found.');
    }
    document.status = 'inactive';
    return this.partnerKycRepository.save(document);
  }

  async getAllKycDocumentDetailById(partnerId: number): Promise<any> {
    const documents = await this.partnerKycDocsRepository.find({
      where: {
        partner: { id: partnerId },
        status: 'active',
      },
      relations: {
        partnerKYCDocumentDetail: true,
        approvedBy: true,
        customKycStatus: true,
      },
    });

    const updatedDocuments = await Promise.all(
      documents.map(async (item) => {
        const rejectedReasons =
          item?.partnerKYCDocumentDetail?.['rejectedReasonIds'];
        if (
          !rejectedReasons ||
          rejectedReasons.length === 0 ||
          rejectedReasons == 'null'
        ) {
          return {
            ...item,
            userId: item?.partner.id,
            userKYCDocumentDetails: item?.partnerKYCDocumentDetail ?? null,
            RejectedReasons: [],
            fileUrl: await this.filesService
              .getSignedUrl(item.fileId)
              .catch(() => null),
          };
        } else {
          return {
            ...item,
            userId: item?.partner.id,
            userKYCDocumentDetails: item?.partnerKYCDocumentDetail ?? null,
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
    const data = this.transformData(updatedDocuments);
    return { result: data };
  }

  // async getAllKycDocumentDetail(
  //   partnerId: number,
  //   limit: number,
  //   page: number,
  //   dto: ApplyListFilterSortColumnDto,
  // ): Promise<any> {
  //   const filters: FilterItem[] = [
  //     {
  //       name: 'status',
  //       operation: FilterOperation.EQUALS,
  //       value: ['active'],
  //     },
  //     {
  //       name: 'side',
  //       operation: FilterOperation.EQUALS,
  //       value: ['front'],
  //     },
  //   ];
  //   const { result, ...rest } =
  //     await this.partnerKycDocumentsRepository.advanceFilters({
  //       filters ,
  //       limit,
  //       page,
  //       userId:partnerId,
  //       listName: ListNames.PARTNER_KYC_DOCUMENTS,
  //       filterList: dto.filters || undefined,
  //       sortList: dto.sort || undefined,
  //       relations: ['customKycStatus', 'partnerKYCDocumentDetails', 'approvedBy'],
  //       defaultSortKey: 'created_at',
  //     });

  //   //Implemented Advance Filters
  //   const documents = result;

  //   const allPartners = documents.map((item) => item.uploadedBy);
  //   const uniquePartners = [...new Set(allPartners)];
  //   let updatedDocuments = await Promise.all(
  //     documents.map(async (item) => {
  //       const rejectedReasons =
  //         item?.partnerKYCDocumentDetails?.['rejectedReasonIds'];
  //       if (
  //         !rejectedReasons ||
  //         rejectedReasons.length === 0 ||
  //         rejectedReasons == 'null'
  //       ) {
  //         return {
  //           ...item,
  //           RejectedReasons: [],
  //           fileUrl: await this.filesService
  //             .getSignedUrl(item.fileId)
  //             .catch(() => null),
  //         };
  //       } else {
  //         return {
  //           ...item,
  //           RejectedReasons: await this.rejectedReasonRepository.find({
  //             where: {
  //               id: In(JSON.parse(rejectedReasons.replace(/\\"/g, '"'))),
  //             },
  //           }),
  //           fileUrl: await this.filesService
  //             .getSignedUrl(item.fileId)
  //             .catch(() => null),
  //         };
  //       }
  //     }),
  //   );
  //   updatedDocuments = updatedDocuments.map((item) => {
  //     return {
  //       ...item,
  //     };
  //   });
  //   const allDocuments: any[] = [];
  //   for (const partner of uniquePartners) {
  //     const result = updatedDocuments.filter((item) => item.uploadedBy === partner);
  //     const finalResult: any[] = this.transformData(result);
  //     allDocuments.push(...finalResult);
  //   }
  //   return { result: allDocuments, ...rest };
  // }

  private transformData = (data) => {
    const uniqueFields = new Set(data.map((elem) => elem.field_id)); //cnic, pas, licence
    const result: any[] = [];
    uniqueFields.forEach((field) => {
      const filteredData = data.filter((item) => item.field_id === field);
      const {
        id,
        field_id,
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
      } = filteredData[0];
      const attachments = filteredData.reduce((result, item) => {
        const key = `${item.side}`;
        result[key] = item.fileUrl;
        return result;
      }, {});
      result.push({
        id,
        field_id,
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
      });
    });
    return result;
  };

  async updatePartnerKycDocumentDetail(
    id: number,
    data: UpdatePartnerKycDocumentDetailDto,
    user: User,
  ): Promise<any> {
    const partnerKYCDocuments = await this.partnerKycRepository.find({
      where: { partner: { id }, field_id: data.fieldId, status: 'active' },
      relations: {
        partnerKYCDocumentDetail: true,
      },
    });
    const documents = [] as any;
    for (const doc of partnerKYCDocuments) {
      if (doc) {
        const detailId = doc.id;
        documents.push(detailId);
      }
    }
    const partnerKYCDocumentDetail =
      await this.partnerKycDocumentDetailRepository.findOne({
        where: { partnerKYCDocuments: { id: In(documents) } },
      });

    const newId = partnerKYCDocumentDetail?.id;

    if (!partnerKYCDocuments) {
      throw new NotFoundException(`Partner KYC Documents not found`);
    }

    if (!partnerKYCDocumentDetail) {
      throw new NotFoundException(`Partner KYC Document Detail not found`);
    }

    const rejectedReasons = await this.rejectedReasonRepository.find();
    let rejectedReasonIds: number[] | null = null;
    if (partnerKYCDocumentDetail?.rejectedReasonIds) {
      try {
        rejectedReasonIds = JSON.parse(
          partnerKYCDocumentDetail?.rejectedReasonIds,
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
      const result = await this.partnerKycDocumentDetailRepository.update(
        newId,
        {
          classification: data.classification,
          idNumber: data.idNumber,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
          documentExpiryDate: data.documentExpiryDate,
          rejectedReasonIds: serializedMetaData,
        },
      );

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: {
          id: newId,
          classification: data.classification,
          idNumber: data.idNumber,
          nationality: data.nationality,
          dateOfBirth: data.dateOfBirth,
          documentExpiryDate: data.documentExpiryDate,
          rejectedReasonIds: serializedMetaData,
        },
        oldData: {
          id: partnerKYCDocumentDetail.id,
          classification: partnerKYCDocumentDetail.classification,
          idNumber: partnerKYCDocumentDetail.idNumber,
          nationality: partnerKYCDocumentDetail.nationality,
          dateOfBirth: partnerKYCDocumentDetail.dateOfBirth,
          documentExpiryDate: partnerKYCDocumentDetail.documentExpiryDate,
          rejectedReasonIds: rejectedReasonIds,
        },
        entityId: newId,
        entityType: 'KycDocument',
        parentId: id,
        parentType: 'Affiliate',
        performerId: user.id,
        performerType: 'Operator',
        field: 'Update Partner KYC Doc',
      });

      return result;
    }
  }

  async updatePartnerKycInfo(
    id: number,
    kycInfoDto: partnerKycInfoDto,
    approverId: number,
  ): Promise<NullableType<any>> {
    const i18n = I18nContext.current();
    const partnerDoc = await this.partnerKycRepository.find({
      where: {
        partner: { id },
        field_id: kycInfoDto.fieldId,
        status: 'active',
      },
    });
    if (!partnerDoc) {
      const message = i18n?.t('errors.auth.partnerNotFound');
      throw new NotFoundException(message);
    }
    const statusId = kycInfoDto?.kycStatus;
    const kycStatusDetails = await this.customStatusRepository.findOne({
      where: { name: statusId, type: kycInfoDto.type as any },
    });

    for (const item of partnerDoc) {
      await this.partnerKycRepository.update(item.id, {
        approved_by: approverId,
        approvedBy: { id: approverId },
        kycStatus: kycStatusDetails?.id,
        userKycNote: kycInfoDto.kycNote ?? '',
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: kycInfoDto,
        oldData: item,
        entityId: item.id,
        entityType: 'KycDocument',
        parentId: item.partner.id,
        parentType: 'Affiliate',
        performerId: approverId,
        performerType: 'Operator',
        field: 'Update Partner KYC Doc',
      });
    }
    return kycInfoDto;
  }
}
