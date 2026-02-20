import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { LegacyAPIConfig } from './legacy-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  @IsNotEmpty()
  LEGACY_API_BASE_URL: string;

  @IsString()
  @IsNotEmpty()
  LEGACY_API_CREATE_TRANSACTION_ENDPOINT: string;

  @IsString()
  @IsNotEmpty()
  LEGACY_API_PREFERRED_PSP: string;
}

export default registerAs<LegacyAPIConfig>('legacy', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    apiBaseUrl: process.env.LEGACY_API_BASE_URL,
    createTransactionEndpoint:
      process.env.LEGACY_API_CREATE_TRANSACTION_ENDPOINT,
    preferredPsp: process.env.LEGACY_API_PREFERRED_PSP,
  };
});
