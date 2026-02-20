import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { RoleService } from 'src/roles/role.service';
import { EventRegistration } from '../entities/event-registration.entity';

@Injectable()
export class EventRegistrationRepository extends BaseRepository<EventRegistration> {
    constructor(
        dataSource: DataSource,
        listCacheService: ListCacheService,
        roleService: RoleService,
    ) {
        super(EventRegistration, dataSource, listCacheService, roleService);
    }
} 