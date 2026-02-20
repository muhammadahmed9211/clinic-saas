import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import nodemailer from 'nodemailer';
import { AllConfigType } from 'src/config/config.type';
import { KafkaService } from 'src/kafka/kafka.service';
import { worldCheck } from 'src/kafka/topics/world-check/worldCheck.enum';

@Injectable()
export class WorldCheckService implements OnModuleInit {
  private readonly transporter: nodemailer.Transporter;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly kafka: KafkaService,
    @Inject('WORLD_CHECK_SERVICE')
    private readonly worldCheckClient: ClientKafka,
  ) {}
  async onModuleInit() {
    const appEnv = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    const domain = this.configService.getOrThrow('app.domain', {
      infer: true,
    });
    for (const topic of Object.values(worldCheck)) {
      await this.worldCheckClient.subscribeToResponseOf(
        `${appEnv}.${domain}.${topic}`,
      );
    }
  }

  async sendTopicToWorldCheckService(
    emailPayload: Record<string, any>,
    topicName: string,
  ) {
    await this.kafka.emitWorldCheckEvent(
      this.worldCheckClient,
      topicName,
      emailPayload,
    );
  }
}
