import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { RecapthcaConfig } from './recapthca-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  GOOGLE_RECAPTCHA_SITE_KEY?: string;

  @IsString()
  @IsOptional()
  GOOGLE_RECAPTCHA_SECRET?: string;

  @IsNumber()
  @IsOptional()
  GOOGLE_RECAPTCHA_SCORE?: number;
}

export default registerAs<RecapthcaConfig>('recaptcha', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    GOOGLE_RECAPTCHA_SITE_KEY: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
    GOOGLE_RECAPTCHA_SECRET: process.env.GOOGLE_RECAPTCHA_SECRET,
    FRESHDESK_GROUP_ID: Number(process.env.GOOGLE_RECAPTCHA_SCORE),
  };
});
