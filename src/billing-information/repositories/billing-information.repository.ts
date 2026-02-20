import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { BillingInformation } from '../entities/billing-information.entity';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class BillingInformationRepository extends BaseRepository<BillingInformation> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(BillingInformation, dataSource, listCacheService);
  }
}
