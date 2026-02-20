import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository/base-repository';
import { ListCacheService } from 'src/list-cache/list-cache-service';
import { DataSource } from 'typeorm';
import { Referrals } from '../entities/referrals.entity';
import { ReferralProgram } from '../entities/referral-program.entity';

@Injectable()
export class ReferralProgramRepository extends BaseRepository<ReferralProgram> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(ReferralProgram, dataSource, listCacheService);
  }
}
