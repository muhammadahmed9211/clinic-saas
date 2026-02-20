export enum BULL_QUEUES {
  OVERDUE_TASK_QUEUE = 'overdue-task-queue',
  UPCOMING_TASK_QUEUE = 'upcoming-task-queue',
  REMINDER_TASK_QUEUE = 'reminder-task-queue',
  EVERY_MINUTE_OVERDUE_TASK_QUEUE = 'every-minute-overdue-task-queue',
  OVERDUE_SCHEDULED_MEETING = 'overdue-scheduled-meeting',
  SCHEDULED_CALL_LOG_QUEUE = 'scheduled-call-log-queue',
  NOT_PAID_TRANSACTION_QUEUE = 'not-paid-transaction-queue',
  AUTO_CLOSE_TICKET_QUEUE = 'auto-close-ticket-queue',
  REFERRAL_QUEUE='referral-queue'
}

export enum BULL_QUEUES_EVENTS {
  REMINDER_OVERDUE_TASK_NOTIFICATION = 'reminder-overdue-task-notification',
  REMINDER_UPCOMING_TASK_NOTIFICATION = 'reminder-upcoming-task-notification',
  REMINDER_TASK_NOTIFICATION = 'reminder-task-notification',
  REMINDER_EVERY_MINUTE_OVERDUE_TASK_NOTIFICATION = 'reminder-every-minute-overdue-task-notification',
  REMINDER_OVERDUE_SCHEDULED_MEETING = 'reminder-overdue-scheduled-meeting',
  REMINDER_SCHEDULED_CALL_LOG = 'reminder-scheduled-call-log',
  NOT_PAID_TRANSACTION_EVENT = 'not-paid-transaction-event',
  AUTO_CLOSE_TICKET_EVENT = 'auto-close-ticket-event',
  REFERRAL_EVENT='referral-event'
}

export enum CRON_TIMES {
  EACH_MINUTE = '*/1 * * * *',
  TEN_MINUTE = '*/10 * * * *',
}
