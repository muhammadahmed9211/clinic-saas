// job.service.ts
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { BULL_QUEUES, BULL_QUEUES_EVENTS, CRON_TIMES } from './queue.enum';

interface IJobConfig {
  jobName: string;
  repeat: {
    cron: string;
  };
}

@Injectable()
export class JobService {
  private repeatingJobs: IJobConfig[];
  constructor(
    @InjectQueue('dataUpload') private readonly dataUploadQueue: Queue,
    @InjectQueue(BULL_QUEUES.OVERDUE_TASK_QUEUE)
    private readonly overdueTaskQueue: Queue,
    @InjectQueue(BULL_QUEUES.UPCOMING_TASK_QUEUE)
    private readonly upcomingTaskQueue: Queue,
    @InjectQueue(BULL_QUEUES.REMINDER_TASK_QUEUE)
    private readonly reminderTaskQueue: Queue,
    @InjectQueue(BULL_QUEUES.OVERDUE_SCHEDULED_MEETING)
    private readonly overdueScheduledMeetingQueue: Queue,
    @InjectQueue(BULL_QUEUES.EVERY_MINUTE_OVERDUE_TASK_QUEUE)
    private readonly overdueEveryMinuteTaskQueue: Queue,
    @InjectQueue(BULL_QUEUES.SCHEDULED_CALL_LOG_QUEUE)
    private readonly scheduledCallLogQueue: Queue,
    @InjectQueue(BULL_QUEUES.NOT_PAID_TRANSACTION_QUEUE)
    private readonly notPaidTransactionQueue: Queue,
    @InjectQueue(BULL_QUEUES.AUTO_CLOSE_TICKET_QUEUE)
    private readonly autoCloseTicketQueue: Queue,
    @InjectQueue(BULL_QUEUES.REFERRAL_QUEUE)
    private readonly referralQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.initializeRepeatingJobs();
  }

  async addDataUploadJob(data: any) {
    console.log('data in queue for leads', data);

    await this.dataUploadQueue.add('dataUploadJob', data),
      {
        // Automatically remove the job after completion or failure
        removeOnComplete: true, // Remove job after successful completion
        removeOnFail: false, // Remove job if it fails
      };
    this.dataUploadQueue.on('completed', async (job) => {
      console.log(`Job with ID ${job.id} has been completed.`);

      // After completion, clean the queue (removing all completed jobs)
      await this.dataUploadQueue.clean(0, 'completed');
    });
  }
  async addDataUploadJobForClient(data: any) {
    await this.dataUploadQueue.add('dataUploadJobForClient', data, {
      // Automatically remove the job after completion or failure
      removeOnComplete: true, // Remove job after successful completion
      removeOnFail: true, // Remove job if it fails
    });
  }

  async initializeRepeatingJobs() {
    await this.setupJob(
      this.overdueTaskQueue,
      BULL_QUEUES_EVENTS.REMINDER_OVERDUE_TASK_NOTIFICATION,
    );
    await this.setupJob(
      this.upcomingTaskQueue,
      BULL_QUEUES_EVENTS.REMINDER_UPCOMING_TASK_NOTIFICATION,
    );
    await this.setupJob(
      this.reminderTaskQueue,
      BULL_QUEUES_EVENTS.REMINDER_TASK_NOTIFICATION,
    );
    await this.setupJob(
      this.overdueScheduledMeetingQueue,
      BULL_QUEUES_EVENTS.REMINDER_OVERDUE_SCHEDULED_MEETING,
    );
    await this.setupJob(
      this.scheduledCallLogQueue,
      BULL_QUEUES_EVENTS.REMINDER_SCHEDULED_CALL_LOG,
    );
    await this.setupJobTenMin(
      this.overdueEveryMinuteTaskQueue,
      BULL_QUEUES_EVENTS.REMINDER_EVERY_MINUTE_OVERDUE_TASK_NOTIFICATION,
    );

    await this.setupJobTenMin(
      this.notPaidTransactionQueue,
      BULL_QUEUES_EVENTS.NOT_PAID_TRANSACTION_EVENT,
    );

    await this.setupJobTenMin(
      this.autoCloseTicketQueue,
      BULL_QUEUES_EVENTS.AUTO_CLOSE_TICKET_EVENT,
    );   
      await this.setupJobTenMin(
      this.referralQueue,
      BULL_QUEUES_EVENTS.REFERRAL_EVENT,
    );
  }

  private async setupJobTenMin(queue: Queue, jobName: string) {
    await queue.removeRepeatable(jobName, { cron: CRON_TIMES.TEN_MINUTE });
    await queue.add(
      jobName,
      {},
      {
        repeat: { cron: CRON_TIMES.TEN_MINUTE },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
    console.log(
      `Job ${jobName} scheduled successfully with cron: ${CRON_TIMES.TEN_MINUTE}`,
    );
  }

  private async setupJob(queue: Queue, jobName: string) {
    await queue.removeRepeatable(jobName, { cron: CRON_TIMES.EACH_MINUTE });
    await queue.add(
      jobName,
      {},
      {
        repeat: { cron: CRON_TIMES.EACH_MINUTE },
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }
}