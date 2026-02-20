import { registerAs } from '@nestjs/config';
import { FileConfig } from 'src/files/config/file-config.type';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';

enum FileDriver {
  LOCAL = 'local',
  S3 = 's3',
}

class EnvironmentVariablesValidator {
  @IsEnum(FileDriver)
  FILE_DRIVER: FileDriver;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  ACCESS_KEY_ID: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  SECRET_ACCESS_KEY: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  AWS_DEFAULT_S3_BUCKET: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  @IsOptional()
  AWS_DEFAULT_S3_URL: string;

  @ValidateIf((envValues) => envValues.FILE_DRIVER === FileDriver.S3)
  @IsString()
  AWS_S3_REGION: string;

  @IsString()
  @IsNotEmpty()
  AWS_SHARED_BUCKET_DIRECTORY: string;

  @IsString()
  @IsNotEmpty()
  AWS_EXCEL_SHEET_DIRECTORY: string;

  @IsString()
  @IsNotEmpty()
  AWS_DEFAULT_BUCKET_DIRECTORY: string;
}

export default registerAs<FileConfig>('file', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    driver: process.env.FILE_DRIVER ?? 'local',
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    awsDefaultS3Bucket: process.env.AWS_DEFAULT_S3_BUCKET,
    awsDefaultS3Url: process.env.AWS_DEFAULT_S3_URL,
    awsS3Region: process.env.AWS_S3_REGION,
    maxFileSize: 5242880, // 5mb
    awss3SignedUrlTimeout: 86400,
    sharedBucketDirectory: process.env.AWS_SHARED_BUCKET_DIRECTORY,
    defaultBucketDirectory: process.env.AWS_DEFAULT_BUCKET_DIRECTORY,
    awsExcelSheetDirectory: process.env.AWS_EXCEL_SHEET_DIRECTORY,
    contactUsBucketDirectory: process.env.AWS_CONTACT_US_BUCKET_DIRECTORY,
    contactUsSignedUrlTimeout: process.env.AWS_CONTACT_US_SIGNED_URL_TIMEOUT,
    chatBucketDirectory: process.env.AWS_CHAT_BUCKET_DIRECTORY ?? 'Chat',
  };
});
