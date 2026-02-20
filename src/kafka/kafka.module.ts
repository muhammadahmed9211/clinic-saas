import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AllConfigType } from 'src/config/config.type';
import { KafkaService } from './kafka.service';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MT5_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.getOrThrow(
                  'kafka.mt5KafkaClientIdLive',
                  {
                    infer: true,
                  },
                ),
                brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                  infer: true,
                }),
                ...(configService.get('kafka.sslEnabled') && { ssl: true }),
                connectionTimeout: 3000,
                requestTimeout: 25000,
                retry: {
                  initialRetryTime: 100,
                  retries: 8
                }
              },
              consumer: {
                groupId: configService.getOrThrow('kafka.mt5KafkaGroupIdLive', {
                  infer: true,
                }),
                sessionTimeout: 30000,
                heartbeatInterval: 3000,
                maxBytesPerPartition: 1048576,
                maxWaitTimeInMs: 3000,
                retry: {
                  initialRetryTime: 100,
                  retries: 8
                }
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'MT5_SERVICE_DEMO',
        useFactory: (configService: ConfigService<AllConfigType>) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: configService.getOrThrow(
                  'kafka.mt5KafkaClientIdDemo',
                  {
                    infer: true,
                  },
                ),
                brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                  infer: true,
                }),
                ...(configService.get('kafka.sslEnabled') && { ssl: true }),
                connectionTimeout: 3000,
                requestTimeout: 25000,
                retry: {
                  initialRetryTime: 100,
                  retries: 8
                }
              },
              consumer: {
                groupId: configService.getOrThrow('kafka.mt5KafkaGroupIdDemo', {
                  infer: true,
                }),
                sessionTimeout: 30000,
                heartbeatInterval: 3000,
                maxBytesPerPartition: 1048576,
                maxWaitTimeInMs: 3000,
                retry: {
                  initialRetryTime: 100,
                  retries: 8
                }
              },
            },
          };
        },
        inject: [ConfigService],
      },
      {
        name: 'MAIL_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka.emailKafkaClientId', {
                infer: true,
              }),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
              ...(configService.get('kafka.sslEnabled') && { ssl: true }),
              connectionTimeout: 3000,
              requestTimeout: 25000,
              retry: {
                initialRetryTime: 100,
                retries: 8
              }
            },
            consumer: {
              groupId: configService.getOrThrow('kafka.emailKafkaGroupId', {
                infer: true,
              }),
              sessionTimeout: 30000,
              heartbeatInterval: 3000,
              maxBytesPerPartition: 1048576,
              maxWaitTimeInMs: 3000,
              retry: {
                initialRetryTime: 100,
                retries: 8
              }
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'WORLD_CHECK_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow(
                'kafka.complianceKafkaClientId',
                {
                  infer: true,
                },
              ),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
              ...(configService.get('kafka.sslEnabled') && { ssl: true }),
              connectionTimeout: 3000,
              requestTimeout: 25000,
              retry: {
                initialRetryTime: 100,
                retries: 8
              }
            },
            consumer: {
              groupId: configService.getOrThrow(
                'kafka.complianceKafkaGroupId',
                {
                  infer: true,
                },
              ),
              sessionTimeout: 30000,
              heartbeatInterval: 3000,
              maxBytesPerPartition: 1048576,
              maxWaitTimeInMs: 3000,
              retry: {
                initialRetryTime: 100,
                retries: 8
              }
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'TRANSFER_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => {
          const brokers = configService.getOrThrow('kafka.kafkaBrokers', {
            infer: true,
          });

          const clientId = configService.getOrThrow(
            'app.transferTransactionClientId',
            {
              infer: true,
            },
          );

          const groupId = configService.getOrThrow(
            'app.transferTransactionGroupId',
            {
              infer: true,
            },
          );

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId,
                brokers,
                ...(configService.get('kafka.sslEnabled') && { ssl: true }),
                connectionTimeout: 3000,
                requestTimeout: 25000,
                retry: {
                  initialRetryTime: 100,
                  retries: 8
                }
              },
              consumer: {
                groupId,
                maxConcurrency:1,
                maxInFlightRequests:1,
                sessionTimeout: 30000,
                heartbeatInterval: 3000,
                maxBytesPerPartition: 1048576,
                maxWaitTimeInMs: 3000,
                retry: {
                  initialRetryTime: 100,
                  retries: 8
                }
              },
              producer:{
                createPartitioner: Partitioners.LegacyPartitioner
              },
              topic:{
                partitions:1
              }
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [KafkaService],
  providers: [KafkaService],
})
export class KafkaModule {}
