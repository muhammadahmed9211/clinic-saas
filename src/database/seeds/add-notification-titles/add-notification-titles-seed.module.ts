import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { titlesSeedService } from './add-notification-titles-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Label, LabelTranslation])],
  providers: [titlesSeedService],
  exports: [titlesSeedService],
})
export class titlesSeedModule {}
