import { Module } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesController } from './currencies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currencies } from './entities/currencies.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Currencies])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
  exports:[CurrenciesService]
})
export class CurrenciesModule {}
