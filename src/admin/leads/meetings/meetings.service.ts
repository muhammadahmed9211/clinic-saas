import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, LessThan, MoreThan, Repository } from 'typeorm';
import {
  AddParticipantsDto,
  CancelMeetingDto,
  CompleteMeetingDto,
  CreateMeetingDto,
  DeleteMeetingDto,
  DeleteParticipantsDto,
  MeetingAttachmentDto,
  MeetingAttachmentResponseDto,
  rescheduleMeetingDto,
  Status,
  UpdateMeetingDto,
} from './dto/meetings.dto';
import { User } from 'src/users/entities/user.entity';
import { MeetingParticipants } from './entities/participants.entity';
import { I18nContext } from 'nestjs-i18n';
import { Lead } from '../entities/lead.entity';
import { RelatedToData } from 'src/admin/task/task.controller';
import { OpportunityService } from '../opportunity/opportunity.service';
import { NotesType } from 'src/admin/kyc/dto/admin-kyc.dto';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { attachments } from '../opportunity/entities/attachment.entity';
import { FilesService } from 'src/files/files.service';
import { MeetingRepository } from './repositories/meetings.repository';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  entityType,
  performerType,
} from 'src/admin/active-log/active-log.type';
import { Meetings } from './entities/meetings.entity';
import { Label } from 'src/tasks/entities/label.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { notifications } from 'src/notification/entity/notification.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
@Injectable()
export class MeetingsService {
  constructor(
    @InjectRepository(MeetingParticipants)
    private readonly meetingsParticipantsRepository: Repository<MeetingParticipants>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(notes)
    private readonly noteRepository: Repository<notes>,
    private readonly opportunityService: OpportunityService,
    @InjectRepository(attachments)
    private readonly attachmentRepository: Repository<attachments>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(notifications)
    private readonly notificationRepository: Repository<notifications>,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    private readonly fileService: FilesService,
    private readonly mailerService: MailerService,
    private readonly meetingsRepository: MeetingRepository,
    private readonly eventEmitter: EventEmitter2,
    // private socketGateway: SocketGateway,
  ) {}

  async createMeetings(
    leadId: number,
    user,
    fromEmail: string,
    createMeetingDto: CreateMeetingDto,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const {
      hostId,
      participants = [],
      notes,
      ...meetingData
    } = createMeetingDto;

    const lead = await this.leadRepository.findOne({ where: { id: leadId },relations:{
      regulation:true
    } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const userInfo = await this.userRepository.findOne({
      where: { id: user.id },
    });

    let fromUtc, toUtc;
    if (meetingData.from) {
      fromUtc = new Date(meetingData.from);
    }

    if (meetingData.to) {
      toUtc = new Date(meetingData.to);
    }

    const meetings = await this.meetingsRepository.save({
      ...meetingData,
      from: fromUtc,
      to: toUtc,
      lead,
      notes,
      fromEmail: fromEmail,
      host: {
        id: hostId,
      },
      createdBy: {
        id: userInfo?.operator.id,
      },
    });

    const validParticipants =
      participants.length > 0 ? [...new Set(participants)] : [];

    const meetingParticipants = validParticipants.map((participant) => {
      if (typeof participant !== 'number') {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: {
              msg: 'Invalid participant ID',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return this.meetingsParticipantsRepository.create({
        participant: { id: participant },
        meeting: { id: meetings.id },
      });
    });
    await this.meetingsParticipantsRepository.save(meetingParticipants);
    if (notes && notes.trim() !== '') {
      const createLeadNoteDto = {
        lead_id: leadId,
        type: NotesType.LEAD_MEETING,
        note: notes,
        meeting_id: meetings.id,
      };
    
      await this.opportunityService.createNote(createLeadNoteDto, user.id);
    }

    const attendeesEmails = await Promise.all(
      validParticipants.map(async (participantId) => {
        const participant = await this.leadRepository.findOne({
          where: { id: participantId },
        });
        return participant?.email;
      }),
    );

    const filteredEmails = attendeesEmails.filter(
      (email) => email !== null && email !== undefined,
    ) as unknown as string[];

    const userAndOperator = await this.userRepository.findOne({
      where: { id: user.id },
    });

    try {
      const teamsMeeting = await this.mailerService.getMeetingMails({
        fromEmail,
        userTimezone: meetingData.userTimezone,
        title: meetingData?.title,
        clientName: lead?.firstName || '',
        operatorName: userAndOperator?.operator.full_name || '',
        notes,
        start: fromUtc,
        end: toUtc,
        attendees: filteredEmails,
        regulationId: lead?.regulation?.id
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: meetings,
        oldData: null,
        entityId: meetings.id,
        entityType: entityType.MEETING,
        parentId: meetings?.lead?.id,
        parentType: entityType.LEAD,
        performerId: user.id,
        performerType: performerType.OPERATOR,
        field: 'Meeting Created',
      });    

      return { ...meetings, teamsMeeting };
    } catch (e) {
      return e.message;
    }
  }

  async getAllMeetingsByLeadId(id: number): Promise<any> {
    const meetings = await this.meetingsRepository.find({
      where: {
        lead: { id: id },
        isDeleted: false,
      },
      relations: ['host', 'participants.participant', 'lead'],
    });

    if (!meetings || meetings.length === 0) {
      return [];
    }

    const updatedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        const participantIds = meeting.participants.map((p) => p.id);
        const participants = await this.userRepository.find({
          where: { id: In(participantIds) },
        });

        meeting.participants = meeting.participants.map((participant) => ({
          ...participant,
          user: participants.find((user) => user.id === participant.id),
        }));

        const relatedTo = RelatedToData.find(
          (p) => p.id === meeting.relatedToId,
        );

        return {
          ...meeting,
          host: meeting.host,
          contactName: meeting.lead.firstName + ' ' + meeting.lead.lastName,
          relatedTo: relatedTo ? relatedTo.name : null,
        };
      }),
    );

    return updatedMeetings;
  }

  async listSingleMeeting(leadId: number, meetingId: number): Promise<any> {
    const i18n = I18nContext.current();
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const meeting = await this.meetingsRepository.findOne({
      where: { id: meetingId, isDeleted: false },
      relations: {
        host: true,
        lead: true,
        // participants: {
        //   participant: true,
        // },
        participants: true,
      },
    });

    if (!meeting) {
      const message = await i18n?.t('errors.leads.meetingNotFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const participantIds = meeting.participants.map((p) => p.participant.id);

    const participants = await this.userRepository.find({
      where: { id: In(participantIds) },
    });

    meeting.participants = meeting.participants.map((participant) => ({
      ...participant,
      user: participants.find((user) => user.id === participant.participant.id),
    }));

    const relatedTo = RelatedToData.find((p) => p.id === meeting.relatedToId);

    const relatedToWithMeeting = {
      ...meeting,
      contactName: meeting.lead.firstName + ' ' + meeting.lead.lastName,
      leadId: meeting.lead.id,
      relatedTo: relatedTo ? relatedTo.name : null,
    };

    return relatedToWithMeeting;
  }

  async listAllMeetings(
    limit: number,
    page: number,
    userId: number,
    dto: ApplyListFilterSortColumnDto,
    all: boolean = false,
  ): Promise<any> {
    const meetings = await this.meetingsRepository.advanceFilters({
      limit,
      page,
      userId,
      relations: [
        'host',
        'createdBy',
        'participants.participant',
        'attachments',
        'lead',
      ],
      filterList: dto.filters || undefined,
      listName: ListNames.MEETINGS,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      all,
    });

    const updatedMeetings = meetings.result.map((meeting) => {
      const relatedTo = RelatedToData.find((p) => p.id === meeting.relatedToId);

      return {
        ...meeting,
        contactName: `${meeting.lead.firstName} ${meeting.lead.lastName}`,
        relatedTo: relatedTo ? relatedTo.name : null,
        createdBy: meeting.createdBy
          ? {
              id : meeting.createdBy.id,
              fullname: meeting.createdBy.full_name,
              photoObject: meeting.createdBy.photo,
            }
          : null,
      };
    });

    return {
      ...meetings,
      result: updatedMeetings,
    };
  }

  async meetingStats(userId: number): Promise<any> {
    // const meetings = await this.meetingsRepository.find();
    const meetings = await this.meetingsRepository.advanceFilters({
      limit: 0,
      page: 0,
      userId,
      // relations: [
      //   'host',
      //   'createdBy',
      //   'participants.participant',
      //   'attachments',
      //   'lead',
      // ],
      filterList: undefined,
      listName: ListNames.MEETINGS,
      sortList: undefined,
      defaultSortKey: 'createdAt',
      listViewId: undefined,
    });

    const statusCount = {
      completed: 0,
      scheduled: 0,
      pending: 0,
      cancelled: 0,
    };
    meetings.result.forEach((meeting) => {
      const status = meeting.status.toLowerCase();

      if (statusCount.hasOwnProperty(status)) {
        statusCount[status]++;
      }
    });

    return statusCount;
  }

  async updateMeetings(
    leadId: number,
    id: number,
    updateMeetingDto: UpdateMeetingDto,
    userId: any
  ): Promise<any> {
    const i18n = I18nContext.current();
    const { hostId, relatedToId, participants, notes, ...meetingData } =
      updateMeetingDto;

    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const previousMeeting = await this.meetingsRepository.findOne({
      where: { id },
    });

    if (!previousMeeting) {
      const message = await i18n?.t('errors.leads.meetingNotFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let fromUtc, toUtc;
    if (meetingData.from) {
      fromUtc = new Date(meetingData.from);
    }

    if (meetingData.to) {
      toUtc = new Date(meetingData.to);
    }

    const newMeetingData = await this.meetingsRepository.update(id, {
      ...meetingData,
      from: fromUtc,
      to: toUtc,
      relatedToId,
      notes,
      host: {
        id: hostId,
      },
    });

    const notess = await this.noteRepository.findOne({
      where: {
        meeting_id: { id },
      },
    });

    if (notess) {
      await this.opportunityService.updateLeadNote(
        notess.id,
        {
          note: notes,
        },
        notess.created_by,
      );
    } else {
    }

    await this.meetingsParticipantsRepository.delete({ meeting: { id } });

    const meetingParticipants = participants?.map((participant) => {
      return this.meetingsParticipantsRepository.create({
        participant: { id: participant },
        meeting: { id },
      });
    });

    if (meetingParticipants) {
      await this.meetingsParticipantsRepository.save(meetingParticipants);
    }

    const meeting = await this.meetingsRepository.findOne({
      where: { id },
      relations: ['participants.participant', 'host','lead'],
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updateMeetingDto,
      oldData: previousMeeting,
      entityId: meeting?.id,
      entityType: entityType.MEETING,
      parentId: meeting?.lead?.id,
      parentType: entityType.LEAD,
      performerId:userId,
      performerType: performerType.OPERATOR,
      field: 'Meeting Updated',
    });

    return meeting;
  }

  async deleteMeetingById(
    leadId: number,
    id: number,
    deleteMeetingDto: DeleteMeetingDto,
    userId: any
  ): Promise<any> {
    const i18n = I18nContext.current();
    const meeting = await this.meetingsRepository.findOneBy({ id: id });
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!meeting) {
      const message = await i18n?.t('errors.leads.meetingNotFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.meetingsRepository.softDelete(id);

    await this.meetingsRepository.update(id, {
      status: 'DELETED',
      deleteReason: deleteMeetingDto.deleteReason,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: meeting,
      entityId: meeting.id,
      entityType: entityType.MEETING,
      parentId: leadId,
      parentType: entityType.LEAD,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Meeting Deleted',
    });

    return { message: 'Meeting deleted successfully' };
  }

  // async rescheduleMeeting(
  //   id: number,
  //   rescheduleMeetingDto: rescheduleMeetingDto,
  // ): Promise<any> {
  //   const previousMeeting = await this.meetingsRepository.findOne({
  //     where: { id: id },
  //     relations: ['lead', 'host'],
  //   });

  //   if (!previousMeeting) {
  //     return [];
  //   }

  //   const { hostId, relatedToId, participants, notes, ...meetingData } =
  //     rescheduleMeetingDto;

  //   const updatedMeeting = await this.meetingsRepository.save({
  //     ...previousMeeting,
  //     ...meetingData,
  //     notes,
  //     relatedTo: { id: relatedToId },
  //     lead: { id: previousMeeting.lead.id },
  //     host: { id: hostId },
  //   });

  //   const notess = await this.noteRepository.findOne({
  //     where: {
  //       meeting_id: { id },
  //     },
  //   });
  //   const user = await this.userRepository.findOne({where: {operator: {id:hostId}}});
  //   if (notess) {
  //     await this.opportunityService.updateLeadNote(
  //       notess.id,
  //       {
  //         note: notes,
  //       },
  //       user?.id,
  //     );
  //   }

  //   await this.meetingsParticipantsRepository.delete({ meeting: { id } });

  //   const meetingParticipants = participants?.map((participant) => {
  //     return this.meetingsParticipantsRepository.create({
  //       participant: { id: participant },
  //       meeting: { id },
  //     });
  //   });

  //   if (meetingParticipants) {
  //     await this.meetingsParticipantsRepository.save(meetingParticipants);
  //     return this.meetingsRepository.findOne({
  //       where: { id },
  //       relations: ['participants.participant', 'host'],
  //     });
  //   }

  //   const defaultNotes = notes || 'Default notes text';

  //   const createLeadNoteDto = {
  //     lead_id: previousMeeting.lead.id,
  //     type: NotesType.LEAD_MEETING,
  //     note: defaultNotes, // Ensure note is always a string
  //     meeting_id: previousMeeting.id,
  //   };

  //   await this.opportunityService.createNote(createLeadNoteDto, hostId);

  //   return updatedMeeting;
  // }

  async rescheduleMeeting(
    id: number,
    rescheduleMeetingDto: rescheduleMeetingDto,
    jwtUser: User,
  ): Promise<any> {
    const previousMeeting = await this.meetingsRepository.findOne({
      where: { id: id },
      relations: ['lead', 'host','lead.regulation'],
    });

    if (!previousMeeting) {
      return [];
    }

    const {
      hostId,
      relatedToId,
      participants = [],
      notes,
      ...meetingData
    } = rescheduleMeetingDto;

    const updatedMeeting = await this.meetingsRepository.save({
      ...previousMeeting,
      ...meetingData,
      notes,
      relatedTo: { id: relatedToId },
      lead: { id: previousMeeting.lead.id },
      host: { id: hostId },
    });

    const noteRecord = await this.noteRepository.findOne({
      where: { meeting_id: { id } },
    });

    const user = await this.userRepository.findOne({
      where: { operator: { id: hostId } },
    });

    if (noteRecord) {
      await this.opportunityService.updateLeadNote(
        noteRecord.id,
        { note: notes },
        user?.id,
      );
    }

    await this.meetingsParticipantsRepository.delete({ meeting: { id } });

    const meetingParticipants = participants?.map((participant) => {
      return this.meetingsParticipantsRepository.create({
        participant: { id: participant },
        meeting: { id },
      });
    });

    if (meetingParticipants) {
      await this.meetingsParticipantsRepository.save(meetingParticipants);
    }

    const validParticipants =
      participants.length > 0 ? [...new Set(participants)] : [];

    const attendeesEmails = await Promise.all(
      validParticipants.map(async (participantId) => {
        const participant = await this.leadRepository.findOne({
          where: { id: participantId },
        });
        return participant?.email;
      }),
    );

    const filteredEmails = attendeesEmails.filter(
      (email) => email !== null && email !== undefined,
    ) as string[];

    const userAndOperator = await this.userRepository.findOne({
      where: { id: user?.id },
    });

    try {
      const teamsMeeting = await this.mailerService.getMeetingMails({
        fromEmail: meetingData.fromEmail,
        userTimezone: meetingData.userTimezone,
        title: meetingData?.title,
        clientName: previousMeeting.lead?.firstName || '',
        operatorName: userAndOperator?.operator.full_name || '',
        notes,
        start: new Date(meetingData?.from),
        end: new Date(meetingData?.to),
        attendees: filteredEmails,
        regulationId: previousMeeting?.lead?.regulation?.id
      });

      const oldData = { 
        ...previousMeeting,
        from: previousMeeting.from.toISOString().replace(/\.\d{3}/, '')  // Removes milliseconds
      };

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: rescheduleMeetingDto,
        oldData: oldData,
        entityId: updatedMeeting.id,
        entityType: entityType.MEETING,
        parentId: updatedMeeting?.lead?.id,
        parentType: entityType.LEAD,
        performerId: jwtUser.id,
        performerType: performerType.OPERATOR,
        field: 'Meeting Rescheduled',
      });

      return { ...updatedMeeting, teamsMeeting };
    } catch (e) {
      return e.message;
    }
  }

  async createMeetingAttachment(
    createAttachmentDto: MeetingAttachmentDto,
    attachedBy: User,
  ): Promise<any> {
    const { fileId, meetingId, leadId } = createAttachmentDto;

    const leadExist = await this.leadRepository.findOne({
      where: { id: leadId as any },
    });

    const meetingExist = await this.meetingsRepository.findOne({
      where: { id: meetingId as any, lead: { id: leadId as any } },
    });

    const existingAttachment = await this.attachmentRepository.findOne({
      where: {
        file: { id: fileId },
        leadId: { id: leadId as any },
        meetingId: { id: meetingId as any },
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

    if (!meetingExist) {
      throw new NotFoundException('Meeting against this lead not found');
    }

    const attachment = new attachments();
    attachment.fileId = fileId;
    attachment.isPublic = false;
    attachment.meetingId = meetingId;
    attachment.leadId = leadId;
    attachment.attachedBy = attachedBy;

    await this.attachmentRepository.save(attachment);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: attachment,
      oldData: null,
      entityId: attachment?.id,
      entityType: entityType.MEETING,
      parentId: attachedBy,
      parentType: entityType.LEAD,
      performerId: attachedBy,
      performerType: performerType.OPERATOR,
      field: 'Meeting Attachment Deleted',
    });

    return attachment;
  }

  async getAllAttachments(
    leadId: number,
    meetingId: number,
  ): Promise<MeetingAttachmentResponseDto[]> {
    const attachments = await this.attachmentRepository.find({
      relations: {
        file: true,
        attachedBy: true,
      },
      where: {
        leadId: { id: leadId },
        meetingId: { id: meetingId },
      },
    });
    const attachmentDtos = await Promise.all(
      attachments.map(async (attachment) => this.mapToResponseDto(attachment)),
    );

    return attachmentDtos;
  }

  private async mapToResponseDto(
    attachment: attachments,
  ): Promise<MeetingAttachmentResponseDto> {
    return {
      id: attachment.id,
      fileId: attachment.fileId,
      url: (await this.fileService.getSignedUrl(attachment.fileId)) ?? null,
      fileSize: attachment.file.fileSize ?? null,
      fileName: attachment.file.fileName ?? null,
      attachedByFirstName: attachment?.attachedBy?.firstName ?? '',
      attachedByLastName: attachment?.attachedBy?.lastName ?? '',
      meetingId: attachment.meetingId,
      leadId: attachment.leadId,
      created_at: attachment.created_at,
      updated_at: attachment.updated_at,
    };
  }

  async softDeleteAttachment(id: number,userId:any): Promise<void> {
    const attachment = await this.attachmentRepository.findOne({
      where: { id },
      relations:['leadId']
    });
    if (!attachment) {
      throw new NotFoundException(`Attachment with ID ${id} not found`);
    }

    const deletedAttachments = await this.attachmentRepository.softDelete(id);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deletedAttachments,
      oldData: null,
      entityId: attachment?.id,
      entityType: entityType.MEETING,
      parentId: attachment?.leadId?.id,
      parentType: entityType.LEAD,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Meeting Attachment Deleted',
    });
  }

  async completeMeetingById(
    leadId: number,
    id: number,
    completeMeetingDto: CompleteMeetingDto,
    userId: any
  ): Promise<any> {
    const i18n = I18nContext.current();
    const meeting = await this.meetingsRepository.findOneBy({ id: id })
    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!meeting) {
      const message = await i18n?.t('errors.leads.meetingNotFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const oldMeetingStatus = JSON.stringify(meeting.status);
    meeting.status = 'COMPLETED';
    meeting.completionReason = completeMeetingDto.completionReason;
    await this.meetingsRepository.save(meeting);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { status: meeting.status, reason: meeting.completionReason },
      oldData: { status: JSON.parse(oldMeetingStatus) },
      entityId: meeting?.id,
      entityType: entityType.MEETING,
      parentId: leadId,
      parentType: entityType.LEAD,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Meeting Completed',
    });

    return { message: 'Meeting completed successfully' };
  }

  async cancelMeetingById(
    leadId: number,
    id: number,
    cancelMeetingDto: CancelMeetingDto,
    userId: any
  ): Promise<any> {
    const i18n = I18nContext.current();

    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const meeting = await this.meetingsRepository.findOneBy({ id: id });

    if (!meeting) {
      const message = await i18n?.t('errors.leads.meetingNotFound');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const oldMeetingStatus = JSON.stringify(meeting.status);
    meeting.status = 'CANCELLED';
    meeting.cancelReason = cancelMeetingDto.cancelReason;
    await this.meetingsRepository.save(meeting);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { status: meeting.status, reason: meeting.cancelReason },
      oldData: { status: JSON.parse(oldMeetingStatus) },
      entityId: meeting.id,
      entityType: entityType.MEETING,
      parentId: leadId,
      parentType: entityType.LEAD,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Meeting Canceled',
    });

    return { message: 'Meeting canceled successfully' };
  }

  async listMeetingsByLeadIdAndDateRange(
    id: number,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    // const i18n = I18nContext.current();

    const meetings = await this.meetingsRepository.find({
      where: {
        lead: { id: id },
        isDeleted: false,
        from: Between(startDate, endDate),
        to: Between(startDate, endDate),
      },
      relations: ['host', 'participants.participant', 'lead'],
      select: { host: { id: true, full_name: true, photo: { id: true } } },
    });

    if (!meetings || meetings.length === 0) {
      return [];
      // const message = await i18n?.t('errors.leads.meetingNotFound');
      // throw new HttpException(
      //   {
      //     status: HttpStatus.UNPROCESSABLE_ENTITY,
      //     error: {
      //       msg: message,
      //     },
      //   },
      //   HttpStatus.UNPROCESSABLE_ENTITY,
      // );
    }

    const updatedMeetings = await Promise.all(
      meetings.map(async (meeting) => {
        const participantIds = meeting.participants.map((p) => p.id);
        const users = await this.userRepository.find({
          where: { id: In(participantIds) },
          select: ['id', 'photo'],
        });

        meeting.participants = meeting.participants.map((participant) => ({
          ...participant,
          user: users.find((user) => user.id === participant.id),
        }));

        const updatedParticipants = meeting.participants.map(
          (participantObj) => {
            const user = users.find(
              (user) => user.id === participantObj.participant.id,
            );
            if (user && user.photo) {
              participantObj.participant['photoUrl'] =
                this.fileService.getSignedUrl(user.photo.id);
            }
            return participantObj;
          },
        );

        const relatedTo = RelatedToData.find(
          (p) => p.id === meeting.relatedToId,
        );
        const hostPhotoUrl = meeting.host.photo
          ? await this.fileService.getSignedUrl(meeting.host.photo.id)
          : null;

        return {
          ...meeting,
          host: {
            ...meeting.host,
            photo: {
              ...meeting.host.photo,
              signedUrl: hostPhotoUrl,
            },
          },
          participants: updatedParticipants,
          contactName: meeting.lead.firstName + ' ' + meeting.lead.lastName,
          relatedTo: relatedTo ? relatedTo.name : null,
        };
      }),
    );

    return updatedMeetings;
  }

  async deleteParticipants(
    leadId: number,
    meetingId: number,
    deleteParticipantsDto: DeleteParticipantsDto,
    user: User,
  ): Promise<any> {
    const i18n = I18nContext.current();

    const { participants } = deleteParticipantsDto;

    const lead = await this.leadRepository.findOne({ where: { id: leadId } });
    if (!lead) {
      const message = await i18n?.t('errors.leads.invalidLeadId');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const meeting = await this.meetingsRepository.findOne({
      where: { id: meetingId },
    });
    if (!meeting) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Meeting not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const meetingParticipants = await this.meetingsParticipantsRepository.find({
      where: {
        meeting: { id: meetingId },
        participant: { id: In(participants) },
      },
      relations: ['participant'],
    });

    const foundParticipantIds = meetingParticipants.map(
      (mp) => mp.participant.id,
    );

    const notFoundParticipantIds = participants.filter(
      (id) => !foundParticipantIds.includes(id),
    );

    const deletedParticipants =
      await this.meetingsParticipantsRepository.softRemove(meetingParticipants);

    if (notFoundParticipantIds.length > 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: 'Some participants not found',
        notFoundParticipants: notFoundParticipantIds,
      };
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deletedParticipants,
      oldData: null,
      entityId: meetingId,
      entityType: entityType.MEETING,
      parentId: leadId,
      parentType: entityType.LEAD,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Participants Deleted',
    });

    return {
      message: 'Participants deleted successfully',
    };
  }

  async listParticipants(leadId?: number, meetingId?: number): Promise<any> {
    const meeting = await this.meetingsRepository.find({
      where: { id: meetingId },
      relations: ['participants'],
    });
    if (!meeting) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Meeting not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const meetingParticipants = await this.meetingsParticipantsRepository.find({
      where: { meeting: { id: meetingId } },
      relations: ['participant'],
    });

    if (meetingParticipants.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No participants found for the given meeting',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return meetingParticipants.map((mp) => mp.participant);
  }
  async addParticipants(
    leadId: number,
    meetingId: number,
    addParticipantsDto: AddParticipantsDto,
    userId: any
  ): Promise<any> {
    const i18n = I18nContext.current();
    if (leadId) {
      const lead = await this.leadRepository.findOne({ where: { id: leadId } });
      if (!lead) {
        const message = await i18n?.t('errors.leads.invalidLeadId');
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    const { participants } = addParticipantsDto;

    const meeting = await this.meetingsRepository.findOne({
      where: { id: meetingId },
    });
    if (!meeting) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Meeting not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.meetingsParticipantsRepository.delete({
      meeting: { id: meetingId },
    });

    const meetingParticipants =
      participants?.map((participantId) => {
        return this.meetingsParticipantsRepository.create({
          participant: { id: participantId },
          meeting: { id: meeting.id },
        });
      }) || [];

    const addedParticipants =
      await this.meetingsParticipantsRepository.save(meetingParticipants);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: addedParticipants,
      oldData: null,
      entityId: meeting?.id,
      entityType: entityType.MEETING,
      performerId: userId,
      parentId: leadId,
      parentType: entityType.LEAD,
      performerType: performerType.OPERATOR,
      field: 'Participants Added',
    });

    return meeting;
  }

  async findOverdueMeetingForNotification(): Promise<void> {
    return;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dueMeetings = await this.meetingsRepository.find({
      where: {
        from: MoreThan(twentyFourHoursAgo),
        status: Status.SCHEDULED,
      },
      relations: ['lead', 'host', 'createdBy'],
    });
    for (const meeting of dueMeetings) {
      await this.createNotification(meeting);
    }
  }

  private async createNotification(meeting: Meetings): Promise<void> {
    const label = await this.labelRepository.findOne({
      where: {
        description: NotificationMessages.meeting_reminder_message,
      },
    });
    const labelTitle = await this.labelRepository.findOne({
      where: {
        description: NotificationTitles.meeting_reminder_title,
      },
    });

    const creator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });

    const userDetail = await this.userRepository.findOne({
      where: { operator: { id: meeting.host.id } },
    });

    const link = `${process.env.CRM_FRONT_END_URL}/meetings/${meeting.id}`;

    const notificationData = {
      entity_id: meeting.id.toString(),
      entity_name: 'Meetings',
      description_label_id: { id: label?.id },
      title_label_id: { id: labelTitle?.id },
      created_by: creator?.full_name || '',
      is_read: false,
      is_deleted: false,
      user_id: { id: userDetail?.id },
      creator_id: { id: creator?.id },
      admin_description: `Your Planned Meeting is overdued.
      Subject: ${meeting.title}\n
      Name: ${meeting.lead.firstName ? meeting.lead.firstName : ''} ${
        meeting.lead.lastName ? meeting.lead.lastName : ''
      }`,
      link,
    };

    // const notification = this.notificationRepository.create(notificationData);
    // await this.notificationRepository.save(notification);
    // if (userDetail) {
    //   this.socketGateway.sendNotificationToUser(userDetail.id, {
    //     ...notificationData,
    //     title: labelTitle?.description,
    //     description: label?.description,
    //   });
    // }
  }
}
