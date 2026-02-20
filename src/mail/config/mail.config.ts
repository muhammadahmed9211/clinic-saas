import { registerAs } from '@nestjs/config';
import { MailConfig } from 'src/mail/config/mail-config.type';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @IsString()
  MAIL_HOST: string;

  @IsString()
  @IsOptional()
  MAIL_USER: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @IsBoolean()
  MAIL_SECURE: boolean;

  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;

  @IsOptional()
  @IsString()
  MAIL_TEMPLATES: string;

  @IsOptional()
  @IsString()
  SUPPORT_EMAIL;

  @IsEmail()
  CRM_WEBSITE_EMAIL: string;

  @IsOptional()
  @IsEmail()
  TICKET_REPLY_EMAIL;

  @IsString()
  SUPPORT_CONTACT;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
    mailTemplates: process.env.MAIL_TEMPLATES
      ? process.env.MAIL_TEMPLATES.split(',')
      : [],
    supportEmail: process.env.SUPPORT_EMAIL,
    sendReminderEmail: process.env.SEND_REMINDER_EMAIL === 'true',
    crmWebsiteEmail: process.env.CRM_WEBSITE_EMAIL,
    ticketReplyEmail: process.env.TICKET_REPLY_EMAIL,
    supportContact: process.env.SUPPORT_CONTACT
  };
});
