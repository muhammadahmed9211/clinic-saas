import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { Bonus } from '../entities/bonus.entity';

@Injectable()
export class BonusRepository extends BaseRepository<Bonus> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(Bonus, dataSource, listCacheService);
  }
}

export const BonusRepositoryProvider = {
  provide: BonusRepository,
  useFactory: (dataSource: DataSource, listCacheService: ListCacheService) => {
    return new BonusRepository(dataSource, listCacheService);
  },
  inject: [DataSource, ListCacheService],
};

