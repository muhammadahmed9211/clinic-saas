import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { NGeniusConfig } from './n-genius-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  NGENIUS_API_URL: string;

  @IsString()
  @IsNotEmpty()
  NGENIUS_COMPANY_TOKEN: string;

  @IsString()
  @IsNotEmpty()
  NGENIUS_OUTLET_REFERENCE: string;

  @IsString()
  @IsNotEmpty()
  NGENIUS_REDIRECT_URL: string;

  @IsString()
  @IsNotEmpty()
  NGENIUS_BACK_URL: string;

  @IsString()
  @IsNotEmpty()
  NGENIUS_EVENT_URL: string;

  @IsString()
  @IsNotEmpty()
  NGENIUS_ALLOWED_COUNTRIES: string;
}

export default registerAs<NGeniusConfig>('nGenius', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiUrl: process.env.NGENIUS_API_URL,
    companyToken: process.env.NGENIUS_COMPANY_TOKEN,
    outletReference: process.env.NGENIUS_OUTLET_REFERENCE,
    redirectUrl: process.env.NGENIUS_REDIRECT_URL,
    backUrl: process.env.NGENIUS_BACK_URL,
    eventUrl: process.env.NGENIUS_EVENT_URL,
    allowedCountries: process.env.NGENIUS_ALLOWED_COUNTRIES ? process.env.NGENIUS_ALLOWED_COUNTRIES.split(",") : [],
  };
});
