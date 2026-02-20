import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThreecxService } from './threecx.service';
import { ThreecxController } from './threecx.controller';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { LeadsCallLog } from 'src/admin/leads-call-logs/entities/leads-call-log.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { Opportunity } from 'src/admin/leads/opportunity/entities/opportunity.entity';
import { OpportunityModule } from 'src/admin/leads/opportunity/opportunity.module';
import { User } from 'src/users/entities/user.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
@Module({
  imports: [TypeOrmModule.forFeature([
    Lead,
    LeadsCallLog,
    Operator,
    User,
    CustomStatus
  ]),
    OpportunityModule
  ],
  controllers: [ThreecxController],
  providers: [ThreecxService],
})
export class ThreecxModule { }
