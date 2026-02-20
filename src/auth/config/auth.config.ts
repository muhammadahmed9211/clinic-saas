import { registerAs } from '@nestjs/config';
import { AuthConfig } from 'src/auth/config/auth-config.type';
import { IsNumber, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { i18nValidationMessage } from 'nestjs-i18n';

class EnvironmentVariablesValidator {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_JWT_SECRET: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_REFRESH_SECRET: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_FORGOT_SECRET: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  IMPERSONATE_AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  OFFICE: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  SALES_DESK: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  RETENTION_DESK: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  SUPPORT_DESK: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  FINANCE_DESK: number;

  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  KYC_DESK: number;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  SOURCE: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LONG_LIVED_TOKEN_EXPIRY_DAYS: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  TICKET_SERVICE_SECRET: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
    office: process.env.OFFICE ? parseInt(process.env.OFFICE, 10) : 1,
    salesDesk: process.env.SALES_DESK
      ? parseInt(process.env.SALES_DESK, 10)
      : 1,
    retentionDesk: process.env.RETENTION_DESK
      ? parseInt(process.env.RETENTION_DESK, 10)
      : 3,
    supportDesk: process.env.SUPPORT_DESK
      ? parseInt(process.env.SUPPORT_DESK, 10)
      : 36,
    financeDesk: process.env.FINANCE_DESK
      ? parseInt(process.env.FINANCE_DESK, 10)
      : 34,
    kycDesk: process.env.KYC_DESK ? parseInt(process.env.KYC_DESK, 10) : 35,
    source: process.env.SOURCE ? process.env.SOURCE : 'Direct',
    ImpersonateExpires: process.env.IMPERSONATE_AUTH_JWT_TOKEN_EXPIRES_IN,
    longLivedTokenExpiry: process.env.LONG_LIVED_TOKEN_EXPIRY_DAYS,
    ticketServiceSecret: process.env.TICKET_SERVICE_SECRET,
  };
});
