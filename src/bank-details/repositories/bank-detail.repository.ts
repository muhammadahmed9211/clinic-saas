import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { BankDetail } from '../entities/bank-detail.entity';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class BankDetailRepository extends BaseRepository<BankDetail> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(BankDetail, dataSource, listCacheService);
  }
}
