import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exchange } from 'src/transaction/entities/exchange.entity';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { Repository } from 'typeorm';
import { PspService } from 'src/psp/psp.service';

@Injectable()
export class ExchangeService {
  constructor(
    @InjectRepository(Exchange)
    private readonly exchangeRepository: Repository<Exchange>,
    private readonly pspService:PspService
  ) {}

  async create(createExchangeDto: CreateExchangeDto, userId: number) {
    const exchange = this.exchangeRepository.create({
      ...createExchangeDto,
      user: { id: userId },
    });
    const entity = await this.exchangeRepository.save(exchange);
    await this.pspService.createExchangeOrBankPsp(entity.name , userId, entity.id, 'Exchange')
    return { entity };
  }

  async findAll() {
    const entities = await this.exchangeRepository.find();
    return entities;
  }
}
