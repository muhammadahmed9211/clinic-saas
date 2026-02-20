import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { Role } from 'src/roles/entities/role.entity';
import { DataSource } from 'typeorm';
@Injectable()
export class RolesRepository extends BaseRepository<Role> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Role, dataSource, listCacheService);
  }
}
