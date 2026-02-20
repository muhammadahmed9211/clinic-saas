// job.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { LeadsService } from 'src/admin/leads/leads.service';
import { TaskService } from 'src/admin/task/task.service';
import { MeetingsService } from 'src/admin/leads/meetings/meetings.service';
import { LeadsCallLogsService } from 'src/admin/leads-call-logs/leads-call-logs.service';
import { FileUploadService } from 'src/upload-data/file_upload.service';
import { BULL_QUEUES, BULL_QUEUES_EVENTS } from './queue.enum';
import { TransactionJobService } from 'src/transaction/services/transaction-job/transaction-job.service';
import { TicketsService } from 'src/ticket-management/tickets.service';
import { ReferralProgramService } from 'src/referral-program/referral-program.service';

@Processor('dataUpload')
export class JobProcessor {
  constructor(
    private readonly dataUploadService: LeadsService,
    private readonly fileUploadServiceForClient: FileUploadService,
  ) { }

  @Process('dataUploadJob')
  async handleDataUpload(job: Job) {
    const { data } = job;
    await this.dataUploadService.uploadingTheLead(
      data?.nonCqArray,
      data?.userId,
      data?.counter,
      data?.userName,
      data?.uploadedClients,
      data?.cqArray,
    );
  }
  @Process('dataUploadJobForClient')
  async handleDataUploadForClients(job: Job) {
    const { data } = job;
    await this.fileUploadServiceForClient.uploadingTheLead(
      data?.data,
      data?.userId,
      data?.counter,
      data?.userName,
      data?.uploadedClients,
      data?.verificationId,
    );
  }
}

// @Processor(BULL_QUEUES.OVERDUE_TASK_QUEUE)
// export class OverdueTaskProcessor {
//   constructor(private readonly taskService: TaskService) { }

//   @Process(BULL_QUEUES_EVENTS.REMINDER_OVERDUE_TASK_NOTIFICATION)
//   async processReminderOverdueTaskNotificationJob(job: Job) {
//     console.log(`Running overdue task notification job at ${new Date().toISOString()}`);
//     await this.taskService.findOverdueTasksForNotification();
//   }
// }

// @Processor(BULL_QUEUES.UPCOMING_TASK_QUEUE)
// export class UpcomingTaskProcessor {
//   constructor(private readonly taskService: TaskService) { }

//   @Process(BULL_QUEUES_EVENTS.REMINDER_UPCOMING_TASK_NOTIFICATION)
//   async processReminderUpcomingTaskNotificationJob(job: Job) {
//     console.log(`Running upcoming task notification job at ${new Date().toISOString()}`);
//     await this.taskService.findUpcomingTasksForNotification();
//   }
// }

// @Processor(BULL_QUEUES.REMINDER_TASK_QUEUE)
// export class ReminderTaskProcessor {
//   constructor(private readonly taskService: TaskService) { }

//   @Process(BULL_QUEUES_EVENTS.REMINDER_TASK_NOTIFICATION)
//   async processReminderTaskNotificationJob(job: Job) {
//     console.log(`Running task notification job at ${new Date().toISOString()}`);
//     await this.taskService.findReminderTasksForNotification();
//   }
// }

// @Processor(BULL_QUEUES.OVERDUE_SCHEDULED_MEETING)
// export class OverdueScheduledMeeting {
//   constructor(private readonly meetingService: MeetingsService) { }

//   @Process(BULL_QUEUES_EVENTS.REMINDER_OVERDUE_SCHEDULED_MEETING)
//   async processReminderOverdueScheduledMeeting(job: Job) {
//     console.log(
//       `Running overdue scheduled meeting notification job at ${new Date().toISOString()}`,
//     );
//     await this.meetingService.findOverdueMeetingForNotification();
//   }
// }

@Processor(BULL_QUEUES.EVERY_MINUTE_OVERDUE_TASK_QUEUE)
export class OverdueTasks {
  constructor(private readonly taskService: TaskService) { }

  @Process(BULL_QUEUES_EVENTS.REMINDER_EVERY_MINUTE_OVERDUE_TASK_NOTIFICATION)
  async processReminderOverdueTaskNotificationJob(job: Job) {
    console.log(
      `Running overdue task notification job at ${new Date().toISOString()}`,
    );
    await this.taskService.findOverDueTasksForNotification();
  }
}

// @Processor(BULL_QUEUES.SCHEDULED_CALL_LOG_QUEUE)
// export class ScheduledCallLog {
//   constructor(private readonly callLogService: LeadsCallLogsService) { }

//   @Process(BULL_QUEUES_EVENTS.REMINDER_SCHEDULED_CALL_LOG)
//   async processReminderScheduledCallLog(job: Job) {
//     console.log(
//       `Running scheduled call log notification job at ${new Date().toISOString()}`,
//     );
//     await this.callLogService.findOverdueCallLogForNotification();
//   }
// }

@Processor(BULL_QUEUES.NOT_PAID_TRANSACTION_QUEUE)
export class NotPaidTransactionProcessor {
  constructor(private readonly transactionJobService: TransactionJobService) { }

  @Process(BULL_QUEUES_EVENTS.NOT_PAID_TRANSACTION_EVENT)
  async processNotPaidTransaction() {
    console.log(`Running not paid transaction job at ${new Date().toISOString()}`);
    await this.transactionJobService.markNotPaidStatusToPendingTransaction();
  }
}

@Processor(BULL_QUEUES.AUTO_CLOSE_TICKET_QUEUE)
export class AutoCloseTicketProcessor {
  constructor(private readonly ticketService: TicketsService) { }

  @Process(BULL_QUEUES_EVENTS.AUTO_CLOSE_TICKET_EVENT)
  async processAutoCloseTicket(job: Job) {
    console.log(
      `Running auto close ticket job at ${new Date().toISOString()}`,
    );

    // Close tickets that have been resolved for 48+ hours without reply
    await this.ticketService.autoCloseResolvedTickets();
    await this.ticketService.autoPermanentlyCloseTickets();

  }
}

@Processor(BULL_QUEUES.REFERRAL_QUEUE)
export class ReferralQueueProcessor {
  constructor(
    private readonly referralProgramService: ReferralProgramService,
  ) {}

  @Process(BULL_QUEUES_EVENTS.REFERRAL_EVENT)
  async processReferral() {
    console.log(`Running referral job at ${new Date().toISOString()}`);
    // await this.referralProgramService.run();
  }
}