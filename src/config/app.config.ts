import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '../utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { v4 as uuidv4 } from 'uuid';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  AE_FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  FRONTEND_WEBSITE_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsString()
  @IsOptional()
  ENVIRONMENT: string;

  @IsNumber()
  @IsOptional()
  AUTH_SALT_ROUNDS: number;

  @IsString()
  @IsOptional()
  DEFAULT_LIVE_GROUP: string;

  @IsString()
  @IsOptional()
  DEFAULT_DEMO_GROUP: string;

  @IsNumber()
  @IsOptional()
  OTP_THRESHOLD: number;

  @IsOptional()
  @IsString()
  CRM_FRONT_END_URL: string;

  @IsNotEmpty()
  @IsString()
  REST_API_DEV_URL: string;

  @IsNotEmpty()
  @IsString()
  REST_API_QA_URL: string;

  @IsNotEmpty()
  @IsString()
  REST_API_STAGING_URL: string;

  @IsNotEmpty()
  @IsString()
  REST_API_PROD_URL: string;

  @IsNotEmpty()
  @IsString()
  PREFERRED_PSP: string;

  @IsNotEmpty()
  @IsString()
  BYPASS_OTP_VERIFICATION: string;

  @IsNotEmpty()
  @IsNumber()
  WITHDRAWAL_MIN_VALUE: number;

  @IsNotEmpty()
  @IsNumber()
  WITHDRAWAL_MAX_VALUE: number;

  @IsNotEmpty()
  @IsNumber()
  WITHDRAWAL_FEE: number;

  @IsNotEmpty()
  @IsNumber()
  DEPOSIT_MIN_VALUE: number;

  @IsNotEmpty()
  @IsNumber()
  DEPOSIT_MAX_VALUE: number;

  @IsNotEmpty()
  @IsNumber()
  DEPOSIT_FEE: number;

  @IsNotEmpty()
  @IsString()
  DOMAIN: string;

  @IsString()
  ALLOWED_DOMAIN: string[];

  @IsNotEmpty()
  @IsString()
  DEFAULT_AGGREGATOR: string;

  @IsNotEmpty()
  @IsString()
  DEFAULT_CRYPTO_PSP: string;

  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  TRANSACTION_NOT_PAID_DIFFERENCE: number;

  @IsString()
  TRANSACTION_EMAIL_CC_LIST: string;
  @IsOptional()
  MT5_REGULATION_SERVERS: string;

  @IsNotEmpty()
  @IsString()
  TRANSFER_TRANSACTION_TYPE: string;

  @IsNotEmpty()
  @IsString()
  TRANSFER_TRANSACTION_KAFKA_GROUP_ID: string;

  @IsNotEmpty()
  @IsString()
  TRANSFER_TRANSACTION__KAFKA_CLIENT_ID: string;

  @IsOptional()
  @IsString()
  ENCRYPTION_KEY: string;

  @IsNotEmpty()
  @IsString()
  PAYMENT_GATEWAY_CRYPTO: string;

  @IsNotEmpty()
  @IsString()
  CRYPTO_CURRENCY: string;

  @IsNotEmpty()
  @IsString()
  CRYPTO_STANDARDS: string;

  @IsNotEmpty()
  @IsString()
  CRYPTO_STANDARDS_COND: string;

  @IsNotEmpty()
  @IsString()
  YAHOO_NEWS_URL: string;

  @IsNotEmpty()
  @IsString()
  YAHOO_NEWS_API_KEY: string;

  @IsNotEmpty()
  @IsString()
  YAHOO_NEWS_API_HOST: string;

  @IsNotEmpty()
  @IsString()
  COMPANY_NAME: string;

  @IsNotEmpty()
  @IsString()
  BTC_QR_CODE_IMAGE: string;

  @IsNotEmpty()
  @IsString()
  BTC_WALLET_ADDRESS: string;

  @IsNotEmpty()
  @IsNumber()
  CRYPTO_MAX_DEPOSIT_LIMIT: number;

  @IsNotEmpty()
  @IsString()
  MT5_MANAGER_LIVE_URL: string;

  @IsNotEmpty()
  @IsString()
  MT5_MANAGER_DEMO_URL: string;

  @IsNumber()
  @IsOptional()
  TIMEZONE_DIFFERENCE: number;
}

const isVariableExist = (variable: string[]) => {
  variable.forEach((value) => {
    if (process.env[value] === undefined) {
      throw new Error(`Missing environment variable: ${value}`);
    }
  });
};

export default registerAs<AppConfig>('app', () => {
  const uniqueId = uuidv4();
  validateConfig(process.env, EnvironmentVariablesValidator);
  isVariableExist([
    'WITHDRAWAL_MIN_VALUE',
    'WITHDRAWAL_MAX_VALUE',
    'WITHDRAWAL_FEE',
    'DEPOSIT_MIN_VALUE',
    'DEPOSIT_MAX_VALUE',
    'DEPOSIT_FEE',
    'CRYPTO_MAX_DEPOSIT_LIMIT',
  ]);

  const withdrawalMinValue = Number(process.env.WITHDRAWAL_MIN_VALUE);
  const withdrawalMaxValue = Number(process.env.WITHDRAWAL_MAX_VALUE);
  const withdrawalFee = Number(process.env.WITHDRAWAL_FEE);
  const cryptoMaxDepositValue = Number(process.env.CRYPTO_MAX_DEPOSIT_LIMIT);

  const companyName = process.env.COMPANY_NAME;

  const depositMinValue = Number(process.env.DEPOSIT_MIN_VALUE);
  const depositMaxValue = Number(process.env.DEPOSIT_MAX_VALUE);
  const depositFee = Number(process.env.DEPOSIT_FEE);
  const transactionNotPaidDifference = Number(
    process.env.TRANSACTION_NOT_PAID_DIFFERENCE,
  );
  if (depositFee > depositMinValue) {
    throw new Error('Deposit Min Value Should Be Greater Than Deposit Fee');
  }
  let financialCCList: string[] = [];
  if (process.env.TRANSACTION_EMAIL_CC_LIST) {
    financialCCList = process.env.TRANSACTION_EMAIL_CC_LIST.split(',');
  }

  const financialEmailCCExcluseOfficeIds: number[] = [];
  if (process.env.TRANSACTION_EMAIL_CC_EXCLUDE_OFFICE_IDS) {
    if (
      Array.isArray(
        process.env.TRANSACTION_EMAIL_CC_EXCLUDE_OFFICE_IDS.split(','),
      )
    ) {
      process.env.TRANSACTION_EMAIL_CC_EXCLUDE_OFFICE_IDS.split(',').forEach(
        (id) => {
          const officeId = Number(id);
          if (!isNaN(officeId)) {
            financialEmailCCExcluseOfficeIds.push(officeId);
          }
        },
      );
    }
  }

  if (withdrawalFee > withdrawalMinValue) {
    throw new Error('Deposit Min Value Should Be Greater Than Deposit Fee');
  }

  const transferTransactionClientId =
    process.env.TRANSFER_TRANSACTION__KAFKA_CLIENT_ID;
  const transferTransactionGroupId =
    process.env.TRANSFER_TRANSACTION_KAFKA_GROUP_ID;

  const paymentGatewayCrypto = process.env.PAYMENT_GATEWAY_CRYPTO;
  const cryptoCurrency = process.env.CRYPTO_CURRENCY;
  const cryptoStandard = process.env.CRYPTO_STANDARDS;
  const cryptoStandardCond = process.env.CRYPTO_STANDARDS_COND;

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    aeFrontendDomain: process.env.AE_FRONTEND_DOMAIN,
    frontendWebsiteDomain: process.env.FRONTEND_WEBSITE_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x_custom_lang',
    environment: process.env.ENVIRONMENT || 'dev',
    authSaltRounds: process.env.AUTH_SALT_ROUNDS || 10,
    defaultLiveGroup: process.env.DEFAULT_LIVE_GROUP,
    defaultDemoGroup: process.env.DEFAULT_DEMO_GROUP,
    crmFrontEndUrl: process.env.CRM_FRONT_END_URL,
    otpThreshold: process.env.OTP_THRESHOLD
      ? parseInt(process.env.OTP_THRESHOLD)
      : 300000,
    otpThresholdCount: process.env.OTP_THRESHOLD_COUNT
      ? parseInt(process.env.OTP_THRESHOLD_COUNT)
      : 5,
    deviceIdOtpThreshold: process.env.DEVICE_ID_OTP_THRESHOLD
      ? parseInt(process.env.DEVICE_ID_OTP_THRESHOLD)
      : 3600000,
    deviceIdOtpThresholdCount: process.env.DEVICE_ID_OTP_THRESHOLD_COUNT
      ? parseInt(process.env.DEVICE_ID_OTP_THRESHOLD_COUNT)
      : 1,
    restApiDevUrl: process.env.REST_API_DEV_URL,
    restApiQAUrl: process.env.REST_API_QA_URL,
    restApiStagingUrl: process.env.REST_API_STAGING_URL,
    restApiProdUrl: process.env.REST_API_PROD_URL,
    preferredPsp: process.env.PREFERRED_PSP,
    bypassOtpVerification: process.env.BYPASS_OTP_VERIFICATION,
    withdrawalMinValue,
    withdrawalMaxValue,
    withdrawalFee,
    depositMinValue,
    depositMaxValue,
    depositFee,
    domain: process.env.DOMAIN,
    allowedDomains: process.env.ALLOWED_DOMAIN
      ? process.env.ALLOWED_DOMAIN.split(',')
      : [],
    defaultAggregator: process.env.DEFAULT_AGGREGATOR,
    defaultCryptoPsp: process.env.DEFAULT_CRYPTO_PSP,
    transactionNotPaidDifference,
    financialCCList,
    mt5RegulationServers: process.env.MT5_REGULATION_SERVERS
      ? process.env.MT5_REGULATION_SERVERS.split(',')
      : ['fsca'],
    transferTransactionType: process.env.TRANSFER_TRANSACTION_TYPE,

    transferTransactionGroupId: process.env.TRANSFER_TRANSACTION_KAFKA_GROUP_ID,
    transferTransactionClientId,
    paymentGatewayCrypto,
    cryptoCurrency,
    cryptoStandard,
    cryptoStandardCond,
    encryptionKey: process.env.ENCRYPTION_KEY,
    yahooNewsUrl: process.env.YAHOO_NEWS_URL,
    yahooNewsApiKey: process.env.YAHOO_NEWS_API_KEY,
    yahooNewsApiHost: process.env.YAHOO_NEWS_API_HOST,
    companyName,
    cryptoMaxDepositValue,
    btcWalletAddress: process.env.BTC_WALLET_ADDRESS,
    btcQRCode: process.env.BTC_QR_CODE_IMAGE,
    mt5ManagerLiveUrl: process.env.MT5_MANAGER_LIVE_URL,
    mt5ManagerDemoUrl: process.env.MT5_MANAGER_DEMO_URL,
    bypass2faVerification: process.env.BYPASS_2FA_VERIFICATION,
    timezoneDifference: process.env.TIMEZONE_DIFFERENCE
      ? Number(process.env.TIMEZONE_DIFFERENCE)
      : 2,
    financialEmailCCExcluseOfficeIds,
    // Migrated from mt5-rest-api by Arshad Shaheen
    symbols: process.env.SYMBOLS ? process.env.SYMBOLS.split(',') : [],
    siliconfortMt5ManagerUrl:
      process.env.SILICONFORT_MT5_MANAGER_URL || process.env.MT5_MANAGER_LIVE_URL,
    enableDummyData: process.env.ENABLE_DUMMY_DATA === 'true',
  };
});