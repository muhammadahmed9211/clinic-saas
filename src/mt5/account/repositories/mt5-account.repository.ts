import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { RoleService } from 'src/roles/role.service';
import { DataSource } from 'typeorm';

@Injectable()
export class Mt5AccountRepository extends BaseRepository<Mt5Account> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Mt5Account, dataSource, listCacheService, roleService);
  }
}
