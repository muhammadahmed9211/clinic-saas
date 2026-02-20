import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { WithdrawRequest } from '../entities/withdraw-request.entity';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
@Injectable()
export class WithdrawRequestRepository extends BaseRepository<WithdrawRequest> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(WithdrawRequest, dataSource, listCacheService);
  }
}
