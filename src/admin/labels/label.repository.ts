import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { Label } from 'src/tasks/entities/label.entity';
import { DataSource } from 'typeorm';
@Injectable()
export class labelRepository extends BaseRepository<Label> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Label, dataSource, listCacheService, roleService);
  }
}