import { Module } from '@nestjs/common';
import { LeadsCallLogsService } from './leads-call-logs.service';
import { LeadsCallLogsController } from './leads-call-logs.controller';
import { LeadsCallLog } from './entities/leads-call-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunityModule } from '../leads/opportunity/opportunity.module';
import { notes } from '../kyc/entities/kycNotes.entity';
import { LeadsCallLogsRepository } from './repositories/leads-call-logs.repository';
import { Label } from 'src/tasks/entities/label.entity';
import { notifications } from 'src/notification/entity/notification.entity';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LeadsCallLog,
      notes,
      Label,
      notifications,
      Operator,
    ]),
    OpportunityModule,
  ],
  controllers: [LeadsCallLogsController],
  providers: [LeadsCallLogsService, LeadsCallLogsRepository],
  exports: [LeadsCallLogsService],
})
export class LeadsCallLogsModule {}
