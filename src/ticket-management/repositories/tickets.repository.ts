import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { Tickets } from '../entities/tickets.entity';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class TicketsRepository extends BaseRepository<Tickets> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService, roleService: RoleService) {
    super(Tickets, dataSource, listCacheService , roleService);
  }
  // async findOneWithRoleFilters(findOneOptions: FindOneOptions<Tickets>, userId: number) {
  //   const filters = await this.getAllRolesFilters(userId, ListNames.TICKETS);
  //   const OR_QUERY: FindOptionsWhere<Tickets>[] = [];

  //   if (filters) {
  //     if (Array.isArray(filters)) {
  //       filters.forEach((item) => {
  //         OR_QUERY.push({ ...item, ...findOneOptions.where });
  //       });
  //     }
  //   } else {
  //     //@ts-expect-error //filter type error
  //     query[filter.name] = In(filter.value);
  //   }

  //   return this.findOne({
  //     ...findOneOptions,
  //     where: OR_QUERY.length? OR_QUERY : findOneOptions.where,
  //   })
  // }
}
