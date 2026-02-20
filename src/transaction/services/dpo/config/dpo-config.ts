import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { DpoConfig } from './dpo-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  DPOPAY_API_URL: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_COMPANY_TOKEN: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_COMPANY_REF: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_SERVICE_TYPE: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_SERVICE_DESCRIPTION: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_PAYMENT_LINK: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_REDIRECT_URL: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_BACK_URL: string;

  @IsString()
  @IsNotEmpty()
  DPOPAY_EVENT_URL: string;
}

export default registerAs<DpoConfig>('dpo', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiUrl: process.env.DPOPAY_API_URL,
    companyToken: process.env.DPOPAY_COMPANY_TOKEN,
    companyRef: process.env.DPOPAY_COMPANY_REF,
    serviceType: process.env.DPOPAY_SERVICE_TYPE,
    serviceDescription: process.env.DPOPAY_SERVICE_DESCRIPTION,
    paymentLink: process.env.DPOPAY_PAYMENT_LINK,
    redirectUrl: process.env.DPOPAY_REDIRECT_URL,
    backUrl: process.env.DPOPAY_BACK_URL,
    eventUrl: process.env.DPOPAY_EVENT_URL,
  };
});
