import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { RoleService } from 'src/roles/role.service';
import { NotificationMessages } from '../entity/notification_messages.entity';

@Injectable()
export class NotificationLabelRepository extends BaseRepository<NotificationMessages> {
  constructor(
    dataSource: DataSource,
    listCacheService: ListCacheService,
    roleService: RoleService,
  ) {
    super(NotificationMessages, dataSource, listCacheService, roleService);
  }
}
