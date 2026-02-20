export type MailConfig = {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
  mailTemplates?: string[];
  supportEmail?: string;
  crmWebsiteEmail?: string;
  ticketReplyEmail?: string;
  supportContact?:string;
};
