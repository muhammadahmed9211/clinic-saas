import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterTaskSeedService } from './masterTask.service';
import { MasterTask } from 'src/tasks/entities/master_task.entity';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MasterTask, Label, LabelTranslation])],
  providers: [MasterTaskSeedService],
  exports: [MasterTaskSeedService],
})
export class MasterTaskSeedModule {}
