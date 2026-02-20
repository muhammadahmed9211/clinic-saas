import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { CommunicationRepository } from './communication.repository';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { InboxEmailRepository } from './inboxEmail.repository';
import { EmailStatus } from 'src/utils/enums/email-status.enum';
import { UpdateDraftEmailDto } from '../dto/update-draft-email';
import { InjectRepository } from '@nestjs/typeorm';
import { Lead } from '../entities/lead.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { LeadsRepository } from '../repositories/lead.repository';

@Injectable()
export class CommunicationService {
  constructor(
    // @InjectRepository(Client)
    // private readonly clientRepository: Repository<Client>,
    private readonly communicationRepository: CommunicationRepository,
    private readonly inboxEmailRepository: InboxEmailRepository,
    @InjectRepository(Lead)
    private readonly leadRepository: LeadsRepository,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async getEmailStats(userId: number): Promise<any> {
    const inboxAllMails = await this.inboxEmailRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId,
      filterList: undefined,
      listName: ListNames.EMAIL_INBOX,
      sortList: undefined,
      defaultSortKey: 'receivedDateTime',
      listViewId: undefined,
      countOnly: true,
    });

    const newEmails = await this.inboxEmailRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      userId,
      filterList: undefined,
      filters: [
        {
          name: 'status',
          operation: FilterOperation.NOT_EQUAL,
          value: [EmailStatus.NEW],
        },
      ],
      listName: ListNames.EMAIL_INBOX,
      sortList: undefined,
      defaultSortKey: 'receivedDateTime',
      listViewId: undefined,
      countOnly: true,
    });

    const draftEmails = await this.communicationRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      filters: [
        { name: 'status', operation: FilterOperation.EQUALS, value: ['Draft'] },
      ],
      userId,
      filterList: undefined,
      listName: ListNames.EMAIL_SENT_DRAFT,
      sortList: undefined,
      defaultSortKey: 'created_at',
      listViewId: undefined,
      countOnly: true,
    });

    const sentEmails = await this.communicationRepository.advanceFilters({
      limit: 0,
      page: 0,
      all: true,
      filters: [
        {
          name: 'status',
          operation: FilterOperation.NOT_EQUAL,
          value: ['Draft'],
        },
      ],
      userId,
      filterList: undefined,
      listName: ListNames.EMAIL_SENT_DRAFT,
      sortList: undefined,
      defaultSortKey: 'created_at',
      listViewId: undefined,
      countOnly: true,
    });

    const statsCount = {
      inboxEmails: inboxAllMails.total,
      newEmails: newEmails.total,
      sentEmails: sentEmails.total,
      draftEmails: draftEmails.total,
    };

    return statsCount;
  }

  async findAllSentAndDraft(
    limit: number,
    page: number,
    userId: number,
    dto: ApplyListFilterSortColumnDto,
    send,
  ): Promise<any> {
    let filters: any;

    if (send == 'false') {
      // statusCondition = 'Draft';
      filters = [
        {
          name: 'status',
          operation: FilterOperation.IN,
          value: ['Draft'],
        },
      ];
    } else {
      // statusCondition = Not('Draft');
      filters = [
        {
          name: 'status',
          operation: FilterOperation.NOT_IN,
          value: ['Draft'],
        },
      ];
    }

    return await this.communicationRepository.advanceFilters({
      limit,
      page,
      userId,
      filters,
      relations: ['operator', 'updatedBy'],
      filterList: dto.filters || undefined,
      listName: ListNames.EMAIL_SENT_DRAFT,
      sortList: dto.sort || undefined,
      defaultSortKey: 'created_at',
      listViewId: dto.listViewId,
    });
  }

  async findAllInbox(
    limit: number,
    page: number,
    userId: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    return await this.inboxEmailRepository.advanceFilters({
      limit,
      page,
      userId,
      relations: ['email'],
      filterList: dto.filters || undefined,
      listName: ListNames.EMAIL_INBOX,
      sortList: dto.sort || undefined,
      defaultSortKey: 'receivedDateTime',
      listViewId: dto.listViewId,
    });
  }

  async updateDraftEmail(
    id: number,
    updateDraftEmailDto: UpdateDraftEmailDto,
  ): Promise<void> {
    const {
      leadId,
      subject,
      html,
      opportunityId = null,
      operatorId,
    } = updateDraftEmailDto;

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
    });

    if (!leadDetail) {
      throw new NotFoundException('Lead not found');
    }

    if (!operatorDetail) {
      throw new NotFoundException('Operator not found');
    }
    if (leadDetail && operatorDetail) {
      //update draft email into communication table of mailMicroService
      await this.mailService.updateDraftHtmlEmail({
        to: leadDetail?.email,
        from: updateDraftEmailDto?.from,
        data: {
          html,
          from: updateDraftEmailDto.from,
          subject,
          leadId,
          opportunityId,
          operatorId: operatorDetail?.operator?.id,
          id: id,
        },
      });
    }
  }
}
