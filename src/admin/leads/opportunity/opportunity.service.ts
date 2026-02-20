import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Opportunity } from './entities/opportunity.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Repository } from 'typeorm';
import {
  CreateEmailDto,
  CreateOpportunityDto,
} from './dto/create-opportunity.dto';
import { Funnel, FunnelType } from './entities/funnel.entity';
import { Lead } from '../entities/lead.entity';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/users/entities/user.entity';
import {
  AttachmentResponseDto,
  CreateAttachmentDto,
} from './dto/attachment.dto';
import { attachments } from './entities/attachment.entity';
import { FilesService } from 'src/files/files.service';
import { CreateLeadNoteDto, UpdateLeadNoteDto } from './dto/notes.dto';
import { FileEntity } from 'src/files/entities/file.entity';
import { FunnelHistory } from './entities/funnel-history.entity';
import { UpdateOpportunityDto } from './dto/update-opportunity';
import { OpportunityRepository } from './repositories/opportunity.repository';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import {
  CreateKycNoteDto,
  LeadNotesType,
  NotesType,
  PaginationDto,
} from 'src/admin/kyc/dto/admin-kyc.dto';
import { Meetings } from '../meetings/entities/meetings.entity';
import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { NotesRepository } from './repositories/notes.repository';
import { AdminTaskRepository } from 'src/admin/task/repositories/admin-task.respository';
import { TaskEntityType } from 'src/admin/task/entities/task.entity';
import { InboxEmailRepository } from '../communications/inboxEmail.repository';
import { InboxEmail } from 'src/mail/entities/inboxEmails.entity';
import { EmailStatus } from 'src/utils/enums/email-status.enum';
import { CommunicationRepository } from '../communications/communication.repository';
import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import {
  entityType,
  performerType,
} from 'src/admin/active-log/active-log.type';
import { TaskService } from 'src/admin/task/task.service';
import {
  CustomStatus,
  StatusType,
} from 'src/admin/client/entities/custom_status.entity';
import { AutomationConfig } from 'src/admin/automation/entities/automation-config.entity';

@Injectable()
export class OpportunityService {
  constructor(
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Funnel)
    private readonly funnelRepository: Repository<Funnel>,
    @InjectRepository(FunnelHistory)
    private readonly funnelHistoryRepository: Repository<FunnelHistory>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(attachments)
    private readonly attachmentRepository: Repository<attachments>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly opportunitiesRepository: OpportunityRepository,
    @InjectRepository(Meetings)
    private readonly meetingsRepository: Repository<Meetings>,
    @InjectRepository(LeadsCallLog)
    private readonly leadCallLogsRepository: Repository<LeadsCallLog>,
    @InjectRepository(Tickets)
    private readonly ticketRepository: Repository<Tickets>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(AutomationConfig)
    private readonly automationConfigRepository: Repository<AutomationConfig>,
    private readonly adminTaskRepository: AdminTaskRepository,
    private readonly mailService: MailService,
    private readonly fileService: FilesService,
    private readonly notesRepository: NotesRepository,
    private readonly taskService: TaskService,
    private readonly inboxEmailRepository: InboxEmailRepository,
    private readonly communicationRepository: CommunicationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(lead: number, data: CreateOpportunityDto, createdBy: number) {
    const leadData = await this.leadRepository.findOne({ where: { id: lead } });

    if (!leadData) throw new NotFoundException('Lead not found');

    const dealOwner = await this.userRepository.findOne({
      where: { operator: { id: data.dealOwner }, isOperator: true },
    });
    if (!dealOwner) throw new NotFoundException('Deal owner not found');

    // const contactName = await this.userRepository.findOne({
    //   where: { id: data.contactName },
    // });

    // if (!contactName) throw new NotFoundException('Contact name not found');

    const opportunity = await this.opportunityRepository.save(
      this.opportunityRepository.create({
        ...data,
        dealOwner: { id: data.dealOwner },
        contactName: { id: data.contactName },
        lead: { id: lead },
        createdBy: { id: createdBy },
        ModifiedBy: { id: createdBy },
      }),
    );

    const modified = await this.userRepository.findOne({
      where: { id: createdBy },
    });

    if (opportunity) {
      const currentDate = new Date();
      const closeDate = new Date(opportunity.closingDate);
      const stageDuration = currentDate.getDate() - closeDate.getDate();

      await this.funnelHistoryRepository.save(
        this.funnelHistoryRepository.create({
          stage: data.stage,
          amount: Math.round(data.expectedInvestment),
          closingDate: data.closingDate,
          expectedInvestment: data.expectedInvestment,
          probability: data.probability,
          ModifiedBy: `${modified?.firstName ? modified.firstName : ''} ${
            modified?.lastName ? modified.lastName : ''
          }`,
          ModifyTime: new Date(),
          opportunity: { id: opportunity.id },
          stageDuration,
        }),
      );
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: data,
      oldData: null,
      entityId: opportunity.id,
      entityType: entityType.OPPORTUNITY,
      parentId: lead,
      parentType: entityType.LEAD,
      performerId: modified?.operator.id,
      performerType: entityType.OPERATOR,
      field: 'Opportunity Created',
    });

    return opportunity;
  }

  async getOpportunityCount(id: number) {
    return await this.opportunityRepository.count({ where: { lead: { id } } });
  }

  async opportunityDetail(id: number) {
    return await this.opportunityRepository.findOne({
      where: { id },
      relations: [
        'contactName',
        'dealOwner',
        'createdBy',
        'ModifiedBy',
        'lead',
      ],
    });
  }

  async opportunityKanbanView(labelId: number) {
    const funnel = await this.funnelRepository.find({
      where: { type: FunnelType.LEAD },
    });
    const funnelNames = funnel.map((funnel) => funnel.name);
    const opportunity = await this.opportunityRepository.find({
      where: { lead: { id: labelId }, stage: In(funnelNames) },
    });

    const qualification = opportunity.filter(
      (item) => item.stage === 'Qualification',
    );
    const proposal_offer = opportunity.filter(
      (item) => item.stage === 'Proposal/Offer',
    );
    const negotiation_consideration = opportunity.filter(
      (item) => item.stage === 'Negotiation/Consideration',
    );
    const verbal_approval = opportunity.filter(
      (item) => item.stage === 'Verbal Approval',
    );
    const closed_won = opportunity.filter(
      (item) => item.stage === 'Closed Won',
    );
    const closed_lost = opportunity.filter(
      (item) => item.stage === 'Closed Lost',
    );
    const closed_lost_competition = opportunity.filter(
      (item) => item.stage === 'Closed Lost to Competition',
    );

    return {
      qualification,
      proposal_offer,
      negotiation_consideration,
      verbal_approval,
      closed_won,
      closed_lost,
      closed_lost_competition,
    };
  }

  async getOpportunityKanbanView(payload: {
    userId: number;
    limit: number;
    page: number;
    all: boolean;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { result } = await this.getAllOpportunities(payload);
    try {
      const qualification = result.filter(
        (item) => item.stage === 'Qualification',
      );
      const proposal_offer = result.filter(
        (item) => item.stage === 'Proposal/Offer',
      );
      const negotiation_consideration = result.filter(
        (item) => item.stage === 'Negotiation/Consideration',
      );
      const verbal_approval = result.filter(
        (item) => item.stage === 'Verbal Approval',
      );
      const closed_won = result.filter((item) => item.stage === 'Closed Won');
      const closed_lost = result.filter((item) => item.stage === 'Closed Lost');
      const closed_lost_competition = result.filter(
        (item) => item.stage === 'Closed Lost to Competition',
      );

      return {
        qualification,
        proposal_offer,
        negotiation_consideration,
        verbal_approval,
        closed_won,
        closed_lost,
        closed_lost_competition,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Your request cannot be processed at this time',
      );
    }
  }

  async getStageHistory(id: number) {
    return await this.funnelHistoryRepository.find({
      where: { opportunity: { id } },
    });
  }

  async updateOpportunity(
    id: number,
    data: UpdateOpportunityDto,
    createdBy: number,
  ) {
    const findOpportunity = await this.opportunityRepository.findOne({
      where: { id: id },
      relations: ['lead'],
    });

    if (!findOpportunity) throw new NotFoundException('Opportunity not found');

    const oldData = { ...findOpportunity };

    const updateData: any = {
      ...data,
      createdBy: { id: createdBy },
      ModifiedBy: { id: createdBy },
    };

    let dealOwner;
    if (data.dealOwner) {
      dealOwner = await this.userRepository.findOne({
        where: { operator: { id: data.dealOwner }, isOperator: true },
      });
      if (!dealOwner) throw new NotFoundException('Deal owner not found');

      // Only include dealOwner in the update data if it exists
      updateData.dealOwner = { id: data.dealOwner };
    }

    await this.opportunityRepository.update(id, updateData);

    const modified = await this.userRepository.findOne({
      where: { id: createdBy },
    });

    const opportunity = await this.opportunityRepository.findOne({
      where: { id },
    });

    if (opportunity) {
      const currentDate = new Date();
      const closeDate = new Date(opportunity.closingDate);
      const stageDuration = currentDate.getDate() - closeDate.getDate();

      await this.funnelHistoryRepository.save(
        this.funnelHistoryRepository.create({
          stage: opportunity.stage,
          amount: Math.round(opportunity.expectedInvestment),
          closingDate: opportunity.closingDate,
          expectedInvestment: opportunity.expectedInvestment,
          probability: opportunity.probability,
          ModifiedBy: `${modified?.firstName ? modified.firstName : ''} ${
            modified?.lastName ? modified.lastName : ''
          }`,
          ModifyTime: new Date(),
          opportunity: { id: opportunity.id },
          stageDuration,
        }),
      );

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: data,
        oldData,
        entityId: opportunity.id,
        entityType: entityType.OPPORTUNITY,
        parentId: findOpportunity.lead.id,
        parentType: entityType.LEAD,
        performerId: modified?.operator.id,
        performerType: entityType.OPERATOR,
        field: 'Opportunity Updated',
      });
    }
    return opportunity;
  }

  async getOpportunitiesByLeadId(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
    leadId: number;
  }) {
    try {
      const { userId, limit, page, dto, leadId } = payload;
      const filters = [
        {
          name: 'lead.id',
          operation: FilterOperation.EQUALS,
          value: [leadId],
        },
      ];
      const relations = ['lead'];
      return await this.opportunitiesRepository.advanceFilters({
        listName: ListNames.OPPORTUNITY,
        userId,
        limit,
        page,
        filters,
        filterList: dto?.filters || undefined,
        sortList: dto.sort || undefined,
        defaultSortKey: 'createdAt',
        listViewId: dto.listViewId,
        relations,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Your request cannot be processed at this time',
      );
    }
  }

  async getAllOpportunities(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    try {
      const { userId, limit, page, dto } = payload;
      const filters = [];
      const relations = ['lead', 'createdBy'];

      return await this.opportunitiesRepository.advanceFilters({
        listName: ListNames.OPPORTUNITY,
        userId,
        limit,
        page,
        filters,
        filterList: dto?.filters || undefined,
        sortList: dto.sort || undefined,
        defaultSortKey: 'createdAt',
        listViewId: dto.listViewId,
        relations,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Your request cannot be processed at this time',
      );
    }
  }
  // async getOpportunitiesByLeadId(leadId: number, query?: OpportunityQueryDto) {
  //   if (query) {
  //     return await this.opportunityRepository.find({
  //       where: { lead: { id: leadId } },
  //       order: { [query.key]: query.value },
  //     });
  //   }
  //   return await this.opportunityRepository.find({
  //     where: { lead: { id: leadId } },
  //   });
  // }

  async getOpportunitiesStats(user: User): Promise<any> {
    const { result } = await this.opportunitiesRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId: user.id,
      filterList: undefined,
      listName: ListNames.OPPORTUNITY,
      sortList: undefined,
      defaultSortKey: 'createdAt',
      listViewId: undefined,
    });

    //     const query = `
    //   SELECT
    //     stage,
    //     COUNT(*) as count
    //   FROM
    //     opportunity
    //   WHERE
    //     stage IN ('Proposal/Offer', 'Closed Won', 'Negotiation/Consideration', 'Qualification', 'Verbal Approval', 'Closed Lost', 'Closed Lost to Competition') AND dealOwner = ${userId}
    //   GROUP BY
    //     stage
    // `;

    //     const result = await this.opportunitiesRepository.query(query);

    const stats = {
      // totalOpportunities: result.reduce((sum, row) => sum + row.count, 0),
      // qualification:
      //   result.find((row) => row.stage === 'Qualification')?.count || 0,
      // proposal:
      //   result.find((row) => row.stage === 'Proposal/Offer')?.count || 0,
      // negotiation:
      //   result.find((row) => row.stage === 'Negotiation/Consideration')
      //     ?.count || 0,
      // verbalApproval:
      //   result.find((row) => row.stage === 'Verbal Approval')?.count || 0,
      // closedWon: result.find((row) => row.stage === 'Closed Won')?.count || 0,
      // closedLost: result.find((row) => row.stage === 'Closed Lost')?.count || 0,
      // closedLostToCompetition:
      //   result.find((row) => row.stage === 'Closed Lost to Competition')
      //     ?.count || 0,
      totalOpportunities: result.length,
      qualification:
        result.filter((row) => row.stage === 'Qualification').length || 0,
      proposal:
        result.filter((row) => row.stage === 'Proposal/Offer')?.length || 0,
      negotiation:
        result.filter((row) => row.stage === 'Negotiation/Consideration')
          ?.length || 0,
      verbalApproval:
        result.filter((row) => row.stage === 'Verbal Approval')?.length || 0,
      closedWon:
        result.filter((row) => row.stage === 'Closed Won')?.length || 0,
      closedLost:
        result.filter((row) => row.stage === 'Closed Lost')?.length || 0,
      closedLostToCompetition:
        result.filter((row) => row.stage === 'Closed Lost to Competition')
          ?.length || 0,
    };

    return stats;
  }

  async getStages() {
    return await this.funnelRepository.find();
  }

  // async createEmail(createEmailDto: CreateEmailDto): Promise<void> {
  //   const {
  //     leadId,
  //     subject,
  //     html,
  //     opportunityId = null,
  //     operatorId,
  //     send = true,
  //   } = createEmailDto;

  //   if (!html) {
  //     throw new BadRequestException('html is required');
  //   }

  //   const operatorDetail = await this.userRepository.findOne({
  //     where: {
  //       id: operatorId,
  //       isOperator: true,
  //     },
  //   });

  //   const leadDetail = await this.leadRepository.findOne({
  //     where: { id: leadId },
  //   });

  //   if (!leadDetail) {
  //     throw new NotFoundException('Lead not found');
  //   }

  //   if (!operatorDetail) {
  //     throw new NotFoundException('Operator not found');
  //   }
  //   if (leadDetail && operatorDetail) {
  //     //sending email to client via mailMicroService and saving into communication table of mailMicroService

  //     this.mailService
  //       .sendLeadHtmlViaEmail({
  //         to: leadDetail?.email,
  //         from: createEmailDto?.from,
  //         data: {
  //           html,
  //           from: createEmailDto.from,
  //           subject,
  //           leadId,
  //           opportunityId,
  //           operatorId: operatorDetail?.operator?.id,
  //           send,
  //         },
  //       })
  //       .then(async () => {
  //         const id = createEmailDto.id;

  //         try {
  //           const callLog = await this.communicationRepository.findOneBy({
  //             id,
  //           });
  //           if (!callLog) throw new NotFoundException('Draft not found');
  //           await this.communicationRepository.softDelete(id);
  //         } catch (error) {
  //           console.log('Error deleting Call Log:', error);
  //           throw new InternalServerErrorException('Error delete Call Log');
  //         }
  //       })
  //       .catch((err) =>
  //         console.log('error sending email in sendLeadHtmlViaEmail: ', err),
  //       );
  //   }
  // }

  async createEmail(createEmailDto: CreateEmailDto): Promise<void> {
    const {
      leadId,
      subject,
      html,
      opportunityId = null,
      operatorId,
      send = true,
      id,
    } = createEmailDto;

    if (!html) {
      throw new BadRequestException('html is required');
    }

    const operatorDetail = await this.userRepository.findOne({
      where: {
        id: operatorId,
        isOperator: true,
      },
    });

    const leadDetail = await this.leadRepository.findOne({
      where: { id: leadId },
      relations: {
        regulation: true,
      },
    });

    if (!leadDetail) {
      throw new NotFoundException('Lead not found');
    }

    if (!operatorDetail) {
      throw new NotFoundException('Operator not found');
    }

    //sending email to client via mailMicroService and saving into communication table of mailMicroService
    await this.mailService.sendLeadHtmlViaEmail({
      to: leadDetail?.email,
      from: createEmailDto?.from,
      data: {
        html,
        from: createEmailDto.from,
        subject,
        leadId,
        opportunityId,
        operatorId: operatorDetail?.operator?.id,
        send,
        id,
        regulation: leadDetail?.regulations,
        regulationId: leadDetail?.regulation?.id,
      },
    });
  }

  async createAttachment(
    createAttachmentDto: CreateAttachmentDto,
    attachedBy: User,
  ): Promise<any> {
    const { fileId, opportunityId, leadId } = createAttachmentDto;

    const leadExist = await this.leadRepository.findOne({
      where: { id: leadId as any },
    });

    const opportunityExist = await this.opportunityRepository.findOne({
      where: { id: opportunityId as any, lead: { id: leadId as any } },
    });

    const existingAttachment = await this.attachmentRepository.findOne({
      where: {
        file: { id: fileId },
        leadId: { id: leadId as any },
        opportunityId: { id: opportunityId as any },
      },
    });

    if (existingAttachment) {
      throw new ConflictException(
        'Attachment with the same file already exists for this lead and opportunity.',
      );
    }

    if (!leadExist) {
      throw new NotFoundException('Lead not found');
    }

    if (!opportunityExist) {
      throw new NotFoundException('Opportunity against this lead not found');
    }

    const attachment = new attachments();
    attachment.fileId = fileId;
    attachment.isPublic = false;
    attachment.opportunityId = opportunityId;
    attachment.leadId = leadId;
    attachment.attachedBy = attachedBy;

    await this.attachmentRepository.save(attachment);
    return attachment;
  }

  async getOpenActivity(opportunityId: number) {
    const currentData = new Date();
    const meetings = await this.meetingsRepository.find({
      where: { opportunityID: opportunityId, from: MoreThan(currentData) },
    });
    const callLogs = await this.leadCallLogsRepository.find({
      where: {
        opportunityID: opportunityId,
        callEndDateTime: MoreThan(currentData),
      },
    });

    const tasks = await this.adminTaskRepository.find({
      where: {
        entity: TaskEntityType.OPPORTUNITY,
        entityId: opportunityId.toString(),
        isCompleted: false,
      },
      relations: { contact: true },
    });

    return { meetings, callLogs, tasks };
  }

  async getAllAttachments(
    leadId: number,
    opportunityId: number,
  ): Promise<AttachmentResponseDto[]> {
    const attachments = await this.attachmentRepository.find({
      relations: {
        file: true,
        attachedBy: true,
      },
      where: {
        leadId: { id: leadId },
        opportunityId: { id: opportunityId },
      },
    });
    const attachmentDtos = await Promise.all(
      attachments.map(async (attachment) => this.mapToResponseDto(attachment)),
    );

    return attachmentDtos;
  }

  async softDeleteAttachment(id: number): Promise<void> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }
    await this.attachmentRepository.softDelete(id);
  }

  private async mapToResponseDto(
    attachment: attachments,
  ): Promise<AttachmentResponseDto> {
    return {
      id: attachment.id,
      fileId: attachment.fileId,
      url: (await this.fileService.getSignedUrl(attachment.fileId)) ?? null,
      fileSize: attachment.file.fileSize ?? null,
      fileName: attachment.file.fileName ?? null,
      attachedByFirstName: attachment?.attachedBy?.firstName ?? '',
      attachedByLastName: attachment?.attachedBy?.lastName ?? '',
      opportunityId: attachment.opportunityId,
      leadId: attachment.leadId,
      created_at: attachment.created_at,
      updated_at: attachment.updated_at,
    };
  }

  async createNote(
    createKycNoteDto: CreateLeadNoteDto,
    createdBy: any,
  ): Promise<any> {
    // console.log('createKycNoteDto: ', createKycNoteDto);
    const lead = await this.leadRepository.findOne({
      where: { id: createKycNoteDto.lead_id },
      relations: { salesStatus: true },
    });
    if (createKycNoteDto.lead_id) {
      if (!lead) {
        throw new NotFoundException('Invalid lead_id');
      }
      if (createKycNoteDto.type === NotesType.LEAD_GENERAL) {
        await this.taskService.updateTasksStatusByLeadId(
          createKycNoteDto.lead_id,
        );
      }
    }

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

    if (createKycNoteDto.opportunity_id) {
      const opportunity = await this.opportunityRepository.findOne({
        where: { id: createKycNoteDto.opportunity_id },
        relations: {
          lead: true,
        },
      });
      if (!opportunity) {
        throw new NotFoundException('Invalid opportunity_id');
      }

      if (createKycNoteDto.type !== NotesType.LEAD_DEAL) {
        throw new BadRequestException(
          'Type cannot be any other except lead-deal when opportunity_id is provided',
        );
      }
    }

    if (
      createKycNoteDto.type === NotesType.LEAD_DEAL &&
      !createKycNoteDto.opportunity_id
    ) {
      throw new BadRequestException(
        'opportunity_id is required when type is lead-deal',
      );
    }

    if (createKycNoteDto.meeting_id) {
      const meeting = await this.meetingsRepository.findOne({
        where: { id: createKycNoteDto.meeting_id },
      });
      if (!meeting) {
        throw new NotFoundException('Invalid meeting id');
      }

      if (createKycNoteDto.type !== NotesType.LEAD_MEETING) {
        throw new BadRequestException(
          'Type cannot be any other except lead-meeting when meeting_id is provided',
        );
      }
    }

    if (
      createKycNoteDto.type === NotesType.LEAD_MEETING &&
      !createKycNoteDto.meeting_id
    ) {
      throw new BadRequestException(
        'meeting_id is required when type is lead-meeting',
      );
    }

    if (createKycNoteDto.call_id) {
      const call = await this.leadCallLogsRepository.findOne({
        where: { id: createKycNoteDto.call_id },
      });
      if (!call) {
        throw new NotFoundException('Invalid call id');
      }

      if (
        createKycNoteDto.type !== NotesType.LEAD_INBOUND &&
        createKycNoteDto.type !== NotesType.LEAD_OUTBOUND
      ) {
        throw new BadRequestException(
          'Type cannot be any other except lead-inbound or lead-outbound when call_id is provided',
        );
      }
    }

    if (
      (createKycNoteDto.type === NotesType.LEAD_INBOUND ||
        createKycNoteDto.type === NotesType.LEAD_OUTBOUND) &&
      !createKycNoteDto.call_id
    ) {
      throw new BadRequestException(
        'call_id is required when type is lead-inbound or lead-outbound',
      );
    }

    if (createKycNoteDto.ticket_id) {
      const ticket = await this.ticketRepository.findOne({
        where: { id: createKycNoteDto.ticket_id },
      });
      if (!ticket) {
        throw new NotFoundException('Invalid ticket id');
      }

      if (createKycNoteDto.type !== NotesType.TICKET_GENERAL) {
        throw new BadRequestException(
          'Type cannot be any other except ticket-general when ticket_id is provided',
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
      lead_id: { id: createKycNoteDto?.lead_id },
      user_id: { id: createKycNoteDto?.user_id },
      opportunity_id: { id: createKycNoteDto?.opportunity_id },
      call_id: { id: createKycNoteDto?.call_id },
      meeting_id: { id: createKycNoteDto?.meeting_id },
      ticket: { id: createKycNoteDto?.ticket_id },
      created_by: createdBy ?? null,
      isPublic: true,
    });
    const savednote = await this.notesRepository.save(newKycNote);

    if (lead) {
      if (createKycNoteDto.lead_id && lead) {
        let currentTime = new Date();
        const status = await this.customStatusRepository.findOne({
          where: { id: lead.salesStatus.id, type: StatusType.Sales },
        });

        let automationConfig: AutomationConfig | null = null;

        if (status && status.name !== 'New') {
          automationConfig = await this.automationConfigRepository
            .createQueryBuilder('automation_config')
            .where('automation_config.currentStatus LIKE :status ', {
              status: `%${status.name}%`,
            })
            .andWhere('automation_config.automationCode = :automationCode', {
              automationCode: 'leads_reassign_5',
            })
            .getOne();
        }

        if (!automationConfig && status) {
          {
            automationConfig = await this.automationConfigRepository
              .createQueryBuilder('automation_config')
              .where('automation_config.currentStatus LIKE :status ', {
                status: `%${status.name}%`,
              })
              .getOne();
          }
        }

        if (automationConfig?.conditionsJson) {
          const config = JSON.parse(automationConfig.conditionsJson);

          if (
            config.noteCreate &&
            automationConfig.actionsJson == 'leads_reassign_5'
          ) {
            currentTime = new Date(
              lead.nextActionTime.getTime() +
                config.noteCreate * 60 * 60 * 1000 +
                10 * 24 * 60 * 60 * 1000 -
                5 * 60 * 1000,
            );
          } else if (config.noteCreate) {
            currentTime = new Date(
              lead.nextActionTime.getTime() +
                config.noteCreate * 60 * 60 * 1000,
            );
          }

          await this.leadRepository.update(lead.id, {
            latestNote: createKycNoteDto.note,
            lastNoteAt: savednote?.updated_at,
            nextActionTime: currentTime,
          });
        } else {
          await this.leadRepository.update(lead?.id, {
            latestNote: createKycNoteDto.note,
            lastNoteAt: savednote?.updated_at,
          });
        }
      }
    }

    const getOperator = await this.userRepository.findOne({
      where: {
        id: createdBy,
      },
      relations: {
        operator: true,
      },
    });
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savednote,
      oldData: null,
      entityId: savednote?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Create Note',
      parentId: createKycNoteDto?.ticket_id
        ? createKycNoteDto?.ticket_id
        : savednote?.lead_id?.id,
      parentType: createKycNoteDto?.ticket_id
        ? entityType.TICKET
        : entityType.LEAD,
    });
    return savednote;
  }

  async updateLeadNote(
    id: number,
    updateData: UpdateLeadNoteDto,
    createdBy: any,
  ): Promise<any> {
    const leadNote = await this.notesRepository.findOne({
      where: { id },
      relations: {
        // lead_id:true,
        ticket: true,
        user_id: true,
        lead_id: {
          salesStatus: true,
        },
      },
    });
    const getOperator = await this.userRepository.findOne({
      where: {
        id: createdBy,
      },
      relations: {
        operator: true,
      },
    });
    if (!leadNote) {
      throw new NotFoundException('Lead note not found');
    }
    if (leadNote.created_by.id !== createdBy) {
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
      oldData: leadNote,
      entityId: leadNote?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Update Note',
      parentId: leadNote?.ticket?.id
        ? leadNote?.ticket?.id
        : leadNote?.lead_id?.id,
      parentType: leadNote?.ticket?.id ? entityType.TICKET : entityType.LEAD,
    });

    return await this.notesRepository.findOne({ where: { id } });
  }

  async getLeadNotes(
    leadId: number,
    type: LeadNotesType,
    oid?: number,
    meeting_id?: number,
    call_id?: number,
    ticket_id?: number,
    paginationOptions?: PaginationDto,
  ): Promise<any> {
    const whereClause: any = {
      lead_id: { id: leadId },
      type: type,
    };

    if (oid !== undefined) {
      whereClause.opportunity_id = { id: oid };
    }

    if (meeting_id !== undefined) {
      whereClause.meeting_id = { id: meeting_id };
    }

    if (call_id !== undefined) {
      whereClause.call_id = { id: call_id };
    }

    if (ticket_id !== undefined) {
      whereClause.ticket = { id: ticket_id };
    }

    let leadNotes;
    let totalCount;

    if (
      paginationOptions &&
      paginationOptions.limit !== undefined &&
      paginationOptions.page !== undefined
    ) {
      const { page, limit } = paginationOptions;
      [leadNotes, totalCount] = await this.notesRepository.findAndCount({
        where: whereClause,
        relations: {
          opportunity_id: true,
          created_by: true,
          lead_id: true,
          call_id: true,
          meeting_id: true,
          ticket: true,
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
      leadNotes = await this.notesRepository.find({
        where: whereClause,
        relations: {
          lead_id: true,
          created_by: true,
          opportunity_id: true,
          call_id: true,
          meeting_id: true,
          ticket: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
      totalCount = leadNotes.length;
    }

    if (!leadNotes || leadNotes.length === 0) {
      return {
        data: [],
        totalCount: 0,
        hasNextPage: false,
        page: 1,
        limit: paginationOptions?.limit ?? null,
      };
    }

    const fileIDs = await Promise.all(
      leadNotes.map(async (kycNote) => {
        const fileId = kycNote?.file_id;
        const attchementUrl = fileId
          ? await this.fileService.getSignedUrl(fileId)
          : null;
        let leadFullName: null | string = null;
        let creatorFullName: null | string = null;
        const creatorNameParts = [
          kycNote?.created_by?.firstName,
          kycNote?.created_by?.lastName,
        ];
        creatorFullName = creatorNameParts?.filter(Boolean).join(' ').trim();
        const leadNameParts = [
          kycNote?.lead_id?.firstName,
          kycNote?.lead_id?.lastName,
        ];
        leadFullName = leadNameParts?.filter(Boolean).join(' ').trim();
        const creatorProfile = kycNote?.created_by?.photo?.id || null;
        const profileUrl = creatorProfile
          ? await this.fileService.getSignedUrl(creatorProfile as string)
          : null;
        const leadId = kycNote?.lead_id?.id ?? null;
        const opportunityId = kycNote?.opportunity_id?.id ?? null;
        const meetingId = kycNote?.meeting_id?.id ?? null;
        const callId = kycNote?.call_id?.id ?? null;
        const createdBy = kycNote?.created_by?.id ?? null;
        const createdAt = kycNote?.created_at ?? null;
        const amount = kycNote?.opportunity_id?.amount ?? null;
        const dealName = kycNote?.opportunity_id?.dealName ?? null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          file_id: _, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          lead_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          opportunity_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          meeting_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          call_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          created_by, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user_kyc_document_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...docWithoutFileId // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } = kycNote; // eslint-disable-next-line @typescript-eslint/no-unused-vars

        return {
          ...docWithoutFileId,
          fileId,
          attchementUrl,
          leadFullName,
          creatorFullName,
          profileUrl,
          leadId,
          opportunityId,
          meetingId,
          callId,
          createdBy,
          createdAt,
          amount,
          dealName,
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

  async getLeadNotesAll(
    leadId: number,
    paginationOptions?: PaginationDto,
  ): Promise<any> {
    const whereClause: any = {
      lead_id: { id: leadId },
      type: In([
        NotesType.LEAD_DEAL,
        NotesType.LEAD_INBOUND,
        NotesType.LEAD_OUTBOUND,
        NotesType.LEAD_GENERAL,
        NotesType.LEAD_MEETING,
        NotesType.TICKET_GENERAL,
      ]),
    };

    let leadNotes;
    let totalCount;

    if (
      paginationOptions &&
      paginationOptions.limit !== undefined &&
      paginationOptions.page !== undefined
    ) {
      const { page, limit } = paginationOptions;
      [leadNotes, totalCount] = await this.notesRepository.findAndCount({
        where: whereClause,
        relations: {
          opportunity_id: true,
          created_by: true,
          lead_id: true,
          meeting_id: true,
          call_id: true,
          ticket: true,
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
      leadNotes = await this.notesRepository.find({
        where: whereClause,
        relations: {
          lead_id: true,
          created_by: true,
          opportunity_id: true,
          meeting_id: true,
          call_id: true,
          ticket: true,
        },
        order: {
          created_at: 'DESC',
        },
      });
      totalCount = leadNotes.length;
    }

    if (!leadNotes || leadNotes.length === 0) {
      return {
        data: [],
        totalCount: 0,
        hasNextPage: false,
        page: 1,
        limit: paginationOptions?.limit ?? null,
      };
    }

    const fileIDs = await Promise.all(
      leadNotes.map(async (kycNote) => {
        const fileId = kycNote?.file_id;
        const attchementUrl = fileId
          ? await this.fileService.getSignedUrl(fileId)
          : null;
        let leadFullName: null | string = null;
        let creatorFullName: null | string = null;
        const creatorNameParts = [
          kycNote?.created_by?.firstName,
          kycNote?.created_by?.lastName,
        ];
        creatorFullName = creatorNameParts?.filter(Boolean).join(' ').trim();
        const leadNameParts = [
          kycNote?.lead_id?.firstName,
          kycNote?.lead_id?.lastName,
        ];
        leadFullName = leadNameParts?.filter(Boolean).join(' ').trim();
        const creatorProfile = kycNote?.created_by?.photo?.id || null;
        const profileUrl = creatorProfile
          ? await this.fileService.getSignedUrl(creatorProfile as string)
          : null;
        const leadId = kycNote?.lead_id?.id ?? null;
        const opportunityId = kycNote?.opportunity_id?.id ?? null;
        const meetingId = kycNote?.meeting_id?.id ?? null;
        const callId = kycNote?.call_id?.id ?? null;
        const createdBy = kycNote?.created_by?.id ?? null;
        const createdAt = kycNote?.created_at ?? null;
        const amount = kycNote?.opportunity_id?.amount ?? null;
        const dealName = kycNote?.opportunity_id?.dealName ?? null;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          file_id: _, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          lead_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          opportunity_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          meeting_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          call_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          created_by, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          user_kyc_document_id, // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ...docWithoutFileId // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } = kycNote; // eslint-disable-next-line @typescript-eslint/no-unused-vars

        return {
          ...docWithoutFileId,
          fileId,
          attchementUrl,
          leadFullName,
          creatorFullName,
          profileUrl,
          leadId,
          opportunityId,
          meetingId,
          callId,
          createdBy,
          createdAt,
          amount,
          dealName,
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

  async getAllNotes(
    limit: number,
    page: number,
    userId: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    const notes = await this.notesRepository.advanceFilters({
      limit,
      page,
      userId,
      relations: [
        'lead_id',
        'created_by',
        'opportunity_id',
        'meeting_id',
        'call_id',
        'ticket',
      ],
      filterList: dto.filters || undefined,
      listName: ListNames.NOTES,
      sortList: dto.sort || undefined,
      defaultSortKey: 'created_at',
      listViewId: dto.listViewId,
    });

    for (let i = 0; i < notes.result.length; i++) {
      const fileId = notes.result[i].file_id;
      const note = notes.result[i];

      [note.attchementUrl, note.fileName] = fileId
        ? await this.fileService.getSignedUrlAdName(fileId)
        : [null, null];
    }

    return notes;
  }

  async getAllNotesForDashboard(payload: {
    limit: number;
    page: number;
    all: boolean;
    userId: number;
    dto: ApplyListFilterSortColumnDto;
  }): Promise<any> {
    const { limit, page, userId, dto, all } = payload;
    const notes = await this.notesRepository.advanceFilters({
      limit,
      page,
      all,
      userId,
      relations: [
        'lead_id',
        'created_by',
        'opportunity_id',
        'meeting_id',
        'call_id',
      ],
      filterList: dto.filters || undefined,
      listName: ListNames.NOTES,
      sortList: dto.sort || undefined,
      defaultSortKey: 'created_at',
      listViewId: dto.listViewId,
    });

    for (let i = 0; i < notes.result.length; i++) {
      const fileId = notes.result[i].file_id;
      const note = notes.result[i];

      [note.attchementUrl, note.fileName] = fileId
        ? await this.fileService.getSignedUrlAdName(fileId)
        : [null, null];
    }

    return notes;
  }
  async getNotesStats(userId: number): Promise<any> {
    const leadNotesFilters: FilterItem[] = [
      {
        name: 'lead_id.id',
        operation: FilterOperation.NOT_EQUAL,
        //@ts-expect-error type-error
        value: [null],
      },
    ];

    const notesAttachmentFilters: FilterItem[] = [
      {
        name: 'file_id',
        operation: FilterOperation.NOT_EQUAL,
        //@ts-expect-error type-error
        value: [null],
      },
    ];

    const dealNotesFilter: FilterItem[] = [
      {
        name: 'type',
        operation: FilterOperation.EQUALS,
        value: [NotesType.LEAD_DEAL],
      },
    ];

    const notes = await this.notesRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId,
      filterList: undefined,
      listName: ListNames.NOTES,
      sortList: undefined,
      defaultSortKey: 'created_at',
      listViewId: undefined,
      countOnly: true,
    });

    const leadNotes = await this.notesRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId,
      filterList: undefined,
      listName: ListNames.NOTES,
      sortList: undefined,
      defaultSortKey: 'created_at',
      listViewId: undefined,
      filters: leadNotesFilters,
      countOnly: true,
    });

    const notesAttachment = await this.notesRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId,
      filterList: undefined,
      listName: ListNames.NOTES,
      sortList: undefined,
      defaultSortKey: 'created_at',
      listViewId: undefined,
      filters: notesAttachmentFilters,
      countOnly: true,
    });

    const dealsNotes = await this.notesRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId,
      filterList: undefined,
      listName: ListNames.NOTES,
      sortList: undefined,
      defaultSortKey: 'created_at',
      listViewId: undefined,
      filters: dealNotesFilter,
      countOnly: true,
    });

    const statsCount = {
      totalNotes: notes.total,
      leadNotes: leadNotes.total,
      notesAttachment: notesAttachment.total,
      dealsNotes: dealsNotes.total,
    };

    return statsCount;
  }

  async softDeleteLeadNote(id: number, userId: number): Promise<void> {
    const kycNote = await this.notesRepository.findOne({
      where: { id },
      relations: {
        lead_id: true,
        user_id: true,
        ticket: true,
      },
    });
    if (!kycNote) {
      throw new NotFoundException('Lead note not found');
    }
    kycNote.deleted_at = new Date();
    const savedNote = await this.notesRepository.save(kycNote);
    if (kycNote?.lead_id?.id) {
      const previousNotes = await this.notesRepository.find({
        where: {
          lead_id: { id: kycNote?.lead_id?.id },
        },
        order: { updated_at: 'DESC' },
        take: 1,
      });
      const previousNote = previousNotes[0];
      await this.leadRepository.update(kycNote?.lead_id?.id, {
        latestNote: previousNote?.note,
        lastNoteAt: previousNote?.updated_at,
      });
    }
    const getOperator = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        operator: true,
      },
    });
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: savedNote,
      entityId: savedNote?.id,
      entityType: entityType.NOTE,
      performerId: getOperator?.operator?.id,
      performerType: performerType.OPERATOR,
      field: 'Delete Note',
      parentId: savedNote?.ticket?.id
        ? savedNote?.ticket?.id
        : savedNote?.lead_id?.id,
      parentType: savedNote?.ticket?.id ? entityType.TICKET : entityType.LEAD,
    });
  }

  async getMessages({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<any> {
    return await this.mailService.getInboxEmail(paginationOptions);
  }

  async getInboxEmailById(payload: { id: number }): Promise<any> {
    // return await this.mailService.getInboxEmailById(payload);

    const communication = await this.inboxEmailRepository.findOne({
      where: { id: payload.id },
      relations: { email: true },
    });

    if (communication?.status === EmailStatus.NEW)
      await this.inboxEmailRepository.save({
        ...communication,
        status: EmailStatus.READ,
      });

    if (!communication) {
      throw new NotFoundException(`Message with ID ${payload.id} not found`);
    }

    return this.mapToDtoInbox(communication);
  }

  private mapToDtoInbox(communication: InboxEmail): any {
    return {
      id: communication.id,
      subject: communication.subject,
      html: communication.body,
      senderName: communication.senderName,
      from: communication.from,
      recievedAt: communication.receivedDateTime,
      to: communication.email?.email,
    };
  }

  async getMessagesByLead({
    paginationOptions,
    leadId,
  }: {
    paginationOptions: IPaginationOptions;
    leadId: number;
  }): Promise<any> {
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    const leadEmail = lead?.email;
    return await this.mailService.getInboxEmailByLead({
      paginationOptions,
      leadId,
      leadEmail,
    });
  }
}
