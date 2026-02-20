import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { partner_kyc_documents } from '../entities/partner_kyc_docs.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class PartnerKycDocumentsRepository extends BaseRepository<partner_kyc_documents> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(partner_kyc_documents, dataSource, listCacheService);
  }
}
