import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateRejectedReasonsSeedService } from './create-rejected-reasons-seed.service';
import { RejectedReason } from 'src/admin/kyc/entities/rejected_reasons.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RejectedReason, Label, LabelTranslation]),
  ],
  providers: [CreateRejectedReasonsSeedService],
  exports: [CreateRejectedReasonsSeedService],
})
export class CreateRejectedReasonsSeedModule {}
