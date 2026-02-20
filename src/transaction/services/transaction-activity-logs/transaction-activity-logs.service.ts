import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { EventTypes } from 'src/common/services/event.type';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';

export enum TransactionAction {
  RECORD_CREATED = 'Record Created',
  DETAILS_UPDATED = 'Details Updated',
  CREDIT_IN = 'Credit In',
  CREDIT_OUT = 'Credit Out',
  BONUS_IN = 'Bonus In',
  BONUS_OUT = 'Bonus Out',
}

export enum PerformerType {
  USER = 'User',
  OPERATOR = 'Operator',
}

type IData = null | object;

interface ITransactionEvent {
  newData: IData;
  oldData: IData;
  entityId: Transaction['id'] | number;
  performerId: User['id'] | Operator['id'];
  performerType: PerformerType;
  field: TransactionAction;
  entityType?: string;
}

@Injectable()
export class TransactionActivityLogsService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  getPerformerType(user: User, isSystem?: boolean): PerformerType {
    if (isSystem) {
      return PerformerType.OPERATOR;
    }
    if (user.role?.name === 'Client') {
      return PerformerType.USER;
    }
    return PerformerType.OPERATOR;
  }
  emit(value: ITransactionEvent): boolean {
    const entityType = value?.entityType || 'Transaction';
    return this.eventEmitter.emit(EventTypes.USER_LOG, {
      ...value,
      entityType,
    });
  }
}
