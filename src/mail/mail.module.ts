import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailerModule } from '../mailer/mailer.module';
import { SendEmailService } from 'src/common/services/send-email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailEntity } from './entities/email-entity.entity';
import { EmailEvent } from 'src/admin/email-mapping/entity/email-event.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { Client } from 'src/users/entities/client.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { Template } from './entities/template.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';

@Module({
  imports: [ConfigModule, MailerModule, TypeOrmModule.forFeature([User, EmailEntity, EmailEvent, EmailMapping, Client, Template, Lead])],
  providers: [MailService , SendEmailService, ClientRepository],
  exports: [MailService, SendEmailService],
})
export class MailModule {}
