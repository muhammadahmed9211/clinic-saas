import { registerAs } from '@nestjs/config';
import { PraxisConfigType } from './praxis-config.type';
import { IsString, IsNotEmpty } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsNotEmpty()
  @IsString()
  PRAXIS_API_URL: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_APPLICATION_KEY: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_DOMAIN: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_VERSION: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_RETURN_URL: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_NOTIFICATION_URL: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_MERCHANT_ID_CREDIT_CARD: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_MERCHANT_SECRET_CREDIT_CARD: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_MERCHANT_ID_E_WALLET: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_MERCHANT_SECRET_E_WALLET: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_MERCHANT_ID_CRYPTO: string;

  @IsNotEmpty()
  @IsString()
  PRAXIS_MERCHANT_SECRET_CRYPTO: string;
}

export default registerAs<PraxisConfigType>('praxis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    api_url: process.env.PRAXIS_API_URL,
    application_key: process.env.PRAXIS_APPLICATION_KEY,
    domain: process.env.PRAXIS_DOMAIN,
    version: process.env.PRAXIS_VERSION,
    returnUrl: process.env.PRAXIS_RETURN_URL,
    notificationUrl: process.env.PRAXIS_NOTIFICATION_URL,
    merchantIdCreditCard: process.env.PRAXIS_MERCHANT_ID_CREDIT_CARD,
    merchantSecretCreditCard: process.env.PRAXIS_MERCHANT_SECRET_CREDIT_CARD,
    merchantIdEWallet: process.env.PRAXIS_MERCHANT_ID_E_WALLET,
    merchantSecretEWallet: process.env.PRAXIS_MERCHANT_SECRET_E_WALLET,
    merchantIdCrypto: process.env.PRAXIS_MERCHANT_ID_CRYPTO,
    merchantSecretCrypto: process.env.PRAXIS_MERCHANT_SECRET_CRYPTO,
  };
});
