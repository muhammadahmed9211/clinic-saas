import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { Partner } from 'src/settings/entities/partner.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class PartnerRepository extends BaseRepository<Partner> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Partner, dataSource, listCacheService);
  }
}
