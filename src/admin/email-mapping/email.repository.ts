import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { DataSource } from 'typeorm';
import { EmailEvent } from './entity/email-event.entity';
@Injectable()
export class EmailEventRepository extends BaseRepository<EmailEvent> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(EmailEvent, dataSource, listCacheService, roleService);
  }
}