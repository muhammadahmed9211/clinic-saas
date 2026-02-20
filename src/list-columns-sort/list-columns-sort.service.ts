import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListColumnsMetaService } from 'src/list-columns-meta/list-columns-meta.service';
import { ListViewsFilterService } from 'src/list-views-filter/list-views-filter.service';
import { CreateListColumnsSortDto } from './dto/create-list-columns-sort.dto';
import { UpdateListColumnsSortDto } from './dto/update-list-columns-sort.dto';
import { ListColumnsSortRepository } from './respositories/list-columns-sort.repository';
import { SortItem } from 'src/database/base-repository/dto/advance-search.dto';

@Injectable()
export class ListColumnsSortService {
  constructor(
    private readonly listColumnFilterRepository: ListColumnsSortRepository,
    private readonly listViewFilterService: ListViewsFilterService,
    private readonly listColumnMetaService: ListColumnsMetaService,
  ) {}
  async create(createListFilterColumnDto: CreateListColumnsSortDto) {
    const { listViewFilterId, listColumnMetaId, sortOrder } =
      createListFilterColumnDto;
    const isExist = await this.listViewFilterService.findOne(listViewFilterId);
    const isExistColumnMeta =
      await this.listColumnMetaService.findOne(listColumnMetaId);
    const data = this.listColumnFilterRepository.create({
      sortOrder,
      listViewFilter: {
        id: isExist.id,
      },
      listColumnMeta: {
        id: isExistColumnMeta.id,
      },
    });
    const sort: SortItem = {
      order: sortOrder,
      key: isExistColumnMeta.name,
    };
    const isValid = await this.listColumnFilterRepository.isValidSort(
      isExist.id,
      sort,
    );
    if (!isValid) {
      throw new BadRequestException(
        'An Error occurred while adding sort to list',
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
    updateListFilterColumnDto: UpdateListColumnsSortDto,
  ) {
    const { listViewFilterId, listColumnMetaId, sortOrder } =
      updateListFilterColumnDto;
    const isExistListView =
      await this.listViewFilterService.findOne(listViewFilterId);
    const isExistColumnMeta =
      await this.listColumnMetaService.findOne(listColumnMetaId);
    const isExist = await this.findOne(id);
    const data = this.listColumnFilterRepository.create({
      sortOrder,
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

  async remove(id: number) {
    const { affected } = await this.listColumnFilterRepository.softDelete({
      id,
    });
    return { isDeleted: affected === 1 };
  }
}
