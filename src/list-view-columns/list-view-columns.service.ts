import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AddListViewColumnDto,
  CreateListViewColumnDto,
} from './dto/create-list-view-column.dto';
import { UpdateListViewColumnDto } from './dto/update-list-view-column.dto';
import { ListViewColumn } from './entities/list-view-column.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ListViewsFilterService } from 'src/list-views-filter/list-views-filter.service';
import { ListColumnsMetaService } from 'src/list-columns-meta/list-columns-meta.service';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { ListAction, ListActivityLogsService } from 'src/list-activity-logs/list-activity-logs.service';
import { entityType } from 'src/admin/active-log/active-log.type';

@Injectable()
export class ListViewColumnsService {
  constructor(
    @InjectRepository(ListViewColumn)
    private readonly listViewsFilterRepository: Repository<ListViewColumn>,
    private readonly listViewFilterService: ListViewsFilterService,
    private readonly listColumnMetaService: ListColumnsMetaService,
    private readonly listCacheService: ListCacheService,
    private readonly listActivityLogsService: ListActivityLogsService,

  ) { }
  async create(createListViewColumnDto: CreateListViewColumnDto) {
    const { listColumnsMetaId, listViewFilterId, ...rest } =
      createListViewColumnDto;
    const isExistListViewFilter =
      await this.listViewFilterService.findOne(listViewFilterId);
    const isExistListColumnsMeta =
      await this.listColumnMetaService.findOne(listColumnsMetaId);
    const data = this.listViewsFilterRepository.create({
      ...rest,
      listColumnsMeta: {
        id: isExistListColumnsMeta.id,
      },
      listViewFilter: {
        id: isExistListViewFilter.id,
      },
    });
    const entity = await this.listViewsFilterRepository.save(data);
    return entity;
  }

  async findAll() {
    const entities = await this.listViewsFilterRepository.find();
    return entities;
  }

  async findOne(id: number) {
    const entity = await this.listViewsFilterRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException('List View Column not found');
    }
    return entity;
  }

  async update(id: number, updateListViewColumnDto: UpdateListViewColumnDto) {
    const { listColumnsMetaId, listViewFilterId, ...rest } =
      updateListViewColumnDto;
    const isExist = await this.findOne(id);
    const isExistListViewFilter =
      await this.listViewFilterService.findOne(listViewFilterId);
    const isExistListColumnsMeta =
      await this.listColumnMetaService.findOne(listColumnsMetaId);
    const data = this.listViewsFilterRepository.create({
      ...rest,
      id: isExist.id,
      listColumnsMeta: {
        id: isExistListColumnsMeta.id,
      },
      listViewFilter: {
        id: isExistListViewFilter.id,
      },
    });
    const entity = await this.listViewsFilterRepository.save(data);
    return entity;
  }

  async remove(id: number, userId: number) {
    const entity = await this.listViewsFilterRepository.findOne({
      where: { id },
      relations: {
        listViewFilter: true
      },
      loadEagerRelations: false
    });
    if (!entity) {
      throw new NotFoundException('List View Column not found');
    }

    if (entity.listViewFilter.userId !== userId) {
      throw new BadRequestException('Not authorized to delete column from this view');
    }

    const { affected } = await this.listViewsFilterRepository.delete({
      id,
    });
    await this.listCacheService.deleteViewConfig(entity.listViewFilter.id);
    this.listActivityLogsService.emit({
      oldData:entity,
      newData: null,
      field: ListAction.RECORD_DELETED,
      performerId: userId,
      entityId: entity.id,
      entityType: entityType.LIST_VIEW_COLUMN,
    });
    return { isDeleted: affected === 1 };
  }

  async add(dto: AddListViewColumnDto, userId: number) {
    const { listViewFilterId, data } = dto;
    const isExist = await this.listViewFilterService.findViewById(listViewFilterId);

    if (isExist?.userId !== userId) {
      throw new UnprocessableEntityException(
        'Not authorized to add columns in this view',
      );
    }

    const columns: ListViewColumn[] = [];
    const colIds = data.map((d) => {
      return d.listColumnsMetaId
    });
    const cols = await this.listColumnMetaService.findMany({ id: In(colIds), list: { id: isExist.list.id } });
    if (cols.length !== colIds.length) {
      throw new UnprocessableEntityException('Column not found');
    }

    const colsDictionary: any = {};
    cols.forEach((c) => {
      colsDictionary[c.id] = c;
    })


    const isColumnAlreadyExist =
      await this.listViewsFilterRepository.findBy({
        listColumnsMeta: {
          id: In(colIds),
        },
        listViewFilter: {
          id: listViewFilterId,
        },
      });

    const colsMetaDictionary: any = {}
    isColumnAlreadyExist.map((c) => {
      colsMetaDictionary[c.listColumnsMetaId] = c.id
    });

    for await (const col of data) {
      const isExistColumnMeta = colsDictionary[col.listColumnsMetaId];
      if (!isExistColumnMeta) {
        throw new UnprocessableEntityException('Column not found');
      }

      let colId = col.id;
      if (colsMetaDictionary[isExistColumnMeta.id]) {
        colId = colsMetaDictionary[isExistColumnMeta.id]
      }
      const view = this.listViewsFilterRepository.create({
        id: colId,
        sequence: col.sequence,
        isSticky: col.isSticky,
        listColumnsMeta: {
          id: isExistColumnMeta.id,
        },
        listViewFilter: {
          id: listViewFilterId,
        },
      });
      columns.push(view);
    }
    const entity = await this.listViewsFilterRepository.save(columns);
    await this.listCacheService.deleteViewConfig(listViewFilterId);

    this.listActivityLogsService.emit({
      oldData: { data: cols },
      newData: { data: entity },
      field: ListAction.RECORD_CREATED,
      performerId: userId,
      entityId: listViewFilterId,
      entityType: entityType.LIST_VIEW_COLUMN,
    });
    return entity;
  }
}
