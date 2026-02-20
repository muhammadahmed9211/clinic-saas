import { plainToClass, plainToInstance } from 'class-transformer';
import { validate, validateOrReject } from 'class-validator';
import * as csv from 'csv-parse';

import { UploadDataDto } from 'src/upload-data/dto/upload-data.dto';
import { DataUploadRepository } from 'src/upload-data/repositries/data-upload.repositries';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEmailExistsDto } from 'src/auth/dto/auth-email-exists.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { Status } from 'src/utils/enums/mt5/response-status.enum';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { NullableType } from 'src/utils/types/nullable.type';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { OperatorRepository } from '../operator/repositories/operator.repository';
import { PartnerService } from '../partner/partner.service';
import { PartnerRepository } from '../partner/repositories/partner.repository';
import { LeadQuestion } from '../questions/entities/question.entity';
import { LeadQuestionRepository } from '../questions/repositories/question.repository';
import { AddAnswerDto } from './dto/add-answer.dto';

import { Equal, FindOptionsWhere, In, IsNull, Like, Not, Repository } from 'typeorm';

import { CreateLeadDto, TelephoneExistLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadAnswer } from './entities/lead-answer.entity';
import { LeadsRepository } from './repositories/lead.repository';

import {
  FilterOperation,
  SortOrder,
} from 'src/database/base-repository/dto/advance-search.dto';
import { SettingsService } from 'src/settings/settings.service';
import { User } from 'src/users/entities/user.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import {
  CustomStatus,
  StatusType,
} from '../client/entities/custom_status.entity';
import { Lead } from './entities/lead.entity';
import { Label } from 'src/tasks/entities/label.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { MailService } from 'src/mail/mail.service';
import { TaskService } from '../task/task.service';
import {
  CreateTaskDto,
  TaskPriorityLevel,
  TaskRelatedTo,
} from '../task/dto/create-task.dto';
import { AdminTask, TaskEntityType } from '../task/entities/task.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import { Client } from 'src/users/entities/client.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { Session } from 'src/session/entities/session.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MassAssignPartnerDto } from './dto/mass-assign-partner.dto';
import { Permission } from 'src/roles/entities/permissoin.entity';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';
import { ActiveStatus, Partner } from 'src/settings/entities/partner.entity';
import { MassAssignSalesDto } from './dto/mass-assign-sales.dto';
import { OperatorDeskRel } from '../custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { MassAssignRetentionDto } from './dto/mass-assign-retention.dto';
import { MassAssignOfficeDto } from './dto/mass-assign-office.dto';
import { MassAssignSalesDeskDto } from './dto/mass-assign-salesDesk.dto';
import { ClientsService } from 'src/users/clients.service';
import { AssignType } from 'src/utils/enums/leads/assign-rep.enum';
import { Regulations } from '../regulations/entities/regulations.entity';
import { I18nContext } from 'nestjs-i18n';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { RegulationBlockedCountries } from '../regulations/entities/regulation-blocked-countries.entity';
import { Meetings } from './meetings/entities/meetings.entity';
import { notes } from '../kyc/entities/kycNotes.entity';
import { LeadsCallLog } from '../leads-call-logs/entities/leads-call-log.entity';
import { Opportunity } from './opportunity/entities/opportunity.entity';
// import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { SendEmailService } from 'src/common/services/send-email.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { Communication } from '../client/entities/communication.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { entityType } from '../active-log/active-log.type';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { AccountService } from 'src/mt5/account/account.service';
import { OpportunityService } from './opportunity/opportunity.service';
import { NotesType } from '../kyc/dto/admin-kyc.dto';
import moment from 'moment';
import ISO6391 from 'iso-639-1';
import { TransferRetentionDto } from './dto/transfer-retention.dto';
import { Role } from 'src/roles/entities/role.entity';
import { MassTransferRetentionDto } from './dto/mass-transfer-retention.dto';
import { WidgetType } from 'src/database/base-repository/base-repository';
import { AutomationConfig } from '../automation/entities/automation-config.entity';

@Injectable()
export class LeadsService {
  constructor(
    private readonly leadsRepository: LeadsRepository,
    @InjectRepository(LeadAnswer)
    private readonly leadAnswerRepository: Repository<LeadAnswer>,
    private readonly leadQuestionRepository: LeadQuestionRepository,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataUploadRepository: DataUploadRepository,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly partnerService: PartnerService,
    private readonly clientService: ClientsService,
    @InjectRepository(PartnerTradingGroups)
    private readonly partnerTradingGroupsRepository: Repository<PartnerTradingGroups>,
    private readonly partnerRepository: PartnerRepository,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    private readonly operatorRepository: OperatorRepository,
    @InjectRepository(Desk) private readonly deskRepository: Repository<Desk>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(notifications)
    private notificationRepository: Repository<notifications>,
    @InjectRepository(Permission)
    private permissionsRepository: Repository<Permission>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private readonly mailService: MailService,
    private readonly settingsService: SettingsService,
    private readonly taskService: TaskService,
    private readonly accountService: AccountService,
    private readonly opportunityService: OpportunityService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(OperatorDeskRel)
    private readonly OperatorDeskRelRepository: Repository<OperatorDeskRel>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(PermissionRoleRel)
    private readonly permissionRoleRelRepository: Repository<PermissionRoleRel>,
    @InjectRepository(Regulations)
    private readonly regulationsRepository: Repository<Regulations>,
    @InjectRepository(RegulationBlockedCountries)
    private readonly regulationBlockedCountriesRepository: Repository<RegulationBlockedCountries>,
    @InjectRepository(AdminTask)
    private readonly adminTaskRepository: Repository<AdminTask>,
    @InjectRepository(Meetings)
    private readonly meetingsRepository: Repository<Meetings>,
    @InjectRepository(notes)
    private readonly notesRepository: Repository<notes>,
    @InjectRepository(LeadsCallLog)
    private readonly leadsCallLogRepository: Repository<LeadsCallLog>,
    @InjectRepository(Communication)
    private readonly communicationRepository: Repository<Communication>,
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(user_kyc_documents)
    private readonly user_kyc_documentsRepository: Repository<user_kyc_documents>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(AutomationConfig)
    private readonly automationConfigRepository: Repository<AutomationConfig>,
    // @InjectRepository(Tickets)
    // private readonly ticketsRepository: Repository<Tickets>,
    private readonly sendEmailService: SendEmailService,
    private readonly configService: ConfigService<AllConfigType>,
    // private socketGateway: SocketGateway,
  ) {}

  async create(
    createLeadDto: CreateLeadDto,
    createdBy?: User,
    sendEmail: boolean = true,
    isSocialSignup: boolean = false,
  ) {
    const i18n = I18nContext.current();

    let defaultDesks;
    const isLeadExist = await this.IsLeadExistByEmail({
      email: createLeadDto.email,
    });
    if (isLeadExist) {
      const existingLeadId = await this.leadsRepository.findOne({
        where: { email: createLeadDto.email, isActive: true },
        select: ['id'],
      });

      const createdBy = await this.usersRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });

      await this.createDuplicateLeadNote(
        createLeadDto,
        existingLeadId?.id,
        false,
        createdBy,
      );
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Email already exists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const regulation = await this.regulationsRepository.findOne({
      where: {
        name: createLeadDto.regulations,
      },
      relations: { blockedCountries: true },
    });

    let parentLead: Lead | null = null;
    if (
      (createLeadDto.telephonePrefix && createLeadDto.telephone) ||
      (createLeadDto.telephonePrefix && createLeadDto.countryIso)
    ) {
      parentLead = await this.leadsRepository.findOne({
        where: [
          {
            telephonePrefix: createLeadDto.telephonePrefix,
            telephone: createLeadDto.telephone,
            userLifeCycle: UserLifeCycle.LEAD,
            isActive: true,
          },
          {
            phoneNumber: createLeadDto.telephone,
            countryIso: createLeadDto.countryIso,
            userLifeCycle: UserLifeCycle.LEAD,
            isActive: true,
          },
        ],
        relations: { regulation: true, salesPartner: true },
        order: { id: 'DESC' },
      });
    }

    let newLeadData;
    if (parentLead) {
      newLeadData = { ...createLeadDto };
      createLeadDto.utmSource = parentLead.utmSource;
      createLeadDto.utmCampaign = parentLead.utmCampaign;
      createLeadDto.utmTerm = parentLead.utmTerm;
      createLeadDto.utmMedium = parentLead.utmMedium;
      createLeadDto.utmContent = parentLead.utmContent;
      createLeadDto.leadSource = parentLead.leadSource;
      createLeadDto.salesDeskId = parentLead.salesDeskId;
      createLeadDto.salesRepId = parentLead.salesRepId;
      createLeadDto.salesRep = parentLead.salesRep;
      createLeadDto.partner_uuid = parentLead.affId;
      createLeadDto.language = parentLead.language;
    }

    let bodyCountryIso = createLeadDto.countryIso;
    let bodyCountry = createLeadDto.country;
    let countryCode;

    if (!bodyCountryIso && createLeadDto.country) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.printableName === createLeadDto.country,
      );
      countryCode = countries.result[isoIndex];
      bodyCountryIso = countries.result[isoIndex]?.iso;
    } else if (!bodyCountry && createLeadDto.countryIso) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.iso === createLeadDto.countryIso,
      );
      countryCode = countries.result[isoIndex];
      if (isoIndex !== -1) {
        bodyCountry = countries.result[isoIndex]?.printableName;
      } else {
        const countryData = this.settingsService.getCountriesIso();
        const cleanNumber =
          createLeadDto.telephone?.replace(/^(00|\+|0)|\D/g, '') || '';

        const sortedCountries = [...(countryData?.result || [])].sort(
          (a, b) => b.phonePrefix.length - a.phonePrefix.length,
        );

        const match = sortedCountries.find((country) =>
          cleanNumber.startsWith(country.phonePrefix),
        );

        bodyCountryIso = match?.iso || 'AE';
        countryCode = match || { phonePrefix: '971' };
        bodyCountry = match?.printableName || 'United Arab Emirates';
      }
    }
    if (createLeadDto?.telephone) {
      const countries = this.settingsService.getCountriesIso();
      let isoIndex;
      if (createLeadDto.countryIso) {
        isoIndex = countries.result.findIndex(
          (country) => country.iso === createLeadDto.countryIso,
        );
      } else if (createLeadDto.country) {
        isoIndex = countries.result.findIndex(
          (country) => country.printableName === createLeadDto.country,
        );
      }
      countryCode = countries.result[isoIndex];
      const cleanNumber = createLeadDto.telephone.replace(/^(00|\+|0)|\D/g, '');
      const matchingCountry = cleanNumber.startsWith(countryCode?.phonePrefix);

      if (matchingCountry) {
        createLeadDto.telephone = cleanNumber.substring(
          countryCode.phonePrefix.length,
        );
      } else {
        createLeadDto.telephone = cleanNumber;
      }
    }
    if (createLeadDto?.telephonePrefix) {
      if (createLeadDto.telephonePrefix !== countryCode.phonePrefix) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Phone Prefix must match with a Country',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
    if (!createLeadDto.telephonePrefix && countryCode) {
      createLeadDto.telephonePrefix = countryCode.phonePrefix;
    }

    if (!regulation) {
      const message = await i18n?.t('errors.auth.regulationNotFound');
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
    
    let blockedCountry: RegulationBlockedCountries | null = null;

    if (createLeadDto.countryIso || bodyCountryIso) {
      blockedCountry = await this.regulationBlockedCountriesRepository.findOne({
        where: {
          regulation: { id: regulation.id },
          country: {
            countryCode: createLeadDto.countryIso
              ? createLeadDto.countryIso
              : bodyCountryIso,
          },
        },
      });
    }

    if (blockedCountry && !isSocialSignup) {
      const message = await i18n?.t('errors.auth.countryBlocked');
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

    // const bodyLanguage = createLeadDto.languageIso?.valueOf() === 'EN' ? 'English' : 'Arabic';
    const validateLanguage =
      createLeadDto.language && ISO6391.getCode(createLeadDto.language);
    let bodyLanguage =
      validateLanguage && createLeadDto.language
        ? createLeadDto.language
        : 'English';
    if (createLeadDto.languageIso && createLeadDto.languageIso.length <= 2) {
      const language = ISO6391.getName(
        createLeadDto.languageIso.toLocaleLowerCase(),
      );
      bodyLanguage = language ? language : bodyLanguage;
    }

    let affId = createLeadDto.partner_uuid;
    const {
      partner,
      operator: salesRep,
      group,
    } = await this.partnerService.assignPartnerSetting({
      speakingLanguage: createLeadDto.speakingLanguage
        ? createLeadDto.speakingLanguage
        : bodyLanguage,
      partnerUUID: createLeadDto.partner_uuid,
      salesRep: createLeadDto.salesRepId,
    });

    if (partner) {
      affId = partner.uuid;
    }

    let salesDeskId = group?.salesDesk;
    let retentionDeskId = group?.retentionDesk;
    let supportDeskId = group?.supportDesk;
    let financeDeskId = group?.financeDesk;
    let kycDeskId = group?.kycDesk;
    let retentionRepId = group?.retentionRep;

    let office = await this.officeRepository.findOne({
      where: { id: group?.office },
    });

    let desks = await this.deskRepository.find({
      where: {
        id: In([
          salesDeskId,
          retentionDeskId,
          supportDeskId,
          financeDeskId,
          kycDeskId,
        ]),
      },
    });

    let retentionRep = await this.operatorRepository.findOne({
      where: { id: retentionRepId },
    });
    let retentionRepName = retentionRep?.full_name;
    let salesDesk = desks.find(
      (desk) => Number(desk.id) === Number(salesDeskId),
    )?.name;
    let retentionDesk = desks.find(
      (desk) => Number(desk.id) === Number(retentionDeskId),
    )?.name;
    let supportDesk = desks.find(
      (desk) => Number(desk.id) === Number(supportDeskId),
    )?.name;
    let financeDesk = desks.find(
      (desk) => Number(desk.id) === Number(financeDeskId),
    )?.name;
    let kycDesk = desks.find((desk) => Number(desk.id) === Number(kycDeskId))
      ?.name;

    const leasdStatusDefault = await this.customStatusRepository.findOne({
      where: { type: StatusType.LEADS, name: 'New' },
    });

    const salesStatusDefault = await this.customStatusRepository.findOne({
      where: { type: StatusType.Sales, name: 'New' },
    });

    // if (createLeadDto.salesRepId) {
    //   const group = await this.partnerTradingGroupsRepository.findOne({
    //     where: { salesRep: createLeadDto.salesRepId },
    //   });
    //   salesDeskId = group?.salesDesk;
    //   retentionDeskId = group?.retentionDesk;
    //   supportDeskId = group?.supportDesk;
    //   financeDeskId = group?.financeDesk;
    //   kycDeskId = group?.kycDesk;
    //   retentionRepId = group?.retentionRep;

    //   office = await this.officeRepository.findOne({
    //     where: { id: group?.office },
    //   });

    //   desks = await this.deskRepository.find({
    //     where: {
    //       id: In([
    //         salesDeskId,
    //         retentionDeskId,
    //         supportDeskId,
    //         financeDeskId,
    //         kycDeskId,
    //       ]),
    //     },
    //   });

    //   retentionRep = await this.operatorRepository.findOne({
    //     where: { id: retentionRepId },
    //   });
    //   retentionRepName = retentionRep?.full_name;
    //   salesDesk = desks.find((desk) => Number(desk.id) === salesDeskId)?.name;
    //   retentionDesk = desks.find((desk) => Number(desk.id) === retentionDeskId)
    //     ?.name;
    //   supportDesk = desks.find((desk) => Number(desk.id) === supportDeskId)
    //     ?.name;
    //   financeDesk = desks.find((desk) => Number(desk.id) === financeDeskId)
    //     ?.name;
    //   kycDesk = desks.find((desk) => Number(desk.id) === kycDeskId)?.name;
    // }
    const salesOperator = await this.operatorRepository.findOne({
      where: {
        id: createLeadDto.salesRepId ? createLeadDto.salesRepId : salesRep?.id,
      },
    });

    const retentionOperator = await this.operatorRepository.findOne({
      where: {
        id: retentionRepId,
      },
    });

    const salesManager = salesOperator?.manager_operator_id
      ? await this.operatorRepository.findOne({
          where: {
            id: salesOperator.manager_operator_id,
          },
        })
      : null;

    const retentionManager = retentionOperator?.manager_operator_id
      ? await this.operatorRepository.findOne({
          where: {
            id: retentionOperator.manager_operator_id,
          },
        })
      : null;

    let operator;
    let CreatedByOperator: User | null = null;

    if (createdBy) {
      CreatedByOperator = await this.usersRepository.findOne({
        where: { id: createdBy.id },
        relations: ['operator'],
      });
    }

    if (!CreatedByOperator) {
      operator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });
    }

    const automationConfig = await this.automationConfigRepository
      .createQueryBuilder('automation_config')
      .where('automation_config.currentStatus LIKE :status ', {
        status: `%New%`,
      })
      .getOne();

    let nextActionTime: Date;

    if (automationConfig) {
      nextActionTime = await this.calculateNextActionTime(
        automationConfig,
        automationConfig.nextAction || 'leads_new_reassign_1',
      );
    } else {
      nextActionTime = new Date();
      nextActionTime.setUTCMinutes(nextActionTime.getUTCMinutes() + 15);
    }

    const lead = await this.leadsRepository.save({
      ...createLeadDto,
      dateOfBirth: createLeadDto.dateOfBirth,
      leadStatus: { id: leasdStatusDefault?.id ?? 85 },
      salesStatus: createLeadDto.salesStatusId
        ? { id: createLeadDto.salesStatusId }
        : { id: salesStatusDefault?.id },
      salesRepId: createLeadDto.salesRepId
        ? createLeadDto.salesRepId
        : salesRep?.id,
      salesRep: createLeadDto.salesRep
        ? createLeadDto.salesRep
        : salesRep?.full_name,
      officeId: parentLead ? parentLead.officeId : group?.office,
      office: parentLead ? parentLead.office : office?.name,
      country: isSocialSignup ? '' : createLeadDto.country ? createLeadDto.country : bodyCountry,
      countryIso: isSocialSignup ? '' : bodyCountryIso,
      language: createLeadDto.language ? createLeadDto.language : bodyLanguage,
      speakingLanguage: createLeadDto.speakingLanguage
        ? createLeadDto.speakingLanguage
        : bodyLanguage,
      type: createLeadDto.type ? createLeadDto.type : 'Individual Client (IC)',
      salesDeskId: parentLead
        ? parentLead.salesDeskId
        : salesDeskId
          ? salesDeskId
          : undefined,
      salesDesk: parentLead ? parentLead.salesDesk : salesDesk,
      retentionDeskId: parentLead
        ? parentLead.retentionDeskId
        : retentionDeskId,
      retentionDesk: parentLead ? parentLead.retentionDesk : retentionDesk,
      supportDeskId: parentLead ? parentLead.supportDeskId : supportDeskId,
      supportDesk: parentLead ? parentLead.supportDesk : supportDesk,
      financeDeskId: parentLead ? parentLead.financeDeskId : financeDeskId,
      financeDesk: parentLead ? parentLead.financeDesk : financeDesk,
      kycDeskId: parentLead ? parentLead.kycDeskId : kycDeskId,
      telephonePrefix: !isSocialSignup ? createLeadDto.telephonePrefix : undefined,
      telephone: !isSocialSignup ? createLeadDto.telephone : undefined,
      phoneNumber:
        !isSocialSignup && createLeadDto.telephonePrefix && createLeadDto.telephone
          ? `${createLeadDto.telephonePrefix}${createLeadDto.telephone}`
          : undefined,
      kycDesk: parentLead ? parentLead.kycDesk : kycDesk,
      retentionRepId: parentLead ? parentLead.retentionRepId : retentionRepId,
      retentionRep: parentLead ? parentLead.retentionRep : retentionRepName,
      salesManagerId: parentLead ? parentLead.salesManagerId : salesManager?.id,
      salesManager: parentLead
        ? parentLead.salesManager
        : salesManager?.full_name,
      retentionManagerId: parentLead
        ? parentLead.retentionManagerId
        : retentionManager?.id,
      retentionManager: parentLead
        ? parentLead.retentionManager
        : retentionManager?.full_name,
      regulation: {
        id: parentLead ? parentLead?.regulation?.id : regulation.id,
      },
      regulations: parentLead ? parentLead.regulations : regulation.name,
      affId: parentLead ? parentLead.affId : affId,
      affiliate: parentLead ? parentLead.affiliate : partner?.name,
      salesPartner: parentLead
        ? { id: parentLead?.salesPartner?.id }
        : { id: partner?.id },
      createdBy: CreatedByOperator
        ? CreatedByOperator?.operator.full_name
        : operator.full_name,
      createdByOperator: CreatedByOperator
        ? CreatedByOperator?.operator.id
        : operator.id,
      leadSource: createLeadDto.leadSource
        ? createLeadDto.leadSource
        : createLeadDto.utmSource,
      source: createLeadDto.source
        ? createLeadDto.source
        : createLeadDto.utmSource,
      salesStatusUpdatedAt: new Date(),
      isDuplicated: parentLead ? true : false,
      systemStatus: 'New',
      nextActionTime,
    });
    if (parentLead) {
      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });
      const cleanedNewLeadData = this.removeEmptyStringKeys(newLeadData);
      const noteEntity = {
        lead_id: lead?.id,
        note: `Lead created with same phone number. Registration information is in this note & Latest Lead ID with same phone number is ${
          parentLead.id
        }. ${JSON.stringify(cleanedNewLeadData)}`,
        // created_by: createdBy,
        type: NotesType.LEAD_GENERAL,
      };
      await this.opportunityService.createNote(noteEntity, operatorUser?.id);
    }

    const link = `${process.env.CRM_FRONT_END_URL}/leads/${lead.id}`;
    if (lead.salesRepId && lead.salesRep && sendEmail) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.leadAssign_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.leadAssign_admin_title,
        },
      });

      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { id: lead.salesRepId } },
        relations: ['operator'],
      });

      const systemOperator = await this.usersRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });

      if (operatorUser?.email) {
        await this.mailService.sendAssignmentViaEmail({
          to: operatorUser.email,
          cc: salesManager?.email ?? null,
          data: {
            subject: 'New Lead Assigned to you!',
            leadId: lead?.id,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            leadEmail: lead?.email,
            link,
            rep: operatorUser.operator.full_name,
            operatorId: lead.salesRepId,
          },
        });
      }

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'Lead Assigned',
          assignTo: operatorUser?.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: lead.id,
          status: 'NOT STARTED',
          description:
            'Lead has been assigned to you with email: ' + lead.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: lead.id,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: TaskEntityType.LEAD,
          entityId: lead.id.toString(),
        } as CreateTaskDto,
        {
          id: systemOperator?.id,
        } as User,
      );

      const notificationData = {
        entity_id: lead.id.toString(),
        entity_name: 'lead',
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: CreatedByOperator
          ? CreatedByOperator?.operator.full_name
          : operator.full_name,
        is_read: false,
        is_deleted: false,
        user_id: { id: operatorUser?.id },
        creator_id: {
          id: CreatedByOperator ? CreatedByOperator?.operator.id : operator.id,
        },
        admin_description: `New Lead is assigned\n
        Name: ${lead?.firstName} ${lead?.lastName}\n
        Contact Number: ${lead?.phoneNumber}`,
        link,
      };

      if (operatorUser) {
        const notification =
          this.notificationRepository.create(notificationData);
        await this.notificationRepository.save(notification);
        // this.socketGateway.sendNotificationToUser(operatorUser.id, {
        //   ...notification,
        //   title: labelTitle?.description,
        //   description: label?.description,
        // });
      }
    }

    if (lead.retentionRepId && lead.retentionRep && sendEmail) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.leadAssign_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.leadAssign_admin_title,
        },
      });

      const retentionOperator = await this.operatorRepository.findOne({
        where: {
          id: lead?.retentionRepId,
        },
      });

      const retentionManager = retentionOperator?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: retentionOperator.manager_operator_id,
            },
          })
        : null;

      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { id: lead.retentionRepId } },
        relations: ['operator'],
      });

      const CreatedByOperator = await this.usersRepository.findOne({
        where: { id: createdBy?.id },
        relations: ['operator'],
      });

      const systemOperator = await this.usersRepository.findOne({
        where: { operator: { full_name: 'System' } },
        relations: ['operator'],
      });

      let operator;

      if (!CreatedByOperator) {
        operator = await this.operatorRepository.findOne({
          where: { full_name: 'System' },
        });
      }

      if (operatorUser?.email) {
        await this.mailService.sendAssignmentViaEmail({
          to: operatorUser.email,
          cc: retentionManager?.email ?? null,
          data: {
            subject: 'New Lead Assigned to you!',
            leadId: lead?.id,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            leadEmail: lead?.email,
            link,
            rep: operatorUser?.operator?.full_name,
            operatorId: lead?.retentionRepId,
          },
        });
      }

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'Lead Assigned',
          assignTo: operatorUser?.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: lead.id,
          status: 'NOT STARTED',
          description: 'lead has assigned to you with email: ' + lead.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: lead.id,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: TaskEntityType.LEAD,
          entityId: lead.id.toString(),
        } as CreateTaskDto,
        {
          id: systemOperator?.id,
        } as User,
      );

      const notificationData = {
        entity_id: lead.id.toString(),
        entity_name: 'lead',
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: CreatedByOperator
          ? CreatedByOperator.operator.full_name
          : operator?.full_name,
        is_read: false,
        is_deleted: false,
        user_id: { id: operatorUser?.id },
        creator_id: {
          id: CreatedByOperator ? CreatedByOperator?.operator.id : operator.id,
        },
        admin_description: `New Lead is assigned\n
        Name: ${lead?.firstName} ${lead?.lastName}\n
        Contact Number: ${lead?.phoneNumber}`,
        link,
      };

      if (operatorUser) {
        const notification =
          this.notificationRepository.create(notificationData);
        await this.notificationRepository.save(notification);
        // this.socketGateway.sendNotificationToUser(operatorUser.id, {
        //   ...notification,
        //   title: labelTitle?.description,
        //   description: label?.description,
        // });
      }
    }

    // if (lead) {
    //   defaultDesks = await this.assignDefaultDesks(
    //     lead.id,
    //     affId || '',
    //     createLeadDto.salesRepId ? salesRep : null,
    //   );
    // }

    if (
      createLeadDto.customQuestion &&
      createLeadDto.customQuestion.length > 0
    ) {
      for (const question of createLeadDto.customQuestion) {
        await this.addAnswer(lead.id, question);
      }
    }

    if (createdBy) {
      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'RecordCreated',
        entity_id: createdBy?.id,
        entity_type: 'Lead',
        json_object: lead,
        performer_id: createdBy?.id,
        performer_type: 'Operator',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: lead,
        oldData: null,
        entityId: lead.id,
        entityType: 'Lead',
        performerId: createdBy.id,
        performerType: 'Operator',
        field: 'Create Lead',
      });
    }

    return { ...lead, ...defaultDesks };
  }
  async getAllLeadsIb(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.IN,
        value: [UserLifeCycle.LEAD, UserLifeCycle.REGISTERED],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
      {
        name: 'type',
        operation: FilterOperation.IN,
        value: [
          'Introducing Broker (IB)',
          'Fund Manager (MAM)',
          'Liquidity Solution (Broker)',
          'Franchise Partner (Office)',
        ],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'client',
        'createdByOperator',
        'client.wallet',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async getLeadsList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.IN,
        value: [UserLifeCycle.LEAD, UserLifeCycle.REGISTERED],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'leadNotes',
        'client',
        'createdByOperator',
        'client.wallet',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async getAllIb(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.IN,
        value: [
          UserLifeCycle.LEAD,
          UserLifeCycle.REGISTERED,
          UserLifeCycle.APPLICANT,
          UserLifeCycle.CLIENT,
        ],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
      {
        name: 'type',
        operation: FilterOperation.IN,
        value: [
          'Introducing Broker (IB)',
          'Fund Manager (MAM)',
          'Liquidity Solution (Broker)',
          'Franchise Partner (Office)',
        ],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'client',
        'createdByOperator',
        'client.wallet',
        'client.user.partner',
        'client.user.partner',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async getAllLeadsAndClients(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'client',
        'createdByOperator',
        'client.wallet',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async purgedLeadsAndClients(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [false],
      },
      {
        name: 'email',
        operation: FilterOperation.CONTAINS,
        value: ['_purged_'],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'client',
        'createdByOperator',
        'client.wallet',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'updatedAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async deactivatedLeadsAndClients(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;

    const filters = [
      {
        name: 'isActive', // Ensure this field exists in your entity
        operation: FilterOperation.EQUALS,
        value: [false], // Fetch only deactivated leads & clients
      },
    ];

    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'client',
        'client.wallet',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'updatedAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async purgedIb(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [false],
      },
      {
        name: 'type',
        operation: FilterOperation.IN,
        value: [
          'Introducing Broker (IB)',
          'Fund Manager (MAM)',
          'Liquidity Solution (Broker)',
          'Franchise Partner (Office)',
        ],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
        'client',
        'createdByOperator',
        'client.wallet',
        'client.commissionProfile',
        'client.commissionProfile.classification',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'updatedAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async getLeadsListAutomation(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const currentTime = new Date()
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.NOT_IN,
        value: [UserLifeCycle.CLIENT],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
      {
        name: 'isTransferToRetention',
        operation: FilterOperation.IN,
        value: [false],
      },
      {
        name: 'createdAt',
        operation: FilterOperation.GREATER_THAN_OR_EQUAL,
        value: ['2024-08-12'],
      },
      {
        name: 'systemStatus',
        operation: FilterOperation.NOT_EQUAL,
        value: ['Paused']
      },
      {
        name: 'salesStatus.name',
        operation: FilterOperation.NOT_IN,
        value: ['Duplicate', 'Do Not Call', 'Under 18']
      },
      {
        name: 'nextActionTime',
        operation: FilterOperation.GREATER_THAN_OR_EQUAL,
        value: [currentTime.toISOString()]
      },
    ];
    const OR: FindOptionsWhere<Lead>[] = [
      {
        utmSource: Not('Canvas'),
        affiliate: Not(Like('IB -%')),
        salesStatusUpdatedAt: Not(IsNull()),
      },
      {
        utmSource: IsNull(),
        affiliate: Not(Like('IB -%')),
        salesStatusUpdatedAt: Not(IsNull()),
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: ['leadStatus', 'salesStatus'],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'nextActionTime',
      defaultSortKeyOrder: SortOrder.ASC,
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
      OR,
    });
  }

  async getLeadsListForDropdown(payload: {
    userId: number;
    limit: number;
    all: boolean;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, all, dto } = payload;
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.IN,
        value: [
          UserLifeCycle.LEAD,
          UserLifeCycle.REGISTERED,
          UserLifeCycle.APPLICANT,
          UserLifeCycle.CLIENT,
        ],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
    ];
    return this.leadsRepository.advanceFilters({
      listName: ListNames.LEADS,
      userId,
      limit,
      page,
      filters,
      relations: [
        'leadStatus',
        'salesStatus',
        'salesPartner',
        'salesOffice',
        'retentionStatus',
      ],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      all,
    });
  }

  async getLeadsListForDashboard(payload: { userId: number }) {
    const { userId } = payload;
    const filter2 =
      await this.leadsRepository.getCombinedFilterForDashboard(userId);
    return filter2;
  }

  async getFiltersForDashboard(
    payload: { userId: number },
    widgetType: WidgetType,
  ) {
    const filters =
      await this.leadsRepository.getCombinedFilterForOperatorDashboard(
        payload.userId,
        widgetType,
      );
    return filters;
  }

  async findAll(search?: string) {
    let leads;
    if (search === '') {
      // Fetch top 10 clients when search term is empty
      leads = await this.leadsRepository.find({
        relations: {
          leadStatus: true,
          salesStatus: true,
          salesPartner: true,
          salesOffice: true,
        },
        take: 10,
        order: {
          createdAt: 'DESC',
        },
      });
    } else {
      // Perform search query when search term is not empty
      leads = await this.leadsRepository.find({
        where: [
          { firstName: Like(`${search}%`) },
          { lastName: Like(`${search}%`) },
        ],
        order: {
          createdAt: 'DESC',
        },
      });
    }
    return leads;
  }

  async findOne(id: number, user: User) {
    const filter = await this.leadsRepository.getAllRolesFilters(
      user.id,
      ListNames.LEADS,
    );
    const query: FindOptionsWhere<Lead> = { id };
    const OR_QUERY: FindOptionsWhere<Lead>[] = [];
    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((item) => {
          OR_QUERY.push({ ...item, ...query });
        });
      } else {
        //@ts-expect-error //filter type error
        query[filter.name] = In(filter.value);
      }
    }
    const lead = await this.leadsRepository.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
      relations: {
        leadStatus: true,
        salesStatus: true,
        salesPartner: true,
        salesOffice: true,
        regulation: true,
        client: {
          commissionProfile:{
            classification:true
          }
        },
      },
    });
    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    return {
      ...lead,
      lastAttendedDate: lead.lastAttendedDate
        ? moment(lead.lastAttendedDate)
            .tz('UTC')
            .format('DD MMM YYYY')
            .toUpperCase()
        : null,
    };
  }

  async update(id: number, updateLeadDto: UpdateLeadDto, user: User) {
    const filter = await this.leadsRepository.getAllRolesFilters(
      user.id,
      ListNames.LEADS,
    );
    const query: FindOptionsWhere<Lead> = { id };
    const OR_QUERY: FindOptionsWhere<Lead>[] = [];
    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((item) => {
          OR_QUERY.push({ ...item, ...query });
        });
      } else {
        //@ts-expect-error //filter type error
        query[filter.name] = In(filter.value);
      }
    }
    const lead = await this.leadsRepository.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
      relations: {
        leadStatus: true,
        salesStatus: true,
        salesPartner: true,
        salesOffice: true,
      },
    });

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    let bodyCountryIso = updateLeadDto.countryIso;
    let countryCode;
    let countryName;
    if (!bodyCountryIso && updateLeadDto.country) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.printableName === updateLeadDto.country,
      );
      countryCode = countries.result[isoIndex];
      bodyCountryIso = countries.result[isoIndex].iso;
    }
    if (bodyCountryIso && !updateLeadDto.country) {
      const countries = this.settingsService.getCountriesIso();
      const countryData = countries.result.find(
        (country) => country.iso === bodyCountryIso,
      );
      if (countryData) {
        countryCode = countryData;
        countryName = countryData.printableName;
      }
    }
    if (updateLeadDto?.telephone) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.iso === lead.countryIso,
      );
      countryCode = countries.result[isoIndex];
      const cleanNumber = updateLeadDto.telephone.replace(/^(00|\+|0)|\D/g, '');

      const matchingCountry = cleanNumber.startsWith(countryCode?.phonePrefix);
      if (matchingCountry) {
        updateLeadDto.telephone = cleanNumber.substring(
          countryCode.phonePrefix,
        );
      }
    }

    // Add telephone prefix validation
    if (updateLeadDto?.telephonePrefix && !updateLeadDto.country) {
      if (!countryCode) {
        const countries = this.settingsService.getCountriesIso();
        const isoIndex = countries.result.findIndex(
          (country) => country.printableName === lead.country,
        );
        countryCode = countries.result[isoIndex];
      }

      if (updateLeadDto.telephonePrefix !== countryCode?.phonePrefix) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Phone Prefix must match with a Country',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    console.log('PAYLOAD: ', updateLeadDto.salesPartnerId);

    if (!updateLeadDto.telephonePrefix && countryCode) {
      updateLeadDto.telephonePrefix = countryCode.phonePrefix;
    }

    let _partner: Partner | null = null;
    if (updateLeadDto.salesPartnerId) {
      _partner = await this.partnerRepository.findOne({
        where: { id: updateLeadDto.salesPartnerId },
      });
    }

    let leadData = {
      ...updateLeadDto,
      id,
      affId: (_partner && _partner.uuid) ?? lead.affId,
      countryIso: bodyCountryIso ? bodyCountryIso : undefined,
      country: countryName ? countryName : undefined,
      salesPartner: { id: updateLeadDto.salesPartnerId },
      salesOffice: { id: updateLeadDto.salesOfficeId },
      leadStatus: { id: updateLeadDto.leadStatusId },
      salesStatus: { id: updateLeadDto.salesStatusId },
      regulation: { id: updateLeadDto.regulationId },
      regulations: updateLeadDto.regulations,
      phoneNumber:
        updateLeadDto.telephonePrefix || updateLeadDto.telephone
          ? `${updateLeadDto.telephonePrefix ?? lead.telephonePrefix}${
              updateLeadDto.telephone ?? lead.telephone
            }`
          : lead.phoneNumber,
      speakingLanguage: updateLeadDto.speakingLanguage,
    } as Partial<Lead>;

    let manager: NullableType<Operator> = null;
    let retentionManager: NullableType<Operator> = null;
    const link = `${process.env.CRM_FRONT_END_URL}/leads/${lead.id}`;

    if (updateLeadDto.salesRepId) {
      const operatorManager = await this.operatorRepository.findOneBy({
        id: updateLeadDto.salesRepId,
      });

      manager = operatorManager?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: operatorManager.manager_operator_id,
            },
          })
        : null;

      leadData = {
        ...leadData,
        salesManagerId: manager ? manager.id : null,
        salesManager: manager ? manager.full_name : null,
      } as Partial<Lead>;
    }

    if (updateLeadDto.retentionRepId) {
      const operatorManager = await this.operatorRepository.findOneBy({
        id: updateLeadDto.retentionRepId,
      });

      retentionManager = operatorManager?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: operatorManager.manager_operator_id,
            },
          })
        : null;

      leadData = {
        ...leadData,
        retentionManagerId: retentionManager ? retentionManager.id : null,
        retentionManager: retentionManager ? retentionManager.full_name : null,
      } as Partial<Lead>;
    }

    if (updateLeadDto.salesStatusId) {
      const status = await this.customStatusRepository.findOne({
        where: { id: updateLeadDto.salesStatusId, type: StatusType.Sales },
      });

      let automationConfig: AutomationConfig | null = null;
      let nextActionTime: Date;

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

      if (automationConfig) {
        nextActionTime = await this.calculateNextActionTime(
          automationConfig,
          automationConfig.nextAction || 'leads_new_reassign_1',
          lead.id,
        );
      } else {
        nextActionTime = new Date();
      }
      nextActionTime = new Date(nextActionTime.getTime() - 3 * 60 * 1000);

      leadData = {
        ...leadData,
        salesStatusUpdatedAt: new Date(),
        systemStatus: '',
        nextActionTime,
      };

      await this.taskService.updateTasksStatusByLeadId(lead.id);
    }

    const result = await this.leadsRepository.save(leadData);

    const clientPayload = {
      firstName: updateLeadDto.firstName ? result.firstName : lead.firstName,
      lastName: updateLeadDto.lastName ? result.lastName : lead.lastName,
      country: updateLeadDto.country ? result.country : countryName ? countryName : lead.country,
      countryIso: updateLeadDto.countryIso
        ? result.countryIso
        : lead.countryIso,
      language: updateLeadDto.language ? result.language : lead.language,
      salesDeskId: updateLeadDto.salesDeskId
        ? result.salesDeskId
        : lead.salesDeskId,
      salesDesk: updateLeadDto.salesDesk ? result.salesDesk : lead.salesDesk,
      salesRepId: updateLeadDto.salesRepId
        ? result.salesRepId
        : lead.salesRepId,
      salesRep: updateLeadDto.salesRep ? result.salesRep : lead.salesRep,
      retentionDeskId: updateLeadDto.retentionDeskId
        ? result.retentionDeskId
        : lead.retentionDeskId,
      retentionDesk: updateLeadDto.retentionDesk
        ? result.retentionDesk
        : lead.retentionDesk,
      retentionRepId: updateLeadDto.retentionRepId
        ? result.retentionRepId
        : lead.retentionRepId,
      retentionRep: updateLeadDto.retentionRep
        ? result.retentionRep
        : lead.retentionRep,
      officeId: updateLeadDto.officeId ? result.officeId : lead.officeId,
      office: updateLeadDto.office ? result.office : lead.office,
      salesManagerId: manager ? result.salesManagerId : lead.salesManagerId,
      salesManager: manager ? result.salesManager : lead.salesManager,
      retentionManagerId: retentionManager
        ? result.retentionManagerId
        : lead.retentionManagerId,
      retentionManager: retentionManager
        ? result.retentionManager
        : lead.retentionManager,
      affid: _partner ? _partner.id : lead.salesPartner.id,
      affiliate: _partner ? _partner.name : lead.affiliate,
      type: updateLeadDto.type ? result.type : lead.type,
      source: result.source ? result.source : lead.source,
      kycClientType: updateLeadDto.type ? result.type : lead.type,
      regulations: updateLeadDto.regulations
        ? result.regulations
        : lead.regulations,
      regulation: updateLeadDto.regulationId
        ? result.regulation
        : lead.regulation,
      utmCampaign: updateLeadDto.utmCampaign
        ? result.utmCampaign
        : lead.utmCampaign,
      utmContent: updateLeadDto.utmContent
        ? result.utmContent
        : lead.utmContent,
      utmMedium: updateLeadDto.utmMedium ? result.utmMedium : lead.utmMedium,
      utmSource: updateLeadDto.utmSource ? result.utmSource : lead.utmSource,
      utmTerm: updateLeadDto.utmTerm ? result.utmTerm : lead.utmTerm,
      internalSalesStatus: updateLeadDto.salesStatusId

        ? result.salesStatus.id
        : lead.salesStatus.id,
                
        leadTitle: updateLeadDto.title
        ? updateLeadDto.title
        : lead.title,

      skypeID: updateLeadDto.skypeID
        ? updateLeadDto.skypeID
        : lead.skypeID,

      dateOfBirth: updateLeadDto.dateOfBirth
        ? new Date(updateLeadDto.dateOfBirth).toISOString()  //because dob is nvarchar in client table..
        : lead.dateOfBirth
        ? new Date(lead.dateOfBirth).toISOString()
        : null,

      email: updateLeadDto.email
        ? updateLeadDto.email
        : lead.email, 
      telephone: updateLeadDto.telephone !== undefined 
        ? updateLeadDto.telephone 
        : lead.telephone,
      tel: updateLeadDto.telephone !== undefined
        ? updateLeadDto.telephone 
        ? `${result.telephonePrefix || lead.telephonePrefix || ''}${updateLeadDto.telephone}`
        : '' 
        : lead.phoneNumber,
    };

    if (lead.clientID) {
      await this.clientRepository.update(
        { userId: Number(lead.clientID) },
        clientPayload,
      );
    }
      const userPayload = {
      firstName: updateLeadDto.firstName ? result.firstName : lead.firstName,
      lastName: updateLeadDto.lastName ? result.lastName : lead.lastName,
      email: updateLeadDto.email ? result.email : lead.email,
      country: updateLeadDto.country ? result.country : countryName ? countryName : lead.country,
      countryIso: updateLeadDto.countryIso ? result.countryIso : lead.countryIso,
      dob: updateLeadDto.dateOfBirth
        ? new Date(updateLeadDto.dateOfBirth).toISOString()
        : lead.dateOfBirth
        ? new Date(lead.dateOfBirth).toISOString()
        : null,
       telephone: updateLeadDto.telephone !== undefined 
      ? updateLeadDto.telephone 
      : lead.telephone,
      tel: updateLeadDto.telephone !== undefined
      ? updateLeadDto.telephone 
        ? `${result.telephonePrefix || lead.telephonePrefix || ''}${updateLeadDto.telephone}`
        : '' 
      : lead.phoneNumber,
    };

    await this.usersRepository.update(
      { id: Number(lead.clientID) },
      userPayload,
    );
    if (updateLeadDto.salesRepId && updateLeadDto.salesRep) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.leadAssign_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.leadAssign_admin_title,
        },
      });

      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { id: updateLeadDto.salesRepId } },
        relations: ['operator'],
      });

      const operator = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['operator'],
      });

      if (operatorUser?.email) {
        await this.mailService.sendAssignmentViaEmail({
          to: operatorUser.email,
          cc: manager?.email ?? null,
          data: {
            subject: 'New Lead Assigned to you!',
            leadId: lead?.id,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            leadEmail: lead?.email,
            link,
            rep: operatorUser?.operator?.full_name,
            operatorId: updateLeadDto.salesRepId,
          },
        });
      }

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'Lead Assigned',
          assignTo: operatorUser?.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: lead.id,
          status: 'NOT STARTED',
          description:
            'Lead has been assigned to you with email: ' + lead.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: lead.id,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: TaskEntityType.LEAD,
          entityId: lead.id.toString(),
        } as CreateTaskDto,
        {
          id: operator?.id,
        } as User,
      );

      const notificationData = {
        entity_id: lead.id.toString(),
        entity_name: 'lead',
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: operator?.operator.full_name,
        is_read: false,
        is_deleted: false,
        user_id: { id: operatorUser?.id },
        creator_id: { id: operator?.operator.id },
        admin_description: `New Lead is assigned\n
        Name: ${lead?.firstName} ${lead?.lastName}\n
        Contact Number: ${lead?.phoneNumber}`,
        link,
      };

      if (operatorUser) {
        const notification =
          this.notificationRepository.create(notificationData);
        await this.notificationRepository.save(notification);
        // await this.socketGateway.sendNotificationToUser(operatorUser.id, {
        //   ...notification,
        //   title: labelTitle?.description,
        //   description: label?.description,
        // });
      }
    }

    if (updateLeadDto.retentionRepId && updateLeadDto.retentionRep) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.leadAssign_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.leadAssign_admin_title,
        },
      });

      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { id: updateLeadDto.retentionRepId } },
        relations: ['operator'],
      });

      const operator = await this.usersRepository.findOne({
        where: { id: user.id },
      });

      if (operatorUser?.email) {
        await this.mailService.sendAssignmentViaEmail({
          to: operatorUser.email,
          data: {
            subject: 'New Lead Assigned to you!',
            leadId: lead?.id,
            firstName: lead?.firstName,
            lastName: lead?.lastName,
            leadEmail: lead?.email,
            link,
            operatorId: updateLeadDto.retentionRepId,
          },
        });
      }

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'Lead Assigned',
          assignTo: operatorUser?.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: lead.id,
          status: 'NOT STARTED',
          description: 'lead has assigned to you with email: ' + lead.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: lead.id,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: TaskEntityType.LEAD,
          entityId: lead.id.toString(),
        } as CreateTaskDto,
        {
          id: operator?.id,
        } as User,
      );

      const notificationData = {
        entity_id: lead.id.toString(),
        entity_name: 'lead',
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: operator?.operator.full_name,
        is_read: false,
        is_deleted: false,
        user_id: { id: operatorUser?.id },
        creator_id: { id: operator?.operator.id },
        admin_description: `New Lead is assigned\n
        Name: ${lead?.firstName} ${lead?.lastName}\n
        Contact Number: ${lead?.phoneNumber}`,
        link,
      };

      if (operatorUser) {
        const notification =
          this.notificationRepository.create(notificationData);
        await this.notificationRepository.save(notification);
        // this.socketGateway.sendNotificationToUser(operatorUser.id, {
        //   ...notification,
        //   title: labelTitle?.description,
        //   description: label?.description,
        // });
      }
    }

    let logPayload = { ...updateLeadDto };
    let oldData = { ...lead, dateOfBirth: lead.dateOfBirth
    ? `${lead.dateOfBirth.getFullYear()}-${String(lead.dateOfBirth.getMonth() + 1).padStart(2,'0')}-${String(lead.dateOfBirth.getDate()).padStart(2,'0')}`
    : null };
    const prevSalesStatus = await this.customStatusRepository.findOne({
      where: { id: lead?.salesStatus?.id },
    });
    // Add partner name
    if (updateLeadDto.salesPartnerId && updateLeadDto.affiliate) {
      const prevPartner = await this.partnerRepository.findOne({
        where: { id: lead.salesPartner?.id },
      });
      logPayload.affiliate = updateLeadDto.affiliate ?? '';
      oldData.affiliate = prevPartner?.name ?? '';
      oldData['salesPartnerId'] = prevPartner?.id;
    }
    if (updateLeadDto.salesStatusId) {
      const getWrongNumberStatus = await this.customStatusRepository.findOne({
        where: {
          type: StatusType.Sales,
          name: 'Wrong Number',
        },
      });
      if (updateLeadDto.salesStatusId == getWrongNumberStatus?.id) {
        await this.sendEmailService.sendEmailToLead({
          entityName: 'lead',
          entityValue: id as any,
          createdForId: id,
          emailEventName: 'WRONG_NUMBER_LEAD',
          operatorId: user.id as any,
          from: this.configService.getOrThrow('mail.supportEmail', {
            infer: true,
          }),
        });
      }
      oldData['salesStatusId'] = prevSalesStatus?.id;
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: logPayload,
      oldData: { ...oldData, salesStatus: prevSalesStatus?.name },
      entityId: lead.id,
      entityType: 'Lead',
      performerId: user.id,
      performerType: 'Operator',
      parentId: lead.id,
      parentType: 'Lead',
      field: 'Update Lead',
    });

    // this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
    //   action: 'DetailsUpdated',
    //   entity_id: user.id,
    //   entity_type: 'Lead',
    //   json_object: lead,
    //   performer_id: user.id,
    //   performer_type: 'Operator',
    //   is_from_archive: 0,
    //   trigger_type: 'Default',
    // });
    await this.cacheManager.del(`get-me-api-${lead.clientID}`);

    return result;
  }

  async getAnswers(leadId: number) {
    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Answers fetched successfully',
      data: await this.leadAnswerRepository.find({
        where: { lead: { id: leadId } },
        relations: ['question'],
      }),
    });
  }

  async addAnswer(leadId: number, updateAnswerDto: AddAnswerDto) {
    let question: NullableType<LeadQuestion>;

    if (updateAnswerDto.questionId) {
      question = await this.leadQuestionRepository.findOne({
        where: { id: updateAnswerDto.questionId },
      });
    } else if (updateAnswerDto.key) {
      question = await this.leadQuestionRepository.findOne({
        where: { key: updateAnswerDto.key },
      });
    } else {
      throw new BadRequestException(
        'Either question key or question id is required',
      );
    }

    const lead = await this.leadsRepository.findOneBy({ id: leadId });
    if (!lead) throw new Error('Lead not found');

    if (!question) throw new Error('Question not found');

    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Answer added successfully',
      data: await this.leadAnswerRepository.save(
        this.leadAnswerRepository.create({
          lead: { id: leadId },
          value: updateAnswerDto.answer,
          question,
        }),
      ),
    });
  }

  async updateAnswer(leadId: number, updateAnswerDto: AddAnswerDto) {
    const answer = await this.leadAnswerRepository.findOne({
      where: {
        question: { id: updateAnswerDto.questionId },
        lead: { id: leadId },
      },
    });

    if (!answer) throw new Error('Answer not found');

    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Answer updated successfully',
      data: await this.leadAnswerRepository.save(
        this.leadAnswerRepository.create({
          ...answer,
          value: updateAnswerDto.answer,
        }),
      ),
    });
  }

  async remove(id: number, createdBy: User) {
    const filter = await this.leadsRepository.getAllRolesFilters(
      createdBy.id,
      ListNames.LEADS,
    );
    const query: FindOptionsWhere<Lead> = { id };
    const OR_QUERY: FindOptionsWhere<Lead>[] = [];
    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((item) => {
          OR_QUERY.push({ ...item, ...query });
        });
      } else {
        //@ts-expect-error //filter type error
        query[filter.name] = In(filter.value);
      }
    }
    const lead = await this.leadsRepository.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
      relations: {
        leadStatus: true,
        salesStatus: true,
        salesPartner: true,
        salesOffice: true,
      },
    });
    if (!lead) {
      throw new BadRequestException('Lead not found');
    }

    lead.isActive = false;

    await this.leadsRepository.save(lead);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: lead,
      entityId: lead.id,
      entityType: 'Lead',
      performerId: createdBy,
      performerType: 'Operator',
      field: 'Create Lead',
    });

    this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
      action: 'RecordDeleted',
      entity_id: createdBy.id,
      entity_type: 'Lead',
      json_object: lead,
      performer_id: createdBy.id,
      performer_type: 'Operator',
      is_from_archive: 0,
      trigger_type: 'Default',
    });

    return ResponseWrapper.wrap({
      status: Status.SUCCESS,
      statusCode: 200,
      statusText: 'Lead deleted successfully',
      data: null,
    });
  }

  async assignDefaultDesks(
    leadId: number,
    affId: string,
    operator: NullableType<Operator>,
  ) {
    const partner = await this.partnerRepository.findOne({
      where: { uuid: affId },
    });

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    let partnerTradingGroup = await this.partnerTradingGroupsRepository.findOne(
      {
        where: {
          partner: { id: partner?.id },
        },
      },
    );

    if (!partnerTradingGroup) {
      partnerTradingGroup = await this.partnerTradingGroupsRepository.findOne({
        where: {
          partner: { name: 'Default' },
        },
      });
    }

    let salesDeskId = partnerTradingGroup?.salesDesk;
    let retentionDeskId = partnerTradingGroup?.retentionDesk;
    let supportDeskId = partnerTradingGroup?.supportDesk;
    let financeDeskId = partnerTradingGroup?.financeDesk;
    let kycDeskId = partnerTradingGroup?.kycDesk;
    const salesRepId = operator ? operator?.id : partnerTradingGroup?.salesRep;
    let retentionRepId = partnerTradingGroup?.retentionRep;

    let office = await this.officeRepository.findOne({
      where: { id: partnerTradingGroup?.office },
    });

    let desks = await this.deskRepository.find({
      where: {
        id: In([
          salesDeskId,
          retentionDeskId,
          supportDeskId,
          financeDeskId,
          kycDeskId,
        ]),
      },
    });
    const salesRep = await this.operatorRepository.findOne({
      where: { id: salesRepId },
    });
    let retentionRep = await this.operatorRepository.findOne({
      where: { id: retentionRepId },
    });
    const salesRepName = salesRep?.full_name;
    let retentionRepName = retentionRep?.full_name;
    let salesDesk = desks.find((desk) => Number(desk.id) === salesDeskId)?.name;
    let retentionDesk = desks.find(
      (desk) => Number(desk.id) === retentionDeskId,
    )?.name;
    let supportDesk = desks.find((desk) => Number(desk.id) === supportDeskId)
      ?.name;
    let financeDesk = desks.find((desk) => Number(desk.id) === financeDeskId)
      ?.name;
    let kycDesk = desks.find((desk) => Number(desk.id) === kycDeskId)?.name;

    const lead = await this.leadsRepository.findOne({
      where: { id: leadId },
    });

    if (operator) {
      const group = await this.partnerTradingGroupsRepository.findOne({
        where: { salesRep: operator.id },
      });

      salesDeskId = group?.salesDesk;
      retentionDeskId = group?.retentionDesk;
      supportDeskId = group?.supportDesk;
      financeDeskId = group?.financeDesk;
      kycDeskId = group?.kycDesk;
      retentionRepId = group?.retentionRep;

      office = await this.officeRepository.findOne({
        where: { id: group?.office },
      });

      desks = await this.deskRepository.find({
        where: {
          id: In([
            salesDeskId,
            retentionDeskId,
            supportDeskId,
            financeDeskId,
            kycDeskId,
          ]),
        },
      });

      retentionRep = await this.operatorRepository.findOne({
        where: { id: retentionRepId },
      });
      retentionRepName = retentionRep?.full_name;
      salesDesk = desks.find((desk) => Number(desk.id) === salesDeskId)?.name;
      retentionDesk = desks.find((desk) => Number(desk.id) === retentionDeskId)
        ?.name;
      supportDesk = desks.find((desk) => Number(desk.id) === supportDeskId)
        ?.name;
      financeDesk = desks.find((desk) => Number(desk.id) === financeDeskId)
        ?.name;
      kycDesk = desks.find((desk) => Number(desk.id) === kycDeskId)?.name;
    }

    return this.leadsRepository.save({
      ...lead,
      officeId: partnerTradingGroup?.office,
      office: office?.name,
      salesDeskId,
      salesDesk,
      retentionDeskId,
      retentionDesk,
      supportDeskId,
      supportDesk,
      financeDeskId,
      financeDesk,
      kycDeskId,
      kycDesk,
      salesRepId: lead?.salesRepId ? lead.salesRepId : salesRepId,
      salesRep: lead?.salesRep ? lead.salesRep : salesRepName,
      retentionRepId,
      retentionRep: retentionRepName,
      affiliate: partner?.name,
      affId: partner.uuid,
      partner: partner.id,
      salesPartner: {
        id: partner.id,
      },
    });
  }
  async validateCsvData(file, userId, userName): Promise<any> {
    const uploadedClients: number = 0;
    const csvContent = file.buffer;
    const counter: number = 0;
    const parsedData: any = await new Promise((resolve, reject) => {
      csv.parse(
        csvContent,
        {
          columns: true,
          relax_quotes: true,
          skip_empty_lines: true,
          cast: true,
          trim: true,
          bom: true,
        },
        (err, records) => {
          if (err) {
            reject(err);
            return { error: true, message: 'Unable to parse file' };
          }
          records.forEach((record) => {
            Object.keys(record).forEach((key) => {
              if (record[key] === '') {
                record[key] = undefined;
              }
            });
          });

          resolve(records);
        },
      );
    });

    const errors: string[] = [];
    if (!parsedData.length) {
      errors.push('Empty File Provided');
      return {
        error: true,
        message: 'File Validation Failed',
        errorsArray: errors,
      };
    }

    //uploading data in dataupload table
    const { nonCqArray, cqArray } = this.processInput(parsedData);

    return {
      error: false,
      length: parsedData?.length,
      data: parsedData,
      nonCqArray,
      userId,
      counter,
      userName,
      uploadedClients,
      cqArray,
    };
  }

  // processInput = (data: any) => {
  //   const nonCqArray = data.map((item) => {
  //     const nonCqItem: any = {};
  //     for (const key in item) {
  //       if (!key.startsWith('cq_')) {
  //         nonCqItem[key] = item[key];
  //       }
  //     }
  //     return nonCqItem;
  //   });

  //   const cqArray = data.map((item) => {
  //     const cqItem: any = {};
  //     for (const key in item) {
  //       if (key.startsWith('cq_')) {
  //         cqItem[key] = item[key];
  //       }
  //     }
  //     return cqItem;
  //   });

  //   return { nonCqArray, cqArray };
  // };
  processInput = (data: any[]): { nonCqArray: any[]; cqArray: any[] } => {
    const nonCqArray: any[] = [];
    const cqArray: any[] = [];
    data.forEach((item) => {
      const nonCqItem: { [key: string]: any } = {}; // Type for non-cq properties
      const cqItem: { [key: string]: any } = {}; // Type for cq properties
      Object.entries(item).forEach(([key, value]) => {
        if (key.startsWith('cq_')) {
          cqItem[key] = value;
        } else {
          nonCqItem[key] = key === 'source' ? 'upload' : value;
        }
      });
      nonCqArray.push(nonCqItem);
      cqArray.push(cqItem);
    });
    return { nonCqArray, cqArray };
  };

  async uploadingTheLead(
    parsedData: any,
    userId: number,
    counter: number,
    userName: string,
    uploadedClients: number,
    questionsArray: any,
  ) {
    let uploadDataParentPayload: any = {
      records: parsedData.length,
      userId,
      uploadedRecords: 0,
      failure: 0,
      progress: 0,
      type: 'Lead',
      status: 'active',
      operator: userName,
      isCancelled: false,
    };
    const parentUploadedData = await this.saveClientData(
      uploadDataParentPayload,
    );
    const validationErrorsArray: any = [];
    //validate All Rows

    for await (const [index, rowData] of parsedData.entries()) {
      const uploadedDataForCancel: any =
        await this.dataUploadRepository.findOne({
          where: { id: parentUploadedData.id },
        });
      if (!uploadedDataForCancel.isCancelled) {
        const validationErrors = await this.validateFileRow(index, rowData);
        //if row's validation failed than create an array of errors
        if (validationErrors.length) {
          validationErrors.forEach((data) => {
            validationErrorsArray.push(data);
          });
        }
        //run the procedure if the row is validated successfully
        if (!validationErrors.length) {
          const {
            id,
            firstName,
            lastName,
            email,
            telephonePrefix,
            telephone,
            language,
            country,
            affid,
            source = 'Upload',
            partnerUuid,
            internalSalesStatus,
            isBlockEmails,
            ...rest
          } = rowData;
          // const source = 'Upload';
          let countryIso;
          if (country.length > 2) {
            const countryData = this.settingsService.getCountriesIso();

            const sortedCountries = [...(countryData?.result || [])].sort(
              (a, b) => b.phonePrefix.length - a.phonePrefix.length,
            );
            const match = sortedCountries.find(
              (countries) =>
                countries.printableName.toLowerCase() === country.toLowerCase(),
            );
            countryIso = match?.iso || 'AE';
          }
          const payload = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            email: email,
            telephonePrefix: telephonePrefix?.toString(),
            telephone: telephone.toString(),
            languageIso: language,
            verificationId: 1,
            countryIso: countryIso ? countryIso : country,
            partnerTypeId: null,
            sc: source,
            affiliate: affid?.toString(),
            partner_uuid: partnerUuid?.toString(),
            internalSalesStatus,
            isBlockEmails: isBlockEmails === 'TRUE' ? true : false,
            source,
            leadSource: source,
            ...rest,
          };

          //register data in lead table
          try {
            const operatorUser = await this.usersRepository.findOne({
              where: { operator: { full_name: 'System' } },
              relations: ['operator'],
            });
            if (!operatorUser) {
              throw new BadRequestException('Operator not found');
            }
            const leadResponse = await this.create(payload, operatorUser);
            uploadedClients = uploadedClients + 1;
            // AFTER SPENDING 20 hours WE FINALLY SOLVE THIS MYSTERY
            // BY JUST REMOVING (A SINGLE LOOP)
            const key = Object.keys(questionsArray[index])?.toString();
            const answer = questionsArray[index][key]?.toString();
            if (answer) {
              const answerPayload: AddAnswerDto = {
                key,
                answer,
              };

              await this.addAnswer(leadResponse?.id, answerPayload);
            }
            // for (const questionRowData in questionsArray) {
            //   const key = questionRowData;
            //   const answer = questionsArray[0][key]?.toString();
            //   if (answer) {
            //     const answerPayload: AddAnswerDto = {
            //       key,
            //       answer,
            //     };

            //     await this.addAnswer(leadResponse?.id, answerPayload);
            //   }
            // }
            counter = counter + 1;

            if (counter == 10) {
              const uploadedData: any = await this.dataUploadRepository.findOne(
                {
                  where: { id: parentUploadedData.id },
                },
              );

              const progress = (uploadedClients / uploadedData.records) * 100;
              uploadDataParentPayload = { uploadedRecords: counter, progress };
              await this.dataUploadRepository.update(parentUploadedData.id, {
                ...uploadDataParentPayload,
                errors: JSON.stringify(validationErrorsArray),
              });

              counter = 0;
              // await sleep(3000);
            }
          } catch (error) {
            const errorMessage = {
              errorMessage: error?.response?.error?.msg,
              data: { ...rowData },
            };
            validationErrorsArray.push(errorMessage);
          }
        }
      } else {
        const progress = (uploadedClients / parsedData.length) * 100;
        uploadDataParentPayload = {
          uploadedRecords: uploadedClients,
          failure: parsedData.length - uploadedClients,
          status: 'sleep',
          progress,
          errors: JSON.stringify(validationErrorsArray),
        };
        await this.dataUploadRepository.update(
          parentUploadedData.id,
          uploadDataParentPayload,
        );
        return { error: false, length: parsedData?.length, data: parsedData };
      }
    }

    //finally updating the records table of uploaded rows
    const progress = (uploadedClients / parsedData.length) * 100;
    uploadDataParentPayload = {
      uploadedRecords: uploadedClients,
      failure: parsedData.length - uploadedClients,
      status: 'sleep',
      progress,
      errors: JSON.stringify(validationErrorsArray),
    };
    await this.dataUploadRepository.update(
      parentUploadedData.id,
      uploadDataParentPayload,
    );
  }
  //function that validates all rows of csv
  async validateFileRow(index, rowData) {
    const errors: any[] = [];
    const csvDto = plainToInstance(UploadDataDto, rowData);

    const validationErrors = await validate(csvDto, {
      whitelist: true, // Strip properties that do not exist in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      skipMissingProperties: false, // Ensure all required properties are present
    });

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        const { property } = error;
        const { constraints } = error;
        if (
          constraints &&
          (typeof constraints.isString === 'string' ||
            typeof constraints.isEmail === 'string' ||
            typeof constraints.isNumber === 'string' ||
            typeof constraints.whitelistValidation === 'string')
        ) {
          const errorMessage = {
            errorMessage: `${property} ${Object.values(constraints).join(
              ', ',
            )}`,
            data: { ...rowData },
          };
          errors.push(errorMessage);
        }
      });
    }
    return errors;
  }

  //function to save records in uploaded data table

  async saveClientData(uploadDataParentPayload): Promise<any> {
    const uploadData = this.dataUploadRepository.create(
      uploadDataParentPayload,
    );
    return this.dataUploadRepository.save(uploadData);
  }
  async transformToDto<T extends object>(
    cls: new () => T,
    plain: object,
  ): Promise<T> {
    const instance = plainToClass(cls, plain);
    await validateOrReject(instance);
    return instance;
  }

  async IsLeadExistByEmail(dto: AuthEmailExistsDto): Promise<boolean> {
    const lead = await this.leadsRepository.findOne({
      where: { email: dto.email },
    });

    return lead ? true : false;
  }

  async massAssignSalesRep(
    massAssignSalesRepDto: MassAssignSalesDto,
    user: User,
  ): Promise<any> {
    const { leadIds, salesRepId, deskId, type } = massAssignSalesRepDto;
    const uniqueLeadIds = [...new Set(leadIds)];

    if (uniqueLeadIds.length > 100) {
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: {
            msg: 'Maximum 100 leads can be assigned at a time',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const permission = await this.permissionRepository.findOne({
      where: { key: 'CAN_MASS_ASSIGN_SALES' },
    });

    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });

    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to assign leads.');
    }

    const operatorDeskRel = await this.OperatorDeskRelRepository.findOne({
      where: {
        desk: { id: deskId, type: 0 },
        operator: { id: Number(salesRepId), is_active: true },
      },
      relations: { operator: true, desk: true },
    });

    if (!operatorDeskRel) {
      throw new NotFoundException('Sales Rep does not have an assigned desk.');
    }

    const leads = await this.leadsRepository.find({
      where: { id: In(uniqueLeadIds), isActive: true },
      relations: { salesPartner: true },
    });

    const clients = await this.clientRepository.findBy({
      leadId: In(uniqueLeadIds),
      isActive: true,
    });

    if (!leads.length) {
      throw new NotFoundException('No leads found for the provided IDs');
    }

    const salesInfo = {
      salesDeskId: Number(operatorDeskRel.desk.id),
      salesDesk: operatorDeskRel.desk.name,
      salesRepId: Number(operatorDeskRel?.operator?.id),
      salesRep: operatorDeskRel?.operator?.full_name,
    };

    const updatedLeads = await Promise.all(
      leads.map(async (lead) => {
        const oldLeadData = { ...lead };

        let updatedLead;
        if (type === AssignType.LEADS) {
          updatedLead = await this.update(
            lead.id,
            { ...salesInfo, salesPartnerId: lead?.salesPartner?.id },
            user,
          );
        } else if (type === AssignType.CLIENTS) {
          const lead2 = Object.assign(lead, salesInfo);
          updatedLead = await this.leadsRepository.save(lead2);
        }

        if (updatedLead) {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            // newData: { ...updatedLead }, // Current state after changes
            // oldData: oldLeadData, // Original state before changes
            newData: {
              salesRepId: updatedLead.salesRepId,
              salesRep: updatedLead.salesRep,
            },
            oldData: {
              salesRepId: oldLeadData.salesRepId,
              salesRep: oldLeadData.salesRep,
            },

            entityId: lead.id,
            entityType: entityType.LEAD,
            performerId: user.id,
            performerType: 'Operator',
            field: 'Mass Assigned Lead Sales Rep',
          });
        }

        return updatedLead;
      }),
    );

    await Promise.all(
      clients.map(async (client) => {
        // const oldClientData = { ...client }; // Create a copy of original state

        let updatedClient;
        if (type === AssignType.LEADS) {
          const client2 = Object.assign(client, salesInfo);
          updatedClient = await this.clientRepository.save(client2);
        } else if (type === AssignType.CLIENTS) {
          updatedClient = await this.clientService.editClientInfo(
            client.userId,
            salesInfo,
            user,
          );
        }

        // if (updatedClient) {
        //   this.eventEmitter.emit(EventTypes.USER_LOG, {
        //     // newData: { ...updatedClient }, // Current state after changes
        //     // oldData: oldClientData, // Original state before changes
        //     newData: {
        //       salesRepId: updatedClient.salesRepId,
        //       salesRep: updatedClient.salesRep,
        //     },
        //     oldData: {
        //       salesRepId: oldClientData.salesRepId,
        //       salesRep: oldClientData.salesRep,
        //     },
        //     entityId: client.userId,
        //     entityType: entityType.USER,
        //     performerId: user.id,
        //     performerType: 'Operator',
        //     field: 'Mass Assigned Client Sales Rep',
        //   });
        // }

        return updatedClient;
      }),
    );

    return { effactedLeads: updatedLeads?.length };
  }

  async purgeLeads(leadIds: number[], user: User): Promise<void> {
    const permission = await this.permissionsRepository.findOne({
      where: { key: 'CAN_MASS_PURGE_USER' },
    });

    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });

    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to purge leads.');
    }

    const whereCondition: any = { id: In(leadIds), isActive: true };

    const leads = await this.leadsRepository.find({ where: whereCondition });

    if (leadIds.length > 100) {
      throw new BadRequestException(
        'You can only purge a maximum of 100 leads at a time.',
      );
    }

    for (const lead of leads) {
      if (!lead.email.endsWith(`_purged_${lead?.id}`)) {
        const oldLeadData = { ...lead };
        lead.isActive = false;
        lead.email = `${lead.email}_purged_${lead?.id}`;

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { ...lead },
          oldData: oldLeadData,
          entityId: lead.id,
          entityType: 'Lead',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Purged Lead',
        });
      }
    }
    await this.leadsRepository.save(leads);

    const clients = await this.clientRepository.find({
      where: { leadId: In(leadIds), isActive: true },
      select: ['leadId', 'email', 'userId', 'isActive'],
    });

    for (const client of clients) {
      if (!client.email.endsWith(`_purged_${client?.userId}`)) {
        const oldClientData = { ...client }; // Create a copy of the original state

        // Update the client
        client.isActive = false;
        client.email = `${client.email}_purged_${client?.userId}`;

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { ...client }, // Current state after changes
          oldData: oldClientData, // Original state before changes
          entityId: client.userId,
          entityType: 'User',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Purged Client',
        });
      }
    }
    await this.clientRepository.save(clients);

    const userIdArray = clients.map((client) => client.userId);
    const users = await this.usersRepository.find({
      where: { id: In(userIdArray), isActive: true },
      select: ['id', 'email', 'isActive'],
    });

    for (const user of users) {
      if (!user.email?.endsWith(`_purged_${user?.id}`)) {
        user.isActive = false;
        user.email = `${user.email}_purged_${user?.id}`;
        user.socialId = null;
      }
    }

    await this.usersRepository.save(users);

    await this.sessionRepository.softDelete({ user: In(userIdArray) });
  }

  async massDeactivateLeads(leadIds: number[], user: User): Promise<void> {
    if (leadIds.length > 100) {
      throw new BadRequestException(
        'You can only purge a maximum of 100 leads at a time.',
      );
    }

    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { key: 'CAN_MASS_DEACTIVATE_LEADS' },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });

    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to deactivate leads.');
    }

    const whereCondition: any = { id: In(leadIds), isActive: true };
    const whereConditionClient: any = { leadId: In(leadIds), isActive: true };

    const leads = await this.leadsRepository.find({ where: whereCondition });

    for (const lead of leads) {
      const oldData = { ...lead };
      lead.isActive = false;
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: { ...lead },
        oldData,
        entityId: lead.id,
        entityType: entityType.LEAD,
        performerId: user.id,
        performerType: 'Operator',
        field: 'Lead Deactivated',
      });
    }
    await this.leadsRepository.save(leads);

    const clients = await this.clientRepository.find({
      where: whereConditionClient,
      select: ['leadId', 'userId', 'isActive'],
    });

    for (const client of clients) {
      const oldData = { ...client };
      client.isActive = false;
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: { ...client },
        oldData,
        entityId: client?.userId,
        entityType: entityType.USER,
        performerId: client?.userId,
        performerType: 'Operator',
        field: 'Client Deactivated',
      });
    }
    await this.clientRepository.save(clients);

    const userIdArray = clients.map((client) => client.userId);
    await this.usersRepository.update(
      { id: In(userIdArray) },
      { isActive: false },
    );

    const users = await this.usersRepository.find({
      where: { id: In(userIdArray), isActive: true },
      select: ['id', 'email', 'isActive'],
    });

    for (const user of users) {
      // const oldData = { ...user };
      user.isActive = false;
      // this.eventEmitter.emit(EventTypes.USER_LOG, {
      //   newData: { ...user },
      //   oldData : oldData,
      //   entityId: user?.id,
      //   entityType: entityType.USER || entityType.LEAD,
      //   performerId: user?.id,
      //   performerType: 'Operator',
      //   field: 'User Deactivated',
      // });
    }

    await this.sessionRepository.softDelete({ user: In(userIdArray) });
  }

  async massUpdateSalesStatus(
    leadIds: number[],
    salesStatusId: number,
    user: User,
  ): Promise<void> {
    try {
      if (leadIds.length > 100) {
        throw new BadRequestException({
          message: 'You can only update a maximum of 100 leads at a time.',
        });
      }

      // Check if the user has permission
      const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
        where: {
          permission: { key: 'CAN_MASS_CHANGE_SALES_STATUS_IN_LEADS' },
          role: { id: user?.role?.id },
        },
        relations: ['permission', 'role'],
      });

      if (!permissionRoleRel) {
        throw new BadRequestException({
          message: 'You are not allowed to update sales status.',
        });
      }

      // Fetch the new sales status entity
      const salesStatus = await this.customStatusRepository.findOne({
        where: { id: salesStatusId },
      });

      if (!salesStatus) {
        throw new BadRequestException({
          message: 'Invalid sales status ID.',
        });
      }

      // Define where conditions for leads
      const whereCondition: any = { id: In(leadIds), isActive: true };
      const whereConditionClient: any = { leadId: In(leadIds), isActive: true };

      // Fetch leads before updating to capture old sales status
      const leads = await this.leadsRepository.find({
        where: whereCondition,
        select: ['id', 'salesStatus'],
        relations: ['salesStatus'], // Ensure we fetch the relation
      });

      // Update leads in bulk
      await this.leadsRepository.update(whereCondition, {
        salesStatus: salesStatus,
      });

      // Emit event logs for leads
      for (const lead of leads) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { salesStatus: salesStatus.name },
          oldData: { salesStatus: lead.salesStatus?.name || null },
          entityId: lead.id,
          entityType: entityType.LEAD,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Lead Sales Status Update',
        });
      }

      // Fetch clients before updating to capture old sales status
      const clients = await this.clientRepository.find({
        where: whereConditionClient,
        select: ['userId', 'internalSalesStatus'],
        relations: ['customSaleStatus'],
      });

      // Update clients in bulk
      await this.clientRepository.update(whereConditionClient, {
        internalSalesStatus: salesStatus.id,
      });

      // Emit event logs for clients
      for (const client of clients) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { salesStatus: salesStatus.name },
          oldData: { salesStatus: client.customSaleStatus.name || null },
          entityId: client.userId,
          entityType: entityType.USER,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Client Sales Status Update',
        });
      }
    } catch (error) {
      console.log('Error in massUpdateSalesStatus:', error.message);
      throw error;
    }
  }

  async massUpdateRetentionStatus(
    clientIds: number[],
    retentionStatusId: number,
    user: User,
  ): Promise<void> {
    try {
      if (!clientIds?.length || !retentionStatusId || !user?.id) {
        throw new BadRequestException('Missing required parameters.');
      }

      if (clientIds.length > 100) {
        throw new BadRequestException({
          message: 'You can only update a maximum of 100 Clients at a time.',
        });
      }

      // Check if the user has permission
      const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
        where: {
          permission: {
            key: 'CAN_MASS_CHANGE_RETENTION_STATUS_IN_CLIENTS_AND_APPLICANTS',
          },
          role: { id: user?.role?.id },
        },
        relations: ['permission', 'role'],
      });

      if (!permissionRoleRel) {
        throw new BadRequestException({
          message: 'You are not allowed to update retention status.',
        });
      }

      const retentionStatus = await this.customStatusRepository.findOne({
        where: { id: retentionStatusId },
      });

      if (!retentionStatus) {
        throw new BadRequestException('Invalid retention status ID.');
      }

      // Fetch current clients to capture old retention status before updating
      const clients = await this.clientRepository.find({
        where: { userId: In(clientIds), isActive: true },
        select: ['userId', 'internalRetentionStatus'],
        relations: ['customRetentionStatus'],
      });

      // Update clients in bulk
      await this.clientRepository.update(
        { userId: In(clientIds), isActive: true },
        { internalRetentionStatus: retentionStatus.id },
      );

      // Emit event logs for clients
      for (const client of clients) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { retentionStatus: retentionStatus.name },
          oldData: {
            retentionStatus: client.customRetentionStatus.name || null,
          },
          entityId: client.userId,
          entityType: entityType.USER,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Client Retention Status Update',
        });
      }

      // Fetch leads before updating to capture old retention status
      const leads = await this.leadsRepository.find({
        where: { clientID: In(clientIds), isActive: true },
        select: ['id', 'retentionStatus'],
        relations: ['retentionStatus'],
      });

      const leadIds = leads.map((lead) => lead.id);

      if (leadIds.length > 0) {
        await this.leadsRepository.update(
          { id: In(leadIds), isActive: true },
          { retentionStatus: retentionStatus },
        );

        // Emit event logs for leads
        for (const lead of leads) {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: { retentionStatus: retentionStatus.name },
            oldData: { retentionStatus: lead.retentionStatus?.name || null },
            entityId: lead.id,
            entityType: entityType.LEAD,
            performerId: user.id,
            performerType: 'Operator',
            field: 'Lead Retention Status Update',
          });
        }
      }
    } catch (error) {
      console.error('Error in massUpdateRetentionStatus:', error);
      throw error;
    }
  }

  async massDelete(leadIds: number[], user: User): Promise<void> {
    // Check if the user has permission to mass delete leads
    const permission = await this.permissionsRepository.findOne({
      where: { key: 'CAN_MASS_DELETE_LEADS' },
    });
    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });
    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to delete leads.');
    }

    // Validate the number of leads to be deleted
    if (leadIds.length > 100) {
      throw new BadRequestException(
        'You can only delete a maximum of 100 leads at a time.',
      );
    }

    // Find and update leads
    const whereCondition: any = { id: In(leadIds), isActive: true };

    const leads = await this.leadsRepository.find({ where: whereCondition });
    for (const lead of leads) {
      if (!lead.email.endsWith(`_purged_${lead?.id}`)) {
        const oldData = {
          isActive: lead.isActive,
          email: lead.email,
        };

        lead.isActive = false;
        // lead.isDeleted = true;
        lead.email = `${lead.email}_purged_${lead?.id}`;

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            isActive: lead.isActive,
            email: lead.email,
          },
          oldData: {
            isActive: oldData.isActive,
            email: oldData.email,
          },
          entityId: lead.id,
          entityType: entityType.LEAD,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Lead Deleted',
        });
      }
    }

    await this.leadsRepository.save(leads);
    await this.leadsRepository.softDelete({ id: In(leadIds) });

    // Handle clients
    const clients = await this.clientRepository.find({
      where: { leadId: In(leadIds), isActive: true },
      select: ['leadId', 'email', 'userId', 'isActive'],
    });
    for (const client of clients) {
      if (!client.email.endsWith(`_purged_${client?.userId}`)) {
        const oldData = {
          isActive: client.isActive,
          email: client.email,
        };
        // const oldData = { ...client };
        client.isActive = false;
        client.isDeleted = true;
        client.email = `${client.email}_purged_${client?.userId}`;
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            isActive: client.isActive,
            email: client.email,
          },
          oldData,
          entityId: client.userId,
          entityType: 'User',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Client Deleted',
        });
      }
    }
    await this.clientRepository.save(clients);
    await this.clientRepository.softDelete({ leadId: In(leadIds) });

    // Handle users
    const userIdArray = clients.map((client) => client.userId);
    const users = await this.usersRepository.find({
      where: { id: In(userIdArray), isActive: true },
      select: ['id', 'email', 'isActive'],
    });
    for (const user of users) {
      if (!user.email?.endsWith(`_purged_${user?.id}`)) {
        // const oldData = { ...user };
        user.isActive = false;
        user.isDeleted = true;
        // user.email = `${user.email}_purged_${user?.id}`;
        // this.eventEmitter.emit(EventTypes.USER_LOG, {
        //   newData: { ...user },
        //   oldData,
        //   entityId: user.id,
        //   parentType: entityType.USER,
        //   performerId: user.id,
        //   performerType: 'Operator',
        //   field: 'User Deleted',
        // });
      }
    }
    await this.usersRepository.save(users);
    await this.usersRepository.softDelete({ id: In(userIdArray) });
    await this.sessionRepository.softDelete({ user: In(userIdArray) });
    await this.deleteChildRecords(leadIds, userIdArray, user);
  }

  // async massRestore(leadIds: number[], user: User): Promise<void> {
  //   // Check if the user has permission to mass restore leads
  //   const permission = await this.permissionsRepository.findOne({
  //     where: { key: 'CAN_MASS_RESTORE_LEADS' },
  //   });
  //   const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
  //     where: {
  //       permission: { id: permission?.id },
  //       role: { id: user?.role?.id },
  //     },
  //     relations: ['permission', 'role'],
  //   });
  //   if (!permissionRoleRel) {
  //     throw new BadRequestException('You are not allowed to restore leads.');
  //   }

  //   // Validate the number of leads to be restored
  //   if (leadIds.length > 100) {
  //     throw new BadRequestException('You can only restore a maximum of 100 leads at a time.');
  //   }

  //   // Find and restore leads
  //   const whereCondition: any = { id: In(leadIds) };
  //   if (user.role?.id && user.role.id > 1) {
  //     const userResult = await this.usersRepository.findOne({
  //       where: { id: user?.id },
  //       relations: { operator: { role: true, operator_rel: true } },
  //     });
  //     whereCondition.salesRepId = userResult?.operator.id;
  //   }

  //   const leads = await this.leadsRepository.find({ where: whereCondition, withDeleted: true });
  //   for (const lead of leads) {
  //     if (lead.email.endsWith(`_purged_${lead?.id}`)) {
  //       const originalEmail = lead.email.replace(`_purged_${lead?.id}`, '');

  //       // Check if another lead with the same email already exists
  //       const existingLead = await this.leadsRepository.findOne({
  //         where: { email: originalEmail },
  //       });

  //       if (existingLead) {
  //         // Append a unique identifier to the email to avoid conflict
  //         lead.email = `${originalEmail}_restored_${new Date().getTime()}`;
  //       } else {
  //         lead.email = originalEmail;
  //       }

  //       lead.isActive = true;
  //     }
  //   }
  //   await this.leadsRepository.save(leads);
  //   await this.leadsRepository.restore({ id: In(leadIds) });

  //   // Handle clients
  //   const clients = await this.clientRepository.find({
  //     where: { leadId: In(leadIds) },
  //     withDeleted: true,
  //   });
  //   for (const client of clients) {
  //     if (client.email?.endsWith(`_purged_${client?.userId}`)) {
  //       const originalEmail = client.email.replace(`_purged_${client?.userId}`, '');

  //       // Check if another client with the same email exists
  //       const existingClient = await this.clientRepository.findOne({
  //         where: { email: originalEmail },
  //       });

  //       if (existingClient) {
  //         client.email = `${originalEmail}_restored_${new Date().getTime()}`;
  //       } else {
  //         client.email = originalEmail;
  //       }
  //     }
  //     client.isActive = true;
  //   }
  //   await this.clientRepository.save(clients);
  //   await this.clientRepository.restore({ leadId: In(leadIds) });

  //   // Handle users
  //   const userIdArray = clients.map((client) => client.userId).filter((id) => id);
  //   if (userIdArray.length > 0) {
  //     const users = await this.usersRepository.find({
  //       where: { id: In(userIdArray) },
  //       withDeleted: true,
  //     });
  //     for (const user of users) {
  //       if (user.email?.endsWith(`_purged_${user?.id}`)) {
  //         const originalEmail = user.email.replace(`_purged_${user?.id}`, '');

  //         // Check if another user with the same email exists
  //         const existingUser = await this.usersRepository.findOne({
  //           where: { email: originalEmail },
  //         });

  //         if (existingUser) {
  //           user.email = `${originalEmail}_restored_${new Date().getTime()}`;
  //         } else {
  //           user.email = originalEmail;
  //         }
  //       }
  //       user.isActive = true;
  //       user.isDeleted = false;
  //     }
  //     await this.usersRepository.save(users);
  //     await this.usersRepository.restore({ id: In(userIdArray) });
  //   }

  //   // Restore sessions
  //   if (userIdArray.length > 0) {
  //     await this.sessionRepository.restore({ user: In(userIdArray) });
  //   }

  //   await this.restoreChildRecords(leadIds, userIdArray, user);
  // }

  async massAssignRetentionRep(
    massAssignSalesRepDto: MassAssignRetentionDto,
    user: User,
  ): Promise<any> {
    const { leadIds, retentionRepId, deskId } = massAssignSalesRepDto;
    const uniqueLeadIds = [...new Set(leadIds)];
    // Validate if the number of lead IDs exceeds the limit (max 10 leads)
    if (uniqueLeadIds.length > 100) {
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: {
            msg: 'Maximum 100 leads can be assigned at a time',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const permission = await this.permissionRepository.findOne({
      where: { key: 'CAN_MASS_ASSIGN_RETENTION' },
    });
    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });
    // If permission is not found, throw an error
    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to assign leads.');
    }
    // set type 1 for retention desk
    const operatorDeskRel = await this.OperatorDeskRelRepository.findOne({
      where: {
        desk: { id: deskId, type: 1 },
        operator: { id: Number(retentionRepId), is_active: true },
      },
      relations: { operator: true, desk: true },
    });
    // If no desk is assigned to the Retention Rep, throw an error
    if (!operatorDeskRel) {
      throw new NotFoundException(
        'Retention Rep does not have an assigned desk.',
      );
    }
    const clients = await this.clientRepository.findBy({
      leadId: In(uniqueLeadIds),
      isActive: true,
    });
    // If no leads are found, throw an error
    if (!clients.length) {
      throw new NotFoundException(
        'No Clients/Applicants found for the provided IDs',
      );
    }
    const updatedClients = await Promise.all(
      clients.map(async (client) => {
        // const oldClientData = { ...client }; // Store original state

        const updatedClient = await this.clientService.editClientInfo(
          client.userId,
          {
            retentionDeskId: operatorDeskRel.desk.id,
            //@ts-expect-error type error
            retentionDesk: operatorDeskRel.desk.name,
            retentionRepId: operatorDeskRel?.operator?.id,
            retentionRep: operatorDeskRel?.operator?.full_name,
          },
          user,
        );

        // Log the change
        // this.eventEmitter.emit(EventTypes.USER_LOG, {
        //   newData: updatedClient,
        //   oldData: oldClientData,
        //   entityId: client.userId,
        //   entityType: 'USER',
        //   performerId: user.id,
        //   performerType: 'Operator',
        //   field: 'Mass Assigned Retention Rep',
        // });

        return updatedClient;
      }),
    );
    return { effectedClients: updatedClients?.length };
  }

  async MassAssignOffice(
    massAssignOfficeDto: MassAssignOfficeDto,
    user: User,
  ): Promise<any> {
    const { leadIds, officeId } = massAssignOfficeDto;
    if (leadIds.length > 100) {
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: {
            msg: 'Maximum 100 leads can be assigned at a time',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const permission = await this.permissionRepository.findOne({
      where: { key: 'CAN_MASS_ASSIGN_OFFICE' },
    });
    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });
    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to assign leads.');
    }

    const leads = await this.leadsRepository.findBy({
      id: In(leadIds),
      isActive: true,
    });
    const clients = await this.clientRepository.findBy({
      leadId: In(leadIds),
      isActive: true,
    });

    if (!leads.length) {
      throw new NotFoundException('No leads found for the provided IDs');
    }
    const officeName = await this.officeRepository.findOneBy({
      id: Number(officeId),
    });
    if (!officeName) {
      throw new NotFoundException('Office Not Found');
    }
    const updatedLeads = await Promise.all(
      leads.map(async (lead) => {
        const oldLeadData = { ...lead }; // Store original state

        lead.officeId = Number(officeId);
        lead.office = officeName?.name;
        const updatedLead = await this.leadsRepository.save(lead);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: updatedLead,
          oldData: oldLeadData,
          entityId: lead.id,
          entityType: entityType.LEAD,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Mass Assigned Lead Office',
        });

        return updatedLead;
      }),
    );
    await Promise.all(
      clients.map(async (client) => {
        const oldClientData = { ...client }; // Store original state

        client.officeId = Number(officeId);
        client.office = officeName?.name;
        const updatedClient = await this.clientRepository.save(client);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: updatedClient,
          oldData: oldClientData,
          entityId: client.userId,
          entityType: entityType.USER,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Mass Assigned Client Office',
        });

        return updatedClient;
      }),
    );
    return { leads: updatedLeads };
  }

  async massAssignPartner(
    massAssignSalesRepDto: MassAssignPartnerDto,
    user: User,
  ): Promise<any> {
    const { leadIds, partnerId } = massAssignSalesRepDto;
    const uniqueLeadIds = [...new Set(leadIds)];
    // Validate if the number of lead IDs exceeds the limit (max 10 leads)
    if (uniqueLeadIds.length > 100) {
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: {
            msg: 'Maximum 100 leads can be assigned at a time',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const permission = await this.permissionRepository.findOne({
      where: { key: 'CAN_MASS_ASSIGN_PARTNER' },
    });

    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });
    // If permission is not found, throw an error
    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to assign leads.');
    }

    const partner = await this.partnerRepository.findOne({
      where: {
        id: partnerId,
        status: ActiveStatus.ACTIVE,
      },
    });
    if (!partner) {
      throw new BadRequestException('Partner not found!');
    }
    const clients = await this.clientRepository.findBy({
      leadId: In(uniqueLeadIds),
      isActive: true,
    });
    const leads = await this.leadsRepository.findBy({
      id: In(uniqueLeadIds),
      isActive: true,
    });

    // If no leads are found, throw an error
    if (!leads.length) {
      throw new NotFoundException('No Leads found for the provided IDs');
    }

    const updatedLeads = await Promise.all(
      leads.map(async (lead) => {
        const oldLeadData = { ...lead }; // Store original state

        lead.affId = partner?.uuid;
        lead.affiliate = partner.name;
        const updatedLead = await this.leadsRepository.save(lead);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            affiliate: partner.name,
          },
          oldData: {
            affiliate: oldLeadData.affiliate,
          },
          entityId: lead.id,
          entityType: 'Lead',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Mass Assigned Partner Lead',
        });

        return updatedLead;
      }),
    );

    await Promise.all(
      clients.map(async (client) => {
        const oldClientData = { ...client }; // Store original state

        client.partner.id = partner?.id;
        client.affiliate = partner.name;
        const updatedClient = await this.clientRepository.save(client);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            affiliate: partner.name,
          },
          oldData: {
            affiliate: oldClientData.partner.name,
          },
          entityId: client.userId,
          entityType: entityType.USER,
          performerId: user.id,
          performerType: 'Operator',
          field: 'Mass Assigned Partner Client',
        });

        return updatedClient;
      }),
    );

    return { effectedLeads: updatedLeads?.map((c) => c.id) };
  }

  async massAssignSalesDesk(
    massAssignSalesRepDto: MassAssignSalesDeskDto,
    user: User,
  ): Promise<any> {
    const { leadIds, deskId } = massAssignSalesRepDto;
    const uniqueLeadIds = [...new Set(leadIds)];

    if (uniqueLeadIds.length > 100) {
      throw new HttpException(
        {
          status: HttpStatus.PAYLOAD_TOO_LARGE,
          error: {
            msg: 'Maximum 100 leads can be assigned at a time',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const permission = await this.permissionRepository.findOne({
      where: { key: 'CAN_MASS_ASSIGN_RETENTION' },
    });
    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });
    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to assign leads.');
    }

    const deskData = await this.deskRepository.findOneBy({ id: deskId });
    if (!deskData) {
      throw new BadRequestException('No Desk found for the provided IDs');
    }

    const clients = await this.clientRepository.findBy({
      leadId: In(uniqueLeadIds),
      isActive: true,
    });
    if (!clients.length) {
      throw new NotFoundException(
        'No Clients/Applicants found for the provided IDs',
      );
    }

    const updatedClients = await Promise.all(
      clients.map(async (client) => {
        const oldClientData = { ...client }; // Store original state

        client.salesDeskId = deskData.id;
        client.salesDesk = deskData.name;
        const updatedClient = await this.clientRepository.save(client);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            salesDesk: deskData.name,
          },
          oldData: {
            salesDesk: oldClientData.salesDesk,
          },
          entityId: client.userId,
          entityType: 'User',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Mass Assigned Client Sales Desk',
        });

        return updatedClient;
      }),
    );

    const leads = await this.leadsRepository.findBy({
      id: In(uniqueLeadIds),
      isActive: true,
    });

    if (!leads.length) {
      throw new NotFoundException('No Leads found for the provided IDs');
    }

    await Promise.all(
      leads.map(async (lead) => {
        const oldLeadData = { ...lead }; // Store original state

        lead.salesDeskId = deskData.id;
        lead.salesDesk = deskData.name;
        const updatedLead = await this.leadsRepository.save(lead);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            salesDesk: deskData.name,
          },
          oldData: {
            salesDesk: oldLeadData.salesDesk,
          },
          entityId: lead.id,
          entityType: 'Lead',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Mass Assigned Lead Sales Desk',
        });

        return updatedLead;
      }),
    );

    return { effectedClients: updatedClients?.map((c) => c.leadId) };
  }

  async massActivateLeads(
    leadIds: number[],
    user: User,
  ): Promise<{
    totalCount: number;
    failureCount: number;
    failureIds: number[];
  }> {
    if (leadIds.length > 100) {
      throw new BadRequestException(
        'You can only activate a maximum of 100 leads and clients at a time.',
      );
    }

    const permission = await this.permissionsRepository.findOne({
      where: { key: 'CAN_UPDATE_LIST_MASS_ACTIVATE' },
    });
    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });

    if (!permissionRoleRel) {
      throw new BadRequestException(
        'You are not allowed to activate leads and clients.',
      );
    }

    const whereCondition: any = { id: In(leadIds), isActive: false };

    const failureIds: number[] = [];
    try {
      const leads = await this.leadsRepository.find({ where: whereCondition });
      if (!leads.length) {
        throw new NotFoundException('No leads found for the provided IDs');
      }

      for (const lead of leads) {
        try {
          const oldData = { ...lead };
          lead.isActive = true;
          await this.leadsRepository.save(lead);
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: { ...lead },
            oldData,
            entityId: lead.id,
            entityType: entityType.LEAD,
            performerId: lead.id,
            performerType: 'Operator',
            field: 'Lead Activated',
          });
        } catch {
          failureIds.push(lead.id);
        }
      }

      const clients = await this.clientRepository.find({
        where: { leadId: In(leadIds), isActive: false },
        select: ['userId', 'leadId', 'isActive'],
      });

      for (const client of clients) {
        const oldData = { ...client };
        client.isActive = true;
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { ...client },
          oldData,
          entityId: client.userId,
          entityType: entityType.USER,
          performerId: client.userId,
          performerType: 'Operator',
          field: 'Client Activated',
        });
      }
      await this.clientRepository.save(clients);

      const userIdArray = clients.map((client) => client.userId);
      const users = await this.usersRepository.find({
        where: { id: In(userIdArray), isActive: false },
        select: ['id', 'email', 'isActive'],
      });

      for (const user of users) {
        // const oldData = { ...user };
        user.isActive = true;
        // this.eventEmitter.emit(EventTypes.USER_LOG, {
        //   newData: { ...user },
        //   oldData,
        //   entityId: user.id,
        //   entityType: entityType.USER,
        //   performerId: user.id,
        //   performerType: 'Operator',
        //   field: 'User Activated',
        // });
      }
      await this.usersRepository.save(users);
      await this.sessionRepository.restore({ user: In(userIdArray) });

      return {
        totalCount: leadIds.length,
        failureCount: failureIds.length,
        failureIds,
      };
    } catch (e) {
      throw e;
    }
  }

  async unPurgeLeads(
    leadIds: number[],
    user: User,
  ): Promise<{
    totalCount: number;
    failureCount: number;
    failureIds: number[];
  }> {
    if (leadIds.length > 100) {
      throw new BadRequestException(
        'You can only unpurge a maximum of 100 leads at a time.',
      );
    }

    const permission = await this.permissionsRepository.findOne({
      where: { key: 'CAN_MASS_UNPURGE_USER' },
    });

    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });

    if (!permissionRoleRel) {
      throw new BadRequestException('You are not allowed to unpurge leads.');
    }

    const whereCondition: any = { id: In(leadIds), isActive: false };

    const failureIds: number[] = [];

    try {
      const leads = await this.leadsRepository.find({ where: whereCondition });
      if (!leads.length) {
        throw new NotFoundException('No leads found for the provided IDs');
      }
      for (const lead of leads) {
        try {
          const oldLeadData = { ...lead };

          lead.isActive = true;
          lead.email = this.restoreOriginalEmail(lead.email);

          await this.leadsRepository.save(lead);

          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: { ...lead },
            oldData: oldLeadData,
            entityId: lead.id,
            entityType: 'Lead',
            performerId: user.id,
            performerType: 'Operator',
            field: 'Unpurged Lead',
          });
        } catch {
          failureIds.push(lead.id);
        }
      }

      const clients = await this.clientRepository.find({
        where: { leadId: In(leadIds), isActive: false },
        select: ['userId', 'leadId', 'email', 'userId', 'isActive'],
      });

      for (const client of clients) {
        const oldClientData = { ...client };

        client.isActive = true;
        client.email = this.restoreOriginalEmail(client.email);

        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: { ...client },
          oldData: oldClientData,
          entityId: client.userId,
          entityType: 'User',
          performerId: user.id,
          performerType: 'Operator',
          field: 'Unpurged Client',
        });
      }

      await this.clientRepository.save(clients);

      const userIdArray = clients.map((client) => client.userId);

      const users = await this.usersRepository.find({
        where: { id: In(userIdArray), isActive: false },
        select: ['id', 'email', 'isActive'],
      });

      for (const user of users) {
        user.isActive = true;
        user.isClient = true;
        user.email = this.restoreOriginalEmail(user.email || ''); // Restore plain email
      }

      await this.usersRepository.save(users);
      // Restore user sessions
      await this.sessionRepository.restore({ user: In(userIdArray) });
      return {
        totalCount: leadIds.length,
        failureCount: failureIds.length,
        failureIds,
      };
    } catch (e) {
      throw e;
    }
  }

  // Utility function to restore original email
  private restoreOriginalEmail(email: string): string {
    return email.replace(/_purged.*$/, ''); // Remove '_purged_<suffix>'
  }

  private removeEmptyStringKeys(obj: Record<string, any>): Record<string, any> {
    const cleanedObject: Record<string, any> = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value !== '') {
          cleanedObject[key] = value;
        }
      }
    }

    return cleanedObject;
  }

  private async deleteChildRecords(
    leadIds: number[],
    userIds: number[],
    user: User,
  ) {
    // Find related Clients where clientId matches leadId
    const relatedClients = await this.clientRepository.find({
      where: { userId: In(userIds) },
      select: ['userId'],
    });

    const clientIds = relatedClients.map((client) => client.userId);
    const additionalUserIds = relatedClients.map((client) => client.userId);

    // Merge additionalUserIds into userIds (avoid duplicates)
    userIds = [...new Set([...userIds, ...additionalUserIds])];

    const childRepositories = [
      {
        repo: this.adminTaskRepository,
        key: 'leadId',
        entityType: 'task',
        repoName: 'Task',
      },
      {
        repo: this.adminTaskRepository,
        key: 'contact',
        entityType: 'task',
        repoName: 'Task',
      },
      {
        repo: this.meetingsRepository,
        key: 'lead',
        entityType: 'meeting',
        repoName: 'Meeting',
      },
      {
        repo: this.notesRepository,
        key: 'lead_id',
        entityType: 'note',
        repoName: 'Note',
      },
      {
        repo: this.leadsCallLogRepository,
        key: 'lead',
        entityType: 'call_log',
        repoName: 'Call Log',
      },
      {
        repo: this.opportunityRepository,
        key: 'lead',
        entityType: 'opportunity',
        repoName: 'Opportunity',
      },
      {
        repo: this.communicationRepository,
        key: 'leadId',
        entityType: 'communication',
        repoName: 'Communication',
      },
      {
        repo: this.communicationRepository,
        key: 'userId',
        entityType: 'communication',
        repoName: 'Communication',
      },
      {
        repo: this.transactionRepository,
        key: 'user',
        entityType: 'transaction',
        repoName: 'Transaction',
      },
      {
        repo: this.mt5AccountRepository,
        key: 'user',
        entityType: 'mt5_account',
        repoName: 'MT5 Account',
      },
      {
        repo: this.user_kyc_documentsRepository,
        key: 'userId',
        entityType: 'user_kyc',
        repoName: 'User KYC',
      },
      // { repo: this.DashboardWidgetRepository, key: 'userId', entityType: 'user_kyc', repoName: 'User KYC' },
    ];

    for (const { repo, key } of childRepositories) {
      const idsToDelete =
        key === 'leadId' ||
        key === 'lead' ||
        key === 'lead_id' ||
        key === 'contact'
          ? leadIds
          : userIds;
      if (!idsToDelete.length) continue;

      // Fetch records to be deleted for logging
      const records = await repo.find({
        where: { [key]: In(idsToDelete) },
      });

      // Find the repository configuration to get repoName
      const repoConfig = childRepositories.find((r) => r.repo === repo);
      // const repoName = repoConfig?.repoName || 'Unknown';

      if (repo === this.mt5AccountRepository) {
        for (const account of records) {
          // Ensure the record has `login`
          if (!('login' in account)) {
            console.warn(`Skipping MT5 account without login field:`, account);
            continue;
          }

          try {
            const existingAccount = await this.accountService.getOneAccount({
              login: account.login.toString(),
            });
            if (!existingAccount) {
              console.warn(
                `Skipping updateAccountRights for login ${account.login} because account not found.`,
              );
              continue;
            }

            await this.accountService.updateAccountRights(
              {
                allowLogin: false,
                allowTrade: false,
                allowPasswordChange: false,
                allowEnableOtp: false,
              },
              account.login.toString(),
              user,
            );
          } catch (error) {
            console.error(`Error fetching account ${account.login}:`, error);
            continue;
          }
        }
      }

      const getParentEntityType = (key: string) => {
        const leadKeys = ['lead', 'leadId', 'lead_id'];
        const userKeys = ['user', 'userId', 'user_id'];

        if (leadKeys.includes(key)) {
          return entityType.LEAD;
        }
        if (userKeys.includes(key)) {
          return entityType.USER;
        }
        return entityType;
      };

      for (const record of records) {
        const entityTypeString = String(entityType);
        const parentEntityType = getParentEntityType(key);
        const oldData = {
          [`${repoConfig?.repoName || entityTypeString}_deleted`]:
            (record as any)?.deleted_at !== null ||
            (record as any)?.deletedAt !== null,
        };
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: {
            [`${repoConfig?.repoName || entityTypeString}_deleted`]: true,
          },
          oldData,
          entityId: record.id,
          entityType: parentEntityType,
          performerId: user.id,
          performerType: 'Operator',
          field: `${repoConfig?.repoName || entityTypeString} Deleted`,
        });

        await (repo as any).softDelete({ [key]: In(idsToDelete) });
      }
      if (clientIds.length)
        await this.clientRepository.softDelete({ userId: In(clientIds) });
      if (userIds.length)
        await this.usersRepository.softDelete({ id: In(userIds) });
      await this.sessionRepository.softDelete({ user: In(userIds) });
    }
    // private async restoreChildRecords(leadIds: number[], userIds: number[], user: User) {
    //   // Find related Clients where clientId matches leadId
    //   const relatedClients = await this.clientRepository.find({
    //     where: { userId: In(leadIds) }, // LeadId is stored as clientId
    //     select: ['userId', 'email']
    //   });

    //   const clientIds = relatedClients.map(client => client.userId); // Clients linked to leads
    //   const additionalUserIds = relatedClients.map(client => client.userId); // Users linked to clients

    //   // Merge additionalUserIds into userIds (avoid duplicates)
    //   userIds = [...new Set([...userIds, ...additionalUserIds])];

    //   const childRepositories = [
    //     { repo: this.adminTaskRepository, key: 'leadId' },
    //     { repo: this.meetingsRepository, key: 'lead' },
    //     { repo: this.notesRepository, key: 'lead_id' },
    //     { repo: this.leadsCallLogRepository, key: 'lead' },
    //     { repo: this.opportunityRepository, key: 'lead' },
    //     { repo: this.communicationRepository, key: 'leadId' },
    //     { repo: this.communicationRepository, key: 'userId' },
    //     { repo: this.transactionRepository, key: 'user' },
    //     { repo: this.mt5AccountRepository, key: 'user' },
    //     { repo: this.user_kyc_documentsRepository, key: 'userId' },
    //   ];

    //   for (const { repo, key } of childRepositories) {
    //     const idsToRestore = key === 'leadId' || key === 'lead' || key === 'lead_id' ? leadIds : userIds;
    //     if (!idsToRestore.length) continue;

    //     await (repo as any).restore({ [key]: In(idsToRestore) });
    //   }

    //   if (userIds.length) {
    //     await this.usersRepository.restore({ id: In(userIds) });

    //     // Update email addresses for restored users
    //     await this.usersRepository.update(
    //       { id: In(userIds) },
    //       {
    //         email: () => `
    //                 CASE
    //                     WHEN CHARINDEX('_purged_', email) > 0
    //                     THEN LEFT(email, CHARINDEX('_purged_', email) - 1)
    //                     ELSE email
    //                 END
    //             ` }
    //     );
    //   }

    //   // Restore emails for related clients
    //   if (clientIds.length) {
    //     await this.clientRepository.update(
    //       { userId: In(clientIds) },
    //       {
    //         email: () => `
    //                 CASE
    //                     WHEN CHARINDEX('_purged_', email) > 0
    //                     THEN LEFT(email, CHARINDEX('_purged_', email) - 1)
    //                     ELSE email
    //                 END
    //             ` }
    //     );
    //   }

    //   await this.sessionRepository.restore({ user: In(userIds) });
    // }
  }

  async createDuplicateLeadNote(
    leadPayload: CreateLeadDto,
    existingLeadId: any,
    isClientPortal: boolean = false,
    createdBy?: any,
  ): Promise<void> {
    try {
      const prefixMessage = isClientPortal
        ? 'Client tried to register again\n\n'
        : 'Lead creation tried again\n\n';

      const createdById = createdBy?.id ?? createdBy;

      const noteContent = JSON.stringify(
        {
          attemptedCreate: {
            ...leadPayload,
            timestamp: new Date().toISOString(),
            userId: createdById,
          },
        },
        null,
        2,
      );

      const notePayload: any = {
        lead_id: existingLeadId,
        type: NotesType.LEAD_GENERAL,
        note: `${prefixMessage}${noteContent}`,
        createdBy: createdById,
      };

      await this.opportunityService.createNote(notePayload, createdBy);
    } catch (error) {
      console.error('Failed to create duplicate lead note:', error);
    }
  }

  async toggleTransferSalesRetention(
    id: number,
    transferRetentionDto: TransferRetentionDto,
    user: User,
  ) {
    // Find the lead with filter check
    const filter = await this.leadsRepository.getAllRolesFilters(
      user.id,
      ListNames.LEADS,
    );
    const query: FindOptionsWhere<Lead> = { id };
    const OR_QUERY: FindOptionsWhere<Lead>[] = [];

    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((item) => {
          OR_QUERY.push({ ...item, ...query });
        });
      } else {
        //@ts-expect-error //filter type error
        query[filter.name] = In(filter.value);
      }
    }

    const lead = await this.leadsRepository.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
    });

    if (!lead) {
      throw new BadRequestException('Lead not found');
    }
    const operator = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: { operator: { role: true, operator_rel: true } },
    });
    const role = await this.roleRepository.findOne({
      where: { name: 'Super Admin' },
    });
    if (!operator?.operator?.id) {
      throw new BadRequestException('Invalid operator');
    }

    const hasPermission =
      operator?.role?.id === role?.id ||
      [
        lead.retentionRepId,
        lead.retentionManagerId,
        lead.salesRepId,
        lead.salesManagerId,
      ].includes(Number(operator.operator.id));
    if (!hasPermission) {
      throw new BadRequestException("You're not allowed to update");
    }

    const updatedLead = await this.leadsRepository.save({
      ...lead,
      isTransferToRetention: transferRetentionDto.isTransferToRetention,
    });

    if (lead.clientID) {
      await this.clientRepository.update(
        { userId: Number(lead.clientID) },
        { isTransferToRetention: transferRetentionDto.isTransferToRetention },
      );
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        isTransferToRetention: transferRetentionDto.isTransferToRetention,
      },
      oldData: { isTransferToRetention: lead.isTransferToRetention },
      entityId: lead.id,
      entityType: 'Lead',
      performerId: user.id,
      performerType: 'Operator',
      parentId: lead.id,
      parentType: 'Lead',
      field: 'Transfer to Retention Status Update',
    });

    return updatedLead.isTransferToRetention;
  }

  async massUpdateTransferRetention(
    massTransferRetentionDto: MassTransferRetentionDto,
    user: User,
  ): Promise<void> {
    const { leadIds, isTransferToRetention } = massTransferRetentionDto;

    if (leadIds.length > 100) {
      throw new BadRequestException(
        'You can only update a maximum of 100 leads at a time.',
      );
    }

    // Check if user has permission
    const permission = await this.permissionRepository.findOne({
      where: { key: 'CAN_MASS_UPDATE_TRANSFER_RETENTION' },
    });
    const permissionRoleRel = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission?.id },
        role: { id: user?.role?.id },
      },
      relations: ['permission', 'role'],
    });

    if (!permissionRoleRel) {
      throw new BadRequestException(
        'You are not allowed to update transfer retention status.',
      );
    }

    // Find leads
    const leads = await this.leadsRepository.find({
      where: { id: In(leadIds), isActive: true },
    });

    if (!leads.length) {
      throw new NotFoundException('No leads found for the provided IDs');
    }

    // Update leads and emit events
    for (const lead of leads) {
      const oldData = { isTransferToRetention: lead.isTransferToRetention };

      lead.isTransferToRetention = isTransferToRetention;

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: { isTransferToRetention },
        oldData,
        entityId: lead.id,
        entityType: entityType.LEAD,
        performerId: user.id,
        performerType: 'Operator',
        field: 'Transfer to Retention Status Update',
      });
    }

    // Save all updates
    await this.leadsRepository.save(leads);

    // Update related clients
    const clients = await this.clientRepository.find({
      where: { leadId: In(leadIds), isActive: true },
    });

    for (const client of clients) {
      const oldData = { isTransferToRetention: client.isTransferToRetention };

      client.isTransferToRetention = isTransferToRetention;

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: { isTransferToRetention },
        oldData,
        entityId: client.userId,
        entityType: entityType.USER,
        performerId: user.id,
        performerType: 'Operator',
        field: 'Transfer to Retention Status Update',
      });
    }

    await this.clientRepository.save(clients);
  }

  async isLeadExistWithPhone(leadPayload: TelephoneExistLeadDto): Promise<any> {
    try {
      const cleanNumber = leadPayload?.telephone?.replace(/^(00|\+|0)|\D/g, '');
      const parentLead = await this.leadsRepository.findOne({
        where: {
          telephonePrefix: leadPayload.telephonePrefix,
          telephone: cleanNumber,
          userLifeCycle: UserLifeCycle.LEAD,
          isActive: true,
        },
      });

      let warningMessage = 'Lead does not exist with the same phone number';

      if (parentLead) {
        const salesRepInfo = await this.usersRepository.findOne({
          where: { operator: { id: parentLead.salesRepId } },
          relations: ['operator'],
        });
        warningMessage = `A lead already exists with the same phone number. It will be assigned to the old rep${
          salesRepInfo?.operator?.full_name
            ? salesRepInfo.operator.full_name
            : ''
        } - ${parentLead.salesRepId}`;
        return { warningMessage, isExist: true };
      }
      return { warningMessage, isExist: false };
    } catch (error) {
      throw error;
    }
  }

  async getAutomationConfigByCode(
    automationCode: string,
  ): Promise<AutomationConfig | null> {
    return await this.automationConfigRepository.findOne({
      where: { automationCode, isActive: true },
    });
  }

  private async calculateNextActionTime(
    config: AutomationConfig,
    nextAction: string,
    entity?: any,
  ): Promise<Date> {
    const now = new Date();
    let nextActionTime = new Date(now);
    let activeConfig = config;

    if (entity) {
      if (
        nextAction === 'leads_new_reassign_2' &&
        this.isEntityOlderThanMonths(entity, config)
      ) {
        const alternateConfig =
          await this.getAutomationConfigByCode('new_reassign_2_1');
        if (alternateConfig) {
          activeConfig = alternateConfig;
        }
      }
    }

    if (config.automationCode === 'leads_reassign_5') {
      nextActionTime.setDate(now.getDate() + 3);

      if (activeConfig.executionTime) {
        const [hours, minutes, seconds] = activeConfig.executionTime
          .split(':')
          .map(Number);
        nextActionTime.setHours(hours, minutes || 0, seconds || 0, 0);
      }

      const executionDays = this.parseExecutionDays(activeConfig.executionDays);
      if (!executionDays.includes(nextActionTime.getDay())) {
        nextActionTime = this.findNextExecutionDay(
          nextActionTime,
          executionDays,
        );
        if (activeConfig.executionTime) {
          const [hours, minutes, seconds] = activeConfig.executionTime
            .split(':')
            .map(Number);
          nextActionTime.setHours(hours, minutes || 0, seconds || 0, 0);
        }
      }

      if (activeConfig.conditions?.timeRestriction) {
        nextActionTime = this.applyTimeRestrictions(
          nextActionTime,
          activeConfig.conditions.timeRestriction,
          executionDays,
        );
      }

      return nextActionTime;
    }

    const executionDays = this.parseExecutionDays(activeConfig.executionDays);

    if (activeConfig.executionTime) {
      const [hours, minutes, seconds] = activeConfig.executionTime
        .split(':')
        .map(Number);

      nextActionTime.setHours(hours, minutes || 0, seconds || 0, 0);

      if (
        nextActionTime <= now ||
        !executionDays.includes(nextActionTime.getDay())
      ) {
        nextActionTime = this.findNextExecutionDay(
          nextActionTime,
          executionDays,
        );
        nextActionTime.setHours(hours, minutes || 0, seconds || 0, 0);
      }
    } else {
      const frequencyMs = activeConfig.executionFrequencyMinutes * 60 * 1000;

      nextActionTime.setTime(now.getTime() + frequencyMs);

      if (!executionDays.includes(nextActionTime.getDay())) {
        nextActionTime = this.findNextExecutionDay(
          nextActionTime,
          executionDays,
        );

        if (activeConfig.executionFrequencyMinutes >= 1440) {
          nextActionTime.setHours(0, 0, 0, 0);
          nextActionTime.setTime(nextActionTime.getTime() + frequencyMs);
        } else {
          const originalHours =
            (now.getHours() +
              Math.floor(activeConfig.executionFrequencyMinutes / 60)) %
            24;
          const originalMinutes =
            (now.getMinutes() + (activeConfig.executionFrequencyMinutes % 60)) %
            60;
          nextActionTime.setHours(originalHours, originalMinutes, 0, 0);
        }
      }
    }

    if (activeConfig.conditions?.timeRestriction) {
      nextActionTime = this.applyTimeRestrictions(
        nextActionTime,
        activeConfig.conditions.timeRestriction,
        executionDays,
      );
    }

    return nextActionTime;
  }

  private parseExecutionDays(executionDaysStr: string): number[] {
    const dayMap = {
      Sun: 0,
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
    };

    return executionDaysStr
      .split(',')
      .map((day) => dayMap[day.trim()])
      .filter((day) => day !== undefined);
  }

  private findNextExecutionDay(fromDate: Date, executionDays: number[]): Date {
    const nextDate = new Date(fromDate);

    for (let i = 1; i <= 7; i++) {
      nextDate.setDate(fromDate.getDate() + i);
      if (executionDays.includes(nextDate.getDay())) {
        break;
      }
    }

    return nextDate;
  }

  private applyTimeRestrictions(
    nextActionTime: Date,
    timeRestriction: { startHour: number; endHour: number },
    executionDays: number[],
  ): Date {
    const { startHour, endHour } = timeRestriction;
    const hour = nextActionTime.getHours();

    if (hour < startHour || hour >= endHour) {
      if (hour < startHour) {
        nextActionTime.setHours(startHour, 0, 0, 0);
      } else {
        const nextDay = this.findNextExecutionDay(
          nextActionTime,
          executionDays,
        );
        nextDay.setHours(startHour, 0, 0, 0);
        return nextDay;
      }
    }

    return nextActionTime;
  }

  private isEntityOlderThanMonths(
    entity: any,
    config: AutomationConfig,
  ): boolean {
    if (!entity.createdAt) return false;

    const createdAt = new Date(entity.createdAt);
    const oneMonthAgo = new Date();
    if (config.conditions && config.conditions.minCreationMonth) {
      oneMonthAgo.setMonth(
        oneMonthAgo.getMonth() - config.conditions.minCreationMonth,
      );
    } else {
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    }

    return createdAt < oneMonthAgo;
  }
}
