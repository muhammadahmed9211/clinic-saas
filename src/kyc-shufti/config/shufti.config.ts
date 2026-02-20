import { registerAs } from '@nestjs/config';
import { ShuftiConfig } from './shufti-config.type';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

enum ProviderType {
  Local = 'local',
  Shufti = 'shufti',
}

class EnvironmentVariablesValidator {
  @IsEnum(ProviderType)
  @IsOptional()
  KYC_PROVIDER: ProviderType;

  @IsString()
  @IsNotEmpty()
  SHUFTI_CLIENT_ID: string;

  @IsString()
  @IsNotEmpty()
  SHUFTI_SECRET_KEY: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  SHUFTI_BASE_URL: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  SHUFTI_CALLBACK_URL: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  SHUFTI_REDIRECT_URL: string;
  @IsUrl({ require_tld: false })
  @IsOptional()
 AWS_SHUFTI_BUCKET_DIRECTORY: string;

}

export default registerAs<ShuftiConfig>('shufti', (): ShuftiConfig => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    provider: (process.env.KYC_PROVIDER as 'shufti' | 'local') || 'local',
    clientId: process.env.SHUFTI_CLIENT_ID!,   // non-null assertion
    secretKey: process.env.SHUFTI_SECRET_KEY!, // non-null assertion
    baseUrl: process.env.SHUFTI_BASE_URL || 'https://api.shuftipro.com',
    callbackUrl: process.env.SHUFTI_CALLBACK_URL || 'https://restapi-v2-qa.siliconfort.com/api/v1/webhooks/shufti',
    redirectUrl: process.env.SHUFTI_REDIRECT_URL || 'https://client-v2-qa.siliconfort.com/dashboard',
    awsBucket: process.env.AWS_SHUFTI_BUCKET_DIRECTORY || 'shufti-local-assets',
  };
});

