import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { PspCountriesPriorityConfig } from 'src/psp/entities/psp-countries-priority-config.entity';

@Injectable()
export class PspCountriesPriorityConfigRepository extends BaseRepository<PspCountriesPriorityConfig> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(PspCountriesPriorityConfig, dataSource, listCacheService);
  }

}
