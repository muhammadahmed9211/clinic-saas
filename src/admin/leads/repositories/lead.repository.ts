import { Injectable } from '@nestjs/common';
import { Lead } from '../entities/lead.entity';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class LeadsRepository extends BaseRepository<Lead> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Lead, dataSource, listCacheService, roleService);
  }
}
