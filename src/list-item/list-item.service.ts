import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateListItemDto } from './dto/create-list-item.dto';
import { UpdateListItemDto } from './dto/update-list-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListName } from './entities/list-name.entity';
import { Repository } from 'typeorm';
import {
  AdvanceSearch,
  repositories,
} from 'src/database/base-repository/advance.search';

import 'reflect-metadata';
import { getMetadataArgsStorage } from 'typeorm';
import { ListViewsFilter } from 'src/list-views-filter/entities/list-views-filter.entity';
import { ListColumnsGroup } from 'src/list-columns-group/entities/list-columns-group.entity';
import { ListColumnsMeta } from 'src/list-columns-meta/entities/list-columns-meta.entity';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListName)
    private readonly listNameRepository: Repository<ListName>,
    @InjectRepository(ListViewsFilter)
    private readonly listViewsFilterRepository: Repository<ListViewsFilter>,
    @InjectRepository(ListColumnsGroup)
    private readonly listColumnsGroupRepository: Repository<ListColumnsGroup>,
    @InjectRepository(ListColumnsMeta)
    private readonly listColumnsMetaRepository: Repository<ListColumnsMeta>,
  ) {}

  async isExist(dto: CreateListItemDto) {
    const { name, appName } = dto;
    const isExist = await this.listNameRepository.findOneBy({ name, appName });
    return Boolean(isExist);
  }
  async create(createListUtilDto: CreateListItemDto, userId: number) {
    const { name } = createListUtilDto;
    const isExist = await this.isExist(createListUtilDto);
    if (isExist) {
      throw new BadRequestException(`List with name ${name} already exists`);
    }
    const data = this.listNameRepository.create(createListUtilDto);
    const list = await this.listNameRepository.save(data);
    const defaultView = await this.listViewsFilterRepository.save({
      isDefault: true,
      isPublic: true,
      isUserDefault: true,
      list: {
        id: list.id,
      },
      name: 'Default View',
      user: {
        id: userId,
      },
    });
    const group = await this.listColumnsGroupRepository.save({
      name: 'General',
      list: {
        id: list.id,
      },
    });
    const entity = repositories[createListUtilDto.name];
    const metadata = AdvanceSearch.getEntityMetadata(
      entity,
      createListUtilDto.name,
    );
    const metaDataList: ListColumnsMeta[] = [];
    if (Array.isArray(metadata)) {
      metadata.forEach((column) => {
        const item = this.listColumnsMetaRepository.create({
          isFilterAble: true,
          isSortable: true,
          group: {
            id: group.id,
          },
          list: {
            id: list.id,
          },
          name: column.name,
          label: column.label,
          type: column.type,
        });
        metaDataList.push(item);
      });
    }
    const meta = await this.listColumnsMetaRepository.save(metaDataList);
    return { list, defaultView, group, meta };
  }

  async findAll() {
    const entities = await this.listNameRepository.find();
    return entities;
  }

  async findOne(id: number) {
    const entity = await this.listNameRepository.findOne({
      where: { id },
      relations: [
        'groups',
        'views',
        'groups.meta',
        'views.columns',
        'views.sort',
        'views.sort.listColumnMeta',
        'views.columns.listColumnsMeta',
        'views.filters',
        'views.filters.listColumnMeta',
      ],
    });
    if (!entity) {
      throw new NotFoundException('List not found');
    }
    return entity;
  }

  async findOneById(id: number) {
    const entity = await this.listNameRepository.findOne({
      where: { id },
    });
    if (!entity) {
      throw new NotFoundException('List not found');
    }
    return entity;
  }

  async update(id: number, updateListUtilDto: UpdateListItemDto) {
    const data = this.listNameRepository.create({ ...updateListUtilDto });
    const { affected } = await this.listNameRepository.update(id, data);
    if (affected !== 1) {
      throw new UnprocessableEntityException(
        'An Error occurred while updating',
      );
    }
    const entity = await this.findOne(id);
    return entity;
  }

  async remove(id: number) {
    const { affected } = await this.listNameRepository.softDelete({ id });
    return { isDeleted: affected === 1 };
  }

  getMetaData(entity) {
    // Function to determine the type of a property
    const determineType = (typeFunction: any) => {
      switch (typeFunction) {
        case String:
          return 'STRING';
        case Number:
          return 'NUMBER';
        case Boolean:
          return 'BOOLEAN';
        case Date:
          return 'DATE';
        default:
          return 'UNKNOWN';
      }
    };

    // Get metadata for the Client entity
    const metadata = getMetadataArgsStorage();
    const clientMetadata = metadata.columns.filter(
      (col) => col.target === entity,
    );

    // Generate the desired output
    const fields = clientMetadata.map((col) => {
      const type = Reflect.getMetadata(
        'design:type',
        new entity(),
        col.propertyName,
      );
      return {
        name: col.propertyName,
        label: col.propertyName
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase()),
        type: determineType(type),
      };
    });

    return fields;
  }
}
