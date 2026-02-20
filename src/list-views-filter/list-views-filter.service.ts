import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListViewsFilterDto } from './dto/create-list-views-filter.dto';
import { UpdateListViewsFilterDto } from './dto/update-list-views-filter.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ListViewsFilter } from './entities/list-views-filter.entity';
import { ListItemService } from 'src/list-item/list-item.service';
import { User } from 'src/users/entities/user.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import {
  ListAction,
  ListActivityLogsService,
} from 'src/list-activity-logs/list-activity-logs.service';
import { entityType } from 'src/admin/active-log/active-log.type';
@Injectable()
export class ListViewsFilterService {
  constructor(
    @InjectRepository(ListViewsFilter)
    private readonly listViewsFilterRepository: Repository<ListViewsFilter>,
    private readonly listItemService: ListItemService,
    private readonly listCacheService: ListCacheService,
    private readonly listActivityLogsService: ListActivityLogsService,
  ) {}
  async create(
    createListViewsFilterDto: CreateListViewsFilterDto,
    userId: User['id'],
  ) {
    const { listId, ...rest } = createListViewsFilterDto;
    const isExist = await this.listItemService.findOneById(listId);
    if (rest.isDefault) {
      const isDefaultExist = await this.listViewsFilterRepository.findOneBy({
        isDefault: true,
        list: { id: isExist.id },
      });
      if (isDefaultExist) {
        throw new BadRequestException(
          `Default View with list ${isExist.name} already exists`,
        );
      }
    }
    if (rest.isUserDefault) {
      const isUserDefaultExist = await this.listViewsFilterRepository.findOneBy(
        {
          isUserDefault: true,
          list: { id: isExist.id },
          user: {
            id: userId,
          },
        },
      );
      if (isUserDefaultExist) {
        throw new BadRequestException(
          `User Default View with list ${isExist.name} already exists`,
        );
      }
    }
    const data = await this.listViewsFilterRepository.create({
      ...rest,
      user: {
        id: userId,
      },
      list: {
        id: isExist.id,
      },
    });
    const entity = await this.listViewsFilterRepository.save(data);
    this.listActivityLogsService.emit({
      oldData: null,
      newData: entity,
      field: ListAction.RECORD_CREATED,
      performerId: userId,
      entityId: entity.id,
      entityType: entityType.LIST_VIEWS_FILTER,
    });
    await this.listCacheService.refreshViewsInList(isExist.name);
    return entity;
  }

  async findAll() {
    const entities = await this.listViewsFilterRepository.find();
    return entities;
  }

  async findOne(id: number) {
    const entity = await this.listViewsFilterRepository.findOne({
      where: { id },
      relations: ['list', 'list.groups', 'list.groups.meta', 'user'],
    });
    if (!entity) {
      throw new NotFoundException('List filter not found');
    }
    return entity;
  }

  async findOneById(id: number, withUser: boolean = false) {
    const relations = ['list'];
    if (withUser) {
      relations.push('user');
    }
    const entity = await this.listViewsFilterRepository.findOne({
      where: { id },
      relations,
    });
    if (!entity) {
      throw new NotFoundException('List filter not found');
    }
    return entity;
  }

  async findViewById(id: number) {
    const entity = await this.listViewsFilterRepository.findOne({
      where: { id },
      relations: {
        list: true,
      },
    });
    if (!entity) {
      throw new NotFoundException('List filter not found');
    }
    return entity;
  }

  async update(
    id: number,
    updateListViewsFilterDto: UpdateListViewsFilterDto,
    userId: User['id'],
  ) {
    const { listId, ...rest } = updateListViewsFilterDto;
    const isListItemExist = await this.listItemService.findOne(listId);
    const isExist = await this.findOne(id);
    if (isExist.user.id && isExist.user.id !== userId) {
      throw new NotFoundException('List filter not found');
    }
    const data = await this.listViewsFilterRepository.create({
      ...rest,
      id: isExist.id,
      list: {
        id: isListItemExist.id,
      },
    });
    const entity = await this.listViewsFilterRepository.save(data);
    return entity;
  }

  async remove(id: number, userId: User['id']) {
    const { affected } = await this.listViewsFilterRepository.softDelete({
      id,
      user: {
        id: userId,
      },
    });
    return { isDeleted: affected === 1 };
  }
}
