import { Injectable } from '@nestjs/common';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { DataSource } from 'typeorm';

@Injectable()
export class OperatorRepository extends BaseRepository<Operator> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService, roleService: RoleService) {
    super(Operator, dataSource, listCacheService, roleService);
  }
}
