import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStatus } from 'src/admin/task/entities/task-status.entity';
import { TaskSeedService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStatus])],
  providers: [TaskSeedService],
  exports: [TaskSeedService],
})
export class TaskSeedModule {}
