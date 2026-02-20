import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { MyFatoorahConfig } from './my-fatoorah-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  MY_FATOORAH_API_KEY: string;

  @IsString()
  @IsNotEmpty()
  MY_FATOORAH_API_URL: string;

  @IsNumber()
  @IsNotEmpty()
  MY_FATOORAH_PAYMENT_METHOD_ID: number;

  @IsString()
  @IsNotEmpty()
  MY_FATOORAH_CALLBACK_URL: string;

  @IsString()
  @IsNotEmpty()
  MY_FATOORAH_ERROR_URL: string;
}

export default registerAs<MyFatoorahConfig>('myFatoorah', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    apiKey: process.env.MY_FATOORAH_API_KEY,
    apiUrl: process.env.MY_FATOORAH_API_URL,
    paymentMethodId: Number(process.env.MY_FATOORAH_PAYMENT_METHOD_ID),
    callbackUrl: process.env.MY_FATOORAH_CALLBACK_URL,
    errorUrl: process.env.MY_FATOORAH_ERROR_URL,
  };
});
