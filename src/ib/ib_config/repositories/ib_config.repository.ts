import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { IbCommissionProfileConfig } from '../entities/ib_commission_profile_config.entity';
import { IbDistribution } from '../entities/ib_distribution.entity';
import { IbDistributionValue } from '../entities/ib_distribution_value.entity';

@Injectable()
export class IbConfigRepository extends BaseRepository<IbCommissionProfileConfig> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(IbCommissionProfileConfig, dataSource, listCacheService, roleService);
  }

  async getProfileConfigWithRelations(id: number) {
    return this.findOne({
      where: { id, isActive: true },
      relations: [
        'commissionProfile',
        'profileType',
        'createdBy',
        'distributions',
        'distributions.distributionValues'
      ]
    });
  }

  async getAllProfileConfigsWithRelations() {
    return this.find({
      where: { isActive: true },
      relations: [
        'commissionProfile',
        'profileType',
        'createdBy',
        'distributions',
        'distributions.distributionValues'
      ]
    });
  }
}

@Injectable()
export class IbDistributionRepository extends BaseRepository<IbDistribution> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(IbDistribution, dataSource, listCacheService, roleService);
  }
}

@Injectable()
export class IbDistributionValueRepository extends BaseRepository<IbDistributionValue> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(IbDistributionValue, dataSource, listCacheService, roleService);
  }
}
