import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AutomationConfig } from './entities/automation-config.entity';
import { AutomationExecutionLog } from './entities/automation-execution-logs.entity';
import { CreateAutomationConfigDto } from './dto/create-automation-config.dto';
import { UpdateAutomationConfigDto } from './dto/update-automation-config.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { AutomationConfigRepository } from './repositories/automation-config.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { FilterItem } from 'src/database/base-repository/dto/advance-search.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
// import { AutomationService } from './automation.service';

@Injectable()
export class AutomationConfigService {
  constructor(
    private readonly automationConfigRepository: AutomationConfigRepository,

    @InjectRepository(AutomationExecutionLog)
    private automationLogRepository: Repository<AutomationExecutionLog>,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<AutomationConfig[]> {
    return this.automationConfigRepository.find({
      order: { entityType: 'ASC', automationCode: 'ASC' },
    });
  }

  async findOne(id: number): Promise<AutomationConfig | null> {
    const config = await this.automationConfigRepository.findOne({
      where: { id },
    });

    if (!config) {
      throw new NotFoundException('Automation config not found');
    }

    return config;
  }

  async create(
    createDto: CreateAutomationConfigDto,
    userId: number,
  ): Promise<AutomationConfig> {
    const isExist = await this.automationConfigRepository.findOne({
      where: { automationCode: createDto.automationCode },
      withDeleted: true,
    });

    if (isExist) {
      throw new BadRequestException('Key already exist');
    }

    const config = this.automationConfigRepository.create(createDto);
    const result = await this.automationConfigRepository.save(config);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: null,
      entityId: result.id,
      entityType: 'AutomationConfig',
      performerId: userId,
      performerType: 'Operator',
      field: 'Create Automation Config',
    });

    return result;
  }

  async getConfigList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const filters: FilterItem[] = [];

    const { userId, limit, page, dto } = payload;

    return this.automationConfigRepository.advanceFilters({
      filters,
      listName: ListNames.AUTOMATION_CONFIG,
      userId,
      limit,
      page,
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async update(
    id: number,
    updateDto: UpdateAutomationConfigDto,
    userId: number,
  ): Promise<AutomationConfig | null> {
    const isExist = await this.automationConfigRepository.findOne({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('Automation config not found');
    }

    if (updateDto.automationCode && updateDto.automationCode !== isExist.automationCode) {
      const keyExist = await this.automationConfigRepository.findOne({
        where: { automationCode: updateDto.automationCode },
        withDeleted: true,
      });

      if (keyExist) {
        throw new BadRequestException('Key already exist');
      }
    }

    const result = await this.automationConfigRepository.save({
      id,
      ...updateDto,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: isExist,
      entityId: result.id,
      entityType: 'AutomationConfig',
      performerId: userId,
      performerType: 'Operator',
      field: 'Update Automation Config',
    });
    return this.automationConfigRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    const isExist = await this.automationConfigRepository.findOne({
      where: { id },
    });

    if (!isExist) {
      throw new NotFoundException('Automation config not found');
    }

    await this.automationConfigRepository.softDelete({ id });
  }

  // async executeNow(id: number): Promise<{ processed: number; errors: number }> {
  //   return this.automationService.executeAutomationById(id);
  // }

  // async findLogs(
  //   entityType?: string,
  //   entityId?: number,
  //   automationCode?: string,
  //   limit?: number,
  //   offset?: number,
  // ): Promise<{ logs: AutomationExecutionLog[]; total: number }> {
  //   return this.automationService.getExecutionLogs({
  //     entityType,
  //     entityId,
  //     automationCode,
  //     limit,
  //     offset,
  //   });
  // }
}
