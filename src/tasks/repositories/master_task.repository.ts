import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { MasterTask } from '../entities/master_task.entity';

@Injectable()
export class MasterTaskRepository extends BaseRepository<MasterTask> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(MasterTask, dataSource, listCacheService, roleService);
  }
}
