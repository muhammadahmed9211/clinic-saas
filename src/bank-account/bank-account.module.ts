import { Module } from '@nestjs/common';
import { BankAccountController } from './bank-account.controller';
import { BankAccountModule as AdminModule } from 'src/admin/bank-account/bank-account.module';
import { ClientRepository } from 'src/users/repositories/client.repository';

@Module({
  imports: [AdminModule],
  controllers: [BankAccountController],
  providers: [ClientRepository],
})
export class BankAccountModule {}