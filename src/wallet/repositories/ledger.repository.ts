import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { Ledger } from '../entities/ledger.entity';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';

@Injectable()
export class LedgerRepository extends BaseRepository<Ledger> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Ledger, dataSource, listCacheService);
  }
}
