import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateSalesRetentionInfoSeedService } from './create-sales-retention-info-seed.service';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CustomStatus])],
  providers: [CreateSalesRetentionInfoSeedService],
  exports: [CreateSalesRetentionInfoSeedService],
})
export class CreateSalesRetentionInfoSeedModule {}
