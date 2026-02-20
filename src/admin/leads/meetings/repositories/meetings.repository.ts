import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { Meetings } from '../entities/meetings.entity';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class MeetingRepository extends BaseRepository<Meetings> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Meetings, dataSource, listCacheService, roleService);
  }
}
