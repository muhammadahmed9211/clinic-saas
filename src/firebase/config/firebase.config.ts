import { registerAs } from '@nestjs/config';
import { AuthConfig } from 'src/auth/config/auth-config.type';
import { IsNumber, IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FirebaseConfig } from './firebase-config.type';

class EnvironmentVariablesValidator {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  FIREBASE_PROJECT_ID: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  FIREBASE_CLIENT_EMAIL: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  FIREBASE_PRIVATE_KEY: string;
}

export default registerAs<FirebaseConfig>('firebase', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };
});
