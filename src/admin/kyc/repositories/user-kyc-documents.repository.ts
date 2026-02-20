import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { user_kyc_documents } from 'src/user-kyc-docs/entities/user-kyc-documents.entity';
import { DataSource } from 'typeorm';
@Injectable()
export class UserKycDocumentsRepository extends BaseRepository<user_kyc_documents> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(user_kyc_documents, dataSource, listCacheService, roleService);
  }
}
