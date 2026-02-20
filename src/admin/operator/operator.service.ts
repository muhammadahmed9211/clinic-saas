import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateOfficeDTO,
  DeskDTO,
  OperatorDTO,
  OperatorData,
  UpdateDeskDTO,
  UpdateOfficeDTO,
} from './dto/create-operator.dto';
import {
  OperatorChangePasswordDto,
  UpdateOperatorDTO,
} from './dto/update-operator.dto';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import * as speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { I18nContext } from 'nestjs-i18n';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { DeskType } from '../custom-dropdown/custom-dropdown/entities/desk_type.entity';
import { CustomStatus } from '../client/entities/custom_status.entity';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { OperatorDeskRel } from '../custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { OperatorRepository } from './repositories/operator.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
  GenerateOperatorLinkDto,
  UpdateGeneratedOperatorDto,
} from './dto/generate-operator-link.dto';
import { operator_links } from './entities/operators-links.entity';
import { ConfigService } from '@nestjs/config';
import { CreateOperatorLinkDto } from './dto/create-operator-link.dto';
import crypto from 'crypto';
import { User } from 'src/users/entities/user.entity';
import { FilesService } from 'src/files/files.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { SessionService } from 'src/session/session.service';
import { Session } from 'src/session/entities/session.entity';
import { JwtService } from '@nestjs/jwt';
import ms from 'ms';
import { RoleService } from 'src/roles/role.service';
import { operator_targets } from './entities/operator_targets.entity';
import {
  CreateOperatorTargetDto,
  UpdateOperatorTargetDto,
} from './dto/operator-target.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { entityType, performerType } from '../active-log/active-log.type';
import { Lead } from '../leads/entities/lead.entity';
import { Client } from 'src/users/entities/client.entity';
import { DeleteOperatorDTO } from './dto/delete-operator.dto';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { PartnerService } from '../partner/partner.service';
import { AdminTask } from '../task/entities/task.entity';
import { Meetings } from '../leads/meetings/entities/meetings.entity';
import { Status } from '../leads/meetings/dto/meetings.dto';
import { CallLog } from '../call-logs/entities/call-log.entity';
import { LeadsCallLog } from '../leads-call-logs/entities/leads-call-log.entity';
import { Opportunity } from '../leads/opportunity/entities/opportunity.entity';
import { notes } from '../kyc/entities/kycNotes.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { PermissionEndpointService } from 'src/permission_endpoint/permission_endpoint.service';

@Injectable()
export class OperatorService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private fileService: FilesService,
    private readonly operatorRepository: OperatorRepository,
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
    @InjectRepository(DeskType)
    private readonly deskTypeRepository: Repository<DeskType>,
    @InjectRepository(CustomStatus)
    private readonly customStatusRepository: Repository<CustomStatus>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    // operator_links
    @InjectRepository(OperatorDeskRel)
    private readonly deskOperatorRepository: Repository<OperatorDeskRel>,
    @InjectRepository(operator_links)
    private readonly operatorLinksRepository: Repository<operator_links>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(operator_targets)
    private readonly operatorTargetsRepository: Repository<operator_targets>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(AdminTask)
    private readonly adminTaskRepository: Repository<AdminTask>,
    @InjectRepository(Meetings)
    private readonly meetingsRepository: Repository<Meetings>,
    @InjectRepository(LeadsCallLog)
    private readonly leadsCallLogRepository: Repository<LeadsCallLog>,
    @InjectRepository(Opportunity)
    private readonly opportunityRepository: Repository<Opportunity>,
    @InjectRepository(notes)
    private readonly notesRepository: Repository<notes>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly partnerService: PartnerService,
    private readonly configService: ConfigService,
    private sessionService: SessionService,
    private jwtService: JwtService,
    private readonly roleService: RoleService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly permissionEndpointService:PermissionEndpointService
  ) {}

  private async processBatch<T>(
    items: T[],
    updateFn: (batch: T[]) => Promise<void>,
  ) {
    const BATCH_SIZE = 50;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE);
      await updateFn(batch);
    }
  }

  async getOperatorsList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const operators = await this.operatorRepository.advanceFilters({
      listName: ListNames.OPERATOR,
      userId,
      limit,
      page,
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      relations: ['role', 'photo', 'operator_rel' , 'operator_rel.desk'],
    });
    const { result, ...rest } = operators;
    const data = result.map((operator) => {
      return this.transformOperatorData(operator);
    });
    return {
      result: data,
      ...rest,
    };
  }

  private transformOperatorData(operator: any): OperatorData {
    let desk = ''
    if(Array.isArray(operator?.operator_rel)){
      operator.operator_rel.forEach(opr => {
        if(opr?.desk?.name){
          desk += `${desk ? ',' : ''}${opr?.desk?.name}`
        };
    });
    }
  
    return {
      id: operator.id,
      email: operator.email,
      full_name: operator.full_name,
      first_name: operator.first_name,
      last_name: operator.last_name,
      is_active: operator.is_active,
      role: operator.role,
      system: operator.system,
      password: operator.password,
      telephone: operator.telephone,
      manager_operator_id: operator.manager_operator_id,
      bypass_ip_whitelist: operator.bypass_ip_whitelist === 1,
      whitelist_ips: operator.whitelist_ips,
      is_blocked: operator.is_blocked,
      is_test: operator.is_test,
      imap_host: operator.imap_host,
      imap_port: operator.imap_port,
      imap_password: operator.imap_password,
      imap_protocol: operator.imap_protocol,
      imap_ssl_enabled: operator.imap_ssl_enabled === 1,
      imap_ssl_protocol: operator.imap_ssl_protocol,
      imap_folders: operator.imap_folders,
      smtp_host: operator.smtp_host,
      smtp_port: operator.smtp_port,
      smtp_password: operator.smtp_password,
      smtp_protocol: operator.smtp_protocol,
      smtp_transport_strategy: operator.smtp_transport_strategy,
      desk_id: operator.desk_id,
      operator_rel: {
        desk:{
          name:desk
        }
      },
      image_url: operator.image_url,
      uuid: operator.uuid,
      photo: operator.photo,
      isPartner: operator.isPartner,
      partnerId: operator.partnerId,
      autoMonthlyTarget : operator.autoMonthlyTarget,
      speakingLanguage: JSON.parse(operator.speakingLanguage),
      autoLeadAssign: operator.autoLeadAssign,
      weeklyCount: operator.weeklyCount,
      autoClientAssign:operator.autoClientAssign,
      retentionWeeklyCount:operator.retentionWeeklyCount,
      assignmentPriority: operator.assignmentPriority,
      availabilityStartTime:operator.availabilityStartTime,
      availabilityEndTime:operator.availabilityEndTime,
      leadReassignWeeklyCount: operator.leadReassignWeeklyCount,
      autoLeadReassign: operator.autoLeadReassign,
      createdAt:operator.createdAt,
      updatedAt:operator.updatedAt
    };
  }

  async getOperatorsDropdownList(user: User, search?: string): Promise<any> {
    // return await this.operatorRepository.find({
    //   select: ['id', 'full_name', 'image_url'],
    // });
    // return this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.photo', 'file') // Fetch all columns of the file entity
    //   .select([
    //     'user.operator.id AS id',
    //     'user.photo AS image_url',
    //     "CONCAT(user.firstName, ' ', user.lastName) AS full_name",
    //   ])
    //   .where('user.isOperator = :isOperator AND user.operatorId IS NOT null', {
    //     isOperator: true,
    //   })
    //   .orderBy('full_name', 'ASC')
    //   .getRawMany();

    const findUser = await this.userRepository.findOne({
      where: { id: user.id, operator: { is_active: true } },
    });

    if (!findUser?.role) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Role not found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const roleFilter = await this.roleService.roleFilterData(findUser.role.id);
    console.log(roleFilter);
    // const levelFilter = roleFilter.find(
    //   (filter) => filter.filterName === 'Level',
    // );

    let queryBuilder = this.operatorRepository
      .createQueryBuilder('operator')
      .leftJoinAndSelect('operator.photo', 'photo')
      .leftJoin('user', 'user', 'user.operatorId = operator.id')
      .where('user.operatorId IS NOT NULL AND user.isOperator = :isOperator', {
        isOperator: true,
      })
      .select([
        'operator.id',
        'operator.full_name',
        'operator.image_url',
        'photo',
      ]);

    if (search) {
      queryBuilder = queryBuilder.andWhere('operator.full_name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (roleFilter.level && roleFilter.level.ids.length > 0) {
      const levelIds = roleFilter.level.ids;
      if (levelIds.includes(3) || levelIds.includes(4)) {
        queryBuilder = queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('operator.id = :operatorId', {
              operatorId: findUser.operator.id,
            });
            qb.orWhere('operator.manager_operator_id = :managerId', {
              managerId: findUser.operator.id,
            });
          }),
        );
      }
    }
    // if (levelFilter && levelFilter.data.length > 0) {
    //   const level = levelFilter.data[0].name;
    //   if (level === 'self') {
    //     queryBuilder = queryBuilder.andWhere('operator.id = :operatorId', {
    //       operatorId: findUser.operator.id,
    //     });
    //   } else if (level === 'team') {
    //     queryBuilder = queryBuilder.andWhere(
    //       'operator.manager_operator_id = :managerId',
    //       {
    //         managerId: findUser.operator.id,
    //       },
    //     );
    //   }
    // }

    return queryBuilder.orderBy('full_name', 'ASC').getMany();

    // return this.operatorRepository
    //   .createQueryBuilder('operator')
    //   .leftJoinAndSelect('operator.photo', 'photo')
    //   .leftJoin('user', 'user', 'user.operatorId = operator.id')
    //   .where('user.operatorId IS NOT NULL AND user.isOperator = :isOperator', {
    //     isOperator: true,
    //   })
    //   .select([
    //     'operator.id',
    //     'operator.full_name',
    //     'operator.image_url',
    //     'photo',
    //   ])
    //   .getMany(); // Fetch the results
  }

  generateUuid() {
    const buffer = crypto.randomBytes(16);
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    const uuid = `${buffer.toString('hex', 0, 4)}-${buffer.toString(
      'hex',
      4,
      6,
    )}-${buffer.toString('hex', 6, 8)}-${buffer.toString(
      'hex',
      8,
      10,
    )}-${buffer.toString('hex', 10, 16)}`;
    return uuid;
  }

  async createOperator(
    operatorDTO: OperatorDTO,
    userJwtPayload: JwtPayloadType,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const existUser = await this.userRepository.findOne({
      where: { email: operatorDTO.email },
    });

    if (existUser) {
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

    const existOperator = await this.operatorRepository.findOne({
      where: { email: operatorDTO.email },
    });

    if (existOperator) {
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

    const uuid = this.generateUuid();
    const data = await this.operatorRepository.save(
      await this.operatorRepository.create({
        ...operatorDTO,
        full_name: `${operatorDTO.first_name} ${operatorDTO.last_name}`,
        desk_id: `[${operatorDTO.desk_id}]`,
        role: { id: operatorDTO.role },
        uuid,
        speakingLanguage: JSON.stringify(operatorDTO.speakingLanguage),
      }),
    );

    const response = {
      email: data.email,
      full_name: data.full_name,
      first_name: data.first_name,
      last_name: data.last_name,
      is_active: data.is_active,
      role: data.role,
      system: data.system,
      password: data.password,
      telephone: data.telephone,
      manager_operator_id: data.manager_operator_id,
      bypass_ip_whitelist: data.bypass_ip_whitelist,
      whitelist_ips: data.whitelist_ips,
      is_blocked: data.is_blocked,
      is_test: data.is_test,
      imap_host: data.imap_host,
      imap_port: data.imap_port,
      imap_password: data.imap_password,
      imap_protocol: data.imap_protocol,
      imap_ssl_enabled: data.imap_ssl_enabled,
      imap_ssl_protocol: data.imap_ssl_protocol,
      imap_folders: data.imap_folders,
      smtp_host: data.smtp_host,
      smtp_port: data.smtp_port,
      smtp_password: data.smtp_password,
      smtp_protocol: data.smtp_protocol,
      smtp_transport_strategy: data.smtp_transport_strategy,
      desk_id: data.desk_id,
      speakingLanguage: data.speakingLanguage,
      // uuid: data.uuid,
    };
    await this.generate2FASecret(data.id);
    if (data.desk_id) {
      // const deskOperator = this.deskOperatorRepository.create({
      //   desk: { id: operatorDTO.desk_id },
      //   operator: { id: Number(data.id) },
      // });
      // await this.deskOperatorRepository.save(deskOperator);
      await this.deskOperatorRepository.delete({ operator: { id: data.id } });
      const desk = operatorDTO.desk_id.map((deskId) => ({
        desk: {
          id: deskId,
        },
        operator: {
          id: data.id,
        },
      }));
      await this.deskOperatorRepository.save(desk);
    }
    const responseWithUuid = {
      ...response,
      uuid,
    };

    await this.userRepository.save(
      await this.userRepository.create({
        firstName: operatorDTO.first_name,
        lastName: operatorDTO.last_name,
        email: operatorDTO.email,
        password: operatorDTO.password,
        provider: 'email',
        role: { id: operatorDTO.role },
        operator: { id: data.id },
        status: { id: 1 },
        isOperator: true,
      }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: data.id,
      entityType: 'Operator',
      performerId: userJwtPayload.id,
      performerType: 'Operator',
      field: 'Operator Create',
    });

    return this.transformOperatorData(responseWithUuid);
  }

  async updateOperator(
    userJwtPayload: JwtPayloadType,
    id: number,
    operatorDTO: UpdateOperatorDTO,
  ): Promise<any> {
    const operator = await this.operatorRepository.findOne({ where: { id } });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }


    const isLeadCountSent = typeof  operatorDTO.weeklyCount === 'number';
    const isClientCountSent = typeof  operatorDTO.retentionWeeklyCount === 'number';
    // const isAutoLeadAssignmentSent = typeof operatorDTO.autoLeadAssign === 'boolean';
    // const isAutoClientAssignmentSent = typeof operatorDTO.autoClientAssign === 'boolean';
    const isAssignmentPrioritySent = typeof operatorDTO.assignmentPriority === 'number';
    const isAvailabilityStartTimeSent = operatorDTO.availabilityStartTime;
    const isAvailabilityEndTimeSent = operatorDTO.availabilityEndTime;

    if(isLeadCountSent || isClientCountSent || isAssignmentPrioritySent || isAvailabilityStartTimeSent || isAvailabilityEndTimeSent){      
      await this.permissionEndpointService.isPermissionAssignedToUser(userJwtPayload.id , 'CAN_UPDATE_OPERATOR_WEEKLY_COUNTS')
    };

    const isAutoLeadAssignmentDisabledToEnabled = operator.autoLeadAssign ===  false && operatorDTO.autoLeadAssign === true;
    const isAutoClientAssignmentDisabledToEnabled = operator.autoClientAssign ===  false && operatorDTO.autoClientAssign === true;

    if(isAutoLeadAssignmentDisabledToEnabled && !isLeadCountSent){
      const highestWeeklyCountOperator = await this.operatorRepository.find({
        order:{
          weeklyCount:"DESC"
        },
        take:1
      });
      const highestWeeklyCount = highestWeeklyCountOperator[0];
      if(highestWeeklyCount && highestWeeklyCount.weeklyCount){
        operatorDTO.weeklyCount = highestWeeklyCount?.weeklyCount;
      }
    }

    if(isAutoClientAssignmentDisabledToEnabled && !isClientCountSent){
      const highestWeeklyCountOperator = await this.operatorRepository.find({
        order:{
          retentionWeeklyCount:"DESC"
        },
        take:1
      });
      const highestWeeklyCount = highestWeeklyCountOperator[0];

      if(highestWeeklyCount && highestWeeklyCount.retentionWeeklyCount){
        operatorDTO.retentionWeeklyCount = highestWeeklyCount?.retentionWeeklyCount;
      }
    }


    // Update the operator object with the new values from operatorDTO
    // const updatedOperator = { ...operator, ...operatorDTO };

    // Save the updated operator to the database
    const data = await this.operatorRepository.update(id, {
      ...operatorDTO,
      full_name:
        operatorDTO.first_name && operatorDTO.last_name
          ? `${operatorDTO.first_name} ${operatorDTO.last_name}`
          : `${operator.first_name} ${operator.last_name}`,
      desk_id: JSON.stringify(operatorDTO.desk_id),
      speakingLanguage: JSON.stringify(operatorDTO.speakingLanguage),
      ...(operatorDTO?.role
        ? {
            role: {id:operatorDTO.role},
          }
        : { role: undefined }),
    });

    if (operatorDTO.desk_id) {
      await this.deskOperatorRepository.delete({ operator: { id } });
      const desk = operatorDTO.desk_id.map((deskId) => ({
        desk: {
          id: deskId,
        },
        operator: {
          id,
        },
      }));
      await this.deskOperatorRepository.save(desk);
    }

    await this.userRepository.update(
      { operator: { id } },
      {
        firstName: operatorDTO.first_name,
        lastName: operatorDTO.last_name,
        email: operatorDTO.email,
        password: operatorDTO.password,
        ...(operatorDTO?.role
          ? {
              role: {id:operatorDTO.role},
            }
          : { role: undefined }),
        isOperator: true,
      },
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: operatorDTO,
      oldData: operator,
      entityId: operator.id,
      entityType: 'Operator',
      performerId: userJwtPayload.id,
      performerType: 'Operator',
      field: 'Details Update',
    });

    const user = await this.userRepository.findOne({
      where: { operator: { id } },
    });

    await this.cacheManager.del(`get-me-api-${user?.id}`);

    return data;
  }

  async getOperator(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const operator = await this.operatorRepository.findOneBy({ id });
    if (operator && operator.photo && operator.photo.id) {
      const url = await this.fileService.getSignedUrl(operator.photo.id);
      operator.photo = {
        ...(operator.photo as any),
        url: url,
      };
    }
    if (!operator) {
      const message = await i18n?.t('errors.operator.notFound');
      throw new NotFoundException(message);
    }

    return this.transformOperatorData(operator);
  }

  async getOperatorWithoutTransform(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const operator = await this.operatorRepository.findOneBy({ id });
    if (!operator) {
      const message = await i18n?.t('errors.operator.notFound');
      throw new NotFoundException(message);
    }
    return operator;
  }

  async deleteOperator(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const operator = await this.operatorRepository.findOne({ where: { id } });

    if (!operator) {
      const message = await i18n?.t('errors.operator.notFound');
      throw new NotFoundException(message);
    }

    await this.operatorRepository.softDelete(id);

    const isSuccess = await i18n?.t('success.operator.deleted');
    return { message: isSuccess };
  }

  async isDeleteOperator(
    id: number,
    data: DeleteOperatorDTO,
    user: User,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const currentDate = new Date();

    const [sessionUser, userOperator] = await Promise.all([
      this.userRepository.findOne({
        where: { id: user.id },
      }),
      this.userRepository.findOne({
        where: { operator: { id }, isOperator: true },
        relations: { operator: true },
      }),
    ]);

    if (!userOperator) {
      const message = await i18n?.t('errors.operator.notFound');
      throw new NotFoundException(message);
    }

    let assignee: Operator | null = null;
    const assigneeId =
      data.assigneeId || userOperator.operator.manager_operator_id;

    if (!assigneeId) {
      throw new NotFoundException('No valid assignee or manager found');
    }

    assignee = await this.operatorRepository.findOne({
      where: {
        id: assigneeId,
        is_active: true,
        is_deleted: false,
      },
      select: ['id', 'full_name', 'email', 'manager_operator_id', 'partnerId'],
    });

    if (!assignee) {
      throw new NotFoundException(
        data.assigneeId ? 'Assignee not found' : 'Manager not found',
      );
    }

    let managerInfo: Operator | null = null;
    if (assignee.manager_operator_id) {
      managerInfo = await this.operatorRepository.findOne({
        where: {
          id: assignee.manager_operator_id,
          is_active: true,
          is_deleted: false,
        },
        select: ['id', 'full_name', 'email'],
      });
    }

    const [leads, clients] = await Promise.all([
      this.leadRepository.find({
        where: { salesRepId: id },
      }),
      this.clientRepository.find({
        where: { salesRepId: id },
      }),
    ]);

    if (leads.length > 0) {
      await this.processBatch(leads, async (batchLeads) => {
        const updatedLeads = batchLeads.map((lead) => {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: {
              salesRepId: assignee?.id,
              salesRep: assignee?.full_name,
            },
            oldData: {
              salesRepId: userOperator.operator.id,
              salesRep: userOperator.operator.full_name,
            },
            entityId: lead.id,
            entityType: 'Lead',
            performerId: user.id,
            performerType: 'Operator',
            field: 'Operator Delete Sales Rep Update',
          });
          return {
            id: lead.id,
            salesRepId: assignee?.id,
            salesRep: assignee?.full_name,
            salesManagerId: managerInfo?.id || null,
            salesManager: managerInfo?.full_name || null,
          } as Partial<Lead>;
        });

        await this.leadRepository.save(updatedLeads);
      });
    }

    if (clients.length > 0) {
      await this.processBatch(clients, async (batchClients) => {
        const updatedClients = batchClients.map((client) => {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: {
              salesRepId: assignee?.id,
              salesRep: assignee?.full_name,
            },
            oldData: {
              salesRepId: userOperator.operator.id,
              salesRep: userOperator.operator.full_name,
            },
            entityId: client.userId,
            entityType: 'User',
            performerId: user.id,
            performerType: 'Operator',
            field: 'Operator Delete Sales Rep Update',
          });
          return {
            userId: client.userId,
            salesRepId: assignee?.id,
            salesRep: assignee?.full_name,
            salesManagerId: managerInfo?.id || null,
            salesManager: managerInfo?.full_name || null,
          } as Partial<Client>;
        });

        await this.clientRepository.save(updatedClients);
      });
    }

    const partnerToProcess =
      userOperator.partnerId || userOperator.operator.partnerId;

    if (partnerToProcess) {
      let partner: Partner;
      if (assignee.partnerId) {
        partner = await this.partnerService.getSinglePartner(
          assignee.partnerId,
        );
      } else {
        partner = await this.partnerService.getPartnerByName('Default');
      }

      const [partnerLeads, partnerClients] = await Promise.all([
        this.leadRepository.find({
          where: { salesPartner: { id: partnerToProcess } },
          relations: ['salesPartner'],
        }),
        this.clientRepository.find({
          where: { affid: partnerToProcess },
        }),
      ]);

      if (partnerLeads.length > 0) {
        await this.processBatch(partnerLeads, async (batchLeads) => {
          const updatedLeads = batchLeads.map((lead) => {
            this.eventEmitter.emit(EventTypes.USER_LOG, {
              newData: {
                salesPartner: partner.id,
                affiliate: partner.name,
                affId: partner.uuid,
              },
              oldData: {
                salesPartner: lead.salesPartner.id,
                affiliate: lead.affiliate,
                affId: lead.affId,
              },
              entityId: lead.id,
              entityType: 'Lead',
              performerId: user.id,
              performerType: 'Operator',
              field: 'Operator Partner Delete',
            });
            return {
              id: lead.id,
              salesPartner: { id: partner.id },
              affiliate: partner.name,
              affId: partner.uuid,
            } as Partial<Lead>;
          });

          await this.leadRepository.save(updatedLeads);
        });
      }

      if (partnerClients.length > 0) {
        await this.processBatch(partnerClients, async (batchClients) => {
          const updatedClients = batchClients.map((client) => {
            this.eventEmitter.emit(EventTypes.USER_LOG, {
              newData: {
                affid: partner.id,
              },
              oldData: {
                affid: client.affid,
              },
              entityId: client.userId,
              entityType: 'User',
              performerId: user.id,
              performerType: 'Operator',
              field: 'Operator Partner Delete',
            });
            return {
              userId: client.userId,
              affid: partner.id,
            } as Partial<Client>;
          });

          await this.clientRepository.save(updatedClients);
        });
      }
    }

    await Promise.all([
      this.adminTaskRepository.update(
        {
          assignTo: { id: userOperator.id },
          isCompleted: false,
          status: 'NOT STARTED',
        },
        {
          deletedAt: currentDate,
          status: 'CANCELED',
          isCompleted: true,
        },
      ),

      this.meetingsRepository.update(
        {
          host: { id: userOperator.operator.id },
          status: Status.SCHEDULED,
        },
        {
          status: Status.CANCEL,
          deletedAt: currentDate,
        },
      ),

      this.leadsCallLogRepository.update(
        {
          callOwnerId: userOperator.id,
        },
        {
          outgoingCallStatus: 'completed',
          deletedAt: currentDate,
        },
      ),

      this.opportunityRepository.update(
        {
          dealOwner: { id },
        },
        {
          deleted_at: currentDate,
        },
      ),

      this.notesRepository.update(
        { created_by: { id: userOperator.id } },
        { deleted_at: currentDate },
      ),
    ]);

    const result = await this.operatorRepository.save({
      id,
      is_active: false,
      is_deleted: true,
      deleted_at: currentDate,
    });

    await this.userRepository.save({
      id: userOperator.id,
      isActive: false,
      isDeleted: true,
      deletedAt: currentDate,
    });

    if (userOperator.operator.partnerId) {
      await Promise.all([
        this.partnerService.deletePartner(userOperator.operator.partnerId),
        this.partnerService.deletePartnerLinks(userOperator.operator.partnerId),
        this.partnerService.deletePartnerTradingGroup(
          userOperator.operator.partnerId,
        ),
      ]);
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        is_deleted: result.is_deleted,
        deleted_at: currentDate.toString(),
        deleted_by: `${sessionUser?.firstName} ${sessionUser?.lastName}`,
      },
      oldData: {},
      entityId: userOperator.operator.id,
      entityType: 'Operator',
      performerId: user.id,
      performerType: 'Operator',
      field: 'Operator Delete',
    });

    const isSuccess = await i18n?.t('success.operator.inActive');
    return { message: isSuccess };
  }

  async generate2FASecret(id: number): Promise<any> {
    const operator = await this.operatorRepository.findOne({ where: { id } });
    const secret = speakeasy.generateSecret({ name: operator?.email });

    const secretKey = secret.otpauth_url;

    if (!operator) {
      throw new NotFoundException('Operator not found');
    }
    await this.operatorRepository.update(id, {
      totp_key_url: secretKey,
      totp_key: secret.base32,
    });

    return secretKey;
  }

  async generate2FAQRCode(id: number): Promise<any> {
    const url = await this.operatorRepository.findOne({ where: { id } });
    const otpauthUrl = url?.totp_key_url;
    const QR = await qrcode.toDataURL(otpauthUrl as any);

    return QR;
  }

  async verify2FAToken(id: number, token: string): Promise<any> {
    const operator = await this.operatorRepository.findOne({ where: { id } });
    if (!operator || !operator.totp_key) {
      return false;
    }

    // Verify the 2FA token
    const isTokenValid = await speakeasy.totp.verify({
      secret: operator.totp_key,
      encoding: 'base32',
      token,
    });

    if (!isTokenValid) {
      return false;
    }

    // Get the user associated with this operator
    const user = await this.userRepository.findOne({
      where: { operator: { id: operator.id } },
      relations: ['role', 'operator'],
    });

    if (!user) {
      return false;
    }

    // Get or create a session for the user
    const session = await this.sessionService.create({
      user,
    });

    // Generate new JWT token with is2FAVerified set to true
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const payload: any = {
      id: user.id,
      role: user.role,
      languageIso: user.languageIso,
      sessionId: session.id,
      email: user.email,
      is2FAVerified: true,
      operator: {
        id: operator.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        is2FAVerified: true,
        isFirstLogin: operator.isFirstLogin || false,
      },
    };

    const [newToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        payload,
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: session.id,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      isValid: true,
      token: newToken,
      refreshToken,
      tokenExpires,
    };
  }

  async reset2FA(id: number): Promise<void> {
    const operator = await this.operatorRepository.findOne({ where: { id } });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    if (operator.totp_key === null) {
      return;
    }

    operator.totp_key = null;
    await this.operatorRepository.save(operator);
  }

  async changePassword(
    id: number,
    userPasswords: OperatorChangePasswordDto,
    userJwtPayload: JwtPayloadType,
  ): Promise<void> {
    const operatorId = id;
    const userId = userJwtPayload.id;
    const i18n = I18nContext.current();

    const user = await this.operatorRepository.findOne({
      where: { id: operatorId },
      relations: ['user'],
    });

    if (user?.role?.id === RoleEnum.super_admin) {
      const message = await i18n?.t('errors.operator.unableToUpdateAdminPass');
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

    if (!user) {
      const message = await i18n?.t('errors.auth.userNotFound');
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

    user.password = userPasswords.new_password;
    await user.save();
    await this.userRepository.update(
      { email: user.email },
      { password: user.password },
    );
    await this.operatorRepository.update(user.id, {
      isFirstLogin: false,
    });

    if (user.user?.id && !user.isFirstLogin) {
      await this.sessionRepository.softDelete({ user: { id: user.user.id } });
      await this.cacheManager.del(`get-me-api-${user.user.id}`);
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: user.id,
      entityType: 'Operator',
      performerId: userId,
      performerType: 'Operator',
      field: 'Password Update',
    });
  }

  async createDesk(user: User, deskDTO: DeskDTO): Promise<any> {
    let payload = {
      ...deskDTO,
      manager : {id : deskDTO.manager},
      coordinator : {id : deskDTO.coordinator},
    }
    const desk = this.deskRepository.create(payload);
    const saved = await this.deskRepository.save(desk);
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: saved,
      oldData: null,
      entityId: saved?.id,
      entityType: entityType.DESK,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Desk Created',
    });
    return saved
  }

  async getDesk(id: number): Promise<any> {
    const desk = await this.deskRepository.findOne({ where: { id } , relations : ['manager' , 'coordinator']});
    if (!desk) {
      throw new NotFoundException('Desk not found');
    }
    const { office_id, type, system } = desk;
    let office, customSystem, customType;

    if (office_id) {
      office = await this.officeRepository.findOne({
        where: { id: office_id },
      });
    }
    if (system) {
      customSystem = await this.customStatusRepository.findOne({
        where: { id: system },
      });
    }
    if (type || type == 0) {
      customType = await this.deskTypeRepository.findOne({
        where: { id: type },
      });
    }
    return {
      id: Number(desk.id),
      name: desk.name,
      type: customType ? customType.name : null,
      daily_goal: Number(desk.daily_goal),
      monthly_goal: Number(desk.monthly_goal),
      weekly_goal: Number(desk.weekly_goal),
      office: office ? office.name : null,
      system: customSystem ? customSystem.name : null,
      is_active: desk.is_active,
      coordinator :desk.coordinator ? {
        full_name : desk?.coordinator?.full_name,
        email : desk?.coordinator?.email,
        id : Number(desk?.coordinator?.id),
      } : null,
      manager : desk?.manager ? {
        full_name : desk?.manager?.full_name,
        email : desk?.manager?.email,
        id : Number(desk?.manager?.id),
      } : null,
    };
  }

  async updateDesk(user: User, id: number, deskDTO: UpdateDeskDTO): Promise<any> {
    const desk = await this.deskRepository.findOne({ where: { id } });
    if (!desk) {
      throw new NotFoundException('Desk not found');
    }
    if ('type' in deskDTO) {
      throw new BadRequestException('Updating the desk type is not allowed');
    }

    let payload = {
      ...deskDTO,
      manager : {id : deskDTO.manager},
      coordinator : {id : deskDTO.coordinator},
    }
    await this.deskRepository.update(id, payload);
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deskDTO,
      oldData: desk,
      entityId: desk?.id,
      entityType: entityType.DESK,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Desk Updated',
    });
    return { message: 'Desk updated successfully' };
  }

  async deleteDesk(user: User, id: number): Promise<any> {
    const desk = await this.deskRepository.findOne({ where: { id } });
    if (!desk) {
      throw new NotFoundException('Desk not found');
    }
    const deleted = await this.deskRepository.softDelete(id);
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deleted,
      oldData: desk,
      entityId: desk?.id,
      entityType: entityType.DESK,
      performerId: user?.id,
      performerType: performerType.OPERATOR,
      field: 'Desk Deleted',
    });
    return { message: 'Desk deleted successfully' };
  }

  async getAllDesks(): Promise<any[]> {
    const desks = await this.deskRepository.find({relations : ['manager', 'coordinator']});
    const deskDTOs = await Promise.all(
      desks.map(async (desk) => {
        const { office_id, type, system } = desk;
        let office, customSystem, customType;

        if (office_id) {
          office = await this.officeRepository.findOne({
            where: { id: office_id },
          });
        }
        if (system) {
          customSystem = await this.customStatusRepository.findOne({
            where: { id: system },
          });
        }
        if (type || type == 0) {
          customType = await this.deskTypeRepository.findOne({
            where: { id: type },
          });
        }
        return {
          id: Number(desk.id),
          name: desk.name,
          type: customType ? customType.name : null,
          daily_goal: Number(desk.daily_goal),
          monthly_goal: Number(desk.monthly_goal),
          weekly_goal: Number(desk.weekly_goal),
          office: office ? office.name : null,
          system: customSystem ? customSystem.name : null,
          coordinator :desk.coordinator ? {
            full_name : desk?.coordinator?.full_name,
            email : desk?.coordinator?.email,
            id : Number(desk?.coordinator?.id),
          } : null,
          manager : desk?.manager ? {
            full_name : desk?.manager?.full_name,
            email : desk?.manager?.email,
            id : Number(desk?.manager?.id),
          } : null,
          is_active: desk.is_active ?? null,
          created_at: desk.createdAt ?? null,
        };
      }),
    );
    return deskDTOs;
  }

  async getOfficeById(id: number): Promise<any> {
    const office = await this.officeRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException('Office not found');
    }
    const { system } = office;
    let customSystem;

    if (system) {
      customSystem = await this.customStatusRepository.findOne({
        where: { id: system },
      });
    }
    return {
      id: Number(office.id),
      name: office.name,
      system: customSystem ? customSystem.name : null,
    };
  }

  async getAllOffices(): Promise<any[]> {
    const offices = await this.officeRepository.find();

    const officeDTOs = await Promise.all(
      offices.map(async (office) => {
        const { system } = office;
        let customSystem;

        if (system) {
          customSystem = await this.customStatusRepository.findOne({
            where: { id: system },
          });
        }
        return {
          id: Number(office.id),
          name: office.name,
          system: customSystem ? customSystem.name : null,
        };
      }),
    );
    return officeDTOs;
  }

  async createOffice(user : User , createOfficeDTO: CreateOfficeDTO): Promise<Office> {
    const office = this.officeRepository.create(createOfficeDTO);
    const saved = await this.officeRepository.save(office);
    console.log(user)
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: saved,
      oldData: null,
      entityId: saved?.id,
      entityType: entityType.OFFICE,
      performerId: user.id,
      performerType: performerType.OPERATOR,
      field: 'Office Created',
    });
    return saved
  }

  async updateOffice(
    user: User,
    id: number,
    updateOfficeDTO: UpdateOfficeDTO,
  ): Promise<any> {
    const office = await this.officeRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException('Office not found');
    }
    await this.officeRepository.update(id, updateOfficeDTO);
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updateOfficeDTO,
      oldData: office,
      entityId: office?.id,
      entityType: entityType.OFFICE,
      performerId: user?.id,
      performerType: performerType.OPERATOR,
      field: 'Office Updated',
    });
    return { message: 'Office updated successfully' };
  }

  async deleteOffice(user: User, id: number): Promise<any> {
    const office = await this.officeRepository.findOne({ where: { id } });
    if (!office) {
      throw new NotFoundException('Office not found');
    }
    const deleted = await this.officeRepository.softDelete(id);
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deleted,
      oldData: office,
      entityId: office?.id,
      entityType: entityType.OFFICE,
      performerId: user?.id,
      performerType: performerType.OPERATOR,
      field: 'Office Deleted',
    });
    return { message: 'Office deleted successfully' };
  }

  async getAllDeskOperators(id: number): Promise<any[]> {
    const operators = await this.deskOperatorRepository.find({
      where: { desk: { id } },
      relations: ['operator'],
    });

    const operatorDTOs = await Promise.all(
      operators.map((operator) => {
        return {
          id: Number(operator.operator.id),
          name: operator.operator.full_name,
        };
      }),
    );
    return operatorDTOs;
  }

  async getOperatorLinks(): Promise<any> {
    return await this.operatorLinksRepository.find();
  }

  async generateOperatorLinks(dto: GenerateOperatorLinkDto): Promise<any> {
    const { uuid, p1, p2, p3, p4, p5, p6, popUnder } = dto;

    const baseUrl = this.configService.get('app.frontendDomain', {
      infer: true,
    });

    const params = { p1, p2, p3, p4, p5, p6 };
    const paramsArray = Object.entries(params)
      .filter(([value]) => value)
      .map(([key, value]) => `${key}=${value}`);

    const paramsString = paramsArray.join('&');

    let url = `${baseUrl}/${uuid}`;

    if (paramsString) {
      url += `?${paramsString}`;
    }

    if (popUnder !== undefined) {
      url += paramsString
        ? `&pu=${popUnder ? 'true' : 'false'}`
        : `?pu=${popUnder ? 'true' : 'false'}`;
    }

    const operatorLink = new operator_links();
    operatorLink.url = url;
    return await this.operatorLinksRepository.save(operatorLink);
  }

  async createOperatorLink(createOperatorLinkDto: CreateOperatorLinkDto) {
    const operatorLink = this.operatorLinksRepository.create(
      createOperatorLinkDto,
    );
    return this.operatorLinksRepository.save(operatorLink);
  }

  async impersonatingClient(user: User, clientId: number) {
    const client = await this.userRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      const message = 'User not found';
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

    const session = await this.sessionService.create({
      user: { id: clientId },
    });

    const { token, tokenExpires } = await this.getTokensData({
      id: client.id,
      role: client.role,
      languageIso: client.languageIso,
      sessionId: session.id,
      email: client.email,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: client.id,
      entityType: 'CrmApiToken',
      performerId: user.id,
      performerType: 'Operator',
      field: 'Impersonate Client',
    });

    return {
      token,
      tokenExpires,
      user: client,
    };
  }

  async impersonatingOperator(user: User, operatorId: number) {
    const operator = await this.userRepository.findOne({
      where: {
        operator: { id: operatorId, is_active: true },
        isOperator: true,
      },
    });

    const manager = await this.userRepository.findOne({
      where: {
        id: user.id,
        operator: { is_active: true },
        isOperator: true,
      },
    });

    if (!operator) {
      const message = 'Operator not found';
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

    if (operator.id == user.id) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'You cannot impersonate yourself',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (RoleEnum.super_admin == operator.role?.id) {
      const message = 'You cannot impersonate super admin';
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

    if (operator.operator.id == manager?.operator.manager_operator_id) {
      const message = 'You cannot impersonate your manager';
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

    const session = await this.sessionService.create({
      user: { id: operator.id },
    });

    const { token, tokenExpires } = await this.getTokensData({
      id: operator.id,
      role: operator.role,
      languageIso: operator.languageIso,
      sessionId: session.id,
      email: operator.email,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: operatorId,
      entityType: 'CrmApiToken',
      performerId: user.id,
      performerType: 'Operator',
      field: 'Impersonate Operator',
    });

    return {
      token,
      tokenExpires,
      user: operator,
    };
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    languageIso: User['languageIso'];
    sessionId: Session['id'];
    email: User['email'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.ImpersonateExpires',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          languageIso: data.languageIso,
          sessionId: data.sessionId,
          email: data.email,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async updateOperatorLink(
    id: number,
    dto: UpdateGeneratedOperatorDto,
  ): Promise<any> {
    const { p1, p2, p3, p4, p5, p6, popUnder } = dto;

    const operatorLink = await this.operatorLinksRepository.findOneBy({ id });
    if (!operatorLink) {
      throw new Error('operator link not found');
    }

    const params = { p1, p2, p3, p4, p5, p6 };
    const paramsArray = Object.entries(params)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`);

    const paramsString = paramsArray.join('&');

    let url = operatorLink.url.split('?')[0];

    if (paramsString) {
      url += `?${paramsString}`;
    }

    if (popUnder !== undefined) {
      url += paramsString
        ? `&pu=${popUnder ? 'true' : 'false'}`
        : `?pu=${popUnder ? 'true' : 'false'}`;
    }

    operatorLink.url = url;
    return await this.operatorLinksRepository.save(operatorLink);
  }

  async getSingleOperatorLink(id: number): Promise<any> {
    const operatorLink = await this.operatorLinksRepository.findOneBy({ id });
    if (!operatorLink?.url) {
      throw new NotFoundException(`URL with id ${id} does not exist!`);
    }

    const url = new URL(operatorLink?.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const popUnder = params.pu === 'true';

    delete params.pu;

    const filteredParams = Object.fromEntries(
      Object.entries({
        p1: params.p1,
        p2: params.p2,
        p3: params.p3,
        p4: params.p4,
        p5: params.p5,
        p6: params.p6,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      }).filter(([_, value]) => value !== null && value !== undefined),
    );

    return {
      parameters: filteredParams,
      popUnder,
    };
  }

  async deleteOperatorLink(id: number): Promise<any> {
    const result = await this.operatorLinksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Url with ID "${id}" not found`);
    }
    return { message: 'Url deleted successfuly' };
  }

  async createTarget(
    createOperatorTargetDto: CreateOperatorTargetDto,
  ): Promise<any> {
    const operator = await this.operatorRepository.findOne({
      where: { id: createOperatorTargetDto.operator_id },
    });

    if (!operator) {
      throw new NotFoundException(
        `Operator with ID ${createOperatorTargetDto.operator_id} not found`,
      );
    }

    const operatorTarget = this.operatorTargetsRepository.create({
      ...createOperatorTargetDto,
      operator: { id: operator.id },
      is_hidden: true,
    });

    return this.operatorTargetsRepository.save(operatorTarget);
  }

  async findOneTarget(id: number, month: string, year: string): Promise<any> {
    const operatorTarget = await this.operatorTargetsRepository.findOne({
      where: { operator: { id }, month, year },
    });

    const currentMonth = new Date().toLocaleString('en-US', {
      month: 'long',
    });
    const currentYear = new Date().getFullYear().toString();
    let isHidden = true;
    if (month === currentMonth && year === currentYear) {
      isHidden = false;
    }

    return operatorTarget
      ? operatorTarget
      : {
          monthly_deposit: 0,
          daily_lots: 0,
          is_hidden: isHidden,
          month: month,
          year: year,
        };
  }

  async updateTarget(
    id: number,
    updateOperatorTargetDto: UpdateOperatorTargetDto,
  ): Promise<any> {
    const operatorTarget = await this.operatorTargetsRepository.findOne({
      where: { id },
    });

    if (!operatorTarget) {
      throw new NotFoundException(`Operator target with ID ${id} not found`);
    }

    const data = await this.operatorTargetsRepository.update(
      operatorTarget.id,
      updateOperatorTargetDto,
    );

    return data;
  }

  async updateImage(id: number): Promise<any> {
    const operator = await this.operatorRepository.findOneBy({ id });
    if (!operator) {
      throw new NotFoundException(`Operator with ID ${id} not found`);
    }

    return await this.operatorRepository.save({
      id,
      photo: null,
      image_url: '',
    });
  }

  async removeTarget(id: number): Promise<any> {
    const result = await this.operatorTargetsRepository.softDelete(id);
    return result;
  }

  async updateAutoMonthlyTarget(
    userJwtPayload: JwtPayloadType,
    id: number,
    body : {autoMonthlyTarget : boolean},
  ): Promise<any> {
    const operator = await this.operatorRepository.findOne({ where: { id } });
    if (!operator) {
      throw new NotFoundException('Operator not found');
    }

    const data = await this.operatorRepository.update(id, {
      autoMonthlyTarget: body.autoMonthlyTarget,
    });



    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: body,
      oldData: operator,
      entityId: operator.id,
      entityType: 'Operator',
      performerId: userJwtPayload.id,
      performerType: 'Operator',
      field: 'Details Update',
    });

    const user = await this.userRepository.findOne({
      where: { operator: { id } },
    });

    await this.cacheManager.del(`get-me-api-${user?.id}`);

    return data;
  }
}
