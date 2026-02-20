import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AddListFiltersDto,
  CreateListFilterColumnDto,
} from './dto/create-list-filter-column.dto';
import { UpdateListFilterColumnDto } from './dto/update-list-filter-column.dto';
import { ListColumnsMetaService } from 'src/list-columns-meta/list-columns-meta.service';
import { ListViewsFilterService } from 'src/list-views-filter/list-views-filter.service';
import { ListFilterColumnsRepository } from './repositories/list-filter-columns.repository';
import { FilterItem } from 'src/database/base-repository/dto/advance-search.dto';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { In } from 'typeorm';
import { ListAction, ListActivityLogsService } from 'src/list-activity-logs/list-activity-logs.service';
import { entityType } from 'src/admin/active-log/active-log.type';
import { NullAttributeValue } from 'aws-sdk/clients/dynamodbstreams';

@Injectable()
export class ListFilterColumnsService {
  constructor(
    private readonly listColumnFilterRepository: ListFilterColumnsRepository,
    private readonly listViewFilterService: ListViewsFilterService,
    private readonly listColumnMetaService: ListColumnsMetaService,
    private readonly listCacheService: ListCacheService,
    private readonly listActivityLogsService: ListActivityLogsService
  ) { }
  async create(createListFilterColumnDto: CreateListFilterColumnDto) {
    const { listViewFilterId, listColumnMetaId, ...rest } =
      createListFilterColumnDto;
    const isExist = await this.listViewFilterService.findOne(listViewFilterId);
    const isExistColumnMeta =
      await this.listColumnMetaService.findOne(listColumnMetaId);
    const values = JSON.stringify(rest.values);
    const data = this.listColumnFilterRepository.create({
      ...rest,
      values,
      listViewFilter: {
        id: isExist.id,
      },
      listColumnMeta: {
        id: isExistColumnMeta.id,
      },
    });
    const filter = {
      name: isExistColumnMeta.name,
      value: rest.values,
      operation: createListFilterColumnDto.operator,
    };
    const isValid = await this.listColumnFilterRepository.isValidFilter(
      isExist.id,
      filter,
    );
    if (!isValid) {
      throw new BadRequestException(
        'An Error occurred while adding filter to list',
      );
    }
    const entity = await this.listColumnFilterRepository.save(data);
    return entity;
  }

  async findAll() {
    const entities = await this.listColumnFilterRepository.find();
    return entities;
  }

  async findOne(id: number) {
    const entity = await this.listColumnFilterRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException('Filter not found');
    }
    return entity;
  }

  async update(
    id: number,
    updateListFilterColumnDto: UpdateListFilterColumnDto,
  ) {
    const { listViewFilterId, listColumnMetaId, ...rest } =
      updateListFilterColumnDto;
    const isExistListView =
      await this.listViewFilterService.findOne(listViewFilterId);
    const isExistColumnMeta =
      await this.listColumnMetaService.findOne(listColumnMetaId);
    const isExist = await this.findOne(id);
    const values = rest.values ? JSON.stringify(rest.values) : undefined;
    const data = this.listColumnFilterRepository.create({
      ...rest,
      values,
      id: isExist.id,
      listViewFilter: {
        id: isExistListView.id,
      },
      listColumnMeta: {
        id: isExistColumnMeta.id,
      },
    });
    const entity = await this.listColumnFilterRepository.save(data);
    return entity;
  }

  async remove(id: number, userId: number) {
    const entity = await this.listColumnFilterRepository.findOne({
      where: { id },
      relations: {
        listViewFilter: true,
      },
      loadEagerRelations: false
    });

    if (!entity) {
      throw new BadRequestException('Filter not found');
    }
    if (entity.listViewFilter.userId !== userId) {
      throw new BadRequestException('Not authorized to delete filter from this view');
    }
    const { affected } = await this.listColumnFilterRepository.delete({
      id,
    });
    const viewId = entity.listViewFilter.id;
    await this.listCacheService.deleteViewConfig(viewId);

    this.listActivityLogsService.emit({
      oldData:entity,
      newData:null,
      field: ListAction.RECORD_DELETED,
      performerId: userId,
      entityId: entity.id,
      entityType:entityType.LIST_COLUMNS_FILTER
    });
    return { isDeleted: affected === 1 };
  }

  async add(dto: AddListFiltersDto, userId: number) {
    const { listViewFilterId, data } = dto;
    const isExist = await this.listViewFilterService.findViewById(
      listViewFilterId,
    );
    if (isExist.userId !== userId) {
      throw new UnprocessableEntityException(
        'Not authorized to add filter in this view',
      );
    }

    const colIds = data.map((d) => {
      return d.listColumnMetaId
    });
    const cols = await this.listColumnMetaService.findMany({ id: In(colIds), list: { id: isExist.list.id } });
    if (cols.length !== colIds.length) {
      throw new UnprocessableEntityException('Column not found');
    }

    const colsDictionary: any = {};
    cols.forEach((c) => {
      colsDictionary[c.id] = c;
    });

    const filters: FilterItem[] = [];
    for await (const filter of data) {
      const isExistColumnMeta = colsDictionary[filter.listColumnMetaId]
      filters.push({
        name: isExistColumnMeta.name,
        operation: filter.operator,
        value: filter.values,
      });
    }

    const isValid = await this.listColumnFilterRepository.isValidFilters(
      isExist.id,
      filters,
    );
    if (!isValid) {
      throw new BadRequestException(
        'An Error occurred while adding filter to list',
      );
    }

    const newFilters = data.map((filter) => {
      const id = filter?.id || undefined;
      return this.listColumnFilterRepository.create({
        id,
        operator: filter.operator,
        values: JSON.stringify(filter.values),
        listColumnMeta: {
          id: filter.listColumnMetaId,
        },
        listViewFilter: {
          id: isExist.id,
        },
      });
    });
    await this.listCacheService.deleteViewConfig(listViewFilterId);
    const oldData = await this.listColumnFilterRepository.findMany({
      where: {
        listViewFilter: {
          id: isExist.id
        }
      }
    });
    const newData = await this.listColumnFilterRepository.save(newFilters);

    this.listActivityLogsService.emit({
      oldData:{data:oldData},
      newData,
      field: ListAction.DETAILS_UPDATED,
      performerId: userId,
      entityId: isExist.id,
      entityType:entityType.LIST_COLUMNS_FILTER
    });
    return newData;
  }
}
