import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meetings } from './entities/meetings.entity';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';
import { User } from 'src/users/entities/user.entity';
import { MeetingParticipants } from './entities/participants.entity';
import { Lead } from '../entities/lead.entity';
import { OpportunityModule } from '../opportunity/opportunity.module';
import { Opportunity } from '../opportunity/entities/opportunity.entity';
import { notes } from 'src/admin/kyc/entities/kycNotes.entity';
import { attachments } from '../opportunity/entities/attachment.entity';
import { FilesModule } from 'src/files/files.module';
import { MeetingRepository } from './repositories/meetings.repository';
import { MailerModule } from 'src/mailer/mailer.module';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Meetings,
      User,
      MeetingParticipants,
      Lead,
      notes,
      Opportunity,
      attachments,
      Label,
      notifications,
      Operator,
    ]),
    OpportunityModule,
    FilesModule,
    MailerModule,
  ],
  controllers: [MeetingsController],
  providers: [MeetingsService, MeetingRepository],
  exports: [MeetingsService],
})
export class MeetingsModule {}
