import { Injectable } from '@nestjs/common';
import { AutomationConfig } from '../entities/automation-config.entity';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class AutomationConfigRepository extends BaseRepository<AutomationConfig> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(AutomationConfig, dataSource, listCacheService, roleService);
  }
}
