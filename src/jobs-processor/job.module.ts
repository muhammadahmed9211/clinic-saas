// job.module.ts
import { BullModule } from '@nestjs/bull';
import { Module, forwardRef } from '@nestjs/common';
import { LeadsModule } from 'src/admin/leads/leads.module';
import { FileUploadModule } from 'src/upload-data/file_upload.module';
import {
  JobProcessor,
  // OverdueTaskProcessor,
  // ReminderTaskProcessor,
  // UpcomingTaskProcessor,
  // OverdueScheduledMeeting,
  OverdueTasks,
  //ScheduledCallLog,
  NotPaidTransactionProcessor,
  AutoCloseTicketProcessor,
  ReferralQueueProcessor,
} from './job.processor';
import { JobService } from './job.service';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { BULL_QUEUES } from './queue.enum';
import { TaskModule } from 'src/admin/task/task.module';
import { TaskService } from 'src/admin/task/task.service';
import { MeetingsModule } from 'src/admin/leads/meetings/meeting.module';
import { LeadsCallLogsModule } from 'src/admin/leads-call-logs/leads-call-logs.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionJobService } from 'src/transaction/services/transaction-job/transaction-job.service';
import { TicketsModule } from 'src/ticket-management/tickets.module';
import { ReferralProgramModule } from 'src/referral-program/referral-program.module';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'dataUpload',
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        redis: {
          host: configService.getOrThrow('redis.host', { infer: true }),
          port: configService.getOrThrow('redis.port', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync(
      {
        name: BULL_QUEUES.OVERDUE_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.UPCOMING_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.REMINDER_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.OVERDUE_SCHEDULED_MEETING,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.EVERY_MINUTE_OVERDUE_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.SCHEDULED_CALL_LOG_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.NOT_PAID_TRANSACTION_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.REFERRAL_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ),
    BullModule.registerQueueAsync(
      {
        name: BULL_QUEUES.OVERDUE_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.UPCOMING_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.REMINDER_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.OVERDUE_SCHEDULED_MEETING,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.EVERY_MINUTE_OVERDUE_TASK_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.SCHEDULED_CALL_LOG_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: BULL_QUEUES.AUTO_CLOSE_TICKET_QUEUE,
        useFactory: (configService: ConfigService) => ({
          redis: {
            host: configService.getOrThrow('redis.host', { infer: true }),
            port: configService.getOrThrow('redis.port', { infer: true }),
          },
        }),
        inject: [ConfigService],
      },
    ),
    forwardRef(() => LeadsModule), // Import your existing module here
    FileUploadModule,
    TaskModule,
    MeetingsModule,
    LeadsCallLogsModule,
    TicketsModule,
    ReferralProgramModule
  ],
  providers: [
    JobProcessor,
    JobService,
    //OverdueTaskProcessor,
    //UpcomingTaskProcessor,
    //ReminderTaskProcessor,
    NotPaidTransactionProcessor,
   // OverdueScheduledMeeting,
    OverdueTasks,
    // ScheduledCallLog,
    AutoCloseTicketProcessor,
    ReferralQueueProcessor
  ],
  exports: [JobService],
})
export class JobModule { }
