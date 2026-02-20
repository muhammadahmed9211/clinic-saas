import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { EmailEventService } from './email.service';
import { EmailEventRepository } from './email.repository';
import { EmailMapping } from './entity/email-mapping.entity';
import { EmailEvent } from './entity/email-event.entity';
import { Layout } from 'src/mail/entities/layout.entity';
import { Template } from 'src/mail/entities/template.entity';
import { EmailEventController } from './email.controller';

@Module({
  controllers: [EmailEventController],
  imports: [
    TypeOrmModule.forFeature([
      Regulations,
      EmailEvent,
      EmailMapping,
      Layout,
      Template,
      User,
    ]),
  ],
  providers: [EmailEventService,EmailEventRepository],
  exports: [EmailEventService],
})
export class EmailEventModule {}
