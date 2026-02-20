import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Lead } from '../leads/entities/lead.entity';
import { CustomStatus } from '../client/entities/custom_status.entity';
import { LeadsModule } from '../leads/leads.module';
import { ClientsModule } from 'src/users/clients.module';
import { ApplicantModule } from '../applicant/applicant.module';
import { TaskModule } from '../task/task.module';
import { OpportunityModule } from '../leads/opportunity/opportunity.module';
import { Opportunity } from '../leads/opportunity/entities/opportunity.entity';
import { LeadsCallLog } from '../leads-call-logs/entities/leads-call-log.entity';
import { LeadsCallLogsModule } from '../leads-call-logs/leads-call-logs.module';
import { notes } from '../kyc/entities/kycNotes.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { DashboardWidget } from './entities/dashboard_widget.entity';
import { RoleDashboardWidget } from './entities/role_dashboard_widget.entity';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionWidgetsService } from 'src/transaction/services/transaction-widgets/transaction-widgets.service';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import { BankAccount } from '../bank-account/entities/bank-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Lead,
      CustomStatus,
      Opportunity,
      LeadsCallLog,
      notes,
      Transaction,
      DashboardWidget,
      RoleDashboardWidget,
      TransactionMethod,
      PSP, 
      BankAccount
    ]),
    forwardRef(() => LeadsModule),
    ClientsModule,
    ApplicantModule,
    TaskModule,
    OpportunityModule,
    LeadsCallLogsModule,
    OpportunityModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService, TransactionWidgetsService, TransactionRepository, Mt5AccountRepository],
  exports: [DashboardService],
})
export class DashboardModule {}
