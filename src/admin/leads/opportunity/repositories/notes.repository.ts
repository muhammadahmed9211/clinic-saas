import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class NotesRepository extends BaseRepository<notes> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(notes, dataSource, listCacheService, roleService);
  }
}
