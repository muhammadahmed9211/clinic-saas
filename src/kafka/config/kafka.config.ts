import { registerAs } from '@nestjs/config';
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { KafkaConfig } from './kafka-config.type';
import validateConfig from 'src/utils/validate-config';
import { v4 as uuidv4 } from 'uuid';

class EnvironmentVariablesValidator {
  @IsOptional()
  KAFKA_BROKERS: string;

  @IsOptional()
  KAFKA_SSL_ENABLED: string;

  @IsString()
  @IsOptional()
  MT5_KAFKA_GROUP_ID_LIVE: string;

  @IsString()
  @IsOptional()
  MT5_KAFKA_CLIENT_ID_LIVE: string;

  @IsString()
  @IsOptional()
  MT5_KAFKA_GROUP_ID_DEMO: string;

  @IsString()
  @IsOptional()
  MT5_KAFKA_CLIENT_ID_DEMO: string;

  @IsString()
  @IsOptional()
  EMAIL_KAFKA_GROUP_ID: string;

  @IsString()
  @IsOptional()
  EMAIL_KAFKA_CLIENT_ID: string;

  @IsNumber()
  @IsOptional()
  EMAIL_KAFKA_PARTITION: number;

  @IsString()
  @IsOptional()
  COMPLIANCE_KAFKA_GROUP_ID: string;

  @IsString()
  @IsOptional()
  COMPLIANCE_KAFKA_CLIENT_ID: string;

  @IsString()
  @IsOptional()
  NOTIFICATION_KAFKA_GROUP_ID: string;

  @IsString()
  @IsOptional()
  NOTIFICATION_KAFKA_CLIENT_ID: string;
}

export default registerAs<KafkaConfig>('kafka', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  const uniqueId = uuidv4();

  return {
    kafkaBrokers: process.env.KAFKA_BROKERS
      ? process.env.KAFKA_BROKERS.split(' ').filter(Boolean)
      : ['localhost:9092'],
    sslEnabled: process.env.KAFKA_SSL_ENABLED === 'true',
    mt5KafkaGroupIdLive: `${process.env.MT5_KAFKA_GROUP_ID_LIVE}-${uniqueId}`,
    mt5KafkaClientIdLive: process.env.MT5_KAFKA_CLIENT_ID_LIVE,
    // mt5KafkaClientIdLive: `${process.env.MT5_KAFKA_CLIENT_ID_LIVE}-${uniqueId}`,
    mt5KafkaGroupIdDemo: `${process.env.MT5_KAFKA_GROUP_ID_DEMO}-${uniqueId}`,
    mt5KafkaClientIdDemo: process.env.MT5_KAFKA_CLIENT_ID_DEMO,
    // mt5KafkaClientIdDemo: `${process.env.MT5_KAFKA_CLIENT_ID_DEMO}-${uniqueId}`,
    mt5KafkaConsumerServers: process.env.MT5_KAFKA_CONSUMER_SERVERS
      ? process.env.MT5_KAFKA_CONSUMER_SERVERS.split(' ')
      : ['dev'],
    emailKafkaGroupId: `${process.env.EMAIL_KAFKA_GROUP_ID}-${uniqueId}`,
    emailKafkaClientId: process.env.EMAIL_KAFKA_CLIENT_ID,
    emailKafkaPartition: process.env.EMAIL_KAFKA_PARTITION
      ? parseInt(process.env.EMAIL_KAFKA_PARTITION)
      : 0,
    complianceKafkaGroupId: `${process.env.COMPLIANCE_KAFKA_GROUP_ID}-${uniqueId}`,
    complianceKafkaClientId: process.env.COMPLIANCE_KAFKA_CLIENT_ID,
    restApiKafkaGroupId: process.env.REST_API_KAFKA_GROUP_ID_LIVE,
    restApiKafkaClientId: process.env.REST_API_KAFKA_CLIENT_ID,
    notificationKafkaGroupId: `${process.env.NOTIFICATION_KAFKA_GROUP_ID}-${uniqueId}`,
    notificationKafkaClientId: process.env.NOTIFICATION_KAFKA_CLIENT_ID,
  };
});
