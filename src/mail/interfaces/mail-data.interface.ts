import { MailSenderType } from 'src/email/dto/mail.send.dto';

export interface MailData<T = never> {
  to: string | string[];
  data: T;
  from?: string | null;
  cc?: string | string[] | null;
  bcc?: string | string[] | null;
}

export interface ISendWelcomeMail {
  to: string;
  userId: number;
  regulation?: string;
  regulationId?: number;
  // subject: string;
  context: {
    firstName: string;
    userName: string;
    password: string;
    accessLink: string;
  };
}

export interface ISendAgreement {
  from?: MailSenderType;
  subject?: string;
  to: string;
  uuid: string;
  languageIso: string;
  docsUploaded: boolean;
  context: {
    firstName: string;
    password: string;
    userId: number;
    regulation?: string;
    regulationId?:number;
  };
  step: number;
  regulationId?:number;
}

export interface IAccountCreationRequestMail {
  to: string;
  // subject: string;
  // firstName: string;
  // userName: string;
  // password: string;
  // accessLink: string;
  context: {
    Name: string;
    Server: string;
    Currency: string;
    Email: string;
    UserId: string;
  };
  templateId?: number;
}
