import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaticData } from './entities/static-data.entity';

@Injectable()
export class StaticDataService {
  constructor(
    @InjectRepository(StaticData)
    private readonly staticDataRepository: Repository<StaticData>,
  ) {}

  async getByKey(key: string): Promise<StaticData | null> {
    return this.staticDataRepository.findOne({ where: { key } });
  }
}