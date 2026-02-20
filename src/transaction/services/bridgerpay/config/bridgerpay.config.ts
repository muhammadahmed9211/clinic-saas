import { registerAs } from '@nestjs/config';
import { BridgerPayConfig } from './bridgerpay-config.type';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  BRIDGERPAY_BASE_URL: string;

  @IsString()
  BRIDGERPAY_USERNAME: string;

  @IsString()
  BRIDGERPAY_PASSWORD: string;

  @IsString()
  BRIDGERPAY_API_KEY: string;

  @IsString()
  BRIDGERPAY_CASHIER_KEY: string;

  @IsString()
  BRIDGERPAY_HOST: string;

  @IsString()
  BRIDGERPAY_CHECKOUT_URL: string;
}

export default registerAs<BridgerPayConfig>('bridgerpay', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    base_url: process.env.BRIDGERPAY_BASE_URL,
    user_name: process.env.BRIDGERPAY_USERNAME,
    password: process.env.BRIDGERPAY_PASSWORD,
    api_key: process.env.BRIDGERPAY_API_KEY,
    cashier_key: process.env.BRIDGERPAY_CASHIER_KEY,
    host: process.env.BRIDGERPAY_HOST,
    checkout_url: process.env.BRIDGERPAY_CHECKOUT_URL,
  };
});
