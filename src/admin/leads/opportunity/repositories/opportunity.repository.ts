import { Injectable } from '@nestjs/common';
import { Opportunity } from '../entities/opportunity.entity';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class OpportunityRepository extends BaseRepository<Opportunity> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Opportunity, dataSource, listCacheService, roleService);
  }
}
