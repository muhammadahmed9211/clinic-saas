import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoService } from './demo.service';
import { DemoController } from './demo.controller';
import { SendEmailService } from 'src/common/services/send-email.service';
import { MailerModule } from 'src/mailer/mailer.module';
import { User } from 'src/users/entities/user.entity';
import { EmailEntity } from 'src/mail/entities/email-entity.entity';
import { EmailEvent } from 'src/admin/email-mapping/entity/email-event.entity';
import { EmailMapping } from 'src/admin/email-mapping/entity/email-mapping.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { Template } from 'src/mail/entities/template.entity';
import { ConfigModule } from '@nestjs/config';
import { Lead } from 'src/admin/leads/entities/lead.entity';


@Module({
  controllers: [DemoController],
  imports: [
    TypeOrmModule.forFeature([
        User,
        EmailEntity,
        EmailEvent,
        EmailMapping,
        Template,
        Lead
    ]),
    MailerModule,
    ConfigModule,
  ],
  providers: [DemoService,SendEmailService,ClientRepository],
  exports: [DemoService,SendEmailService],
})
export class DemoModule {}
