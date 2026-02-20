import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { RegulationEvent } from '../regulations-config/entities/regulation-event.entity';

@Injectable()
export class RegulationEventRepository extends BaseRepository<RegulationEvent> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(RegulationEvent, dataSource, listCacheService);
  }
}
