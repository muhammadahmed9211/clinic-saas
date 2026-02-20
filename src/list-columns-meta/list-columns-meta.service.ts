import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateListColumnsMetaDto } from './dto/create-list-columns-meta.dto';
import { UpdateListColumnsMetaDto } from './dto/update-list-columns-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ListColumnsMeta } from './entities/list-columns-meta.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ListColumnsGroupService } from 'src/list-columns-group/list-columns-group.service';
import { GetListColumnsMetaParamDto } from './dto/get-list-columns-meta.dto';

@Injectable()
export class ListColumnsMetaService {
  constructor(
    @InjectRepository(ListColumnsMeta)
    private readonly listColumnsMetaRepository: Repository<ListColumnsMeta>,
    private readonly listColumnsGroupService: ListColumnsGroupService,
  ) {}
  async create(createListColumnsMetaDto: CreateListColumnsMetaDto) {
    const { groupId, ...rest } = createListColumnsMetaDto;
    const group = await this.listColumnsGroupService.findOne(groupId);
    const data = this.listColumnsMetaRepository.create({
      list: {
        id: group.list.id,
      },
      group: {
        id: group.id,
      },
      ...rest,
    });
    const entity = await this.listColumnsMetaRepository.save(data);
    return entity;
  }

  async findAll(query?: GetListColumnsMetaParamDto) {
    const where: FindOptionsWhere<ListColumnsMeta> = {};
    if (query) {
      if (query.listId) {
        where.list = {
          id: query.listId,
        };
      }

      if (query.groupId) {
        where.group = {
          id: query.groupId,
        };
      }
    }
    const entities = await this.listColumnsMetaRepository.findBy(where);
    return entities;
  }


  async findMany(query: FindOptionsWhere<ListColumnsMeta>) {
    const entities = await this.listColumnsMetaRepository.findBy(query);
    return entities;
  }

  async findOne(id: number) {
    const entity = await this.listColumnsMetaRepository.findOneBy({ id });
    if (!entity) {
      throw new BadRequestException('Columns Meta not found');
    }
    return entity;
  }

  async update(id: number, updateListColumnsMetaDto: UpdateListColumnsMetaDto) {
    const { groupId, ...rest } = updateListColumnsMetaDto;
    const isExist = await this.findOne(id);
    const isGroupExist = await this.listColumnsGroupService.findOne(groupId);
    const data = this.listColumnsMetaRepository.create({
      id: isExist.id,
      group: {
        id: isGroupExist.id,
      },
      list: {
        id: isGroupExist.list.id,
      },
      ...rest,
    });
    const entity = await this.listColumnsMetaRepository.save(data);
    return entity;
  }

  async remove(id: number) {
    const { affected } = await this.listColumnsMetaRepository.softDelete({
      id,
    });
    return { isDeleted: affected === 1 };
  }
}
