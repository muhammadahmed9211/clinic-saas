import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateKycStatusArabicTranslationsSeedService } from './create-kyc-status-arabic-translations-seed.service';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label, LabelTranslation])],
  providers: [CreateKycStatusArabicTranslationsSeedService],
  exports: [CreateKycStatusArabicTranslationsSeedService],
})
export class CreateKycStatusArabicTranslationsSeedModule {}
