import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { FreshDeskConfig } from './freshdesk-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsOptional()
  FRESHDESK_API_URL?: string;

  @IsString()
  @IsOptional()
  FRESHDESK_API_KEY?: string;

  @IsString()
  @IsOptional()
  FRESHDESK_PASSWORD?: string;

  @IsNumber()
  @IsOptional()
  FRESHDESK_GROUP_ID?: number;
}

export default registerAs<FreshDeskConfig>('freshdesk', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    FRESHDESK_API_URL: process.env.FRESHDESK_API_URL,
    FRESHDESK_API_KEY: process.env.FRESHDESK_API_KEY,
    FRESHDESK_PASSWORD: process.env.FRESHDESK_PASSWORD,
    FRESHDESK_GROUP_ID: Number(process.env.FRESHDESK_GROUP_ID),
  };
});
