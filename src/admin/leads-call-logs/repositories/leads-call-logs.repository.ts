import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { LeadsCallLog } from '../entities/leads-call-log.entity';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class LeadsCallLogsRepository extends BaseRepository<LeadsCallLog> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(LeadsCallLog, dataSource, listCacheService, roleService);
  }
}
