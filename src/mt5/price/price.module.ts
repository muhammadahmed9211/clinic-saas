import { Module } from '@nestjs/common';
import { PriceController, PublicPriceController } from './price.controller';
import { PriceService } from './price.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { KafkaModule } from 'src/kafka/kafka.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavouriteSymbol } from 'src/mt5/entities/mt5-favourite-symbol.entity';
import { User } from 'src/users/entities/user.entity';
import { Mt5Symbol } from 'src/mt5/entities/mt5-symbol.entity';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'MT5_SERVICE',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka.mt5KafkaClientIdLive', {
                infer: true,
              }),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: configService.getOrThrow('kafka.mt5KafkaGroupIdLive', {
                infer: true,
              }),
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'MT5_SERVICE_DEMO',
        useFactory: (configService: ConfigService<AllConfigType>) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow('kafka.mt5KafkaClientIdDemo', {
                infer: true,
              }),
              brokers: configService.getOrThrow('kafka.kafkaBrokers', {
                infer: true,
              }),
            },
            consumer: {
              groupId: configService.getOrThrow('kafka.mt5KafkaGroupIdDemo', {
                infer: true,
              }),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    KafkaModule,
    TypeOrmModule.forFeature([FavouriteSymbol, User, Mt5Symbol]), // Register repositories
  ],
  controllers: [PriceController, PublicPriceController],
  providers: [PriceService],
  exports: [PriceService],
})
export class PriceModule {}
