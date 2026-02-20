import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { BankAccount } from './entities/bank-account.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesModule } from 'src/files/files.module';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { BankAccountRegulations } from './entities/bank-account-regulation.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { PspModule } from 'src/psp/psp.module';
import { BankAccountCountries } from './entities/bank-account-countries.entity';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { Countries } from 'src/psp/entities/countries.entity';
import { BankAccountMethods } from './entities/bank-account-methods.entity';
import { Currencies } from 'src/currencies/entities/currencies.entity';
@Module({
  imports: [
    FilesModule,
    PspModule,
    TypeOrmModule.forFeature([
      BankAccount,
      Wallet,
      FileEntity,
      BankAccountRegulations,
      Regulations,
      BankAccountCountries,
      BillingInformation,
      Countries,
      BankAccountMethods,
      Currencies
    ]),
  ],
  controllers: [BankAccountController],
  providers: [BankAccountService, BankAccountRepository],
  exports: [BankAccountService],
})
export class BankAccountModule {}