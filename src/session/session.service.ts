import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptions } from 'src/utils/types/find-options.type';
import { DeepPartial, Not, Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { NullableType } from '../utils/types/nullable.type';
import { User } from 'src/users/entities/user.entity';
import { OperatorSession } from './entities/operator_session.entity';
import { DeviceInfo } from 'src/push-notification/entities/device-info.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(OperatorSession)
    private readonly operatorSessionRepository: Repository<OperatorSession>,
    @InjectRepository(DeviceInfo)
    private readonly deviceInfoRepository: Repository<DeviceInfo>,
  ) {}

  async findOne(options: FindOptions<Session>): Promise<NullableType<Session>> {
    return this.sessionRepository.findOne({
      where: options.where,
      relations: ['user'],
    });
  }

  async findMany(options: FindOptions<Session>): Promise<Session[]> {
    return this.sessionRepository.find({
      where: options.where,
    });
  }

  async create(data: DeepPartial<Session>): Promise<Session> {
    return this.sessionRepository.save(this.sessionRepository.create(data));
  }

  async createOperator(
    data: DeepPartial<OperatorSession>,
  ): Promise<OperatorSession> {
    return this.operatorSessionRepository.save(
      this.operatorSessionRepository.create(data),
    );
  }

  async softDelete({
    excludeId,
    ...criteria
  }: {
    id?: Session['id'];
    user?: Pick<User, 'id'>;
    excludeId?: Session['id'];
  }): Promise<void> {
    await this.sessionRepository.softDelete({
      ...criteria,
      id: criteria.id ? criteria.id : excludeId ? Not(excludeId) : undefined,
    });
  }

  async saveFcmToken(sessionId: number, fcmToken: string, deviceId: string) {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });
    if (!session) {
      throw new Error('Session not found');
    }
    await this.sessionRepository.save({
      ...session,
      fcmToken,
    });

    console.log('deviceid', deviceId);

    if (deviceId) {
      const device = await this.deviceInfoRepository.findOne({
        where: {
          deviceId: deviceId,
        },
      });

      if (device) {
        await this.deviceInfoRepository.save({
          ...device,
          fcmToken,
        });
      }
    }

    return {
      status: 0,
      statusCode: 200,
      message: 'Token saved successfully',
      result: {
        token: fcmToken,
      },
    };
  }
}
