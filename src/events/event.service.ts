import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/events.entity';
import { ActivityLog } from './entities/active-log.entity';
import { EventCreateDto } from './dto/create-event.dto';
import { ActiveLogDto } from './dto/active-log-create.dto';
import { ActivityLogType } from './entities/active-log-type.entity';
import { UserLogDto } from './dto/user-log-create.dto';
import { UserLog } from './entities/user-log.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(ActivityLogType)
    private actionTypeRepository: Repository<ActivityLogType>,
    @InjectRepository(UserLog)
    private userLogRepository: Repository<UserLog>,
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async create(data: EventCreateDto): Promise<Event> {
    const serviceExist = await this.eventRepository.findOne({
      where: { serviceName: data.serviceName },
    });
    if (serviceExist) {
      throw new HttpException('Service already exist', 400);
    }
    return await this.eventRepository.save(data);
  }

  async createLog(payload: ActiveLogDto) {
    const logs = await this.actionTypeRepository.find({
      where: [
        { type: 'ActivityLogAction', value: payload.action },
        { type: 'ActivityLogEntityType', value: payload.entity_type },
        { type: 'ActivityLogPerformerType', value: payload.performer_type },
        { type: 'ActivityLogTriggerType', value: payload.trigger_type },
        { type: 'ActivityLogEntityType', value: payload.parent_type },
      ],
    });

    const action = logs.find((item) => item.value === payload.action);
    const entity = logs.find((item) => item.value === payload.entity_type);
    const performer = logs.find(
      (item) => item.value === payload.performer_type,
    );
    const trigger = logs.find((item) => item.value === payload.trigger_type);
    const parent = logs.find((item) => item.value === payload.parent_type);

    return await this.activityLogRepository.save({
      action: action?.key,
      entity_id: payload.entity_id,
      entity_type: entity?.key,
      json_object: JSON.stringify(payload.json_object),
      parent_id: payload.parent_id,
      parent_type: parent?.key,
      performer_id: payload.performer_id,
      performer_type: performer?.key,
      archive_insertion_date: payload.archive_insertion_date,
      is_from_archive: payload.is_from_archive,
      trigger_type: trigger?.key,
    });
  }

  async createUserLog(payload: UserLogDto) {
    const logs = await this.actionTypeRepository.find({
      where: [
        { type: 'ActivityLogEntityType', value: payload.entity_type },
        { type: 'ActivityLogPerformerType', value: payload.performer_type },
        { type: 'ActivityLogEntityType', value: payload.parent_type },
      ],
    });

    let performer;
    const entity = logs.find((item) => item.value?.toLowerCase() === payload.entity_type?.toLowerCase())?.key;
    const parent = logs.find((item) => item.value?.toLowerCase() === payload.parent_type?.toLowerCase())?.key;
    if (payload.performer_type && payload.performer_id !== 1) {
      performer = logs.find((item) => item.value?.toLowerCase() === payload.performer_type?.toLowerCase())
        ?.key;
    } else {
      performer = 3;
    }

    return await this.userLogRepository.save({
      ...payload,
      entity_id: payload.entity_id.toString(),
      entity_type: Number(entity),
      parent_id: payload.parent_id?.toString(),
      parent_type: Number(parent),
      performer_type: Number(performer),
    });
  }

  async getAll(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getById(data: any) {
    const eventData = await this.eventRepository.findOneBy({
      serviceName: data.serviceName,
    });
    console.log('return data: ', eventData);
  }
}
