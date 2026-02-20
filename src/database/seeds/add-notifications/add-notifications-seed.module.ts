import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { addNotificationsSeedService } from './add-notifications-seed.service';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Label, LabelTranslation])],
  providers: [addNotificationsSeedService],
  exports: [addNotificationsSeedService],
})
export class addNotificationsSeedModule {}
