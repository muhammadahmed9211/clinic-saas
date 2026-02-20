import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { Server } from '../entities/server.entity';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class ServerRepository extends BaseRepository<Server> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Server, dataSource, listCacheService);
  }
}
