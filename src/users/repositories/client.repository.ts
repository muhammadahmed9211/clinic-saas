import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { RoleService } from 'src/roles/role.service';
import { Partner } from 'src/settings/entities/partner.entity';
import { Client } from 'src/users/entities/client.entity';
import { DataSource, FindOptionsRelations, FindOptionsWhere, In, IsNull, Not } from 'typeorm';
import { User } from '../entities/user.entity';
@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Client, dataSource, listCacheService, roleService);
  }

  async getClientWithRoleFilter(userId: number, query: FindOptionsWhere<Client>, relations?: FindOptionsRelations<Client>) {
    const filter = await this.getAllRolesFilters(userId, ListNames.CLIENTS);
    const OR_QUERY: FindOptionsWhere<Client>[] = [];

    if (filter) {
      if (Array.isArray(filter)) {
        filter.forEach((item) => {
          OR_QUERY.push({ ...item, ...query });
        });
      } else {
        //@ts-expect-error //filter type error
        query[filter.name] = In(filter.value);
      }
    }
    const client = await this.findOne({
      where: OR_QUERY.length ? OR_QUERY : query,
      relations: relations ? relations : undefined
    });
    return client
  }

}
