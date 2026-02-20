import { registerAs } from '@nestjs/config';
import { FacebookConfig } from 'src/auth-facebook/config/facebook-config.type';
import { IsOptional, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { i18nValidationMessage } from 'nestjs-i18n';

class EnvironmentVariablesValidator {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  FACEBOOK_APP_ID: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  FACEBOOK_APP_SECRET: string;
}

export default registerAs<FacebookConfig>('facebook', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    appId: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
  };
});
