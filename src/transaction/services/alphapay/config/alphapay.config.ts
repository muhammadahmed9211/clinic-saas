import { IsNotEmpty, IsString } from 'class-validator';
import { AlphaPayConfig } from './alphapay-config.type';
import { registerAs } from '@nestjs/config';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  ALPHA_PAY_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  ALPHA_PAY_API_URL: string;

  @IsString()
  @IsNotEmpty()
  ALPHA_PAY_WEBHOOK_SECRET: string;

  @IsString()
  @IsNotEmpty()
  ALPHA_PAY_ALLOWED_COINS: string;
}

export default registerAs<AlphaPayConfig>('alphaPay', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    apiKey: process.env.ALPHA_PAY_API_KEY,
    apiUrl: process.env.ALPHA_PAY_API_URL,
    webhookSecret: process.env.ALPHA_PAY_WEBHOOK_SECRET,
    allowedCoins: process.env.ALPHA_PAY_ALLOWED_COINS
  };
});
