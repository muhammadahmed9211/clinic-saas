import { Module } from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';
import { BankDetailsController } from './bank-details.controller';
import { BankDetailRepository } from './repositories/bank-detail.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankDetail } from './entities/bank-detail.entity';
import { FilesModule } from 'src/files/files.module';
@Module({
  imports: [FilesModule, TypeOrmModule.forFeature([BankDetail])],
  controllers: [BankDetailsController],
  providers: [BankDetailRepository, BankDetailsService],
  exports: [BankDetailsService],
})
export class BankDetailsModule {}
