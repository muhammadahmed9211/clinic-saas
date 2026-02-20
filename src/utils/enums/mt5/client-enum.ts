export enum ClientTypeId {
  CLIENT_TYPE_UNDEFINED = 0, // Not set.
  CLIENT_TYPE_INDIVIDUAL = 1, // Private.
  CLIENT_TYPE_CORPORATE = 2, // Corporate.
}

export enum ClientStatus {
  CLIENT_STATUS_UNREGISTERED = 0, // Not registered. An anonymous client, which was created based on a demo account without any data.
  CLIENT_STATUS_REGISTERED = 100, // Registered. The client has created a demo account with filled contact details.
  CLIENT_STATUS_NOTINTERESTED = 200, // Not interested. The client has created a demo account with filled contact data but is not interested in opening a real account.
  CLIENT_STATUS_APPLICATION_INCOMPLETED = 300, // Not completed. The client has provided data for opening a real account.
  CLIENT_STATUS_APPLICATION_COMPLETED = 400, // Completed. The client has provided data for opening a real account and has submitted all the required documents.
  CLIENT_STATUS_APPLICATION_INFORMATION = 500, // Information is needed. To open a real account, the client needs to provide additional information.
  CLIENT_STATUS_APPLICATION_REJECTED = 600, // Rejected. The client is denied registration.
  CLIENT_STATUS_APPROVED = 700, // Approved. A real account has been opened for the client.
  CLIENT_STATUS_FUNDED = 800, // Funded. The client has deposited money to a real account.
  CLIENT_STATUS_ACTIVE = 900, // Active. The client has trading activity.
  CLIENT_STATUS_INACTIVE = 1000, // Inactive. The client does not have trading activity.
  CLIENT_STATUS_SUSPENDED = 1100, // Suspended. Work with the client has been suspended.
  CLIENT_STATUS_CLOSED = 1200, // Closed. The client has left at the client's own decision.
  CLIENT_STATUS_TERMINATED = 1300, // Terminated. Work with the client was terminated at the initiative of the company.
}
