import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListColumnsGroupDto } from './dto/create-list-columns-group.dto';
import { UpdateListColumnsGroupDto } from './dto/update-list-columns-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListColumnsGroup } from './entities/list-columns-group.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ListItemService } from 'src/list-item/list-item.service';
import { GetListColumnsParamDto } from './dto/get-list-columns-group.dto';

@Injectable()
export class ListColumnsGroupService {
  constructor(
    @InjectRepository(ListColumnsGroup)
    private readonly listColumnsGroupRepository: Repository<ListColumnsGroup>,
    private readonly listItemService: ListItemService,
  ) {}
  async create(createListColumnsGroupDto: CreateListColumnsGroupDto) {
    const { listId } = createListColumnsGroupDto;
    const isExist = await this.listItemService.findOne(listId);
    const data = this.listColumnsGroupRepository.create({
      name: createListColumnsGroupDto.name,
      list: {
        id: isExist.id,
      },
    });
    const entity = await this.listColumnsGroupRepository.save(data);
    return entity;
  }

  async findAll(query?: GetListColumnsParamDto) {
    const where: FindOptionsWhere<ListColumnsGroup> = {};
    if (query && query.listId) {
      where.list = {
        id: query.listId,
      };
    }
    const entities = await this.listColumnsGroupRepository.findBy(where);
    return entities;
  }

  async findOne(id: number) {
    const entity = await this.listColumnsGroupRepository.findOne({
      where: { id },
      relations: ['list'],
    });
    if (!entity) {
      throw new NotFoundException('List Group not found');
    }
    return entity;
  }

  async update(
    id: number,
    updateListColumnsGroupDto: UpdateListColumnsGroupDto,
  ) {
    const { listId } = updateListColumnsGroupDto;
    const isExist = await this.findOne(id);
    const isListExist = await this.listItemService.findOne(listId);

    const data = this.listColumnsGroupRepository.create({
      name: updateListColumnsGroupDto.name,
      id: isExist.id,
      list: {
        id: isListExist.id,
      },
    });
    const entity = await this.listColumnsGroupRepository.save(data);
    return entity;
  }

  async remove(id: number) {
    const { affected } = await this.listColumnsGroupRepository.softDelete({
      id,
    });
    return { isDeleted: affected === 1 };
  }
}
