import { Module } from '@nestjs/common';
import { PspCountryService } from './psp-country.service';
import { PspCountryController } from './psp-country.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PspCountriesPriority } from 'src/psp/entities/psp-countries-priority.entity';
import { Countries } from 'src/psp/entities/countries.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import { PspCountriesPriorityConfigRepository } from './repositories/psp-countries-priority-config.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PspCountriesPriority, Countries, PSP])],
  controllers: [PspCountryController],
  providers: [PspCountriesPriorityConfigRepository, PspCountryService],
})
export class PspCountryModule { }
