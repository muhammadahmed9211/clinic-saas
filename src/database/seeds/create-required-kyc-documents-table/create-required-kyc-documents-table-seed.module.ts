import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { required_kyc_documents } from 'src/admin/kyc/entities/admin-kyc.entity';
import { CreateRequiredKYCDocumentsTableSeedService } from './create-required-kyc-documents-table-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([required_kyc_documents])],
  providers: [CreateRequiredKYCDocumentsTableSeedService],
  exports: [CreateRequiredKYCDocumentsTableSeedService],
})
export class CreateRequiredKYCDocumentsTableSeedModule {}
