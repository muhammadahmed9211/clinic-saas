import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { RegulationRule } from '../regulations-config/entities/regulation-rule.entity';

@Injectable()
export class RegulationRuleRepository extends BaseRepository<RegulationRule> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(RegulationRule, dataSource, listCacheService);
  }
}
