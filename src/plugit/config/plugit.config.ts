import { registerAs } from '@nestjs/config';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { PlugitConfigType } from './plugit.config.type';

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  @IsString()
  PLUG_IT_SUBSCRIPTION_KEY: string;

  @IsNotEmpty()
  @IsString()
  PLUG_IT_BASE_URL: string;
}

export default registerAs<PlugitConfigType>('plugit', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    plugitSubscriptionKey: process.env.PLUG_IT_SUBSCRIPTION_KEY,
    plugitBaseUrl: process.env.PLUG_IT_BASE_URL,
  };
});
