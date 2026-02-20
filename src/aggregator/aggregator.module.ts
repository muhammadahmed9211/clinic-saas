import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { AggregatorController } from './aggregator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregatorPSP } from './entities/aggregator.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import { AggregatorPSPRepository } from './repositories/aggregator-psp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AggregatorPSP, PSP])],
  controllers: [AggregatorController],
  providers: [AggregatorService, AggregatorPSPRepository],
  exports: [AggregatorService],
})
export class AggregatorModule {}
