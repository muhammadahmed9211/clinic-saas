import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MAIL_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka.emailKafkaClientId', {
                infer: true,
              }),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: configService.getOrThrow('kafka.emailKafkaGroupId', {
                infer: true,
              }),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KafkaModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {}
