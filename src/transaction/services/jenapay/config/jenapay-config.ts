import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { JenaPayConfig } from './jenapay-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  JENAPAY_MERCHANT_KEY: string;

  @IsString()
  @IsNotEmpty()
  JENAPAY_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  JENAPAY_CHECKOUT_URL: string;

  @IsString()
  @IsNotEmpty()
  JENAPAY_SUCCESS_URL: string;

  @IsString()
  @IsNotEmpty()
  JENAPAY_CANCEL_URL: string;
}

export default registerAs<JenaPayConfig>('jenapay', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    merchantKey: process.env.JENAPAY_MERCHANT_KEY,
    password: process.env.JENAPAY_PASSWORD,
    checkoutUrl: process.env.JENAPAY_CHECKOUT_URL,
    successUrl: process.env.JENAPAY_SUCCESS_URL,
    cancelUrl: process.env.JENAPAY_CANCEL_URL,
  };
});
