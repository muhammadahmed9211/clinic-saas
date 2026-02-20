import { Global, Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { Partitioners } from 'kafkajs';

const imports = [
  ClientsModule.registerAsync([
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
            },
            consumer: {
              groupId,
              maxConcurrency: 1,
              maxInFlightRequests: 1,
              maxParallel: 1,
              allowAutoTopicCreation: true,
            },
            producer: {
              createPartitioner: Partitioners.LegacyPartitioner,
              maxInFlightRequests: 1
            },
            topic: {
              partitions: 1
            }
          },
        };
      },
      inject: [ConfigService],
    },
  ]),
  KafkaModule,
];
const controllers = [];
const providers = [TransferService];
const moduleExports = [TransferService];

@Global()
@Module({})
export class TransferModule {
  static async register(): Promise<typeof TransferModule> {

    @Module({
      imports,
      controllers,
      providers,
      exports: moduleExports
    })
    class DynamicTransferModule { }
    //@ts-ignore
    return DynamicTransferModule;
  }
}