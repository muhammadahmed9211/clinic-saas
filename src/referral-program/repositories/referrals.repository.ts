import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { Referrals } from '../entities/referrals.entity';

@Injectable()
export class ReferralsRepository extends BaseRepository<Referrals> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Referrals, dataSource, listCacheService);
  }
}
