import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityLog } from 'src/events/entities/active-log.entity';
import { In, Repository } from 'typeorm';
import { ActiveLogDTO } from './dto/get-active-log.dto';
import { ActivityLogType } from 'src/events/entities/active-log-type.entity';
import { GetOperatorLogDto, GetUserLogDto } from './dto/get-user-log.dto';
import { UserLog } from 'src/events/entities/user-log.entity';
import { User } from 'src/users/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { entityType } from './active-log.type';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';


export enum ActivityFields {
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

interface IActivityLogEmit {
  newData: IData;
  oldData: IData;
  entityId: number;
  performerId: User['id'] | Operator['id'];
  field: ActivityFields;
  entityType: string;
}

@Injectable()
export class ActiveLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(ActivityLogType)
    private readonly logTypeRepository: Repository<ActivityLogType>,
    @InjectRepository(UserLog)
    private readonly userLogRepository: Repository<UserLog>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly eventEmitter: EventEmitter2
  ) { }

  async getLogs(payload: ActiveLogDTO): Promise<any> {
    const newArr: object[] = [];
    const data = await this.activityLogRepository.find({
      where: [
        { entity_id: Number(payload.entity_id) },
        { parent_id: Number(payload.parent_id) },
      ],
      order: { createdAt: 'DESC' },
    });

    //TODO - optimization required
    for await (const iterator of data) {
      const logsType = await this.logTypeRepository.find({
        where: [
          { type: 'ActivityLogAction', key: iterator.action },
          { type: 'ActivityLogEntityType', key: iterator.entity_type },
          { type: 'ActivityLogPerformerType', key: iterator.performer_type },
          { type: 'ActivityLogTriggerType', key: iterator.trigger_type },
          { type: 'ActivityLogEntityType', key: iterator.parent_type },
        ],
      });

      const action = logsType.find(
        (item) =>
          item.type === 'ActivityLogAction' && item.key === iterator.action,
      );
      const entity = logsType.find(
        (item) =>
          item.type === 'ActivityLogEntityType' &&
          item.key === iterator.entity_type,
      );
      const performer = logsType.find(
        (item) =>
          item.type === 'ActivityLogPerformerType' &&
          item.key === iterator.performer_type,
      );
      const trigger = logsType.find(
        (item) =>
          item.type === 'ActivityLogTriggerType' &&
          item.key === iterator.trigger_type,
      );
      const parent = logsType.find(
        (item) =>
          item.type === 'ActivityLogEntityType' &&
          item.key === iterator.parent_type,
      );

      newArr.push({
        ...iterator,
        action: action?.value,
        entity_type: entity?.value,
        performer_type: performer?.value,
        trigger_type: trigger?.value,
        parent_type: parent?.value,
      });
    }

    return newArr;
  }

  // async getUserLogs(payload: GetUserLogDto) {
  //   const arrEntity: number[] = [];
  //   const arrPerformer: number[] = [];
  //   const arr: object[] = [];

  //   const transaction = await this.transactionRepository.find({
  //     where: { user: { id: Number(payload.entity_id) } },
  //   });
  //   const transactionId = transaction.map((item) => item.id);

  //   const entityType = await this.logTypeRepository.findOne({
  //     where: { type: 'ActivityLogEntityType', value: payload.entity_type },
  //   });

  //   transactionId.push(payload.entity_id);
  //   let data: UserLog[];
  //   if (entityType && payload.entity_type) {
  //     data = await this.userLogRepository.find({
  //       where: [
  //         { entity_id: In(transactionId), entity_type: entityType?.key },
  //         { parent_id: payload.parent_id },
  //       ],
  //       order: { createdAt: 'DESC' },
  //     });
  //   } else {
  //     data = await this.userLogRepository.find({
  //       where: [
  //         { entity_id: In(transactionId) },
  //         { parent_id: payload.parent_id },
  //       ],
  //       order: { createdAt: 'DESC' },
  //     });
  //   }

  //   for await (const iterator of data) {
  //     arrEntity.push(iterator.entity_type);
  //     arrPerformer.push(iterator.performer_id);
  //   }

  //   const performerType = await this.userRepository.find({
  //     where: [{ operator: { id: In(arrPerformer) } }, { id: In(arrPerformer) }],
  //   });

  //   // if (performerType.length == 0) {
  //   //   performerType = await this.userRepository.find({
  //   //     where: { id: In(arrPerformer) },
  //   //   });
  //   // }

  //   const type = await this.logTypeRepository.find({
  //     where: { type: 'ActivityLogEntityType', key: In(arrEntity) },
  //   });

  //   for await (const iterator of data) {
  //     const entity = type.find((item) => item.key === iterator.entity_type);

  //     const performer = performerType.find((value) =>
  //       value.id == iterator.performer_id
  //         ? value?.id == iterator.performer_id
  //         : value.operator?.id == iterator.performer_id,
  //     );

  //     arr.push({
  //       ...iterator,
  //       entity_type: entity?.value,
  //       performer_type: `${performer?.firstName ? performer.firstName : ''} ${
  //         performer?.lastName ? performer?.lastName : ''
  //       }`,
  //     });
  //   }

  //   return arr;
  // }
  async getUserLogs(payload: GetUserLogDto) {
    const arrEntity: number[] = [];
    const arrPerformer: number[] = [];
    const arrParent: number[] = [];
    const arr: object[] = [];

    const transaction = await this.transactionRepository.find({
      where: { user: { id: Number(payload.entity_id) } },
    });
    const transactionId = transaction.map((item) => item.id);

    const entityType = await this.logTypeRepository.findOne({
      where: { type: 'ActivityLogEntityType', value: payload.entity_type },
    });

    const parentType = await this.logTypeRepository.findOne({
      where: { type: 'ActivityLogEntityType', value: payload.parent_type },
    });

    transactionId.push(payload.entity_id);

    let data: UserLog[];
    let total: number | undefined;

    if (entityType && payload.entity_type) {
      const page = payload.page || 1;
      const limit = payload.limit || 10;
      const skip = (page - 1) * limit;

      [data, total] = await this.userLogRepository.findAndCount({
        where: [
          { entity_id: In(transactionId), entity_type: entityType?.key },
          { parent_id: payload.parent_id, parent_type: parentType?.key },
        ],
        order: { createdAt: 'DESC' },
        skip,
        take: limit,
      });
    } else {
      data = await this.userLogRepository.find({
        where: [
          { entity_id: In(transactionId) },
          { parent_id: payload.parent_id },
        ],
        order: { createdAt: 'DESC' },
      });
    }

    for await (const iterator of data) {
      arrEntity.push(iterator.entity_type);
      arrPerformer.push(iterator.performer_id);
      arrParent.push(iterator.parent_type);
    }

    const performerType = await this.userRepository.find({
      where: [
        { operator: { id: In(arrPerformer) } },
        { id: In(arrPerformer) },
      ],
      withDeleted: true,
    });

    const type = await this.logTypeRepository.find({
      where: { type: 'ActivityLogEntityType', key: In(arrEntity) },
    });

    const parentTypeLog = await this.logTypeRepository.find({
      where: { type: 'ActivityLogEntityType', key: In(arrParent) },
    });

    for await (const iterator of data) {
      const entity = type.find((item) => item.key === iterator.entity_type);
      const parent = parentTypeLog.find(
        (item) => item.key === iterator.parent_type,
      );

      const performer = performerType.find((value) =>
        value.id == iterator.performer_id
          ? value?.id == iterator.performer_id
          : value.operator?.id == iterator.performer_id,
      );

      arr.push({
        ...iterator,
        entity_type: entity?.value,
        parent_type: parent?.value,
        performer_type: `${performer?.firstName ? performer.firstName : ''} ${performer?.lastName ? performer?.lastName : ''
          }`,
      });
    }

    if (total !== undefined) {
      const page = payload.page || 1;
      const limit = payload.limit || 10;

      return {
        data: arr,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return arr;
  }

  // async getOperatorLogs(payload: GetOperatorLogDto) {
  //   const arrEntity: number[] = [];
  //   const arrPerformer: number[] = [];
  //   const arr: object[] = [];
  //   const page = payload.page || 1;
  //   const limit = payload.limit || 10;
  //   const skip = (page - 1) * limit;

  //   const userId = await this.userRepository.findOne({
  //     where: { operator: { id: payload.performer_id } },
  //   });

  //   const performer = await this.logTypeRepository.findOne({
  //     where: { type: 'ActivityLogEntityType', value: entityType.OPERATOR },
  //   });

  //   const [data, total] = await this.userLogRepository.findAndCount({
  //     where: [
  //       { performer_id: payload.performer_id, performer_type: performer?.key },
  //       { performer_id: userId?.id, performer_type: performer?.key },
  //     ],
  //     order: { createdAt: 'DESC' },
  //     skip,
  //     take: limit,
  //   });

  //   for await (const iterator of data) {
  //     arrEntity.push(iterator.entity_type);
  //     arrPerformer.push(iterator.performer_id);
  //   }

  //   // const performerType = await this.userRepository.find({
  //   //   where: [{ operator: { id: In(arrPerformer) } }, { id: In(arrPerformer) }],
  //   // });

  //   const batchSize = 1000; // Adjust the batch size as needed
  //   let performerType: User[] = [];
  //   for (let i = 0; i < arrPerformer.length; i += batchSize) {
  //     const batch = arrPerformer.slice(i, i + batchSize);
  //     const batchResults = await this.userRepository.find({
  //       where: { operator: { id: In(batch) } },
  //     });
  //     performerType = performerType.concat(batchResults);
  //   }

  //   // Batch the type query
  //   let type: ActivityLogType[] = [];
  //   for (let i = 0; i < arrEntity.length; i += batchSize) {
  //     const batch = arrEntity.slice(i, i + batchSize);
  //     const batchResults = await this.logTypeRepository.find({
  //       where: { type: 'ActivityLogEntityType', key: In(batch) },
  //     });
  //     type = type.concat(batchResults);
  //   }

  //   // if (performerType.length == 0) {
  //   //   performerType = await this.userRepository.find({
  //   //     where: { id: In(arrPerformer) },
  //   //   });
  //   // }

  //   // const type = await this.logTypeRepository.find({
  //   //   where: { type: 'ActivityLogEntityType', key: In(arrEntity) },
  //   // });

  //   for await (const iterator of data) {
  //     const entity = type.find((item) => item.key === iterator.entity_type);

  //     const performer = performerType.find((value) =>
  //       value.id == iterator.performer_id
  //         ? value?.id == iterator.performer_id
  //         : value.operator?.id == iterator.performer_id,
  //     );

  //     arr.push({
  //       ...iterator,
  //       entity_type: entity?.value,
  //       performer_type: `${performer?.firstName ? performer.firstName : ''} ${
  //         performer?.lastName ? performer?.lastName : ''
  //       }`,
  //     });
  //   }

  //   // return arr;
  //   return {
  //     data: arr,
  //     meta: {
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //   };
  // }
  async getOperatorLogs(payload: GetOperatorLogDto) {
    const page = payload.page || 1;
    const limit = payload.limit || 10;
    const skip = (page - 1) * limit;

    // Fetch user and performer in parallel
    const [user, performer] = await Promise.all([
      this.userRepository.findOne({
        where: { operator: { id: payload.performer_id } },
      }),
      this.logTypeRepository.findOne({
        where: { type: 'ActivityLogEntityType', value: entityType.OPERATOR },
      }),
    ]);

    // Fetch logs with pagination
    const [data, total] = await this.userLogRepository.findAndCount({
      where: [
        { performer_id: payload.performer_id, performer_type: performer?.key },
        { performer_id: user?.id, performer_type: performer?.key },
      ],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    // Extract unique entity types and performer IDs
    const uniqueEntityTypes = [...new Set(data.map((log) => log.entity_type))];
    const uniquePerformerIds = [
      ...new Set(data.map((log) => log.performer_id)),
    ];

    // Batch fetch performer types and entity types
    const batchSize = 1000; // Adjust the batch size as needed
    const performerTypePromises: Promise<User[]>[] = [];
    const typePromises: Promise<ActivityLogType[]>[] = [];

    for (let i = 0; i < uniquePerformerIds.length; i += batchSize) {
      const batch = uniquePerformerIds.slice(i, i + batchSize);
      performerTypePromises.push(
        this.userRepository.find({
          where: { operator: { id: In(batch) } },
        }),
      );
    }

    for (let i = 0; i < uniqueEntityTypes.length; i += batchSize) {
      const batch = uniqueEntityTypes.slice(i, i + batchSize);
      typePromises.push(
        this.logTypeRepository.find({
          where: { type: 'ActivityLogEntityType', key: In(batch) },
        }),
      );
    }

    const [performerTypeResults, typeResults] = await Promise.all([
      Promise.all(performerTypePromises).then((results) => results.flat()),
      Promise.all(typePromises).then((results) => results.flat()),
    ]);

    // Map results for quick lookup
    const performerTypeMap = new Map(
      performerTypeResults.map((user) => [user.id, user]),
    );
    const typeMap = new Map(typeResults.map((type) => [type.key, type.value]));

    // Construct the final data array
    const arr = data.map((log) => {
      const entity = typeMap.get(log.entity_type);
      const performer = performerTypeMap.get(log.performer_id);

      return {
        ...log,
        entity_type: entity,
        performer_type: `${performer?.firstName || ''} ${performer?.lastName || ''
          }`.trim(),
      };
    });

    return {
      data: arr,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  emitLog(value: IActivityLogEmit, performerType: PerformerType = PerformerType.OPERATOR): boolean {
    const { performerId, entityId, newData, oldData, field, entityType } = value;

    const parentType = ParentType.OPERATOR;
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
