import { registerAs } from '@nestjs/config';
import { ReferralConfig } from './referral-config.type';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsNumber()
  REFERRAL_LOT_SIZE: number;

  @IsString()
  @IsNotEmpty()
  REFERRAL_JOB_EXECUTION_TOKEN: string;
}

export default registerAs<ReferralConfig>('referral', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    lot_size: Number(process.env.REFERRAL_LOT_SIZE || 0),
    execution_token: process.env.REFERRAL_JOB_EXECUTION_TOKEN,
  };
});
