import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAggregatorDto } from './dto/create-aggregator.dto';
import { UpdateAggregatorDto } from './dto/update-aggregator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PSP } from 'src/transaction/entities/psp.entity';
import { User } from 'src/users/entities/user.entity';
import { AggregatorPSPRepository } from './repositories/aggregator-psp.repository';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { ActiveLogService, ActivityFields } from 'src/admin/active-log/active-log.service';
import { entityType } from 'src/admin/active-log/active-log.type';
@Injectable()
export class AggregatorService {
  constructor(
    private readonly aggregatorPSPRepository: AggregatorPSPRepository,
    @InjectRepository(PSP)
    private readonly pspRepository: Repository<PSP>,
    private readonly activityLogsService:ActiveLogService
  ) {}

  async create(createAggregatorDto: CreateAggregatorDto, userId: User['id']) {
    const { name, fee } = createAggregatorDto;
    const data = this.aggregatorPSPRepository.create({
      name,
      fee,
      isActive: true,
      description: name,
      displayName: name,
      user: {
        id: userId,
      },
    });
    const entity = await this.aggregatorPSPRepository.save(data);
    if (entity) {
      await this.pspRepository.save({
        aggregator: { id: entity.id },
        description: name,
        displayName: name,
        isActive: true,
        name,
      });
    }
    this.activityLogsService.emitLog({
      entityId:entity.id,
      entityType:entityType.AGGREGATOR,
      field:ActivityFields.RECORD_CREATED,
      newData:entity,
      oldData:null,
      performerId:userId
    });
    return entity;
  }

  findAll(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    userId: number,
  ) {
    const filters: FilterItem[] = [
      { name: 'isActive', operation: FilterOperation.EQUALS, value: [true] },
    ];
    return this.aggregatorPSPRepository.advanceFilters({
      limit,
      page,
      listName: ListNames.AGGREGATOR,
      relations: ['user'],
      filterList: body.filters,
      sortList: body.sort,
      filters,
      userId,
      defaultSortKey: 'createdAt',
      listViewId: body.listViewId,
    });
  }

  async getBridgerPayAggregator() {
    return await this.aggregatorPSPRepository.findOneBy({ name: 'BridgerPay' });
  }

  async getPraxisAggregator() {
    return await this.aggregatorPSPRepository.findOneBy({ name: 'Praxis' });
  }

  async update(
    id: number,
    updateAggregatorDto: UpdateAggregatorDto,
    userId: User['id'],
  ) {
    const isExist = await this.aggregatorPSPRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!isExist) {
      throw new BadRequestException('Aggregator not found');
    }
    if (isExist.user.id !== userId) {
      throw new BadRequestException('Aggregator is created by different user');
    }
    const data = this.aggregatorPSPRepository.create({
      id,
      displayName: updateAggregatorDto?.name,
      fee: updateAggregatorDto?.fee,
    });

    const entity = await this.aggregatorPSPRepository.save(data);

    if (entity?.displayName) {
      await this.pspRepository.update(
        { aggregator: { id: isExist.id } },
        { aggregatorName: entity.displayName },
      );
    }
    this.activityLogsService.emitLog({
      entityId:entity.id,
      entityType:entityType.AGGREGATOR,
      field:ActivityFields.DETAILS_UPDATED,
      newData:entity,
      oldData:isExist,
      performerId:userId
    });
    return entity;
  }

  async remove(id: number, userId: User['id']) {
    const isExist = await this.aggregatorPSPRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!isExist) {
      throw new BadRequestException('Aggregator not found');
    }
    if (isExist.user.id !== userId) {
      throw new BadRequestException('Aggregator is created by different user');
    }
    const { affected } = await this.aggregatorPSPRepository.softDelete(
      isExist.id,
    );
    if (affected === 1) {
      await this.pspRepository.softDelete({ aggregator: { id: isExist.id } });
    }

    this.activityLogsService.emitLog({
      entityId:isExist.id,
      entityType:entityType.AGGREGATOR,
      field:ActivityFields.RECORD_DELETED,
      newData:null,
      oldData:isExist,
      performerId:userId
    });
    return { isDeleted: affected === 1 };
  }
}
