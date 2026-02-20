import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './communication.service';
import { Client } from 'src/users/entities/client.entity';
import { Communication } from 'src/admin/client/entities/communication.entity';
import { CommunicationRepository } from './communication.repository';
import { InboxEmailRepository } from './inboxEmail.repository';
import { InboxEmail } from 'src/mail/entities/inboxEmails.entity';
import { Lead } from '../entities/lead.entity';
import { User } from 'src/users/entities/user.entity';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, Communication, InboxEmail, Lead, User]),
    MailModule,
  ],
  controllers: [CommunicationController],
  providers: [
    CommunicationService,
    CommunicationRepository,
    InboxEmailRepository,
  ],
  exports: [CommunicationService],
})
export class CommunicationModule {}
