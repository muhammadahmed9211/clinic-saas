export type KafkaConfig = {
  kafkaBrokers?: string[];
  sslEnabled?: boolean;
  mt5KafkaGroupIdLive?: string;
  mt5KafkaClientIdLive?: string;
  mt5KafkaGroupIdDemo?: string;
  mt5KafkaClientIdDemo?: string;
  mt5KafkaConsumerServers?: string[];
  emailKafkaGroupId?: string;
  emailKafkaClientId?: string;
  emailKafkaPartition?: number;
  complianceKafkaClientId?: string;
  complianceKafkaGroupId?: string;
  notificationKafkaClientId?: string;
  notificationKafkaGroupId?: string;
};
