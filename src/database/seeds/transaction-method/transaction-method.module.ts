import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionMethodService } from './transaction-method.service';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionMethod])],
  providers: [TransactionMethodService],
  exports: [TransactionMethodService],
})
export class TransactionMethodModule {}
