import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from './entities/opportunity.entity';
import { OpportunityController } from './opportunity.controller';
import { OpportunityService } from './opportunity.service';
import { Funnel } from './entities/funnel.entity';
import { Lead } from '../entities/lead.entity';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/users/entities/user.entity';
import { attachments } from './entities/attachment.entity';
import { FilesModule } from 'src/files/files.module';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { FileEntity } from 'src/files/entities/file.entity';
import { FunnelHistory } from './entities/funnel-history.entity';
import { OpportunityRepository } from './repositories/opportunity.repository';
import { Meetings } from '../meetings/entities/meetings.entity';
import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import { NotesRepository } from './repositories/notes.repository';
import { AdminTaskRepository } from 'src/admin/task/repositories/admin-task.respository';
import { InboxEmailRepository } from '../communications/inboxEmail.repository';
import { CommunicationRepository } from '../communications/communication.repository';
import { Tickets } from 'src/ticket-management/entities/tickets.entity';
import { TaskModule } from 'src/admin/task/task.module';
import { LeadsModule } from '../leads.module';
import { AutomationConfig } from 'src/admin/automation/entities/automation-config.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Opportunity,
      Funnel,
      Lead,
      User,
      attachments,
      notes,
      FileEntity,
      FunnelHistory,
      Meetings,
      LeadsCallLog,
      Tickets,
      AutomationConfig,
      CustomStatus,
    ]),
    MailModule,
    FilesModule,
    TaskModule
  ],
  controllers: [OpportunityController],
  providers: [
    OpportunityService,
    OpportunityRepository,
    NotesRepository,
    AdminTaskRepository,
    InboxEmailRepository,
    CommunicationRepository,
  ],
  exports: [OpportunityService],
})
export class OpportunityModule {}
