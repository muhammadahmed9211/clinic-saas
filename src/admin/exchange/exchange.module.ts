import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from 'src/files/files.module';
import { ExchangeController } from './exchange.controller';
import { Exchange } from 'src/transaction/entities/exchange.entity';
import { ExchangeService } from './exchange.service';
import { PspModule } from 'src/psp/psp.module';

@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([Exchange]), PspModule],
  controllers: [ExchangeController],
  providers: [ExchangeService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
