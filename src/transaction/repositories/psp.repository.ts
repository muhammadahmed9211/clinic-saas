import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { DataSource } from 'typeorm';
import { PSP } from '../entities/psp.entity';
import { ListCacheService } from 'src/list-cache/list-cache-service';

@Injectable()
export class PspRepository extends BaseRepository<PSP> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(PSP, dataSource, listCacheService);
  }

  public async getDefaultPSP() {
    return this.findOne({ where: { name: 'NONE' } });
  }
}
