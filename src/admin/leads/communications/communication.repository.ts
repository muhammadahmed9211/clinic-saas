import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { Communication } from 'src/admin/client/entities/communication.entity';
import { RoleService } from 'src/roles/role.service';

@Injectable()
export class CommunicationRepository extends BaseRepository<Communication> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(Communication, dataSource, listCacheService, roleService);
  }
}
