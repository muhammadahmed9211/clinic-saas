import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { EventTypes } from 'src/common/services/event.type';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';

export enum ListAction {
  RECORD_CREATED = 'RecordCreated',
  RECORD_DELETED = 'RecordDeleted',
  DETAILS_UPDATED = 'DetailsUpdated',
}

export enum PerformerType {
  OPERATOR = 'Operator',
}

export enum ParentType {
  OPERATOR = 'Operator',
}

type IData = null | object;

interface IListActivityLogs {
  newData: IData;
  oldData: IData;
  entityId: Transaction['id'] | number;
  performerId: User['id'] | Operator['id'];
  field: ListAction;
  entityType: string;
}

@Injectable()
export class ListActivityLogsService {
  constructor(private readonly eventEmitter: EventEmitter2) { }

  emit(value: IListActivityLogs): boolean {
    const { performerId, entityId, newData, oldData, field , entityType } = value;

    const parentType = ParentType.OPERATOR;
    const performerType = PerformerType.OPERATOR;
    return this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData,
      oldData,
      entityId,
      entityType,
      performerId,
      performerType,
      field,
      parentType
    });
  }
}
