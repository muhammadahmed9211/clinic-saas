import { Module } from '@nestjs/common';
import { Mt5EventsService } from './mt5-events.service';
import { Mt5EventsController } from './mt5-events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/users/entities/client.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { MailerModule } from 'src/mailer/mailer.module';
import { Mt5Account } from '../entities/mt5-account.entity';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mt5Account, Client, Operator]),
    MailerModule,
    PushNotificationModule,
  ],
  controllers: [Mt5EventsController],
  providers: [Mt5EventsService],
})
export class Mt5EventsModule {}
