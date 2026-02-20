import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { BankAccount } from '../entities/bank-account.entity';
@Injectable()
export class BankAccountRepository extends BaseRepository<BankAccount> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(BankAccount, dataSource, listCacheService);
  }
}
