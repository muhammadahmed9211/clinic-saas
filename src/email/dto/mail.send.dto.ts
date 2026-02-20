import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import Mail from 'nodemailer/lib/mailer';

export enum MailSenderType {
  SUPPORT = 1,
  NO_REPLY = 2,
}

export class SendMailDto {
  @IsEnum(MailSenderType)
  from: MailSenderType;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  to: string | string[];

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @IsOptional()
  attachment: Mail.Attachment[];

  context?: {
    title?: string | undefined;
    url?: string;
    actionTitle?: string | undefined;
    app_name?: string | undefined;
    [key: string]: string | undefined;
  };

  // content: string | Buffer;

  @IsNumber()
  templateId: number;
}

export type SendEmail = {
  from: any;
  to: string | string[];
  cc?: string | null | string[];
  bcc?: string | null | string[];
  rep?:string | null;
  subject?: string | undefined;
  userId?: number;
  layoutId?: number;
  entityId?: number;
  entityType?: string;
  entityValue?: string;
  regulation?: string;
  operatorId?: number;
  regulationId?: number;
  type?: string;
  attachment?: Mail.Attachment[];
  context?: {
    title?: string | undefined;
    url?: string;
    actionTitle?: string | undefined;
    app_name?: string | undefined;
    [key: string]: string | undefined;
    Phone?: string;
    phone?: string;
  };
  html?: string;
  templateId?: number;
  templateName?: string;
  languageIso?: string;
  skipCommunication?:boolean
  leadId?:number;
  fileUuids?: string[];
  userAgreement?: { [key: string]: any };
  emailEventName?:string
};

export type CreateEmailTemplate = {
  id?: number;
  text: string;
  name: string;
  language: string;
};
