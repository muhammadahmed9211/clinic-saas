import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { Regulations } from '../entities/regulations.entity';

@Injectable()
export class RegulationsRepository extends BaseRepository<Regulations> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Regulations, dataSource, listCacheService);
  }
}
