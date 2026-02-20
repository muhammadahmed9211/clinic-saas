import { Injectable } from '@nestjs/common';
import { IbCommissionProfile } from '../entities/ib_commission_profile.entity';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { IbCommissionProfileType } from '../entities/ib_commission_profile_type.entity';
import { IbProfileDistribution } from '../entities/ib_profile_distribution.entity';
@Injectable()
export class IbProfileRepository extends BaseRepository<IbCommissionProfile> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(IbCommissionProfile, dataSource, listCacheService, roleService);
  }
}

@Injectable()
export class IbCommissionProfileTypeRepository extends BaseRepository<IbCommissionProfileType> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(IbCommissionProfileType, dataSource, listCacheService, roleService);
  }
}


@Injectable()
export class IbProfileDistributionRepository extends BaseRepository<IbProfileDistribution> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(IbProfileDistribution, dataSource, listCacheService, roleService);
  }
}

