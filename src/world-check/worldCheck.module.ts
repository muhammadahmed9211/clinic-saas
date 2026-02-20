import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { User } from 'src/users/entities/user.entity';
import { WorldCheckService } from './worldCheck.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
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
            },
            consumer: {
              groupId: configService.getOrThrow(
                'kafka.complianceKafkaGroupId',
                {
                  infer: true,
                },
              ),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KafkaModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [WorldCheckService],
  exports: [WorldCheckService],
})
export class WorldCheckModule {}
