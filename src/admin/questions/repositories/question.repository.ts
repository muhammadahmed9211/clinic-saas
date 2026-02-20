import { BaseRepository } from 'src/database/base-repository/base-repository';
import { LeadQuestion } from '../entities/question.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ListCacheService } from 'src/list-cache/list-cache-service';

@Injectable()
export class LeadQuestionRepository extends BaseRepository<LeadQuestion> {
  constructor(dataSource: DataSource, listCacheService: ListCacheService) {
    super(LeadQuestion, dataSource, listCacheService);
  }
}
