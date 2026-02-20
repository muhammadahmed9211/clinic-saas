import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Currencies } from './entities/currencies.entity';

@Injectable()
export class CurrenciesService {
  constructor(@InjectRepository(Currencies)
  private readonly currenciesRepository: Repository<Currencies>) { }

  async findAll() {
    const currencies = await this.currenciesRepository.find({ where: { isActive: true } });
    return currencies;
  }
}
