import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { Layout } from 'src/mail/entities/layout.entity';
import { RoleService } from 'src/roles/role.service';
import { DataSource } from 'typeorm';
@Injectable()
export class layoutRepository extends BaseRepository<Layout> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Layout, dataSource, listCacheService, roleService);
  }
}
