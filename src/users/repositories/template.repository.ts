import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { Template } from 'src/mail/entities/template.entity';
import { RoleService } from 'src/roles/role.service';
import { DataSource } from 'typeorm';
@Injectable()
export class templateRepository extends BaseRepository<Template> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Template, dataSource, listCacheService, roleService);
  }
}
