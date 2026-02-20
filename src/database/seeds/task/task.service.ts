import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskStatus } from 'src/admin/task/entities/task-status.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskSeedService {
  constructor(
    @InjectRepository(TaskStatus)
    private readonly taskStatusRepository: Repository<TaskStatus>,
  ) {}

  async run() {
    const exists = await this.taskStatusRepository.count();

    const actionTypeData = [
      {
        name: 'Not Started',
      },
      {
        name: 'Deferred',
      },
      {
        name: 'Waiting for Input',
      },
      {
        name: 'Completed',
      },
    ];

    if (exists == 0) {
      await this.taskStatusRepository.save(actionTypeData);
    }
  }
}
