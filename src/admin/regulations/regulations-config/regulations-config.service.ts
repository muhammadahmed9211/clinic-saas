import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RegulationEvent,
  RegulationEventKeys,
} from './entities/regulation-event.entity';
import {
  RegulationRule,
  RegulationRuleKeys,
  RegulationRuleType,
} from './entities/regulation-rule.entity';
import { RegulationEventRuleMapping } from './entities/regulation-event-rule-mapping.entity';
import { Repository } from 'typeorm';
import {
  CreateRegulationEventDto,
  CreateRegulationRuleDto,
} from './dto/create-regulation-config.dto';
import { Client } from 'src/users/entities/client.entity';
import {
  UpdateRegulationEventDto,
  UpdateRegulationRuleDto,
} from './dto/update-regulation-config.dto';
import { CreateRegulationEventRuleMappingDto } from './dto/create-regulation-mapping.dto';
import { UpdateRegulationEventRuleMappingDto } from './dto/update-regulation-mapping.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { RegulationEventRepository } from '../repositories/regulationEvent.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { RegulationRuleRepository } from '../repositories/regulationRule.repository';
import { RegulationsEventRuleMappingRepository } from '../repositories/regulationEventRuleMapping.repository';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { entityType, performerType } from 'src/admin/active-log/active-log.type';

@Injectable()
export class RegulationsConfigService {
  constructor(
    @InjectRepository(RegulationEvent)
    private readonly regulationsEventRepository: Repository<RegulationEvent>,
    @InjectRepository(RegulationRule)
    private readonly regulationsRuleRepository: Repository<RegulationRule>,
    @InjectRepository(RegulationEventRuleMapping)
    private readonly regulationEventRuleMappingRepository: Repository<RegulationEventRuleMapping>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly regulationEventRepository: RegulationEventRepository,
    private readonly regulationRuleRepository: RegulationRuleRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly RegulationsEventRuleMappingRepository: RegulationsEventRuleMappingRepository,
  ) {}

  async createEvent(group: CreateRegulationEventDto, userId: number) {
    const isExist = await this.regulationsEventRepository.findOne({
      where: {
        key: group.key,
        isDeleted: false,
      },
    });

    if (isExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'key already exist',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isDeleted = await this.regulationsEventRepository.findOne({
      where: {
        key: group.key,
        isDeleted: true,
      },
    });

    if (isDeleted) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'key is deleted',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this.regulationsEventRepository.save(
      this.regulationsEventRepository.create({
        ...group,
        createdBy: { id: userId },
      }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: data,
          oldData: null,
          entityId: data?.id,
          entityType: entityType.REGULATION_EVENT,
          performerId: userId,
          performerType: performerType.OPERATOR,
          field: 'Regulation Event Created',
        });
    
    return data;
  }

  async createConfig(config: CreateRegulationRuleDto, userId: number) {
    const isExist = await this.regulationsRuleRepository.findOne({
      where: {
        key: config.key,
        isDeleted: false,
      },
    });

    if (isExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'key already exist',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const isDeleted = await this.regulationsRuleRepository.findOne({
      where: {
        key: config.key,
        isDeleted: true,
      },
    });

    if (isDeleted) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'key is deleted',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await this.regulationsRuleRepository.save(
      this.regulationsRuleRepository.create({
        ...config,
        createdBy: { id: userId },
      }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: data,
      oldData: null,
      entityId: data?.id,
      entityType: entityType.REGULATION_RULE,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Rule Created',
    });

    return data;
  }

  async createRegulationMapping(data: CreateRegulationEventRuleMappingDto,userId: number) {
    const isExist = await this.regulationEventRuleMappingRepository.findOne({
      where: {
        regulation: {
          id: data.regulationId,
        },
        event: {
          id: data.eventId,
        },
        rule: {
          id: data.ruleId,
        },
      },
    });

    if (isExist) {
      throw new BadRequestException(
        'Regulation already mapped with event and rule.',
      );
    }

    const mapping = await this.regulationEventRuleMappingRepository.save(
      this.regulationEventRuleMappingRepository.create({
        regulation: {
          id: data.regulationId,
        },
        event: {
          id: data.eventId,
        },
        rule: {
          id: data.ruleId,
        },
        value: data.value,
      }),
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: mapping,
      oldData: null,
      entityId: mapping?.id,
      parentId: mapping?.regulation?.id,
      parentType: entityType.REGULATION,
      entityType: entityType.REGULATION_MAPPING,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Mapping Created',
    });

    return mapping;
  }

  async GetAllEvent(
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
    userId: number,
  ): Promise<any> {
    const filters = [
      {
        name: 'isDeleted',
        operation: FilterOperation.EQUALS,
        value: [false],
      },
    ];
    const response = await this.regulationEventRepository.advanceFilters({
      limit,
      page,
      userId,
      filters,
      relations: ['regulationRule', 'createdBy'],
      filterList: dto.filters || undefined,
      listName: ListNames.REGULATION_EVENT,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
    });

    return {
      ...response,
    };
  }

  async AllEvents(): Promise<any> {
    const response = await this.regulationsEventRepository.find({
      where: { isDeleted: false },
      relations: [
        'regulationRule',
        'regulationRule.regulation',
        'regulationRule.rule',
        'createdBy',
      ],
    });

    return response;
  }

  async GetAllConfig(
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
    userId: number,
  ): Promise<any> {
    const filters = [
      {
        name: 'isDeleted',
        operation: FilterOperation.EQUALS,
        value: [false],
      },
    ];
    const response = await this.regulationRuleRepository.advanceFilters({
      limit,
      page,
      userId,
      filters,
      relations: [
        'regulationEvent',
        'regulationEvent.regulation',
        'regulationEvent.event',
        'createdBy',
      ],
      filterList: dto.filters || undefined,
      listName: ListNames.REGULATION_RULE,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
    });

    return {
      ...response,
    };
  }

  async AllConfig(): Promise<any> {
    const response = await this.regulationsRuleRepository.find({
      where: { isDeleted: false },
      relations: [
        'regulationEvent',
        'regulationEvent.regulation',
        'regulationEvent.event',
        'createdBy',
      ],
    });
    return response;
  }

  async GetAllEventById(id: number) {
    const isExist = await this.regulationsEventRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!isExist) {
      throw new BadRequestException('Event not found');
    }

    const data = await this.regulationsEventRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        'regulationRule',
        'regulationRule.regulation',
        'regulationRule.rule',
        'createdBy',
      ],
    });
    return data;
  }

  async GetAllConfigById(id: number) {
    const isExist = await this.regulationsRuleRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!isExist) {
      throw new BadRequestException('Rule not found');
    }

    const data = await this.regulationsRuleRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        'regulationEvent',
        'regulationEvent.regulation',
        'regulationEvent.event',
        'createdBy',
      ],
    });
    return data;
  }

  async GetEventByRegulationId(id: number) {
    const isExist = await this.regulationEventRuleMappingRepository.findOne({
      where: {
        regulation: {
          id,
        },
        isDeleted: false,
      },
    });

    if (!isExist) {
      throw new BadRequestException('Regulation mapping not found');
    }

    const data = await this.regulationEventRuleMappingRepository.find({
      where: {
        regulation: {
          id,
        },
        isDeleted: false,
      },
      relations: {
        regulation: true,
        event: true,
        rule: true,
      },
    });
    return data;
  }

  async updateEventByRegulationId(
    id: number,
    data: UpdateRegulationEventRuleMappingDto,
    userId: number
  ) {
    const isExist = await this.regulationEventRuleMappingRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['regulation', 'event', 'rule']
    });

    if (!isExist) {
      throw new BadRequestException('Regulation mapping not found');
    }

    const result = await this.regulationEventRuleMappingRepository.save({
      ...isExist,
      regulation: {
        id: data.regulationId ? data.regulationId : undefined,
      },
      event: {
        id: data.eventId ? data.eventId : undefined,
      },
      rule: {
        id: data.ruleId ? data.ruleId : undefined,
      },
      value: data.value ? data.value : undefined,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { ...data },
      oldData: {
        regulationId: isExist?.regulation?.id,
        "eventId": isExist?.event?.id,
        "ruleId": isExist?.rule?.id,
        "value": isExist.value
      },
      entityId: id,
      entityType: entityType.REGULATION_MAPPING,
      parentId: isExist?.regulation?.id,
      parentType: entityType.REGULATION,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Mapping Updated',
    });

    return result;
  }

  async updateEventById(id: number, event: UpdateRegulationEventDto,userId: number) {
    const isExist = await this.regulationsEventRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        'regulationRule',
        'regulationRule.regulation',
        'regulationRule.rule',
      ],
    });

    if (!isExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Event not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (event.key) {
      const keyExist = await this.regulationsEventRepository.findOne({
        where: {
          key: event.key,
        },
      });

      if (keyExist) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: {
              msg: 'key already exist',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const data = await this.regulationsEventRepository.save({
      ...isExist,
      ...event,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: data,
      oldData: isExist,
      entityId: data?.id,
      entityType: entityType.REGULATION_EVENT,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Event Updated',
    });

    return data;
  }

  async updateRuleById(id: number, rule: UpdateRegulationRuleDto, userId: number) {
    const isExist = await this.regulationsRuleRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        'regulationEvent',
        'regulationEvent.regulation',
        'regulationEvent.event',
      ],
    });

    if (!isExist) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: {
            msg: 'Rule not found',
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (rule.key) {
      const keyExist = await this.regulationsRuleRepository.findOne({
        where: {
          key: rule.key,
        },
      });

      if (keyExist) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: {
              msg: 'key already exist',
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const data = await this.regulationsRuleRepository.save({
      ...isExist,
      ...rule,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: data,
      oldData: isExist,
      entityId: data?.id,
      entityType: entityType.REGULATION_RULE,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Rule Updated',
    });
    return data;
  }

  async deleteEventById(id: number,userId: number) {
    const isExist = await this.regulationsEventRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!isExist) {
      throw new BadRequestException('Event not found');
    }

    const data = await this.regulationsEventRepository.save({
      ...isExist,
      isDeleted: true,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: isExist,
      entityId: data?.id,
      entityType: entityType.REGULATION_EVENT,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Event Deleted',
    });
    return data;
  }

  async deleteRuleById(id: number,userId: number) {
    const isExist = await this.regulationsRuleRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!isExist) {
      throw new BadRequestException('Rule not found');
    }

    const data = await this.regulationsRuleRepository.save({
      ...isExist,
      isDeleted: true,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: isExist,
      entityId: data?.id,
      entityType: entityType.REGULATION_RULE,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Rule Deleted',
    });
    return data;
  }

 
  async isAllowedInRegulation(
    regulationId: number,
    regulationEventKey: RegulationEventKeys,
    regulationRuleKeys: RegulationRuleKeys[],
  ) {
    const isAllowed = regulationRuleKeys.map(() => false);
    const mapping = await this.GetEventByRegulationId(regulationId);

    regulationRuleKeys.forEach((regulationRuleKey, i) => {
      let isAllowedInThisConfig = false;
      const event = mapping.find((g) => g.event.key === regulationEventKey && g.rule.key === regulationRuleKey);
      isAllowedInThisConfig = event?.rule?.type === RegulationRuleType.BOOLEAN && event?.value === 'TRUE';
      isAllowed[i] = isAllowedInThisConfig;
    });

    return isAllowed;
  }

  async isAllowedInUserRegulation(
    userId: number,
    regulationEventKey: RegulationEventKeys,
    regulationRuleKeys: RegulationRuleKeys[],
  ) {
    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: { regulation: true },
    });
    const regulationId = client?.regulation?.id;
    if (!regulationId) {
      throw new BadRequestException('User Regulation not found');
    }
    const isAllowed = await this.isAllowedInRegulation(
      regulationId,
      regulationEventKey,
      regulationRuleKeys,
    );
    return isAllowed;
  }

  async deleteRegulationMappingById(id: number,userId: number) {
    const isExist = await this.regulationEventRuleMappingRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['regulation'],
    });   

    if (!isExist) {
      throw new BadRequestException('Regulation Event Rule Mapping not found');
    }

    const data = await this.regulationEventRuleMappingRepository.save({
      ...isExist,
      isDeleted: true,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: isExist,
      entityId: data?.id,
      parentId: isExist?.regulation?.id,
      parentType: entityType.REGULATION,
      entityType: entityType.REGULATION_MAPPING,
      performerId: userId,
      performerType: performerType.OPERATOR,
      field: 'Regulation Mapping Deleted',
    });
    return data;
  }

  async GetAllRegulationMapping(
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
    userId: number,
  ): Promise<any> {
    const filters = [
      {
        name: 'isDeleted',
        operation: FilterOperation.EQUALS,
        value: [false],
      },
    ];
    const response =
      await this.RegulationsEventRuleMappingRepository.advanceFilters({
        limit,
        page,
        userId,
        filters,
        relations: ['regulation', 'event', 'rule'],
        filterList: dto.filters || undefined,
        listName: ListNames.REGULATION_EVENT_RULE,
        sortList: dto.sort || undefined,
        defaultSortKey: 'createdAt',
        listViewId: dto.listViewId,
      });

    return {
      ...response,
    };
  }
}