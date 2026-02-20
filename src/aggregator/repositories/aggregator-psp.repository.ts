import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { AggregatorPSP } from '../entities/aggregator.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AggregatorPSPRepository extends BaseRepository<AggregatorPSP> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(AggregatorPSP, dataSource, listCacheService);
  }
}
