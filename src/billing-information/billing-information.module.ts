import { Module } from '@nestjs/common';
import { BillingInformationService } from './billing-information.service';
import { BillingInformationController } from './billing-information.controller';
import { BillingInformationRepository } from './repositories/billing-information.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Countries } from 'src/psp/entities/countries.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Countries])],
  controllers: [BillingInformationController],
  providers: [BillingInformationRepository, BillingInformationService],
  exports: [BillingInformationService],
})
export class BillingInformationModule {}
