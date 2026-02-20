import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionEvents } from 'src/transaction/entities/transaction-events.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Repository } from 'typeorm';
import {
  PerformerType,
  TransactionAction,
  TransactionActivityLogsService,
} from '../transaction-activity-logs/transaction-activity-logs.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionEventsService {
  constructor(
    @InjectRepository(TransactionEvents)
    private readonly transactionEventsRepository: Repository<TransactionEvents>,
    private readonly transactionActivityLogsService: TransactionActivityLogsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async addNewEvent(id: Transaction['id'], payload: string, ip?: string, calledBy?: string) {
    const data = this.transactionEventsRepository.create({
      transaction: {
        id,
      },
      payload,
      ip,
      calledBy,
      isProcessed: false
    });
    try {
      const operator = await this.userRepository.findOne({
        where: { operator: { full_name: 'System' }, isOperator: true },
        relations: ['operator'],
      });
      if (operator && operator?.id) {
        this.transactionActivityLogsService.emit({
          oldData: null,
          newData: JSON.parse(payload),
          entityId: id,
          performerType: PerformerType.OPERATOR,
          field: TransactionAction.DETAILS_UPDATED,
          performerId: operator.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
    return this.transactionEventsRepository.save(data);
  }

  async updateGeneratedData(id: TransactionEvents['id'], payload: any) {
    if (typeof payload !== 'string') {
      payload = JSON.stringify(payload)
    }
    return this.transactionEventsRepository.save({
      id,
      generatedPayload: payload
    });
  }

  async updateEvent(id: TransactionEvents['id'], isProcessed: boolean, responseBody: string, errorMsg: string) {
    return this.transactionEventsRepository.save({
      id,
      isProcessed, responseBody, errorMsg
    });
  }
}