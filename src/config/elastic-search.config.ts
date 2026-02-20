import { registerAs } from '@nestjs/config';
import validateConfig from '../utils/validate-config';
import { IsOptional, IsString } from 'class-validator';
import { ElasticsearchConfig } from './elastic-search.type';

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsString()
  ELASTIC_APM_SERVICE_NAME?: string;

  @IsOptional()
  @IsString()
  ELASTIC_APM_SERVER_URL?: string;
}

export default registerAs<ElasticsearchConfig>('elasticsearch', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    serviceName: process.env.ELASTIC_APM_SERVICE_NAME || 'rest-api',
    serverUrl: process.env.ELASTIC_APM_SERVER_URL || '',
  };
});
