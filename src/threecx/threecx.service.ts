import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { entityType } from 'src/admin/active-log/active-log.type';
import { CallToUserType, RelatedTo } from 'src/admin/call-logs/entities/call-log.entity';
import { CustomStatus, StatusType } from 'src/admin/client/entities/custom_status.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { NotesType } from 'src/admin/kyc/dto/admin-kyc.dto';
import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { OpportunityService } from 'src/admin/leads/opportunity/opportunity.service';
import { EventTypes } from 'src/common/services/event.type';
import { User } from 'src/users/entities/user.entity';
import { parseDate } from 'src/utils/helper';
import { Repository } from 'typeorm';

@Injectable()
export class ThreecxService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(LeadsCallLog)
    private readonly leadCallLogRepo: Repository<LeadsCallLog>,
    @InjectRepository(Operator)
    private readonly operatorRepo: Repository<Operator>,
    private readonly eventEmitter: EventEmitter2,
    private readonly opportunityService: OpportunityService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
  ) { }

  async findLeadById(id: number) {
    return await this.leadRepo.findOne({ where: { id, isActive: true } });
  }

  async findLeadByNumber(number: string) {
    return await this.leadRepo.findOne({
      where: [{ phoneNumber: number, isActive: true }, { telephone: number, isActive: true }],
      order: { createdAt: 'DESC' }
    });
  }

  async findLeadByEmail(email: string) {
    return await this.leadRepo.findOne({
      select: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
      where: { email, isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  async createCallLogs(contact: any, lead: any) {

    // Parse the date strings
    const callStartDateTime = parseDate(contact.callStartTimeUtc);
    const callEndDateTime = parseDate(contact.callEndTimeUtc);

    const callResult = await this.customStatusRepository.findOne({
      where: {
        type: StatusType.CALL_RESULTS,
        name: '3cx Call'
      },
    });

    let agentOperator;
    if (contact.agentEmail) {
      agentOperator = await this.usersRepository.findOne({
        where: { operator: { email: contact.agentEmail } },
        relations: ['operator'],
      });
    }

    const callRecord = await this.leadCallLogRepo.save({
      callStartDateTime,
      callEndDateTime,
      releatedTo: RelatedTo.CLIENT,
      callType: contact?.callType == "Notanswered" ? "missed" : contact?.callType?.toLowerCase(),
      callToUserType: CallToUserType.LEAD,
      callToUserName: `${lead.firstName} ${lead.lastName}`,
      outgoingCallStatus: "completed",
      callOwner: contact.agentName,
      agentExt: contact.agent,
      agentName: contact.agentName,
      lead: { id: contact.contactId },
      callDuration: contact.duration,
      subject: '3CX call log',
      callAgenda: '3CX call log',
      description: '3CX call log',
      callResults: callResult?.id,
      callOwnerId: agentOperator?.id,
    } as any);

    const newType = contact.callType == 'outbound' ? NotesType.LEAD_OUTBOUND : NotesType.LEAD_INBOUND;

    const createLeadNoteDto = {
      lead_id: contact.contactId,
      type: newType,
      // note: "contact.agentName + lead.phoneNumber",
      note: `A call is made on contact number: ${lead.phoneNumber} by operator ${contact.agentName} ${contact.agent} `,
      call_id: callRecord.id,
    };




    let operator = await this.usersRepository.findOne({
      where: { operator: { full_name: 'System' } },
      relations: ['operator'],
    });


    await this.opportunityService.createNote(createLeadNoteDto, operator?.id);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: contact,
      oldData: null,
      entityId: callRecord.id,
      entityType: 'CallLogs',
      parentId: contact.contactId,
      parentType: entityType.LEAD,
      performerId: operator?.id,
      performerType: 'Operator',
      field: 'Call Log Created from 3cx',
    });

    return callRecord;
  }
}
