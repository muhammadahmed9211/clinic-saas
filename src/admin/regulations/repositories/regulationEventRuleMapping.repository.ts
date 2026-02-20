import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { RegulationEventRuleMapping } from '../regulations-config/entities/regulation-event-rule-mapping.entity';

@Injectable()
export class RegulationsEventRuleMappingRepository extends BaseRepository<RegulationEventRuleMapping> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(RegulationEventRuleMapping, dataSource, listCacheService);
  }
}
