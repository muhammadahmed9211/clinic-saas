import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { InboxEmail } from 'src/mail/entities/inboxEmails.entity';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class InboxEmailRepository extends BaseRepository<InboxEmail> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(InboxEmail, dataSource, listCacheService, roleService);
  }
}
