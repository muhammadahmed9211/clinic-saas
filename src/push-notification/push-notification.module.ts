import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceInfo } from './entities/device-info.entity';
import { PushNotificationController } from './push-notification.controller';
import { UserRepository } from 'src/users/repositories/user.repository';
import { PushNotificationService } from './push-notification.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeviceInfo]),
    FirebaseModule,
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow(
                'kafka.notificationKafkaClientId',
                {
                  infer: true,
                },
              ),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: configService.getOrThrow(
                'kafka.notificationKafkaGroupId',
                {
                  infer: true,
                },
              ),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KafkaModule,
  ],
  controllers: [PushNotificationController],
  providers: [UserRepository, PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
