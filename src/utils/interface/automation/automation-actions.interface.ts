export interface AutomationActions {
  sendEmail?: boolean;
  createTask?: boolean;
  createNotification?: boolean;

  // Additional actions can be added here
  [key: string]: any;
}
