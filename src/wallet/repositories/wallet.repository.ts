import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { Wallet } from '../entities/wallet.entity';
import { DataSource } from 'typeorm';
import { ListCacheService } from 'src/list-cache/list-cache-service';

@Injectable()
export class WalletRepository extends BaseRepository<Wallet> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Wallet, dataSource, listCacheService);
  }
}
