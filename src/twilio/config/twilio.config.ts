import { registerAs } from '@nestjs/config';
import { TwilioConfig } from 'src/twilio/config/twilio-config.type';
import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  TWILIO_ACCOUNT_SID: string;

  @IsString()
  TWILIO_AUTH_TOKEN: string;

  @IsString()
  TWILIO_SERVICE_SMS: string;
}

export default registerAs<TwilioConfig>('twilio', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    account_id: process.env.TWILIO_ACCOUNT_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    service_sms: process.env.TWILIO_SERVICE_SMS,
  };
});
