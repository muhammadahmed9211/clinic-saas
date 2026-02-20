import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  DeepPartial,
  In,
  Like,
  Repository,
  SelectQueryBuilder,
  DataSource,
  ILike,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
  FindOptionsWhere,
  Not,
} from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { User } from './entities/user.entity';
import { AccountClassification, Client } from './entities/client.entity';
import { NullableType } from '../utils/types/nullable.type';
import { AuthUpdateDto } from 'src/auth/dto/auth-update.dto';
import {
  ClientSalesInfoDTO,
  UpdateClientDTO,
} from 'src/admin/client/dto/clientSales.dto';
import { RetentionInfoDTO } from 'src/admin/client/dto/clientRetention.dto';
import { BankInfoDTO } from 'src/admin/client/dto/clientBank.dto';
import {
  CreateCommunicationDto,
  CreateEmailLayoutDto,
  CreateEmailTemplateDto,
  UpdateEmailLayoutDto,
  UpdateEmailTemplateDto,
} from 'src/admin/client/dto/clientCommunication.dto';
import { Communication } from 'src/admin/client/entities/communication.entity';
import {
  ClientInfoDTO,
  ClientInfoUpdateDTO,
} from 'src/admin/client/dto/clientInfoEdit.dto';
import { StepsUpdateDto } from 'src/auth/dto/steps-update.dto';
import { ConfigService } from '@nestjs/config';
import { TwilioService } from 'nestjs-twilio';
import { AllConfigType } from 'src/config/config.type';
import {
  CustomStatus,
  StatusType,
} from 'src/admin/client/entities/custom_status.entity';
import { AllKycInfoDto } from 'src/admin/client/dto/clientKycInfo.dto';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Session } from 'src/session/entities/session.entity';
import { MailerService } from 'src/mailer/mailer.service';
import { MailService } from 'src/mail/mail.service';
import { I18nContext } from 'nestjs-i18n';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { ClientService as Mt5ClientService } from 'src/mt5/client/client.service';
import { AccountService as Mt5AccountService } from 'src/mt5/account/account.service';
import { UserAnswer } from './entities/user_kyc_answers.entity';
import { QuestionService } from 'src/kyc/question-answer.service';
import {
  UpdateClientAnswersDto,
  UpdateClientPasswordDto,
} from 'src/admin/client/dto/updateClientAnswers.dto';
import { notifications } from 'src/notification/entity/notification.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { ClientRepository } from './repositories/client.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import {
  AdvanceSearchDto,
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { AuthRegisterBrokerDto } from 'src/auth/dto/auth-register-login.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AdminTask, TaskEntityType } from 'src/admin/task/entities/task.entity';
import {
  NotificationMessages,
  NotificationTitles,
} from 'src/notification/constants/notification.messages';
import { ServerName } from 'src/wallet/entities/server.entity';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { FilesService } from 'src/files/files.service';
import { AdminKycService } from 'src/admin/kyc/kyc.service';
import { UserKycDocumentsService } from 'src/user-kyc-docs/user-kyc-documents.service';
import {
  KycTemplateNames,
  KycTemplateSubject_AR,
  KycTemplateSubject_EN,
} from 'src/admin/kyc/dto/admin-kyc.dto';
import { TaskService } from 'src/admin/task/task.service';
import {
  CreateTaskDto,
  TaskPriorityLevel,
  TaskRelatedTo,
} from 'src/admin/task/dto/create-task.dto';
import { EventTypes } from 'src/common/services/event.type';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { AuthEmailExistsDto } from 'src/auth/dto/auth-email-exists.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Transaction } from 'src/transaction/entities/transaction.entity';
// import { SocketGateway } from 'src/socket/socket.gateway';
import { Template } from 'src/mail/entities/template.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { compile } from 'handlebars';
import { use } from 'passport';
import { EmailVariable } from 'src/mail/entities/email-variable.entity';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { SendEmail } from 'src/email/dto/mail.send.dto';
import { templateRepository } from './repositories/template.repository';
import { layoutRepository } from './repositories/layout.repository';
import { version } from 'os';
import { RegulationEventKeys } from 'src/admin/regulations/regulations-config/entities/regulation-event.entity';
import { RegulationRuleKeys } from 'src/admin/regulations/regulations-config/entities/regulation-rule.entity';
import { RegulationsConfigService } from 'src/admin/regulations/regulations-config/regulations-config.service';
import { UserRepository } from './repositories/user.repository';
import { regulations } from 'src/admin/client/constants/custom_status.constants';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import * as speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { WalletService } from 'src/wallet/wallet.service';
import { SettingsService } from 'src/settings/settings.service';
import moment from 'moment';
import {
  entityType,
  performerType,
} from 'src/admin/active-log/active-log.type';
import bcrypt from 'bcryptjs';
import { SendEmailService } from 'src/common/services/send-email.service';
import { AccountTradingType } from 'src/mt5/account/dto/create-account.dto';
import { IbAutomationService } from 'src/ib-automation/ib-automation.service';
import { AccountTradingRights } from 'src/kafka/topics/mt5/account-trading-rights.enum';
import { Countries } from 'src/psp/entities/countries.entity';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private clientsRepository: ClientRepository,
    @InjectRepository(Communication)
    private communicationRepository: Repository<Communication>,
    private readonly twilioService: TwilioService,
    private configService: ConfigService<AllConfigType>,
    @InjectRepository(CustomStatus)
    private customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Desk)
    private deskRepository: Repository<Desk>,
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    @InjectRepository(UserAnswer)
    private userAnswerRepository: Repository<UserAnswer>,
    @InjectRepository(BillingInformation)
    private billingInformationRepository: Repository<BillingInformation>,
    @InjectRepository(notifications)
    private notificationRepository: Repository<notifications>,
    @InjectRepository(Label)
    private labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private labelTranslationRepository: Repository<LabelTranslation>,
    private readonly mailerService: MailerService,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
    private readonly mt5ClientService: Mt5ClientService,
    private questionService: QuestionService,
    private readonly mt5AccountService: Mt5AccountService,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerTradingGroups)
    private readonly partnerTradingGroupsRepository: Repository<PartnerTradingGroups>,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(AdminTask)
    private readonly taskRepository: Repository<AdminTask>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    private readonly filesService: FilesService,
    private readonly adminKycService: AdminKycService,
    private readonly userKycDocumentsService: UserKycDocumentsService,
    private readonly taskService: TaskService,
    private readonly leadRepository: LeadsRepository,
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    // private socketGateway: SocketGateway,
    @InjectRepository(Template)
    private readonly templateRepository: Repository<Template>,
    @InjectRepository(Layout)
    private readonly layoutRepository: Repository<Layout>,
    @InjectRepository(EmailVariable)
    private readonly varRepository: Repository<EmailVariable>,
    @InjectRepository(EmailEntity)
    private readonly entitiyRepository: Repository<EmailEntity>,
    @InjectRepository(Regulations)
    private readonly regulationRepository: Repository<Regulations>,
    private templatesRepository: templateRepository,
    private layoutsRepository: layoutRepository,
    private userRepository: UserRepository,
    private readonly regulationsConfigService: RegulationsConfigService,
    private readonly walletService: WalletService,
    private readonly sendEmailService: SendEmailService,
    private readonly IBAutomationService: IbAutomationService,
    @InjectRepository(Countries) 
    private readonly countriesRepository:Repository<Countries>,
    @InjectRepository(IbCommissionProfile)
    private readonly ibCommissionProfileRepository: Repository<IbCommissionProfile>,
  ) {}

  domain = this.configService.get('app.domain', {
    infer: true,
  });

  create(createProfileDto: CreateClientDto): Promise<User> {
    return this.usersRepository.save(
      this.usersRepository.create({ ...createProfileDto, isClient: true }),
    );
  }

  createBroker(createBrokerDto: AuthRegisterBrokerDto): Promise<any> {
    return this.partnerRepository.save(
      this.partnerRepository.create(createBrokerDto),
    );
  }

  createSteps(userId: number, stepsUpdateDto: StepsUpdateDto): Promise<any> {
    const i18n = I18nContext.current();
    if (
      stepsUpdateDto.completedSteps !== undefined &&
      (stepsUpdateDto.completedSteps < 1 || stepsUpdateDto.completedSteps > 4)
    ) {
      const message = i18n?.t('errors.auth.completedSteps');
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
    return this.clientsRepository.save(
      this.clientsRepository.create({
        userId: userId,
        ...stepsUpdateDto,
      }),
    );
  }

  async findManyWithPagination({
    paginationOptions,
    userId,
    dto,
  }: {
    userId: number;
    dto?: ApplyListFilterSortColumnDto;
    paginationOptions: IPaginationOptions;
  }) {
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.EQUALS,
        value: [UserLifeCycle.CLIENT],
      },
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
    ];
    const filterParam = {
      ...paginationOptions,
      userId,
      relations: [
        'customKycStatus',
        'recentTask',
        'partner',
        'photo',
        'role',
        'status',
        'customSaleStatus',
        'customRetentionStatus',
        'wallet',
        'lead',
        'commissionProfile',
        'commissionProfile.classification',
      ],
      listName: ListNames.CLIENTS,
      filters,
      filterList: dto?.filters || undefined,
      sortList: dto?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto?.listViewId,
      orList: dto?.or,
    };
    return this.clientsRepository.advanceFilters(filterParam);
  }

  async findManyWithPaginationIb({
    paginationOptions,
    userId,
    dto,
  }: {
    userId: number;
    dto?: ApplyListFilterSortColumnDto;
    paginationOptions: IPaginationOptions;
  }) {
    const filters = [
      {
        name: 'userLifeCycle',
        operation: FilterOperation.EQUALS,
        value: [UserLifeCycle.CLIENT],
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
    const filterParam = {
      ...paginationOptions,
      userId,
      relations: [
        'customKycStatus',
        'recentTask',
        'partner',
        'photo',
        'role',
        'status',
        'customSaleStatus',
        'customRetentionStatus',
        'wallet',
        'lead',
        'commissionProfile',
        'commissionProfile.classification',
      ],
      listName: ListNames.CLIENTS,
      filters,
      filterList: dto?.filters || undefined,
      sortList: dto?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto?.listViewId,
      orList: dto?.or,
    };
    return this.clientsRepository.advanceFilters(filterParam);
  }

  async findManyWithPaginationForDashboard(payload: {
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
        operation: FilterOperation.EQUALS,
        value: [UserLifeCycle.CLIENT],
      },
    ];
    const filterParam = {
      userId,
      limit,
      page,
      all,
      relations: [
        'customKycStatus',
        'recentTask',
        'partner',
        'photo',
        'role',
        'status',
        'customSaleStatus',
        'customRetentionStatus',
        'wallet',
        'lead',
        'commissionProfile',
        'commissionProfile.classification',
      ],
      listName: ListNames.CLIENTS,
      filters,
      filterList: dto?.filters || undefined,
      sortList: dto?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto?.listViewId,
    };
    return this.clientsRepository.advanceFilters(filterParam);
  }

  findOne(
    fields: EntityCondition<User>,
    isAuthMe: boolean = false,
  ): Promise<NullableType<User>> {
    const relations = ['client', 'role', 'wallets', 'client.customKycStatus'];
    if (isAuthMe) {
      relations.push('client.regulation');
      relations.push('client.user');
      // relations.push('client.regulation.group');
      // relations.push('client.regulation.group.config');
    }
    return this.usersRepository.findOne({
      where: fields,
      relations,
    });
  }

  async findRegulationId(regulations: string): Promise<any> {
    const regulation = await this.clientsRepository.findOne({
      where: { regulations },
      relations: {
        regulation: true,
      },
    });
    const regulationId = regulation?.regulation?.id;
    return regulationId;
  }

  async findOneById(
    user: User,
    fields: EntityCondition<User>,
  ): Promise<NullableType<any>> {
    // let list;
    // if (user) {
    //   list = await this.clientsRepository.getRoleFilters(
    //     ListNames.CLIENTS,
    //     user.id,
    //     [],
    //   );
    // }
    // if (!list) {
    //   return this.usersRepository.findOne({
    //     where: fields,
    //     relations: ['client', 'role', 'wallets', 'client.customKycStatus', 'client.regulation'],
    //   });
    // }
    // const isAccess = list.value?.find((item) => item === fields.id);

    // if (!isAccess) {
    //   const msg = `You don't have access to view this user`;

    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: {
    //         msg,
    //       },
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    // return this.usersRepository.findOne({
    //   where: fields,
    //   relations: ['client', 'role', 'wallets', 'client.customKycStatus', 'client.regulation'],
    // });
    const filter = await this.clientsRepository.getAllRolesFilters(
      user.id,
      ListNames.USER,
    );
    const query: FindOptionsWhere<User> = fields;
    const OR_QUERY: FindOptionsWhere<User>[] = [];
    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((item) => {
          OR_QUERY.push({ ...item, ...query } as FindOptionsWhere<User>);
        });
      } else {
        //@ts-expect-error //filter type error
        query[filter.name] = In(filter.value);
      }
    }
    const userFound = await this.usersRepository.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
      relations: {
        // client: true,
        client: {
          customKycStatus: true,
          regulation: true,
          commissionProfile: {
            classification: true,
          },
        },
        role: true,
        wallets: true,
      },
    });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }
    if (userFound.languageIso) {
      const nationalityQuestion = await this.questionService.getQuestionByWhere(
        { languageIso: userFound.languageIso, name: 'nationality' },
      );
      const nationalityAnswer = await this.userAnswerRepository.findOne({
        where: { questionId: nationalityQuestion?.id, userId: userFound.id },
      });
      userFound.nationality = nationalityAnswer?.answerText ?? '';
    }

    const lead = await this.leadRepository.find({
      where: {
        client: { userId: userFound?.id },
        isActive: true,
      },
      select: ['lastAttendedDate', 'hasAttendedEvent', 'minutesOfAttendance'],
      order: {
        id: 'DESC',
      },
    });

    const transformedLead = lead.map((l) => ({
      ...l,
      lastAttendedDate:
        l.lastAttendedDate && l.lastAttendedDate instanceof Date
          ? moment(l.lastAttendedDate)
              .tz('UTC')
              .format('DD MMM YYYY')
              .toUpperCase()
          : null,
    }));

    return {
      ...userFound,
      lead: transformedLead,
    };
  }

  findOneEntireClient(
    fields: EntityCondition<Client>,
  ): Promise<NullableType<Client>> {
    return this.clientsRepository.findOne({
      where: fields,
      // relations: ['lead'],
    });
  }

  async findOneClient(id: number): Promise<any> {
    const client = await this.createClientQueryBuilder(id).getOne();
    if (!client) return null;
    const data = {
      userId: client.userId,
      salesDeskId: client.salesDeskId,
      salesRepId: client.salesRepId,
      internalSalesStatus: client.internalSalesStatus,
      clientPotential: client.clientPotential,
      auditStatus: client.auditStatus,
    };

    const salesDesk = await this.deskRepository.findOne({
      where: { id: data.salesDeskId },
      select: {
        id: true,
        name: true,
      },
    });

    const salesRep = await this.operatorRepository.findOne({
      where: { id: data.salesRepId },
      select: {
        id: true,
        full_name: true,
      },
    });

    const result = await this.customStatusRepository
      .createQueryBuilder('custom_status')
      .where(
        'custom_status.id IN (:...ids) AND custom_status.type IN (:...types)',
        {
          ids: [
            data.auditStatus,
            data.clientPotential,
            data.internalSalesStatus,
          ],
          types: ['audit_status', 'client_potential', 'sales'],
        },
      )
      .getMany();

    let internalSalesStatus: any | null;
    let clientPotential: any | null;
    let auditStatus: any | null;

    result.forEach((values) => {
      if (values.type === 'sales') {
        internalSalesStatus = { id: values.id, name: values.name };
      } else if (values.type === 'audit_status') {
        auditStatus = { id: values.id, name: values.name };
      } else if (values.type === 'client_potential') {
        clientPotential = { id: values.id, name: values.name };
      }
    });

    return {
      salesDesk,
      salesRep: { id: salesRep?.id, name: salesRep?.full_name },
      internalSalesStatus,
      clientPotential,
      auditStatus,
    };
  }

  async updateClient(
    id: number,
    updateClientDto: UpdateClientDTO,
  ): Promise<NullableType<ClientSalesInfoDTO>> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    // Update only provided fields
    Object.assign(client, updateClientDto);

    await this.clientsRepository.save(client);
    //TODO--data loging missing
    return {
      userId: client.userId,
      salesDeskId: client.salesDeskId,
      salesRepId: client.salesRepId,
      internalSalesStatus: client.internalSalesStatus,
      clientPotential: client.clientPotential,
      auditStatus: client.auditStatus,
    };
  }

  async getRetentionInfo(id: number): Promise<any> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });

    if (!client) return null;

    const data = {
      firstRetinationRep: client.firstRetinationRep,
      retentionDeskId: client.retentionDeskId,
      retentionRepId: client.retentionRepId,
      internalRetentionStatus: client.internalRetentionStatus,
    };

    const retentionDesk = await this.deskRepository.findOne({
      where: {
        id: data.retentionDeskId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    const internalRetentionStatus = await this.customStatusRepository.findOne({
      where: { id: data.internalRetentionStatus, type: StatusType.Retention },
      select: {
        id: true,
        name: true,
      },
    });

    let firstRetinationRep: any | null;
    let retentionRep: any | null;

    const result = await this.operatorRepository
      .createQueryBuilder('operator')
      .where('operator.id IN (:...ids)', {
        ids: [data.firstRetinationRep, data.retentionRepId],
      })
      .getMany();

    if (result.length === 0) {
      firstRetinationRep = null;
      retentionRep = null;
    }
    result.forEach((values) => {
      values.id == data.firstRetinationRep
        ? (firstRetinationRep = { id: values.id, name: values.full_name })
        : null;
      values.id == data.retentionRepId
        ? (retentionRep = { id: values.id, name: values.full_name })
        : null;
    });

    return {
      firstRetinationRep,
      retentionDesk,
      retentionRep,
      internalRetentionStatus,
    };
  }

  private createClientQueryBuilder(id: number): SelectQueryBuilder<Client> {
    return this.clientsRepository
      .createQueryBuilder('client')
      .select([
        'client.userId',
        'client.salesDeskId',
        'client.salesRepId',
        'client.internalSalesStatus',
        'client.clientPotential',
        'client.auditStatus',
      ])
      .where('client.userId = :id', { id });
  }

  async update(
    id: User['id'],
    payload: DeepPartial<User> & { zip?: string },
  ): Promise<User> {
    const i18n = I18nContext.current();
    if (payload.email) {
      const isEmailExists = await this.usersRepository.findOne({
        where: {
          email: payload.email,
          status: { id: 1 },
        },
      });
      if (isEmailExists && isEmailExists.id !== id) {
        const message = await i18n?.t('errors.auth.emailExists');
        throw new HttpException(
          {
            msg: message,
          },
          400,
        );
      }
    }
    let phone: string | undefined = undefined;
    if (payload.telephonePrefix && payload.telephone) {
      phone = `+${payload.telephonePrefix} ${payload.telephone}`;
    }

    let name: string | undefined = undefined;
    if (payload.firstName && payload.lastName) {
      name = `${payload.firstName} ${payload.lastName}`;
    }
    let postalCode = payload.postalCode;
    if (payload && payload.zip) {
      postalCode = payload.zip;
    }

    const billingData: DeepPartial<BillingInformation> = {
      country: payload.countryIso || undefined,
      city: payload.city || undefined,
      address: payload.address || undefined,
      phone: phone,
      name: name,
      postalCode: postalCode || undefined,
    };

    let countryInfo : Countries | null | undefined;
    if(billingData.country){
      countryInfo = await this.countriesRepository.findOne({
        where:{
          iso:billingData.country
        }
      });
      if(countryInfo){
        billingData.countryInfo = countryInfo;
      }
    }

    await this.billingInformationRepository.update(
      { user: { id: id } },
      billingData,
    );

    const userNotifications = await this.usersRepository.findOneBy({ id });

    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        isEmailNotificationsEnabled:
          userNotifications?.isEmailNotificationsEnabled,
        isSmsNotificationsEnabled: userNotifications?.isSmsNotificationsEnabled,
        isWhatsappNotificationsEnabled:
          userNotifications?.isWhatsappNotificationsEnabled,
        isClient: userNotifications?.isClient,
        isActive: userNotifications?.isActive,
        ...payload,
      }),
    );
  }

  async updateClientInfo(user: User, payload: AuthUpdateDto) {
    const question2 = JSON.stringify(payload.question2 || {});
    const agreementData = JSON.stringify(payload.agreementData || {});

    const clData = await this.findOneEntireClient({ userId: user.id });

    // const userData = {
    //   ...user,
    //   userId: user.id,
    //   email: user.email,
    //   telephone: user.telephone,
    //   telephonePrefix: user.telephonePrefix,
    // };
    // (userData as any)['isBroker'] = undefined;
    // (userData as any)['isOperator'] = undefined;
    // (userData as any)['isPartner'] = undefined;
    // (userData as any)['isClient'] = undefined;
    // (userData as any)['id'] = undefined;

    const newPayload = {
      ...clData,
      userId: user.id,
      firstName: user.firstName || payload.firstName,
      lastName: user.lastName || payload.lastName,
      email: user.email || payload.email,
      telephone: user.telephone || payload.telephone,
      telephonePrefix: user.telephonePrefix || payload.telephonePrefix,
      ...payload,
      question2,
      agreementData,
      dateOfBirth: payload.dob,
      country: payload.country,
      countryOfResidence: payload.country,
      regulation: payload.regulation ? { id: payload.regulation } : undefined,
      regulations: payload.regulations ? payload.regulations : undefined,
      address: payload.address,
      city: payload.city,
      zip: payload.zip,
      state: payload.state,
      isSwapFree: payload.isSwapFree,
      type: payload.partnerType,
    };

    const clientData = this.clientsRepository.create(newPayload);

    return this.clientsRepository.save(clientData);
  }

  async createClientInfo(user: User, payload: AuthUpdateDto, lead: Lead) {
    const question2 = JSON.stringify(payload.question2 || {});
    const agreementData = JSON.stringify(payload.agreementData || {});

    const noneClientPotentialStatus = await this.customStatusRepository.findOne(
      {
        where: { type: 'client_potential' as any, name: 'None' },
      },
    );

    const noneAuditStatus = await this.customStatusRepository.findOne({
      where: { type: 'audit_status' as any, name: 'None' },
    });

    const internalSalesStatus = await this.customStatusRepository.findOne({
      where: { type: 'sales' as any, name: 'New' },
    });

    const internalRetentionStatus = await this.customStatusRepository.findOne({
      where: { type: 'retention' as any, name: 'New' },
    });
    const kycStatus = await this.customStatusRepository.findOne({
      where: { type: 'kyc_status' as any, name: 'No KYC' },
    });

    const userData = {
      ...user,
      userId: user.id,
      email: user.email,
      telephone: user.telephone,
      telephonePrefix: user.telephonePrefix,
    };
    let walletId: null | number = null;
    if (user.id) {
      const wallet = await this.walletService.findOne('USD', user.id);
      if (wallet) {
        walletId = wallet.id;
      }
    }

    const partner = await this.partnerRepository.findOne({
      where: { uuid: lead.affId },
    });

    const clientData = this.clientsRepository.create({
      ...(userData as { email: string; userId: number; telephone: string }),
      ...payload,
      question2,
      agreementData,
      internalSalesStatus: internalSalesStatus?.id,
      internalRetentionStatus: internalRetentionStatus?.id,
      clientPotential: noneClientPotentialStatus?.id,
      auditStatus: noneAuditStatus?.id,
      kycStatus: kycStatus?.id,
      kycClientType: lead.type ? lead.type : 'Individual Client (IC)',
      type: lead.type ? lead.type : 'Individual Client (IC)',
      kycWorkflowStatus: 'New',
      fnsStatus: 'Pending Review',
      idVerificationStatus: 'Pending Review',
      porVerificationStatus: 'Pending Review',
      officeId: lead.officeId,
      office: lead.office,
      salesDeskId: lead.salesDeskId,
      salesDesk: lead.salesDesk,
      salesRepId: lead.salesRepId,
      salesRep: lead.salesRep,
      retentionDeskId: lead.retentionDeskId,
      retentionDesk: lead.retentionDesk,
      retentionRepId: lead.retentionRepId,
      retentionRep: lead.retentionRep,
      supportDeskId: lead.supportDeskId,
      supportDesk: lead.supportDesk,
      supportRepId: lead.supportRepId,
      supportRep: lead.supportRep,
      financeDeskId: lead.financeDeskId,
      financeDesk: lead.financeDesk,
      financeRepId: lead.financeRepId,
      financeRep: lead.financeRep,
      kycDeskId: lead.kycDeskId,
      kycDesk: lead.kycDesk,
      kycRepId: lead.kycRepId,
      kycRep: lead.kycRep,
      affid: partner?.id,
      source: payload.source,
      regulations: payload.regulations ? payload.regulations : 'FSCA',
      regulation: payload.regulation ? { id: payload.regulation } : undefined,
      languageIso: payload.languageIso,
      countryIso: payload.countryIso,
      country: payload.country,
      language: payload.languageIso === 'EN' ? 'English' : 'Arabic',
      leadId: lead.id,
      salesManagerId: lead?.salesManagerId,
      salesManager: lead?.salesManager,
      retentionManagerId: lead?.retentionManagerId,
      retentionManager: lead?.retentionManager,
      financeManagerId: lead?.financeManagerId,
      financeManager: lead?.financeManager,
      kycManagerId: lead?.kycManagerId,
      kycManager: lead?.kycManager,
      walletId: walletId ? walletId : undefined,
      intendedClassification:
        payload.accountClassification || AccountClassification.STANDARD,
    });

    return await this.clientsRepository.save(clientData);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.clientsRepository.update({ userId: id }, { isActive: false });
    await this.usersRepository.update({ id }, { isActive: false });
    await this.leadRepository.update(
      { clientID: id.toString() },
      { isActive: false },
    );
  }

  async updateRetentionInfo(
    id: number,
    retentionInfoDto: RetentionInfoDTO,
  ): Promise<NullableType<RetentionInfoDTO>> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    Object.assign(client, retentionInfoDto);

    await this.clientsRepository.save(client);

    return retentionInfoDto;
  }

  async updateClientKycInfo(
    id: number,
    kycInfoDto: AllKycInfoDto,
    operatorId: number,
  ): Promise<{ message: string; data: NullableType<AllKycInfoDto> }> {
    try {
      const client = await this.clientsRepository.findOne({
        where: { userId: id },
        relations: {
          regulation: true,
        },
      });
      const system_operator = await this.operatorRepository.findOne({
        where: { full_name: 'System' },
      });
      const session_operator = await this.usersRepository.findOne({
        where: { id: operatorId },
      });
      if (!client || !client.regulation) {
        throw new NotFoundException('Client or Regulation not found');
      }
      const user = await this.usersRepository.findOneBy({ id });
      const updatedLang = user?.languageIso.toLocaleUpperCase();

      if (!user) throw new NotFoundException('User not found');

      const kycApproveDetails = await this.customStatusRepository.findOne({
        where: { name: 'Approved', type: 'kyc_status' as any },
      });

      const kycRejectionDetails = await this.customStatusRepository.findOne({
        where: { name: 'Rejected', type: 'kyc_status' as any },
      });
      const kycInfoDtoCopy = { ...kycInfoDto };

      if (kycInfoDto?.kycStatus) {
        const kycStatusDetails = await this.customStatusRepository.findOne({
          where: { id: kycInfoDto.kycStatus, type: 'kyc_status' as any },
        });

        if (kycStatusDetails) {
          kycInfoDtoCopy['kycStatusName'] = kycStatusDetails.name; // Add kycStatusName to the copy
        } else {
          kycInfoDtoCopy['kycStatusName'] = 'Unknown'; // Handle case when status is not found in the DB
        }
      }
      const isKycApproved = kycInfoDto?.kycStatus === kycApproveDetails?.id;
      if (kycInfoDto?.kycStatus === kycApproveDetails?.id) {
        const kycDocumentsVerified =
          await this.adminKycService.isKycVerified(id);
        if (
          !kycDocumentsVerified &&
          client.idVerificationStatus !== 'Approved'
        ) {
          throw new BadRequestException(
            'KYC proof of identity document not approved',
          );
        } else if (
          !kycDocumentsVerified &&
          client.porVerificationStatus !== 'Approved'
        ) {
          throw new BadRequestException(
            'KYC proof of address document not approved',
          );
        }
        const label = await this.labelRepository.findOne({
          where: {
            description: NotificationMessages.clientregistration_kyc_approved,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_kyc_approved_title,
          },
        });

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

        await this.createNotification({
          ...notificationData,
          title: labelTitle?.description,
          description: label?.description,
        });

        if (user?.email) {
          const lead = await this.leadRepository.findOne({
            where: { email: user.email },
          });

          if (lead) {
            await this.leadRepository.save(
              this.leadRepository.create({
                ...lead,
                userLifeCycle: UserLifeCycle.CLIENT,
                clientCreatedTime: lead.clientCreatedTime ?? new Date(),
              }),
            );
          }
        }

        await this.clientsRepository.update(
          { userId: id },
          {
            fnsStatus: 'Approved',
            kycWorkflowStatus: 'Completed',
            userLifeCycle: UserLifeCycle.CLIENT,
          },
        );

        await this.mt5AccountService.enableClientTrading(user.id);

        await this.sendEmailService.sendEmailToClient({
          entityName: 'client',
          entityValue: user?.id.toString(),
          createdForId: user?.id,
          emailEventName: 'KYC_STATUS_APPROVED',
          operatorId: system_operator?.id ? system_operator?.id : 0,
        });
      }

      if (kycInfoDto?.kycStatus === kycRejectionDetails?.id) {
        const label = await this.labelRepository.findOne({
          where: {
            description: NotificationMessages.clientregistration_kyc_rejected,
          },
        });

        const labelTitle = await this.labelRepository.findOne({
          where: {
            description:
              NotificationTitles.clientregistration_kyc_rejected_title,
          },
        });

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

        await this.createNotification({
          ...notificationData,
          title: labelTitle?.description,
          description: label?.description,
        });
        if (updatedLang === 'EN') {
          await this.userKycDocumentsService.sendEmailKyc({
            template: KycTemplateNames.KYC_REJECTION,
            title: KycTemplateSubject_EN.KYC_REJECTION,
            userId: user.id,
          });
        } else if (updatedLang === 'AR') {
          await this.userKycDocumentsService.sendEmailKyc({
            template: KycTemplateNames.KYC_REJECTION,
            title: KycTemplateSubject_AR.KYC_REJECTION,
            userId: user.id,
          });
        }
        // await this.sendEmailService.sendEmailToClient({
        //   entityName: 'client',
        //   entityValue: user?.id.toString(),
        //   createdForId: user?.id,
        //   emailEventName: 'KYC_STATUS_REJECTED',
        //   operatorId: system_operator?.id?system_operator?.id:0,
        // });
      }
      await this.clientsRepository.update({ userId: id }, kycInfoDto);
      try {
        if (kycInfoDto?.kycStatus === kycApproveDetails?.id) {
          const [shouldCreateOnKyc] =
            await this.regulationsConfigService.isAllowedInRegulation(
              client.regulation.id,
              RegulationEventKeys.mt5_live_account_creation,
              [RegulationRuleKeys.on_kyc_approval],
            );
          const existingAccounts = await this.mt5AccountRepository.count({
            where: { user: { id }, server: { name: ServerName.LIVE } },
          });
          if (existingAccounts < 1 && shouldCreateOnKyc) {
            await this.mt5AccountService.createAccount(
              {
                Server: ServerName.LIVE,
                ClientID: id.toString(),
                Currency: 'USD',
                Email: user?.email ?? '',
                TradingType: client.isCopyTrading
                  ? AccountTradingType.COPY_TRADING
                  : AccountTradingType.NORMAL,
              },
              user,
            );
          }
        }
      } catch (error) {
        console.error(error);
      }

      if (kycInfoDto?.kycStatus) {
        const kycStatusDetails = await this.customStatusRepository.findOne({
          where: { id: kycInfoDto.kycStatus, type: 'kyc_status' as any },
        });
        await this.leadRepository.update(
          { clientID: id.toString() },
          { kycStatus: kycStatusDetails?.id },
        );
      }

      try {
        if (isKycApproved) {
          await this.IBAutomationService.setup(id, true);
        }
      } catch (error) {
        console.error(error, 'ERROR');
      }

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: kycInfoDtoCopy,
        oldData: client,
        entityId: id,
        entityType: 'User',
        performerId: session_operator
          ? session_operator?.operator?.id
          : system_operator?.id,
        performerType: session_operator ? 'Operator' : 'System',
        field: 'Details Update',
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'DetailsUpdated',
        entity_id: id,
        entity_type: 'User',
        parent_id: id,
        parent_type: 'User',
        json_object: kycInfoDtoCopy,
        performer_id: session_operator
          ? session_operator?.operator?.id
          : system_operator?.id,
        performer_type: session_operator ? 'Operator' : 'System',
        is_from_archive: 0,
        trigger_type: 'Default',
      });

      await this.cacheManager.del(`get-me-api-${user.id}`);

      return {
        message: `Client's kyc data updated successfully`,
        data: kycInfoDto,
      };
    } catch (error) {
      throw error;
    }
  }

  async getBankInfo(id: number): Promise<NullableType<BankInfoDTO>> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });

    return client
      ? {
          bankAccountName: client.bankAccountName,
          bankAccountNumber: client.bankAccountNumber,
          bankBranchName: client.bankBranchName,
          bankComment: client.bankComment,
          bankCountryIso: client.bankCountryIso,
          bankName: client.bankName,
          bankSwiftCode: client.bankSwiftCode,
        }
      : null;
  }

  async updateBankInfo(
    id: number,
    bankInfoDto: BankInfoDTO,
  ): Promise<NullableType<BankInfoDTO>> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    Object.assign(client, bankInfoDto);
    await this.clientsRepository.save(client);
    return bankInfoDto;
  }

  async createCommunication(
    createCommunicationDto: CreateCommunicationDto,
  ): Promise<void> {
    const { type, text, userId, subject, html } = createCommunicationDto;

    if (!text && !html) {
      throw new BadRequestException('Text or html is required');
    }

    if (type !== 'sms' && type !== 'email') {
      throw new NotFoundException('Invalid communication type');
    }

    const userDetails = await this.getUserDetails(userId);
    if (!userDetails) {
      throw new NotFoundException('User not found');
    }
    const isExist2 = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['client', 'role', 'wallets', 'client.customKycStatus'],
    });

    if (type === 'sms') {
      await this.sendCustomMessage(
        userDetails.telephonePrefix,
        userDetails.telephone,
        text,
        subject,
      );
      await this.mailerService.sendCommunication({
        userId: userId,
        type: 'sms',
        text: text,
        subject: subject,
        operatorId: createCommunicationDto.operatorId,
      });
    } else if (type === 'email') {
      const regulation = isExist2?.client?.regulations;
      //sending email to client via mailMicroService and saving into communication table of mailMicroService
      await this.mailService.sendHtmlViaEmail({
        to: userDetails.email,
        from: createCommunicationDto.from,
        data: {
          text: text,
          from: createCommunicationDto.from,
          subject: subject,
          userId: userId,
          html: html,
          operatorId: createCommunicationDto.operatorId,
          regulation,
        },
      });
    }
  }

  async createEmailLayout(
    createEmailLayoutDto: CreateEmailLayoutDto,
    userId?: any,
  ): Promise<any> {
    try {
      const { regulation, language, name, layout, companyName, regulationId } =
        createEmailLayoutDto;
      const newName = name.toUpperCase().replace(/ /g, '_');
      if (!language || !name || !layout) {
        throw new NotFoundException('Invalid Payload');
      }
      if (regulation || regulationId) {
        throw new NotFoundException('Regulation is not required in V2');
      }
      // const existingLayout = await this.layoutRepository.findOne({
      //   where: {
      //     language: language,
      //     regulationId: { id: regulationId },
      //   },
      // });
      // if (existingLayout) {
      //   throw new HttpException(
      //     {
      //       status: HttpStatus.UNPROCESSABLE_ENTITY,
      //       error: {
      //         msg: 'Layout already exists',
      //       },
      //     },
      //     HttpStatus.UNPROCESSABLE_ENTITY,
      //   );
      // }
      const layouts = new Layout();
      (layouts.name = newName),
        // (layouts.regulation = regulation ? regulation : 'FSCA'),
        (layouts.language = language ? language.toLocaleUpperCase() : 'EN'),
        (layouts.layout = layout),
        (layouts.companyName = companyName
          ? companyName
          : `${process.env.DOMAIN}`);
      layouts.isActive = true;
      layouts.user = userId;
      // layouts.regulationId = regulationId as any;
      layouts.version = 'v2';
      await this.layoutRepository.save(layouts);
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: layouts,
        oldData: null,
        entityId: layouts?.id,
        entityType: entityType.LAYOUT,
        performerId: userId,
        performerType: performerType.OPERATOR,
        field: 'Layout Created',
      });
      return {
        message: 'Email layout created successfully',
        data: layouts,
      };
    } catch (error) {
      throw error;
    }
  }

  async createEmailTemplate(
    createEmailTemplateDto: CreateEmailTemplateDto,
    userId?: number,
  ): Promise<void> {
    const { title, language, entityId, subject } = createEmailTemplateDto;
    //sending email to client via mailMicroService and saving into communication table of mailMicroService
    await this.addEmailTemplate({
      title,
      language,
      userId,
      entityId,
      subject,
    });
  }

  async addEmailTemplate(sendMailDto: any) {
    try {
      await this.createEmailTemplate2({
        language: sendMailDto.language,
        title: sendMailDto.title,
        userId: sendMailDto.userId,
        entityId: sendMailDto.entityId,
        subject: sendMailDto.subject,
      });
    } catch (error) {
      throw error;
    }
  }

  async createEmailTemplate2(sendMailDto: any): Promise<any> {
    const { title, language, userId, entityId, subject } = sendMailDto;
    if (!language || !title || !entityId) {
      throw new NotFoundException('Invalid sendMailDto');
    }
    const newName = title ? title.toUpperCase().replace(/ /g, '_') : undefined;
    const existingTemp = await this.templateRepository.findOne({
      where: {
        title,
        language,
        name: newName,
      },
    });
    if (existingTemp) {
      throw new NotFoundException('Template already exists');
    }
    const template = new Template();
    (template.communicationType = 1),
      (template.eventId = 789),
      (template.indexName = 'malfex'),
      (template.subIndexName = 'SUBIDX_0'),
      (template.text = '');
    template.language = language;
    template.name = newName;
    (template.title = title),
      (template.eventName = title),
      (template.isDeleted = false),
      (template.trackingId = '3da747d5-9da3-466d-b71a-be058f7b8ee7');
    template.user = userId;
    template.domain = this.domain ? this.domain : `${process.env.DOMAIN}`;
    template.entity = entityId;
    template.version = 'v2';
    template.subject = subject;
    try {
      await this.templateRepository.save(template);

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: template,
        oldData: null,
        entityId: template?.id,
        entityType: entityType.BODY_CONTENT,
        performerId: userId,
        performerType: performerType.OPERATOR,
        field: 'Body Content Created',
      });

      return {
        message: 'Email template created successfully',
        data: template,
      };
    } catch (error) {
      throw new Error('Failed to save template');
    }
  }

  async updateEmailLayout(
    id: number,
    updateEmailLayoutDto: UpdateEmailLayoutDto,
    userId: number,
  ): Promise<any> {
    const { name } = updateEmailLayoutDto;

    const currentRecord = await this.layoutRepository.findOne({
      where: {
        id,
      },
    });

    if (!currentRecord) {
      throw new NotFoundException('Email layout not found');
    }

    // if (currentRecord.version === 'v2') {
    const { regulation, regulationId, ...v2UpdateDto } = updateEmailLayoutDto;
    const newName = name ? name.toUpperCase().replace(/ /g, '_') : undefined;
    const updatedEmailDto = {
      ...v2UpdateDto,
      ...(newName && { name: newName }),
    };
    // if (newName) {
    //   const existingRecord = await this.layoutRepository.findOne({
    //     where: {
    //       name: newName,
    //       id: Not(id)
    //     },
    //   });
    //   if (existingRecord) {
    //     throw new NotFoundException('Name Already Exists');
    //   }
    // }
    await this.updateEmailLayoutById(id, updatedEmailDto, userId);
    // } else if (currentRecord.version === 'v1') {
    // throw new BadRequestException('this record is not editable');
    // const existingRecord = await this.layoutRepository.findOne({
    //   where: {
    //     language: language || (currentRecord?.language as any),
    //     regulationId: {
    //       id: regulationId || (currentRecord?.regulationId as any),
    //     },
    //     id: Not(id),
    //   },
    // });

    // if (existingRecord) {
    //   throw new ConflictException(
    //     `An email layout with language "${language}" and regulationId "${regulationId}" already exists.`,
    //   );
    // }

    // const newName = name ? name.toUpperCase().replace(/ /g, '_') : undefined;
    // const updatedEmailDto = {
    //   ...updateEmailLayoutDto,
    //   ...(newName && { name: newName }),
    //   ...(regulation && regulationId && { regulationId: { id: regulationId } }),
    // };
    // await this.updateEmailLayoutById(id, updatedEmailDto);
    // }
  }

  async updateEmailTemplate(
    id: number,
    createEmailTemplateDto: UpdateEmailTemplateDto,
    userId: number,
  ): Promise<void> {
    const { name, text } = createEmailTemplateDto;
    const existingTemplate = await this.templateRepository.findOne({
      where: { id },
    });
    if (!existingTemplate) {
      throw new NotFoundException('Template not found');
    }
    const newName = name ? name.toUpperCase().replace(/ /g, '_') : undefined;

    // Prepare the updated DTO
    const updatedEmailDto: UpdateEmailTemplateDto = {
      ...createEmailTemplateDto,
      ...(newName && { name: newName }), // Include name only if transformed
    };

    if (Object.keys(updatedEmailDto).length > 0) {
      await this.updateEmailTemplateById(id, updatedEmailDto, userId);
    }
  }

  async updateEmailTemplateById(
    id: number,
    sendMailDto: any,
    userId: number,
  ): Promise<any> {
    try {
      const getEmailTemplate = await this.templateRepository.findOne({
        where: {
          id,
          isDeleted: false,
        },
      });
      if (getEmailTemplate) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: sendMailDto,
          oldData: getEmailTemplate,
          entityId: id,
          entityType: entityType.BODY_CONTENT,
          performerId: userId,
          performerType: performerType.OPERATOR,
          field: 'Body Content Updated',
        });
        await this.templateRepository.update(id, sendMailDto);
        return {
          message: 'Email template updated successfully',
          data: sendMailDto,
        };
      }
      throw new NotFoundException('Email template not found');
    } catch (error) {
      throw error;
    }
  }

  async updateEmailLayoutById(
    id: number,
    sendMailDto: any,
    userId: number,
  ): Promise<any> {
    try {
      const getEmailTemplate = await this.layoutRepository.findOne({
        where: {
          id,
        },
      });
      if (getEmailTemplate) {
        await this.layoutRepository.update(id, sendMailDto);
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: sendMailDto,
          oldData: getEmailTemplate,
          entityId: getEmailTemplate?.id,
          entityType: entityType.LAYOUT,
          performerId: userId,
          performerType: performerType.OPERATOR,
          field: 'Layout Updated',
        });
        return {
          message: 'Email layout updated successfully',
          data: sendMailDto,
        };
      }
      throw new NotFoundException('Email layout not found');
    } catch (error) {
      throw error;
    }
  }

  async getTemplates({
    paginationOptions,
    searchValue,
    searchColumn,
    startDate,
    endDate,
    sortBy,
    sortOrder,
    version,
  }: {
    paginationOptions: IPaginationOptions;
    searchValue?: string;
    searchColumn?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
    version?: string;
  }): Promise<any> {
    return await this.getAllEmailTemplates({
      paginationOptions,
      searchValue,
      searchColumn,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      version,
    });
  }

  async getAllEmailTemplates(params: any): Promise<any> {
    const {
      paginationOptions,
      searchValue,
      searchColumn,
      startDate,
      endDate,
      sortBy,
      sortOrder,
      version,
    } = params;
    const whereConditions: any = {
      domain: this.domain,
      isDeleted: false,
    };

    if (searchColumn) {
      if (searchColumn != 'user' && !startDate && !endDate) {
        whereConditions[`${searchColumn}`] = Like(`%${searchValue}%`);
      } else if (searchColumn == 'user') {
        whereConditions[`${searchColumn}`] = {
          operator: { full_name: ILike(`%${searchValue}%`) },
        };
      } else if (searchColumn == 'creationTime') {
        if (startDate && endDate) {
          whereConditions['creationTime'] = Between(
            new Date(startDate),
            new Date(endDate),
          );
        } else if (startDate) {
          whereConditions['creationTime'] = MoreThanOrEqual(
            new Date(startDate),
          );
        } else if (endDate) {
          whereConditions['creationTime'] = LessThanOrEqual(new Date(endDate));
        }
      } else if (searchColumn == 'lastUpdateTime') {
        if (startDate && endDate) {
          whereConditions['lastUpdateTime'] = Between(
            new Date(startDate),
            new Date(endDate),
          );
        } else if (startDate) {
          whereConditions['lastUpdateTime'] = MoreThanOrEqual(
            new Date(startDate),
          );
        } else if (endDate) {
          whereConditions['lastUpdateTime'] = LessThanOrEqual(
            new Date(endDate),
          );
        }
      }
    }

    if (version) {
      whereConditions['version'] = version;
    }

    const total = await this.templateRepository.count({
      where: whereConditions,
    });

    const templates = await this.templateRepository.find({
      where: whereConditions,
      skip: paginationOptions
        ? (paginationOptions.page - 1) * paginationOptions.limit
        : 0,
      take: paginationOptions?.limit ?? total,
      order: { [sortBy]: sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' },
      relations: { user: true },
    });

    const hasNextPage = paginationOptions
      ? paginationOptions.page * paginationOptions.limit < total
      : false;

    return {
      message: 'Templates fetched successfully',
      templates,
      hasNextPage,
      total,
      count: templates.length,
    };
  }

  async getAllEmailTemplatesAdvance(
    userId: number,
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    const company = `${process.env.DOMAIN}`;
    const filters: FilterItem[] = [
      {
        name: 'domain',
        operation: FilterOperation.EQUALS,
        value: [company],
      },
      {
        name: 'isDeleted',
        operation: FilterOperation.EQUALS,
        value: [false],
      },
    ];

    const { result, ...rest } = await this.templatesRepository.advanceFilters({
      filters,
      limit,
      page,
      userId,
      listName: ListNames.TEMPLATES,
      filterList: dto.filters || undefined,
      sortList: dto.sort || undefined,
      relations: ['user'],
      defaultSortKey: 'creationTime',
      listViewId: dto.listViewId,
    });
    const templates = result;

    return {
      message: 'Templates fetched successfully',
      result: templates,
      ...rest,
    };
  }

  async getAllEmailLayouts(params: any): Promise<any> {
    const {
      paginationOptions,
      searchValue,
      searchColumn,
      sortBy,
      sortOrder,
      startDate,
      endDate,
      version,
    } = params;

    const whereConditions: any = { companyName: this.domain };

    if (searchColumn) {
      if (searchColumn != 'user' && !startDate && !endDate) {
        whereConditions[`${searchColumn}`] = Like(`%${searchValue}%`);
      } else if (searchColumn == 'user') {
        whereConditions[`${searchColumn}`] = {
          operator: { full_name: ILike(`%${searchValue}%`) },
        };
      } else if (searchColumn == 'createdAt') {
        if (startDate && endDate) {
          whereConditions['createdAt'] = Between(
            new Date(startDate),
            new Date(endDate),
          );
        } else if (startDate) {
          whereConditions['createdAt'] = MoreThanOrEqual(new Date(startDate));
        } else if (endDate) {
          whereConditions['createdAt'] = LessThanOrEqual(new Date(endDate));
        }
      } else if (searchColumn == 'updatedAt') {
        if (startDate && endDate) {
          whereConditions['updatedAt'] = Between(
            new Date(startDate),
            new Date(endDate),
          );
        } else if (startDate) {
          whereConditions['updatedAt'] = MoreThanOrEqual(new Date(startDate));
        } else if (endDate) {
          whereConditions['updatedAt'] = LessThanOrEqual(new Date(endDate));
        }
      }
    }
    if (version) {
      whereConditions['version'] = version;
    }
    console.log('whereConditions: ', whereConditions);

    const total = await this.layoutRepository.count({ where: whereConditions });

    const layouts = await this.layoutRepository.find({
      where: whereConditions,
      skip: paginationOptions
        ? (paginationOptions.page - 1) * paginationOptions.limit
        : 0,
      take: paginationOptions?.limit ?? total,
      order: { [sortBy]: sortOrder.toUpperCase() == 'ASC' ? 'ASC' : 'DESC' },
      relations: { user: true },
    });

    const hasNextPage = paginationOptions
      ? paginationOptions.page * paginationOptions.limit < total
      : false;

    return {
      message: 'Layouts fetched successfully',
      layouts,
      hasNextPage,
      total,
      count: layouts.length,
    };
  }

  async getAllEmailLayoutsAdvance(
    userId: number,
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    if (this.domain) {
      const filters: FilterItem[] = [
        {
          name: 'companyName',
          operation: FilterOperation.EQUALS,
          value: [this.domain],
        },
      ];

      const { result, ...rest } = await this.layoutsRepository.advanceFilters({
        filters,
        limit,
        page,
        userId,
        listName: ListNames.LAYOUT,
        filterList: dto.filters || undefined,
        sortList: dto.sort || undefined,
        relations: ['user', 'regulationId'],
        defaultSortKey: 'createdAt',
        listViewId: dto.listViewId,
      });
      const layouts = result;
      return {
        message: 'Layouts fetched successfully',
        result: layouts,
        ...rest,
      };
    }
  }

  async getLayout(
    language: string = 'EN',
    regulation: string = 'FSCA',
    regulationId?: number,
  ) {
    const layout = this.layoutRepository.findOne({
      where: {
        language,
        companyName: this.domain,
        regulationId: { id: regulationId },
      },
    });

    if (!layout && regulation !== 'FSCA') {
      return this.layoutRepository.findOne({
        where: { language, companyName: this.domain, regulation: 'FSCA' },
      });
    }
    return layout;
  }

  async getLayoutWithoutRegulation(layoutId: number) {
    const layout = this.layoutRepository.findOne({
      where: {
        id: layoutId,
      },
    });
    return layout;
  }

  async compileHtmlWithLayoutWithoutTemplate({
    html,
    context,
    language,
    layoutTitle,
    regulation,
    regulationId,
    version,
    layoutId,
  }: {
    html: any;
    context?: any;
    language?: string;
    layoutTitle?: string;
    regulation?: string;
    regulationId?: number;
    version?: string;
    layoutId?: number;
  }) {
    const query: FindOptionsWhere<Template> = {};
    if (language) {
      query.language = language;
    } else {
      query.language = 'EN';
    }
    query.domain = this.domain;
    const getDefaultRegulation = await this.regulationRepository.findOne({
      where: {
        name: 'FSCA',
      },
    });
    const getRegulation = await this.regulationRepository.findOne({
      where: {
        id: regulationId,
      },
    });
    let layout;
    if (layoutId) {
      layout = await this.getLayoutWithoutRegulation(layoutId);
    } else {
      layout = await this.getLayout(
        language || 'EN',
        getRegulation?.name || getDefaultRegulation?.name,
        regulationId || (getDefaultRegulation?.id as any),
      );
    }
    const supportEmailAddress = this.configService.get('mail.supportEmail', {
      infer: true,
    });
    const supportContact = this.configService.get('mail.supportContact', {
      infer: true,
    });
    let body = html;
    if (context) {
      body = this.compileHtml(html, {
        ...context,
        domain:
          getRegulation?.name == getDefaultRegulation?.name
            ? getDefaultRegulation?.domain
            : getRegulation?.domain,
        website:
          getRegulation?.name == getDefaultRegulation?.name
            ? getDefaultRegulation?.website
            : getRegulation?.website,
        supportContact,
        supportEmailAddress,
      });
    }
    return {
      html: this.compileHtml(layout?.layout, { body }),
    };
  }

  compileHtml(template, context) {
    return compile(template, { strict: true })(context);
  }

  async getEmailPreview(params: any): Promise<any> {
    const { language, body, layoutTitle, entityValue, entityId } = params;
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    let context: Record<string, any> | undefined = {
      app_name,
    };
    if (entityId && entityValue) {
      const Entity = await this.getEntity(entityId);

      if (!Entity) {
        throw new NotFoundException('No entity found for the given template');
      }

      // Assuming templateVariable has entityId and entityType fields
      const { name: entityType } = Entity;

      // Step 2: Fetch dynamic data for the entity using the fetched variable
      const dynamicData = await this.fetchTemplateVariables(
        entityId,
        entityType,
        entityValue,
      );

      for (const [key, value] of Object.entries(dynamicData)) {
        const keys = key.split('.');
        keys.reduce((acc, k, i) => {
          if (i === keys.length - 1) {
            acc[k] = value;
          } else {
            acc[k] = acc[k] || {};
          }
          return acc[k];
        }, context);
      }
    } else {
      context = undefined;
    }
    const layout = await this.layoutRepository.findOne({
      where: { language, name: layoutTitle },
      relations: {
        regulationId: true,
      },
    });
    const getDefaultRegulation = await this.regulationRepository.findOne({
      where: {
        name: 'FSCA',
      },
    });
    const { html } = await this.compileHtmlWithLayoutWithoutTemplate({
      html: body,
      context,
      language: layout?.language || 'EN',
      layoutTitle,
      regulation: layout?.regulation || 'FSCA',
      regulationId: layout?.regulationId?.id || getDefaultRegulation?.id,
      version: layout?.version,
      layoutId: layout?.id,
    });
    return {
      message: 'Preview fetched successfully',
      html,
    };
  }

  async getOneTemplate(id: number): Promise<any> {
    return await this.getTemplateById({
      id,
    });
  }

  async getTemplateById(dto: any) {
    try {
      const message = await this.templateRepository.findOne({
        where: { id: dto.id, isDeleted: false },
        relations: {
          user: true,
          entity: true,
        },
      });
      if (!message) {
        throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Template fetched successfully',
        data: {
          id: message?.id,
          html: message?.text,
          languageIso: message?.language,
          language: message?.language == 'EN' ? 'English' : 'Arabic',
          name: message?.name,
          createdBy: message?.user?.operator?.full_name,
          title: message?.title,
          version: message?.version,
          entityId: message?.entity?.id,
          entityName: message?.entity?.name,
          subject: message?.subject,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getLayoutById(dto: any) {
    try {
      const message = await this.layoutRepository.findOne({
        where: { id: dto.id },
        relations: {
          user: true,
          regulationId: true,
        },
      });
      if (!message) {
        throw new HttpException('Layout not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Layout fetched successfully',
        data: {
          id: message.id,
          layout: message.layout,
          language: message.language,
          name: message.name,
          regulation: message?.regulationId?.name,
          regulationId: message?.regulationId?.id,
          companyName: message.companyName,
          createdBy: message?.user?.operator?.full_name,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteEmailTemplateById(id: number, userId: number): Promise<any> {
    try {
      const getEmailTemplate = await this.templateRepository.findOne({
        where: {
          id: id,
        },
      });
      if (getEmailTemplate) {
        await this.templateRepository.update(id, { isDeleted: true });
        await this.templateRepository.softDelete(id);
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: null,
          oldData: getEmailTemplate,
          entityId: getEmailTemplate?.id,
          entityType: entityType.BODY_CONTENT,
          performerId: userId,
          performerType: performerType.OPERATOR,
          field: 'Body Content Deleted',
        });
        return {
          message: 'Email template deleted successfully',
        };
      }
      throw new NotFoundException('Email template not found');
    } catch (error) {
      throw new Error('Failed to save template');
    }
  }

  async getAllEmailEntities(): Promise<EmailEntity[]> {
    return this.entitiyRepository.find({});
  }

  async getVariablesByEntityId(entityId: number): Promise<EmailVariable[]> {
    const variable = await this.varRepository
      .createQueryBuilder('variable')
      .leftJoin('variable.emailEntity', 'entity')
      .where('entity.id = :entityId', { entityId })
      .orWhere('variable.is_external = :isExternal', { isExternal: true })
      .getMany();

    if (variable.length > 0) {
      return variable || [];
    }

    throw new NotFoundException(`varibales  with ID ${entityId} not found`);
  }

  async deleteEmailLayoutById(id: number, userId: number): Promise<any> {
    try {
      const getEmailTemplate = await this.layoutRepository.findOne({
        where: {
          id: id,
        },
      });
      if (getEmailTemplate) {
        await this.layoutRepository.softDelete(id);
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: null,
          oldData: getEmailTemplate,
          entityId: getEmailTemplate?.id,
          entityType: entityType.LAYOUT,
          performerId: userId,
          performerType: performerType.OPERATOR,
          field: 'Email Layout Deleted',
        });
        return {
          message: 'Email layout deleted successfully',
        };
      }
      throw new NotFoundException('Email layout not found');
    } catch (error) {
      throw error;
    }
  }

  async updateStarredStatus(
    userId: number,
    communicationId: number,
  ): Promise<void> {
    await this.mailerService.updateCommunication({
      userId,
      communicationId,
    });
  }

  async getAllCommunicationsByUserId(
    userId: number,
    starredOnly: boolean,
  ): Promise<any> {
    return await this.mailerService.getCommunication({
      userId,
      starredOnly,
    });
  }

  async getLatestCommunications(filters: {
    leadFilter: string;
    clientFilter: string;
  }): Promise<any> {
    const query2 = ` 
 SELECT 
   'Sent' AS [Source],
    communication.id as id,
	l.id as leadId ,
	l.clientID as userId,
	CONCAT(l.firstName,' ',l.lastName) as FullName,
	communication.[from] AS [From],
	l.email AS [To],
	communication.subject AS [Subject],
	communication.created_at AS [Time]
FROM
	communication
Inner JOIN lead l	ON l.id = communication.leadId and l.isActive = 1 ${filters?.leadFilter}
 WHERE communication.status IN ('Sent', 'Active') and communication.leadId  is not null
UNION ALL
 SELECT 
   'Sent' AS [Source],
    communication.id as id,
	l.id as leadId ,
	l.clientID as userId,
	CONCAT(l.firstName,' ',l.lastName) as FullName,
	communication.[from] AS [From],
	l.email AS [To],
	communication.subject AS [Subject],
	communication.created_at AS [Time]
FROM
	communication
INNER  JOIN client c ON	c.userId  = communication.userId and c.isActive = 1 ${filters?.clientFilter}
Inner JOIN lead l ON c.userId = l.clientID and l.isActive = 1
 WHERE communication.status IN ('Sent', 'Active') and communication.userid  is not null
union all


SELECT 		
'Inbox' AS [Source],
	inbox_email.id as id,
	c.leadId AS leadId,
	c.userId as userId,
	inbox_email.senderName as [FullName],
	email_list.email AS [To],
	inbox_email.[from] AS [From],
	inbox_email.subject AS [Subject],
	inbox_email.receivedDateTime AS [Time]
FROM Inbox_email
LEFT JOIN email_list 	ON	email_list.id = inbox_email.emailId
INNER JOIN client c 		ON	lower(c.email) = LOWER(inbox_email.[from]) and c.isActive = 1 ${filters?.clientFilter}

union all

SELECT 		
'Inbox' AS [Source],
	inbox_email.id as id,
	l.id AS leadId,
	l.clientID as userId,
	inbox_email.senderName as [FullName],
	email_list.email AS [To],
	inbox_email.[from] AS [From],
	inbox_email.subject AS [Subject],
	inbox_email.receivedDateTime AS [Time]
FROM Inbox_email
LEFT JOIN email_list 	ON	email_list.id = inbox_email.emailId
INNER JOIN lead l 		ON	lower(l.email) = LOWER(inbox_email.[from]) and l.clientID is null and l.isActive = 1 ${filters?.leadFilter}
order by [Time] DESC`;
    const messages = await this.dataSource.query(query2);
    const firstFiveMessages = messages.slice(0, 5);
    return { messages: firstFiveMessages };
  }

  async getOneMessageId2(id: number): Promise<any> {
    const message = await this.mailerService.getOneMessage({
      id,
    });
    const user = await this.usersRepository.findOne({
      where: { id: message.userId },
    });

    return {
      ...message,
      to: user?.email,
    };
  }

  async getOneMessageId(id: number): Promise<any> {
    try {
      // const message = await this.communicationRepository.findOneBy({
      //   id: id
      // });

      const message = await this.communicationRepository.findOne({
        where: { id: id },
        relations: ['lead'],
      });

      let userOrLead;

      if (message?.userId) {
        userOrLead = await this.usersRepository.findOne({
          where: { id: message?.userId },
        });
      } else if (message?.lead) {
        userOrLead = await this.leadRepository.findOne({
          where: { id: message?.leadId },
        });
      }

      if (!message) {
        throw new HttpException('Message not found', HttpStatus.NOT_FOUND);
      }

      return {
        id: message.id,
        html: message.html,
        subject: message.subject,
        text: message.text,
        type: message.type,
        sender: message.sender,
        from: message.from,
        userId: message.userId,
        operatorId: message.operatorId,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
        status: message.status,
        starred: message.starred,
        templateId: message.template?.id ? message.template?.id : null,
        read: message.read,
        // leadId: message.leadId,
        lead: message.lead,
        // ...message,
        to: userOrLead?.email,
      };
    } catch (error) {}
  }

  async emailExists(dto: AuthEmailExistsDto): Promise<boolean> {
    const user = await this.findOne({ email: dto.email });

    return user ? true : false;
  }

  async editClientInfo(
    id: number,
    clientInfoUpdateDto: ClientInfoUpdateDTO,
    sessionUser?: User,
  ): Promise<NullableType<ClientInfoUpdateDTO>> {
    if (sessionUser) {
      const filter = await this.clientsRepository.getAllRolesFilters(
        sessionUser.id,
        ListNames.CLIENTS,
      );
      const query: FindOptionsWhere<Client> = { userId: id };
      const OR_QUERY: FindOptionsWhere<Client>[] = [];
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
      const clientInfo = await this.clientsRepository.findOne({
        where: OR_QUERY.length ? OR_QUERY : query,
      });

      if (!clientInfo) {
        throw new BadRequestException('Lead not found');
      }
    }

    const user = await this.usersRepository.findOne({
      where: { id: id, status: { id: 1 } },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let client = await this.clientsRepository.findOne({
      where: { userId: id },
      relations: ['lead', 'commissionProfile'],
    });
    const link =
      client?.userLifeCycle == UserLifeCycle.CLIENT
        ? `${process.env.CRM_FRONT_END_URL}/clients/${client?.userId}`
        : `${process.env.CRM_FRONT_END_URL}/applicants/${client?.userId}`;

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const previousClient = JSON.parse(JSON.stringify(client));

    const { email } = clientInfoUpdateDto;
    if (email) {
      const i18n = I18nContext.current();
      const isExist = await this.emailExists({
        email,
      });

      if (isExist) {
        const message = await i18n?.t('errors.auth.emailExists');
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
    let bodyCountryIso = clientInfoUpdateDto.countryIso;
    let bodyCountry = clientInfoUpdateDto.country;
    let countryCode;

    if (!bodyCountryIso && clientInfoUpdateDto.country) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.printableName === clientInfoUpdateDto.country,
      );
      countryCode = countries.result[isoIndex];
      bodyCountryIso = countries.result[isoIndex]?.iso;
    } else if (!bodyCountry && clientInfoUpdateDto.countryIso) {
      const countries = this.settingsService.getCountriesIso();
      const isoIndex = countries.result.findIndex(
        (country) => country.iso === clientInfoUpdateDto.countryIso,
      );
      countryCode = countries.result[isoIndex];
      if (isoIndex !== -1) {
        bodyCountry = countries.result[isoIndex]?.printableName;
      } else {
        const countryData = this.settingsService.getCountriesIso();
        const cleanNumber =
          clientInfoUpdateDto.telephone?.replace(/^(00|\+|0)|\D/g, '') || '';

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

    // Handle phone number cleaning and prefix extraction
    if (clientInfoUpdateDto?.telephone) {
      const countries = this.settingsService.getCountriesIso();
      const cleanNumber = clientInfoUpdateDto.telephone.replace(
        /^(00|\+|0)|\D/g,
        '',
      );
      // Get the current client's country code
      let clientCountryCode = countryCode;
      if (!clientCountryCode) {
        const isoIndex = countries.result.findIndex(
          (country) =>
            country.printableName === client?.country ||
            country.iso === client?.countryIso,
        );
        if (isoIndex !== -1) {
          clientCountryCode = countries.result[isoIndex];
        }
      }
      // Only strip prefix if the number starts with the client's country prefix
      if (
        clientCountryCode &&
        cleanNumber.startsWith(clientCountryCode.phonePrefix)
      ) {
        clientInfoUpdateDto.telephone = cleanNumber.substring(
          clientCountryCode.phonePrefix.length,
        );
      } else {
        // Number doesn't start with prefix, keep as is (already local number)
        clientInfoUpdateDto.telephone = cleanNumber;
      }
      if (!/^\d{7,12}$/.test(clientInfoUpdateDto.telephone)) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: 'Phone number must be between 7 and 12 digits',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      if (client) {
        client.tel = `${
          clientInfoUpdateDto.telephonePrefix ?? client.telephonePrefix
        }${clientInfoUpdateDto.telephone}`;
      }
    }

    // Add telephone prefix validation
    if (clientInfoUpdateDto?.telephonePrefix) {
      if (!countryCode) {
        const countries = this.settingsService.getCountriesIso();
        const isoIndex = countries.result.findIndex(
          (country) => country.printableName === client?.country,
        );
        countryCode = countries.result[isoIndex];
        client.tel = `${
          clientInfoUpdateDto.telephonePrefix ?? client.telephonePrefix
        }${clientInfoUpdateDto.telephone ?? client.telephone}`;
      }

      if (clientInfoUpdateDto.telephonePrefix !== countryCode?.phonePrefix) {
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

    if (!clientInfoUpdateDto.telephonePrefix && countryCode) {
      clientInfoUpdateDto.telephonePrefix = countryCode.phonePrefix;
      client.tel = `${
        clientInfoUpdateDto.telephonePrefix ?? client.telephonePrefix
      }${clientInfoUpdateDto.telephone ?? client.telephone}`;
    }

    let affiliate: NullableType<Partner> = null;
    if (clientInfoUpdateDto.affid) {
      const partner = await this.partnerRepository.findOne({
        where: { id: clientInfoUpdateDto.affid },
      });

      affiliate = partner;
    }

    let userObject = {
      ...client,
      ...clientInfoUpdateDto,
      country: bodyCountry ? bodyCountry : client.country,
      userId: id,
      partner: clientInfoUpdateDto.affid && { id: clientInfoUpdateDto.affid },
      regulation: clientInfoUpdateDto.regulationId && {
        id: clientInfoUpdateDto.regulationId,
      },
      affiliate: affiliate ? affiliate?.name : client.affiliate,
      commissionProfile: { id: clientInfoUpdateDto.commissionProfileId },
    } as Partial<Client>;

    let manager: NullableType<Operator> = null;
    let retentionManager: NullableType<Operator> = null;

    if (clientInfoUpdateDto.salesRepId) {
      const operatorManager = await this.operatorRepository.findOneBy({
        id: clientInfoUpdateDto.salesRepId,
      });

      manager = operatorManager?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: operatorManager.manager_operator_id,
            },
          })
        : null;

      userObject = {
        ...userObject,
        salesManagerId: manager ? manager.id : null,
        salesManager: manager ? manager.full_name : null,
      } as Partial<Client>;
    }

    if (clientInfoUpdateDto.retentionRepId) {
      const operatorManager = await this.operatorRepository.findOneBy({
        id: clientInfoUpdateDto.retentionRepId,
      });

      retentionManager = operatorManager?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: operatorManager.manager_operator_id,
            },
          })
        : null;

      userObject = {
        ...userObject,
        retentionManagerId: retentionManager ? retentionManager.id : null,
        retentionManager: retentionManager ? retentionManager.full_name : null,
      } as Partial<Client>;
    }

    const adjustedFtdAmount = clientInfoUpdateDto?.adjustedFtdAmount;

    let isFtdAdjusted = false;
    if (typeof adjustedFtdAmount === 'number' && !isNaN(adjustedFtdAmount)) {
      userObject.adjustedFtdAmount = adjustedFtdAmount;
      isFtdAdjusted = true;
    }

    let timesOfFTD = client?.timesOfFTD ? client?.timesOfFTD : undefined;
    if (isFtdAdjusted && !timesOfFTD) {
      timesOfFTD = new Date();
      userObject.timesOfFTD = timesOfFTD;
    }

    await this.clientsRepository.save(userObject);

    client = await this.clientsRepository.findOne({
      where: { userId: id },
      relations: {
        regulation: true,
      },
    });

    if (!client) {
      throw new BadRequestException('Client not found');
    }

    if (
      client.userLifeCycle === UserLifeCycle.APPLICANT ||
      client.userLifeCycle === UserLifeCycle.REGISTERED ||
      client.userLifeCycle === UserLifeCycle.CLIENT
    ) {
      await this.leadRepository.update(
        { clientID: `${id}` },
        {
          firstName: client.firstName,
          lastName: client.lastName,
          utmCampaign: client.utmCampaign,
          utmContent: client.utmContent,
          utmMedium: client.utmMedium,
          utmSource: client.utmSource,
          utmTerm: client.utmTerm,
          countryIso: client.countryIso,
          country: client.country,
          salesDeskId: client.salesDeskId,
          salesDesk: client.salesDesk,
          salesRepId: client.salesRepId,
          salesRep: client.salesRep,
          retentionDeskId: client.retentionDeskId,
          retentionDesk: client.retentionDesk,
          retentionRepId: client.retentionRepId,
          retentionRep: client.retentionRep,
          salesStatus: { id: client.internalSalesStatus },
          retentionStatus: { id: client.internalRetentionStatus },
          officeId: client.officeId,
          office: client.office,
          salesManagerId: client.salesManagerId,
          salesManager: client.salesManager,
          retentionManagerId: client.retentionManagerId,
          retentionManager: client.retentionManager,
          affId: affiliate?.uuid,
          affiliate: affiliate?.name,
          type: client.type,
          regulation: { id: client?.regulation?.id },
          regulations: client?.regulations,
          adjustedFtdAmount: userObject?.adjustedFtdAmount || undefined,
          timesOfFTD,
          telephone: client.telephone,
          telephonePrefix: client.telephonePrefix,
          phoneNumber: `${
            clientInfoUpdateDto.telephonePrefix ?? client.telephonePrefix
          }${clientInfoUpdateDto.telephone ?? client.telephone}`,
          speakingLanguage: clientInfoUpdateDto.speakingLanguage,
          salesStatusUpdatedAt:
            clientInfoUpdateDto.internalSalesStatus && new Date(),
          title: client.leadTitle,
          skypeID: client.skypeID,
          dateOfBirth: client.dateOfBirth
            ? new Date(client.dateOfBirth)
            : undefined,
          email: client.email,
        },
      );

      if (
        clientInfoUpdateDto.internalSalesStatus ||
        clientInfoUpdateDto.internalRetentionStatus
      ) {
        if (client.leadId) {
          await this.taskService.updateTasksStatusByLeadId(client.leadId);
        }
      }
    }

    if (
      clientInfoUpdateDto.salesDeskId &&
      clientInfoUpdateDto.salesDeskId !== client.salesDeskId
    ) {
      await this.clientsRepository.query(
        'UPDATE client SET salesRepId = NULL, salesRep = NULL WHERE userId = ' +
          client.userId,
      );
    }

    await this.usersRepository.update(id, {
      firstName: clientInfoUpdateDto.firstName,
      lastName: clientInfoUpdateDto.lastName,
      email: clientInfoUpdateDto.email,
      telephone: clientInfoUpdateDto.telephone,
      telephonePrefix: clientInfoUpdateDto.telephonePrefix,
      tel: `${clientInfoUpdateDto.telephonePrefix ?? client.telephonePrefix}${
        clientInfoUpdateDto.telephone ?? client.telephone
      }`,
      country: bodyCountry,
      countryIso: bodyCountryIso,
      state: clientInfoUpdateDto.state,
      city: clientInfoUpdateDto.city,
      address: clientInfoUpdateDto.addressStreetName,
      dob: clientInfoUpdateDto.dateOfBirth
        ? new Date(clientInfoUpdateDto.dateOfBirth).toISOString()
        : undefined,
      isClient: true,
    });

    if (clientInfoUpdateDto.salesRepId && clientInfoUpdateDto.salesRep) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.clientAssign_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.clientAssign_admin_title,
        },
      });

      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { id: clientInfoUpdateDto.salesRepId } },
        relations: ['operator'],
      });

      const salesManager = operatorUser?.operator?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: operatorUser.operator.manager_operator_id,
            },
          })
        : null;

      const createdBy = await this.usersRepository.findOne({
        where: { id: sessionUser?.id },
        relations: ['operator'],
      });

      let operator;

      if (!createdBy) {
        operator = await this.operatorRepository.findOne({
          where: { full_name: 'System' },
        });
      }

      if (operatorUser?.email) {
        await this.mailService.sendClientAssignmentViaEmail({
          to: operatorUser.email,
          cc: salesManager?.email ?? null,
          data: {
            subject: 'New Client Assigned to you!',
            clientId: client?.userId,
            firstName: client?.firstName,
            lastName: client?.lastName,
            clientEmail: client?.email,
            link,
            rep: operatorUser?.operator?.full_name,
            operatorId: clientInfoUpdateDto.salesRepId,
          },
        });
      }

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'Client Assigned',
          assignTo: operatorUser?.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: client.leadId,
          status: 'NOT STARTED',
          description:
            'Client has been assigned to you with email: ' + client.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: client.leadId,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: client.leadId ? TaskEntityType.LEAD : TaskEntityType.CLIENT,
          entityId: client.leadId
            ? client.leadId.toString()
            : client.userId.toString(),
        } as CreateTaskDto,
        {
          id: createdBy ? createdBy?.id : operatorUser?.id,
        } as User,
      );

      const notificationData = {
        entity_id: user.id.toString(),
        entity_name:
          client?.userLifeCycle == UserLifeCycle.CLIENT
            ? 'client'
            : `applicant`,
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: createdBy
          ? createdBy?.operator.full_name
          : operator?.full_name,
        is_read: false,
        is_deleted: false,
        user_id: { id: operatorUser?.id },
        creator_id: { id: createdBy ? createdBy.operator.id : operator.id },
        admin_description:
          client?.userLifeCycle == UserLifeCycle.CLIENT
            ? `New Client is assigned\n
            Name: ${user?.firstName} ${user?.lastName}\n
            Contact Number: ${client?.telephonePrefix} ${client?.telephone}`
            : `New Applicant is assigned\n
            Name: ${user?.firstName} ${user?.lastName}\n
            Contact Number: ${client?.telephonePrefix} ${client?.telephone}`,
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

    if (clientInfoUpdateDto.retentionRepId) {
      const label = await this.labelRepository.findOne({
        where: {
          description: NotificationMessages.clientAssign_message_admin,
        },
      });

      const labelTitle = await this.labelRepository.findOne({
        where: {
          description: NotificationTitles.clientAssign_admin_title,
        },
      });

      const operatorUser = await this.usersRepository.findOne({
        where: { operator: { id: clientInfoUpdateDto.retentionRepId } },
        relations: ['operator'],
      });

      const retentionManager = operatorUser?.operator?.manager_operator_id
        ? await this.operatorRepository.findOne({
            where: {
              id: operatorUser.operator.manager_operator_id,
            },
          })
        : null;

      const createdBy = await this.usersRepository.findOne({
        where: { id: sessionUser?.id },
        relations: ['operator'],
      });

      let operator;

      if (!createdBy) {
        operator = await this.operatorRepository.findOne({
          where: { full_name: 'System' },
        });
      }

      if (operatorUser?.email) {
        await this.mailService.sendClientAssignmentViaEmail({
          to: operatorUser.email,
          cc: retentionManager?.email ?? null,
          data: {
            subject: 'New Client Assigned to you!',
            clientId: client?.userId,
            firstName: client?.firstName,
            lastName: client?.lastName,
            clientEmail: client?.email,
            link,
            rep: operatorUser?.operator?.full_name,
            operatorId: clientInfoUpdateDto.retentionRepId,
          },
        });
      }

      const currentDate = new Date();

      await this.taskService.create(
        {
          subject: 'Client Assigned',
          assignTo: operatorUser?.operator.id,
          relatedTo: TaskRelatedTo.LEAD,
          relatedToId: client.leadId,
          status: 'NOT STARTED',
          description:
            'Client has been assigned to you with email: ' + client.email,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          contact: client.leadId,
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
          entity: client.leadId ? TaskEntityType.LEAD : TaskEntityType.CLIENT,
          entityId: client.leadId
            ? client.leadId.toString()
            : client.userId.toString(),
        } as CreateTaskDto,
        {
          id: createdBy ? createdBy?.id : operatorUser?.id,
        } as User,
      );

      const notificationData = {
        entity_id: user.id.toString(),
        entity_name:
          client?.userLifeCycle == UserLifeCycle.CLIENT
            ? 'client'
            : `applicant`,
        description_label_id: { id: label?.id },
        title_label_id: { id: labelTitle?.id },
        created_by: createdBy
          ? createdBy?.operator.full_name
          : operator?.full_name,
        is_read: false,
        is_deleted: false,
        user_id: { id: operatorUser?.id },
        creator_id: { id: createdBy ? createdBy?.operator.id : operator.id },
        admin_description:
          client?.userLifeCycle == UserLifeCycle.CLIENT
            ? `New Client is assigned\n
            Name: ${user?.firstName} ${user?.lastName}\n
            Contact Number: ${client?.telephonePrefix} ${client?.telephone}`
            : `New Applicant is assigned\n
            Name: ${user?.firstName} ${user?.lastName}\n
            Contact Number: ${client?.telephonePrefix} ${client?.telephone}`,
        link,
      };

      if (operatorUser) {
        const notification =
          this.notificationRepository.create(notificationData);
        await this.notificationRepository.save(notification);
        // this.socketGateway.sendNotificationToUser(operatorUser?.id, {
        //   ...notification,
        //   title: labelTitle?.description,
        //   description: label?.description,
        // });
      }
    }

    let logPayload = { ...clientInfoUpdateDto };
    let oldData = { ...previousClient };
    if (clientInfoUpdateDto.commissionProfileId) {
      const newCommissionProfile =
        await this.ibCommissionProfileRepository.findOne({
          where: { id: clientInfoUpdateDto.commissionProfileId },
        });

      oldData.commissionProfileName = previousClient?.commissionProfile?.name;
      oldData.commissionProfileId = previousClient?.commissionProfile?.id;
      logPayload.commissionProfileName = newCommissionProfile?.name;
    }

    if (clientInfoUpdateDto.internalSalesStatus) {
      const salesStatus = await this.customStatusRepository.findOne({
        where: { id: clientInfoUpdateDto.internalSalesStatus },
      });
      const previousSalesStatus = await this.customStatusRepository.findOne({
        where: { id: previousClient.customSaleStatus?.id },
      });
      oldData.internalSalesStatusName = previousSalesStatus?.name;
      logPayload.internalSalesStatusName = salesStatus?.name;
    }

    if (clientInfoUpdateDto.internalRetentionStatus) {
      const retentionStatus = await this.customStatusRepository.findOne({
        where: { id: clientInfoUpdateDto.internalRetentionStatus },
      });
      const previousRetentionStatus = await this.customStatusRepository.findOne(
        {
          where: { id: previousClient.customRetentionStatus?.id },
        },
      );
      oldData.internalRetentionStatusName = previousRetentionStatus?.name;
      logPayload.internalRetentionStatusName = retentionStatus?.name;
    }

    if (clientInfoUpdateDto.affid) {
      const partner = await this.partnerRepository.findOne({
        where: { id: clientInfoUpdateDto.affid },
      });
      const previousPartner = await this.partnerRepository.findOne({
        where: { id: previousClient.affid },
      });
      oldData.affIdName = previousPartner?.name;
      logPayload.affIdName = partner?.name;
    }

    if (sessionUser) {
      const session = await this.usersRepository.findOne({
        where: { id: sessionUser.id },
      });

      if (session?.isOperator) {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: logPayload,
          oldData: {
            ...oldData,
            speakingLanguage: oldData.lead.speakingLanguage,
          },
          entityId: user.id,
          entityType: 'User',
          performerId: session.id,
          performerType: 'Operator',
          parentId: client.leadId,
          parentType: 'Lead',
          field: 'Client Info Update',
        });
      } else {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: logPayload,
          oldData: oldData,
          entityId: user.id,
          entityType: 'User',
          performerId: user.id,
          performerType: 'User',
          parentId: client.leadId,
          parentType: 'Lead',
          field: 'Client Info Update',
        });
      }
    }

    await this.cacheManager.del(`get-me-api-${user.id}`);

    return clientInfoUpdateDto;
  }

  async getClientInfo(user: User, id: number): Promise<ClientInfoDTO> {
    // let list;
    // if (user) {
    //   list = await this.clientsRepository.getRoleFilters(
    //     ListNames.CLIENTS,
    //     user.id,
    //     [],
    //   );
    // }
    // if (!list) {
    //   const client = await this.clientsRepository.findOne({
    //     where: { userId: id },
    //     relations: [
    //       'customKycStatus',
    //       'customSaleStatus',
    //       'customRetentionStatus',
    //       'partner',
    //       'regulation',
    //     ],
    //   });
    //   if (!client) {
    //     throw new NotFoundException('Client not found');
    //   }

    //   return ClientInfoDTO.fromEntity(client);
    // }
    // const isAccess = list.value?.find((item) => item === id);

    // if (!isAccess) {
    //   const msg = `You don't have access to view this user`;

    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       error: {
    //         msg,
    //       },
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }
    // const client = await this.clientsRepository.findOne({
    //   where: { userId: id },
    //   relations: [
    //     'customKycStatus',
    //     'customSaleStatus',
    //     'customRetentionStatus',
    //     'partner',
    //     'regulation',
    //   ],
    // });
    const filter = await this.clientsRepository.getAllRolesFilters(
      user.id,
      ListNames.CLIENTS,
    );
    const query: FindOptionsWhere<Client> = { userId: id };
    const OR_QUERY: FindOptionsWhere<Client>[] = [];
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
    const client = await this.clientsRepository.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
      relations: {
        customKycStatus: true,
        customSaleStatus: true,
        customRetentionStatus: true,
        partner: true,
        regulation: true,
        lead: true,
      },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    if (client.languageIso) {
      const nationalityQuestion = await this.questionService.getQuestionByWhere(
        { languageIso: client.languageIso, name: 'nationality' },
      );
      const nationalityAnswer = await this.userAnswerRepository.findOne({
        where: { questionId: nationalityQuestion?.id, userId: client.userId },
      });
      client.nationality = nationalityAnswer?.answerText ?? '';
    }

    return ClientInfoDTO.fromEntity(client);
  }

  async getUserDetails(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    return user
      ? {
          email: user.email,
          telephonePrefix: user.telephonePrefix,
          telephone: user.telephone,
        }
      : null;
  }

  async sendCustomMessage(
    telephonePrefix: string,
    telephone: string,
    message: string,
    subject: string,
  ): Promise<void> {
    const mobile = `+${telephonePrefix}${telephone}`;
    const twilioMessage = {
      subject: subject,
      body: message,
    };
    const i18n = I18nContext.current();

    const sentMessage = await this.twilioService.client.messages.create({
      to: mobile,
      from: '+14356253928',
      ...twilioMessage,
    });

    if (!sentMessage) {
      const message = i18n?.t('errors.auth.sendMessageFailed');
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

  async getStatsSummary(userId: number) {
    const client = await this.clientsRepository.findOne({
      relations: {
        user: true,
        customSaleStatus: true,
        customRetentionStatus: true,
        customKycStatus: true,
      },
      where: { userId },
    });

    if (!client) throw new NotFoundException('Client not found');

    const salesDesk = await this.deskRepository.findOne({
      where: { id: client.salesDeskId },
      select: {
        id: true,
        name: true,
      },
    });

    const salesRep = await this.operatorRepository.findOne({
      where: { id: client.salesRepId },
      select: {
        id: true,
        full_name: true,
      },
    });

    const retentionDesk = await this.deskRepository.findOne({
      where: { id: client.retentionDeskId },
      select: {
        id: true,
        name: true,
      },
    });

    const retentionRep = await this.operatorRepository.findOne({
      where: { id: client.retentionRepId },
      select: {
        id: true,
        full_name: true,
      },
    });

    return client
      ? {
          salesDesk: salesDesk?.name,
          saleRep: salesRep?.full_name,
          salesStatus: client.customSaleStatus.name,
          retentionRep: retentionRep?.full_name,
          retentionDesk: retentionDesk?.name,
          retentionStatus: client.customRetentionStatus.name,
          kycStatusId: client.customKycStatus.id,
          kycStatus: client.customKycStatus.name,
          salesLastAssigned: 'None',
          retentionLastAssigned: 'None',
          kycRep: 'None',
          source: client.user.sc,
          fnsStatus: client.fnsStatus,
          kycWorkflowStatus: client.kycWorkflowStatus,
          kycScore: client.kycScore,
          porVerificationStatus: client.porVerificationStatus,
          idVerificationStatus: client.idVerificationStatus,
          pendingInvestigation: client.pendingInvestigation,
          kycClientType: client.type,
        }
      : null;
  }

  async deleteUser(userId: User, id: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id });
    const i18n = I18nContext.current();

    if (!user) {
      const message = i18n?.t('errors.auth.userNotFound');
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

    const client = await this.clientsRepository.findOneBy({ userId: id });

    if (!client) {
      const message = await i18n?.t('errors.auth.clientNotFound');
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

    let list;
    if (userId) {
      list = await this.clientsRepository.getRoleFilters(
        ListNames.CLIENTS,
        userId.id,
        [],
      );
    }
    if (!list) {
      user.isDeleted = true;
      client.isDeleted = true;

      await this.usersRepository.save(user);
      await this.clientsRepository.save(client);

      return { message: 'User and Client deleted successfully' };
    }
    const isAccess = list.value?.find((item) => item === id);

    if (!isAccess) {
      const msg = `You don't have access to delete this user`;

      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: {
            msg,
          },
        },
        HttpStatus.FORBIDDEN,
      );
    }

    user.isDeleted = true;
    client.isDeleted = true;

    await this.usersRepository.save(user);
    await this.clientsRepository.save(client);

    return { message: 'User and Client deleted successfully' };
  }

  async purgeUser(id: number): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user || user.isDeleted === false) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: {
            msg: user ? 'User is not soft deleted' : 'User not found',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const sessions = await this.sessionRepository.find({
      where: { user: { id } },
    });
    if (sessions.length > 0) {
      await Promise.all(
        sessions.map((session) => this.sessionRepository.remove(session)),
      );
    }

    const client = await this.clientsRepository.findOneBy({ userId: id });
    if (client) {
      await this.clientsRepository.remove(client);
    }

    await this.usersRepository.remove(user);

    return { message: 'User and Client purged successfully' };
  }

  async purgeMultipleUser(id: number[]): Promise<any> {
    const user = await this.usersRepository.find({ where: { id: In(id) } });

    const sessions = await this.sessionRepository.find({
      where: { user: { id: In(id) } },
    });
    if (sessions.length > 0) {
      await Promise.all(
        sessions.map((session) => this.sessionRepository.remove(session)),
      );
    }

    const client = await this.clientsRepository.find({
      where: { userId: In(id) },
    });
    if (client) {
      await this.clientsRepository.remove(client);
    }

    const task = await this.taskRepository.find({ where: { contact: In(id) } });
    if (task.length > 0) {
      await this.taskRepository.remove(task);
    }

    const notification = await this.notificationRepository.find({
      where: { user_id: In(id) },
    });
    if (notification.length > 0) {
      await this.notificationRepository.remove(notification);
    }

    await this.usersRepository.remove(user);

    return { message: 'User and Client purged successfully' };
  }

  async getAllAgreementsByUserId(userId: number): Promise<any> {
    return await this.mailerService.getAgreements({ userId });
  }

  async updateClientAnswers(
    userId: number,
    updateClientAnswersDto: UpdateClientAnswersDto,
    session_user?: number,
  ): Promise<any> {
    const { questionId, answerId, answerText } = updateClientAnswersDto;
    const i18n = I18nContext.current();
    const question = await this.questionService.getQuestionById(questionId);

    if (!question) {
      const message = await i18n?.t('errors.kyc.questionNotFound');
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
    if (
      question.type.toLowerCase() !== 'input' &&
      question.type.toLowerCase() !== 'date'
    ) {
      const matchingAnswer = question.answers.find(
        (answer) => answer.id === answerId,
      );

      if (!matchingAnswer) {
        const message = await i18n?.t('errors.auth.answerNotFound');
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

    const userAnswer = await this.userAnswerRepository.findOne({
      where: { userId, questionId },
    });

    const session_operator = await this.usersRepository.findOne({
      where: { id: session_user },
      relations: ['operator'],
    });
    if (!userAnswer) {
      const message = await i18n?.t('errors.auth.userAnswerNotFound');
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

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updateClientAnswersDto,
      oldData: userAnswer,
      entityId: userId,
      entityType: 'User',
      performerId: session_operator?.operator?.id
        ? session_operator.operator?.id
        : session_user,
      performerType: 'Operator',
      field: 'Details Update',
    });

    if (answerId !== undefined) {
      userAnswer.answerId = answerId;
    }

    if (answerText !== undefined) {
      userAnswer.answerText = answerText;
    }

    this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
      action: 'DetailsUpdated',
      entity_id: userId,
      entity_type: 'User',
      parent_id: userId,
      parent_type: 'User',
      json_object: updateClientAnswersDto,
      performer_id: session_operator?.operator?.id
        ? session_operator.operator?.id
        : session_user,
      performer_type: 'Operator',
      is_from_archive: 0,
      trigger_type: 'Default',
    });

    await this.userAnswerRepository.save(userAnswer);

    return userAnswer;
  }

  async createNotification(notificationData: any): Promise<any> {
    notificationData.entity_id = notificationData.entity_id.toString();
    const notification = this.notificationRepository.create(notificationData);
    // this.socketGateway.sendNotificationToUser(
    //   notificationData.user_id,
    //   notification,
    // );
    return this.notificationRepository.save(notification);
  }

  async createLabel(labelData: Partial<Label>): Promise<Label> {
    const label = this.labelRepository.create(labelData);
    return this.labelRepository.save(label);
  }

  async createLabelTranslation(
    labelTranslationData: Partial<LabelTranslation>,
  ): Promise<LabelTranslation> {
    const labelTranslation =
      this.labelTranslationRepository.create(labelTranslationData);
    return this.labelTranslationRepository.save(labelTranslation);
  }

  async search(dto: AdvanceSearchDto, userId?: number) {
    const { filters, page = 1, limit = 50, sort } = dto;
    if (userId) {
      filters.push({
        name: 'user.id',
        operation: FilterOperation.EQUALS,
        value: [userId],
      });
    }

    return await this.clientsRepository.advanceSearch({
      filters,
      page,
      limit,
      sort,
      all: false,
      select: undefined,
    });
  }

  async updateMessageRead(createWebhookCommunication: any[]): Promise<any> {
    return await this.updateMessagesRead(createWebhookCommunication);
  }

  async updateMessagesRead(createWebhookCommunication: any) {
    for (const item of createWebhookCommunication) {
      if (item.event == 'delivered') {
        const message = await this.communicationRepository.findOne({
          where: { message_id: item['smtp-id'] },
        });

        if (message == null || message == undefined) {
          return 'no message found';
        }
        if (!message.is_delivered) {
          await this.communicationRepository.update(message.id, {
            is_delivered: true,
            status: 'Active',
            sg_message_id: item.sg_message_id,
          });
        }
      }
      if (item.event == 'open') {
        const deliveredMessage = await this.communicationRepository.findOne({
          where: { sg_message_id: item.sg_message_id },
        });

        if (deliveredMessage == null || deliveredMessage == undefined) {
          return 'no message found';
        }
        if (deliveredMessage.is_delivered) {
          await this.communicationRepository.update(deliveredMessage.id, {
            read: true,
            read_at: new Date(),
          });
        }
      }
    }
  }

  async getClientListForDropdown(payload: {
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
    ];
    return await this.clientsRepository.advanceFilters({
      listName: ListNames.CLIENTS,
      userId,
      limit,
      page,
      filters,
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      all,
    });
  }

  async findAll(search: string) {
    let clients;

    if (search === '') {
      // Fetch top 10 clients when search term is empty
      clients = await this.usersRepository.find({
        where: { isOperator: false },
        select: ['id', 'firstName', 'lastName', 'email', 'photo'],
        take: 10, // Limit the result to top 10
      });
    } else {
      // Perform search query when search term is not empty
      clients = await this.usersRepository.find({
        where: [
          { isOperator: false, firstName: Like(`${search}%`) },
          { isOperator: false, lastName: Like(`${search}%`) },
        ],
        select: ['id', 'firstName', 'lastName', 'email', 'photo'],
      });
    }

    const clientPromises = clients.map(async (client) => {
      return {
        id: client.id,
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        photoId: client.photo?.id
          ? await this.filesService.getSignedUrl(client.photo?.id)
          : null,
      };
    });

    return await Promise.all(clientPromises);
  }

  async updateClientPassword(
    id: number,
    updatePasswordDto: UpdateClientPasswordDto,
  ): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }
    user.password = updatePasswordDto.password;
    await this.usersRepository.save(user);

    return { success: true, message: 'Password updated successfully' };
  }

  async getInactiveClients(
    paginationOptions: IPaginationOptions,
    repId: number,
  ): Promise<any> {
    const activeClientsQuery = `
        WITH UserActivity AS (
            SELECT 
                ma.userId,
                'SalesRep' AS RepType,
                md.salesRepId AS RepId,
                salesRep.full_name AS RepName,
                COUNT(md.Time) AS ActivityCount -- Count all activity for this rep
            FROM mt5_deals md
            INNER JOIN mt5_commision_rates mcr ON md.Symbol = mcr.symbol
            INNER JOIN mt5_account ma ON ma.login = md.Login
            INNER JOIN mt5_equity_daily med ON med.loginId = md.[Login]
            LEFT JOIN operator salesRep ON salesRep.id = md.salesRepId
            WHERE md.salesRepId IS NOT NULL
            GROUP BY ma.userId, md.salesRepId, salesRep.full_name
            UNION ALL
            SELECT 
                ma.userId,
                'RetentionRep' AS RepType,
                md.retentionRepId AS RepId,
                retentionRep.full_name AS RepName,
                COUNT(md.Time) AS ActivityCount -- Count all activity for this rep
            FROM mt5_deals md
            INNER JOIN mt5_commision_rates mcr ON md.Symbol = mcr.symbol
            INNER JOIN mt5_account ma ON ma.login = md.Login
            INNER JOIN mt5_equity_daily med ON med.loginId = md.[Login]
            LEFT JOIN operator retentionRep ON retentionRep.id = md.retentionRepId
            WHERE md.retentionRepId IS NOT NULL
            GROUP BY ma.userId, md.retentionRepId, retentionRep.full_name
        ),
        ActiveUsers AS (
            SELECT 
                RepId,
                RepName,
                RepType,
                SUM(CASE WHEN ActivityCount > 0 THEN 1 ELSE 0 END) AS ActiveUsers, -- Count total active users
                STRING_AGG(CAST(userId AS VARCHAR(MAX)), ',') AS ActiveUserIds -- Aggregate userIds as a comma-separated string with VARCHAR(MAX)
            FROM UserActivity
            GROUP BY RepId, RepName, RepType
        ),
        TotalClients AS (
            SELECT 
                'SalesRep' AS RepType,
                c.salesRepId AS RepId,
                salesRep.full_name AS RepName,
                COUNT(*) AS TotalCount,
                STRING_AGG(CAST(c.userId AS VARCHAR(MAX)), ',') AS ClientUserIds -- Aggregate userIds as a comma-separated string with VARCHAR(MAX)
            FROM client c
            LEFT JOIN operator salesRep ON salesRep.id = c.salesRepId
            WHERE c.isActive = 1 AND c.salesRepId IS NOT NULL
            GROUP BY c.salesRepId, salesRep.full_name
            UNION ALL
            SELECT 
                'RetentionRep' AS RepType,
                c.retentionRepId AS RepId,
                retentionRep.full_name AS RepName,
                COUNT(*) AS TotalCount,
                STRING_AGG(CAST(c.userId AS VARCHAR(MAX)), ',') AS ClientUserIds -- Aggregate userIds as a comma-separated string with VARCHAR(MAX)
            FROM client c
            LEFT JOIN operator retentionRep ON retentionRep.id = c.retentionRepId
            WHERE c.isActive = 1 AND c.retentionRepId IS NOT NULL
            GROUP BY c.retentionRepId, retentionRep.full_name
        ),
        InactiveUsers AS (
            SELECT 
                tc.RepId,
                tc.RepName,
                tc.RepType,
                STRING_AGG(CAST(c.userId AS VARCHAR(MAX)), ',') AS InactiveUserIds -- Get user IDs that are in TotalClients but not in ActiveUsers
            FROM client c
            LEFT JOIN TotalClients tc ON c.salesRepId = tc.RepId OR c.retentionRepId = tc.RepId
            LEFT JOIN UserActivity ua ON c.userId = ua.userId -- Join to see if the user has any activity
            WHERE ua.userId IS NULL AND c.isActive = 1 -- Inactive users will have no activity in UserActivity
            GROUP BY tc.RepId, tc.RepName, tc.RepType
        )
        -- Final Query that references the CTEs
        SELECT 
            'All Time' AS ActivityPeriod, -- Single activity period for all-time results
            COALESCE(au.RepId, tc.RepId) AS RepId,
            COALESCE(au.RepName, tc.RepName) AS RepName,
            COALESCE(au.RepType, tc.RepType) AS RepType,
            COALESCE(au.ActiveUsers, 0) AS ActiveUserCount,
            COALESCE(tc.TotalCount, 0) AS TotalCount,
            (CAST(COALESCE(au.ActiveUsers, 0) AS FLOAT) / NULLIF(tc.TotalCount, 0)) * 100 AS ActiveUserPercentage,
            COALESCE(iu.InactiveUserIds, '') AS InactiveUserIds -- Include the aggregated userIds for inactive users
        FROM ActiveUsers au
        FULL JOIN TotalClients tc 
            ON au.RepId = tc.RepId 
            AND au.RepType = tc.RepType
        LEFT JOIN InactiveUsers iu 
            ON tc.RepId = iu.RepId AND tc.RepType = iu.RepType
        WHERE tc.RepId = ${+repId}`;

    const activeClientsResult =
      await this.transactionRepository.query(activeClientsQuery);

    console.log(activeClientsResult);

    if (activeClientsResult.length < 1) {
      return [];
    }

    const ids = activeClientsResult[0].InactiveUserIds.split(',');

    // Extract page and limit from query, and handle the default case for limit
    const page = paginationOptions.page || 1;
    const limit = paginationOptions.limit ? paginationOptions.limit : null; // Parse limit, or set to null if not provided
    const skip = (page - 1) * (limit || 0); // Calculate skip only if limit is provided, otherwise skip is 0

    // Build the query with conditional pagination
    const queryOptions: any = {
      where: {
        id: In(ids),
      },
      skip, // Always include skip, even if it's 0
    };

    // Apply `take` only if `limit` is provided and valid
    if (limit) {
      queryOptions.take = limit;
    }

    // Fetch filtered clients with or without pagination
    const total = await this.usersRepository.count(queryOptions);
    const data = await this.usersRepository.find(queryOptions);
    return { data, total };
  }

  async getTemplateEntity(templateId: number): Promise<any> {
    // Fetch a single template variable associated with the given template ID
    return await this.templateRepository.findOne({
      where: { id: templateId },
      relations: {
        entity: true,
      },
    });
  }

  async getEntity(id: number): Promise<any> {
    // Fetch a single template variable associated with the given template ID
    return await this.entitiyRepository.findOne({
      where: { id },
    });
  }

  async fetchTemplateVariables(
    entityId: number,
    entityType: string,
    entityValue: string,
  ): Promise<Record<string, any>> {
    try {
      const entityExists = await this.dataSource
        .createQueryBuilder()
        .select('1')
        .from(entityType, entityType)
        .where(
          entityType === 'client'
            ? `${entityType}.userId = :entityValue`
            : `${entityType}.id = :entityValue`,
          { entityValue },
        )
        .getRawOne();

      if (!entityExists) {
        throw new NotFoundException(
          `Entity of type ${entityType} with value ${entityValue} does not exist.`,
        );
      }
      const entityVariables = await this.dataSource
        .createQueryBuilder()
        .select('variable.id', 'emailVariableId')
        .addSelect('variable.name', 'variableName')
        .from('email_variable', 'variable')
        .innerJoin('email_entity', 'ee', 'variable.emailEntityId = ee.id')
        .where('variable.emailEntityId = :entityId', { entityId })
        .andWhere('variable.is_external = :isExternal', { isExternal: 0 })
        .getRawMany();
      let queryBuilder = this.dataSource
        .createQueryBuilder()
        .from(entityType, entityType);
      if (entityType === 'client') {
        queryBuilder = queryBuilder.where(`${entityType}.userId = :userId`, {
          userId: entityValue,
        });
      } else {
        queryBuilder = queryBuilder.where(`${entityType}.id = :id`, {
          id: entityValue,
        });
      }
      const joinedRelations = new Set<string>();

      for (const varObj of entityVariables) {
        const parts = varObj.variableName.split('.');
        const table = parts[0]; // Main table
        const lastPart = parts[parts.length - 1]; // Column name

        if (parts.length === 2) {
          queryBuilder.addSelect(
            `${table}.${lastPart}`,
            varObj.variableName.replace(/\./g, '_'),
          );
        } else if (parts.length > 2) {
          let currentTable = table;
          let alias = table;
          for (let i = 1; i < parts.length - 1; i++) {
            const relation = parts[i];
            const joinKey = `${currentTable}.${relation}`;

            if (!joinedRelations.has(joinKey)) {
              joinedRelations.add(joinKey);
              queryBuilder.innerJoin(`${currentTable}.${relation}`, relation);
            }

            currentTable = relation;
            alias = relation;
          }

          queryBuilder.addSelect(
            `${alias}.${lastPart}`,
            varObj.variableName.replace(/\./g, '_'),
          );
        }
      }
      const data = await queryBuilder.getRawOne();
      const emailData: Record<string, any> = {};

      entityVariables.forEach((varObj) => {
        const variableAlias = varObj.variableName.replace(/\./g, '_');
        emailData[varObj.variableName] = data[variableAlias];
      });
      return emailData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async sendDynamicEmail(data: {
    subject: string;
    template: string;
    from: string;
    to: string | string[];
    layoutId: number;
    entityId: number;
    entityType: string;
    entityValue: string;
    operatorId?: number;
    userId?: number;
    regulationId?: number;
    dynamicData?: any;
    cc?: string[];
    bcc?: string[];
  }) {
    const app_name = this.configService.get('app.name', {
      infer: true,
    });
    const {
      subject,
      template,
      from,
      to,
      layoutId,
      dynamicData,
      userId,
      regulationId,
      cc,
      bcc,
    } = data;
    const layoutDetail = await this.layoutRepository.findOne({
      where: { id: layoutId },
    });
    const operatorDetail = await this.usersRepository.findOne({
      where: { id: data?.operatorId },
    });
    const context = {
      title: subject,
      actionTitle: subject,
      app_name,
    };
    for (const [key, value] of Object.entries(dynamicData)) {
      const keys = key.split('.');
      keys.reduce((acc, k, i) => {
        if (i === keys.length - 1) {
          acc[k] = value;
        } else {
          acc[k] = acc[k] || {};
        }
        return acc[k];
      }, context);
    }
    await this.mailerService.sendEmailWithDynamicData({
      from,
      to,
      subject,
      context,
      templateName: template,
      languageIso: layoutDetail?.language || 'EN',
      regulation: layoutDetail?.regulation || 'FSCA',
      regulationId,
      operatorId: operatorDetail?.operator?.id,
      layoutId,
      entityId: data?.entityId,
      entityType: data?.entityType,
      entityValue: data?.entityValue,
      userId,
      cc,
      bcc,
    });
  }

  async getUserListForDropdown(payload: {
    userId: number;
    limit: number;
    all: boolean;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, all, dto } = payload;
    const filters = [
      {
        name: 'userType',
        operation: FilterOperation.EQUALS,
        value: [1],
      },
    ];
    return await this.userRepository.advanceFilters({
      listName: ListNames.USER,
      userId,
      limit,
      page,
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      all,
    });
  }
  async getClient(id: number): Promise<any> {
    const client = await this.clientsRepository.findOneBy({ userId: id });
    if (!client) {
      throw new NotFoundException('client not found');
    }
    return client;
  }

  async generate2FAQRCode(id: number): Promise<any> {
    const url = await this.clientsRepository.findOne({ where: { userId: id } });
    const otpauthUrl = url?.totp_key_url;
    const secretKey = url?.totp_key;
    const QR = await qrcode.toDataURL(otpauthUrl as any);

    return { QR, secretKey };
  }

  async verify2FAToken(id: number, token: string): Promise<any> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });
    if (!client || !client.totp_key) {
      return false;
    }

    // Verify the 2FA token
    const isTokenValid = await speakeasy.totp.verify({
      secret: client.totp_key,
      encoding: 'base32',
      token,
    });

    return isTokenValid;
  }

  async reset2FA(id: number): Promise<void> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    if (client.totp_key === null) {
      return;
    }

    client.totp_key = null;
    await this.clientsRepository.save(client);
  }

  async generate2FASecret(id: number): Promise<any> {
    const client = await this.clientsRepository.findOne({
      where: { userId: id },
    });
    const secret = speakeasy.generateSecret({ name: client?.email });

    const secretKey = secret.otpauth_url;

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    await this.clientsRepository.update(
      { userId: id },
      {
        totp_key_url: secretKey,
        totp_key: secret.base32,
      },
    );

    return secretKey;
  }

  async verify2FATokenByEmail(email: string, token: string): Promise<any> {
    const client = await this.clientsRepository.findOne({
      where: { email: email },
    });
    if (!client || !client.totp_key) {
      return false;
    }

    // Verify the 2FA token
    const isTokenValid = await speakeasy.totp.verify({
      secret: client.totp_key,
      encoding: 'base32',
      token,
    });

    return isTokenValid;
  }

  async updateUser(
    id: User['id'],
    createProfileDto: CreateClientDto,
  ): Promise<User> {
    if (createProfileDto.password) {
      const salt = await bcrypt.genSalt();
      createProfileDto.password = await bcrypt.hash(
        createProfileDto.password,
        salt,
      );
    }
    return await this.usersRepository.save({
      ...createProfileDto,
      id,
      isClient: true,
      isTicketUser: false,
    });
  }

  async getSystemUser() {
    const systemOperator = await this.userRepository.findOne({
      where: { operator: { full_name: 'System' } },
      relations: { operator: true },
    });

    if (!systemOperator) {
      throw new BadRequestException('System operator not found');
    }

    return systemOperator?.id;
  }
}
