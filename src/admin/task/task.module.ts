import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminTask } from './entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { TaskStatus } from './entities/task-status.entity';
import { AdminTaskRepository } from './repositories/admin-task.respository';
import { Partner } from 'src/settings/entities/partner.entity';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import { Lead } from '../leads/entities/lead.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminTask,
      User,
      TaskStatus,
      Partner,
      Operator,
      Label,
      notifications,
      Lead,
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService, AdminTaskRepository, ClientRepository],
  exports: [TaskService],
})
export class TaskModule {}
