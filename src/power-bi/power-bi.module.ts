import { PowerBiService } from './power-bi.service';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { PowerBiController } from './power-bi.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'POWER_BI_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'power-bi-consumer-local',
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: 'power-bi-consumer-local',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KafkaModule,
  ],
  controllers: [PowerBiController],
  providers: [PowerBiService],
  exports: [PowerBiService],
})
export class PowerBiModule {}
