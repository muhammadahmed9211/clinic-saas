import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterDeviceDto } from './dto/device-info.dto';
import { User } from 'src/users/entities/user.entity';
import { UserRepository } from 'src/users/repositories/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceInfo } from './entities/device-info.entity';
import { IsNull, Not, Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import {
  SendPushNotificationDto,
  SendPushNotificationRequest,
} from './dto/push-notification.dto';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(DeviceInfo)
    private readonly deviceInfoRepository: Repository<DeviceInfo>,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
    private readonly kafkaService: KafkaService,
  ) {}

  async registerDevice(dto: RegisterDeviceDto) {
    try {
      let user: User | null = null;
      if (dto.userId) {
        user = await this.userRepository.findOne({
          where: { id: dto.userId },
        });
      }

      const existingDevice = await this.deviceInfoRepository.findOne({
        where: { deviceId: dto.deviceId },
      });

      if (existingDevice) {
        return this.deviceInfoRepository.save({
          ...existingDevice,
          osVersion: dto.osVersion,
          appVersion: dto.appVersion,
          fcmToken: dto.fcmToken,
          ipAddress: dto.ipAddress,
          location: dto.location,
          timezone: dto.timezone,
          isRegistered: false,
          locale: dto?.locale,
          lastAppOpenTime: new Date(),
          disableNotifications: false,
          isActive: true,
        });
      } else {
        const device = this.deviceInfoRepository.create({
          deviceId: dto.deviceId,
          deviceType: dto.deviceType,
          name: dto.name,
          model: dto.model,
          manufacturer: dto.manufacturer,
          brand: dto.brand,
          os: dto.os,
          osVersion: dto.osVersion,
          appVersion: dto.appVersion,
          fcmToken: dto.fcmToken,
          ipAddress: dto.ipAddress,
          location: dto.location,
          timezone: dto.timezone,
          isRegistered: false,
          locale: dto?.locale,
          lastAppOpenTime: new Date(),
          disableNotifications: false,
          isActive: true,
        });

        return this.deviceInfoRepository.save(device);
      }
    } catch (err) {
      console.error(
        'Error registering device in pushNotificationService:',
        err,
      );
      throw err;
    }
  }

  async sendPushNotification(body: SendPushNotificationRequest) {
    return this.kafkaService.emitNotification(
      this.notificationClient,
      'notification.request',
      body,
    );
  }

  async sendPushNotificationToFirebase(body: SendPushNotificationDto) {
    try {
      const message = {
        token: body.fcmToken,
        notification: body.notification,
        data: body.data || {},
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  async getFcmTokensByUserId(userId: number) {
    const devices = await this.deviceInfoRepository.find({
      where: {
        user: { id: userId },
        isActive: true,
        disableNotifications: false,
        fcmToken: Not(IsNull()),
      },
    });

    return devices.map((device) => device.fcmToken);
  }
}
