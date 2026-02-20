import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Methods,
  TransactionMethod,
} from 'src/transaction/entities/transaction-method.entity';
@Injectable()
export class TransactionMethodService {
  constructor(
    @InjectRepository(TransactionMethod)
    private repository: Repository<TransactionMethod>,
  ) {}

  async run() {
    const methods = Object.keys(Methods);
    for await (const me of methods) {
      const method = Methods[me];
      const transactionMethod = await this.repository.findOneBy({ method });
      if (!transactionMethod) {
        await this.repository.save({ method });
      }
    }
  }
}
