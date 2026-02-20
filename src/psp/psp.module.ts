import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PSP } from 'src/transaction/entities/psp.entity';
import { PspController } from './psp.controller';
import { PspService } from './psp.service';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { AggregatorPSP } from 'src/aggregator/entities/aggregator.entity';
import { PspRegulations } from 'src/transaction/entities/psp-regulations.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { Countries } from './entities/countries.entity';
import { PspCountries } from './entities/psp-countries.entity';
import { PspMethod } from './entities/psp-method.entity';
import { PspCountriesPriority } from './entities/psp-countries-priority.entity';
import { TransactionAttempts } from './entities/transaction-attempts.entity';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';
import { AggregatorRegulations } from 'src/aggregator/entities/aggregator-regulations.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PSP,
      AggregatorPSP,
      PspRegulations,
      Regulations,
      Countries,
      PspCountries,
      PspMethod,
      PspCountriesPriority,
      TransactionAttempts,
      TransactionMethod,
      AggregatorRegulations
    ]),
  ],
  controllers: [PspController],
  providers: [PspService, PspRepository],
  exports: [PspService],
})
export class PspModule {}
