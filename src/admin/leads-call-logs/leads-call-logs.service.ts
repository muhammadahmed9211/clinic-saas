import { CreateLeadsCallLogDto } from './dto/create-leads-call-log.dto';
import { UpdateLeadsCallLogDto } from './dto/update-leads-call-log.dto';
import {
  Injectable,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { OpportunityService } from '../leads/opportunity/opportunity.service';
import { notes } from '../kyc/entities/kycNotes.entity';
import { NotesType } from '../kyc/dto/admin-kyc.dto';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { LeadsCallLogsRepository } from './repositories/leads-call-logs.repository';
import { CallType } from '../call-logs/entities/call-log.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { LeadsCallLog } from './entities/leads-call-log.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { MailService } from 'src/mail/mail.service';
import { entityType } from '../active-log/active-log.type';

@Injectable()
export class LeadsCallLogsService {
  constructor(
    @InjectRepository(notes)
    private readonly notesRepository: Repository<notes>,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(notifications)
    private readonly notificationRepository: Repository<notifications>,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    private readonly opportunityService: OpportunityService,
    private readonly leadsCallLogsRepository: LeadsCallLogsRepository,
    private readonly eventEmitter: EventEmitter2,
    // private socketGateway: SocketGateway,
  ) {}

  async create(
    createLeadsCallLogDto: CreateLeadsCallLogDto,
    leadId: number,
    createdBy: number,
  ) {
    const { callType, description } = createLeadsCallLogDto;
    const duration = this.getDuration(
      createLeadsCallLogDto.callStartDateTime,
      createLeadsCallLogDto.callEndDateTime,
    );

    const callRecord = await this.leadsCallLogsRepository.save({
      ...createLeadsCallLogDto,
      callType,
      description,
      callResults: { id: createLeadsCallLogDto.callResults },
      lead: { id: leadId },
      callDuration: duration,
    });

    const newType =
      callType == 'outbound' ? NotesType.LEAD_OUTBOUND : NotesType.LEAD_INBOUND;
    console.log('newType: ', newType);
    if (description && description.trim() !== '') {
      const createLeadNoteDto = {
        lead_id: leadId,
        type: newType,
        note: description,
        call_id: callRecord.id,
      };
    
      await this.opportunityService.createNote(createLeadNoteDto, createdBy);
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: callRecord,
      oldData: null,
      entityId: callRecord.id,
      entityType: 'CallLogs',
      parentId: leadId,
      parentType: entityType.LEAD,
      performerId: createdBy,
      performerType: 'Operator',
      field: 'Call Log Created',
    });

    return callRecord;
  }

  findAllByLeadId(leadId: number) {
    return this.leadsCallLogsRepository.find({
      relations: { callResults: true, lead: true },
      where: { lead: { id: leadId } },
    });
  }
  // findAll() {
  //   const result = this.leadsCallLogsRepository.find({
  //     relations: { callResults: true, lead: true },
  //   });

  //   console.log(result);

  //   return result;
  // }
  // async findAll() {
  //   const result = await this.leadsCallLogsRepository.find({
  //     relations: ['callResults', 'lead'],
  //   });
  //   console.log(result);
  //   return result;
  // }

  async findAll(
    limit: number,
    page: number,
    userId: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    return await this.leadsCallLogsRepository.advanceFilters({
      limit,
      page,
      userId,
      relations: ['callResults', 'lead'],
      filterList: dto.filters || undefined,
      listName: ListNames.LEADS_CALL_LOGS,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
    });
  }

  async findAllDashboard(payload: {
    limit: number;
    page: number;
    all: boolean;
    userId: number;
    dto: ApplyListFilterSortColumnDto;
  }): Promise<any> {
    const { limit, page, userId, dto, all } = payload;
    return await this.leadsCallLogsRepository.advanceFilters({
      limit,
      page,
      all,
      userId,
      relations: ['callResults', 'lead'],
      filterList: dto.filters || undefined,
      listName: ListNames.LEADS_CALL_LOGS,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
    });
  }

  async getCallLogsStats(id: number): Promise<any> {
    const logs = await this.leadsCallLogsRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId: id,
      filterList: undefined,
      listName: ListNames.LEADS_CALL_LOGS,
      sortList: undefined,
      defaultSortKey: 'createdAt',
      listViewId: undefined,
    });
    const scheduleCalls = logs?.result?.filter(function (log) {
      return log.outgoingCallStatus == 'scheduled';
    });

    const outboundCalls = logs?.result?.filter(function (log) {
      return log.callType == CallType.OUTBOUND;
    });

    const inboundCalls = logs?.result?.filter(function (log) {
      return log.callType == CallType.INBOUND;
    });

    const leadsToCall = logs?.result?.filter(function (log) {
      return log.callOwnerId == id;
    });

    const statsCount = {
      scheduleCalls: scheduleCalls.length,
      outboundCalls: outboundCalls.length,
      inboundCalls: inboundCalls.length,
      leadsToCall: leadsToCall.length,
    };

    return statsCount;
  }

  async findOne(id: number) {
    return await this.leadsCallLogsRepository.findOne({
      where: { id },
      relations: { callResults: true, lead: true },
      // loadRelationIds: true
    });
  }

  async update(
    id: number,
    updateLeadsCallLogDto: UpdateLeadsCallLogDto,
    createdBy: number,
  ) {
    const callLog = await this.leadsCallLogsRepository.findOne({
      where: { id },
      relations: ['lead'],
    });
    if (!callLog) {
      throw new NotFoundException('Call Log not found');
    }

    const duration = this.getDuration(
      updateLeadsCallLogDto.callStartDateTime,
      updateLeadsCallLogDto.callEndDateTime,
    );

    const callRecord = await this.leadsCallLogsRepository.save({
      ...updateLeadsCallLogDto,
      id,
      callResults: { id: updateLeadsCallLogDto.callResults },
      callDuration: duration,
    });

    const notess = await this.notesRepository.findOne({
      where: {
        call_id: { id },
      },
    });
    if (notess) {
      await this.opportunityService.updateLeadNote(
        notess.id,
        {
          note: updateLeadsCallLogDto.description,
        },
        createdBy,
      );
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: callRecord,
      oldData: callLog,
      entityId: callRecord.id,
      entityType: 'CallLogs',
      parentId: callLog?.lead?.id,
      parentType: entityType.LEAD,
      performerId: createdBy,
      performerType: 'Operator',
      field: 'Call Log Updated',
    });

    return callRecord;
  }

  async remove(id: number, createdBy: number) {
    try {
      // const callLog = await this.leadsCallLogsRepository.findOneBy({ id });
      const callLog = await this.leadsCallLogsRepository.findOne({
        where: { id },
        relations: ['lead'],
      });
      if (!callLog) throw new NotFoundException('Call Log not found');
      await this.leadsCallLogsRepository.softDelete(id);

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: callLog,
        entityId: callLog.id,
        entityType: 'CallLogs',
        parentId: callLog?.lead?.id,
        parentType: entityType.LEAD,
        performerId: createdBy,
        performerType: 'Operator',
        field: 'Call Log Deleted',
      });

      return ResponseWrapper.wrap({
        status: Status.SUCCESS,
        statusCode: HttpStatus.OK,
        statusText: 'Call Log Deleted Successfully',
        data: null,
      });
    } catch (error) {
      console.log('Error deleting Call Log:', error);
      throw new InternalServerErrorException('Error delete Call Log');
    }
  }

  getDuration(start: Date, end: Date) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = endDate.getTime() - startDate.getTime();

    // let ms = diff % 1000;
    // let ss = Math.floor(diff / 1000) % 60;
    const mm = Math.floor(diff / 1000 / 60) % 60;
    const hh = Math.floor(diff / 1000 / 60 / 60);

    let duration = '';
    hh != 0 ? (duration += `${hh}hr`) : '';
    mm != 0 ? (duration += `, ${mm}min`) : '';
    // ss != 0 ?  duration += `, ${ss}sec`: ""

    return duration;
  }
v
  async findOverdueCallLogForNotification(): Promise<void> {
    return;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dueCalls = await this.leadsCallLogsRepository.find({
      where: {
        callStartDateTime: MoreThan(twentyFourHoursAgo),
        outgoingCallStatus: 'scheduled',
        callOwnerId: Not(IsNull()),
      },
      relations: ['callResults', 'lead'],
    });
    for (const callLog of dueCalls) {
      await this.createNotification(callLog);
    }
  }

  private async createNotification(callLog: LeadsCallLog): Promise<void> {
    if (callLog.callOwnerId == null) return;
    const label = await this.labelRepository.findOne({
      where: {
        description: NotificationMessages.call_log_reminder_message,
      },
    });
    const labelTitle = await this.labelRepository.findOne({
      where: {
        description: NotificationTitles.call_log_reminder_title,
      },
    });

    const creator = await this.operatorRepository.findOne({
      where: { full_name: 'System' },
    });

    const link = `${process.env.CRM_FRONT_END_URL}/call-logs/${callLog.id}`;

    const notificationData = {
      entity_id: callLog.id.toString(),
      entity_name: 'call-logs',
      description_label_id: { id: label?.id },
      title_label_id: { id: labelTitle?.id },
      created_by: creator?.full_name || '',
      is_read: false,
      is_deleted: false,
      user_id: { id: callLog.callOwnerId },
      creator_id: { id: creator?.id },
      admin_description: `Your Scheduled Call is overdued.\n
      Subject: ${callLog.subject}\n
      Name: ${callLog.callToUserName}`,
      link,
    };

    // const notification = this.notificationRepository.create(notificationData);
    // await this.notificationRepository.save(notification);
    // this.socketGateway.sendNotificationToUser(callLog.callOwnerId, {
    //   ...notificationData,
    //   title: labelTitle?.description,
    //   description: label?.description,
    // });
  }
}
