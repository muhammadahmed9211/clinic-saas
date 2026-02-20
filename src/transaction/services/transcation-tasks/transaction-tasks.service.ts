import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { TaskService } from 'src/admin/task/task.service';
import {
  CreateTaskDto,
  TaskPriorityLevel,
} from 'src/admin/task/dto/create-task.dto';
import { TaskEntityType } from 'src/admin/task/entities/task.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { Lead } from 'src/admin/leads/entities/lead.entity';

enum TransactionTasks {
  MANUAL_DEPOSIT_UNDER_REVIEW = 'MANUAL_DEPOSIT_UNDER_REVIEW',
}

const ALL_TRANSACTIONS_TASKS = {
  [TransactionTasks.MANUAL_DEPOSIT_UNDER_REVIEW]: {
    subject: 'Client Deposit Transactions',
    description: 'Review Deposit request',
  },
};

interface ICreateAdminTask {
  transaction: Transaction;
  task: TransactionTasks;
}

@Injectable()
export class TransactionTaskService {
  constructor(
    private readonly taskService: TaskService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Lead) private readonly leadsRepository: Repository<Lead>,
  ) {}

  promisefy(promise: Promise<any>) {
    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    promise.then().catch();
  }

  async create(data: ICreateAdminTask) {
    const entityId = data.transaction.id;
    const taskInfo = ALL_TRANSACTIONS_TASKS[data.task];
    const contact = data.transaction.user.id;
    const lead = await this.leadsRepository.findOne({
      where: {
        clientID: data.transaction.user.id.toString(),
      },
    });
    const operator = await this.userRepository.findOne({
      where: {
        role: { id: RoleEnum.super_admin },
        isOperator: true,
        operator: Not(IsNull()),
      },
    });
    const currentDate = new Date();

    if (entityId && taskInfo && contact && operator?.operator?.id) {
      await this.taskService.create(
        {
          subject: taskInfo.subject,
          description: taskInfo.description,
          assignTo: operator?.operator.id,
          status: 'NOT STARTED',
          contact: lead?.id,
          priority: TaskPriorityLevel.HIGH,
          repeat: 'never',
          entityId,
          entity: TaskEntityType.TRANSACTION,
          dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
          reminder: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000),
        } as CreateTaskDto,
        {
          id: operator?.id,
        } as User,
      );
    }
  }

  onUserManualDepositCreate(transaction: Transaction) {
    const task = TransactionTasks.MANUAL_DEPOSIT_UNDER_REVIEW;
    this.promisefy(this.create({ transaction, task }));
  }
}
