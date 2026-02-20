import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { AllConfigType } from 'src/config/config.type';
// import { PriceTopics } from 'src/mt5/price/price.topics.enum';
// import { AccountTopics } from './topics/mt5/account.topics.enum';
// import { ClientTopics } from './topics/mt5/client.topics.enum';
// import { DealTopics } from './topics/mt5/deal.topics.enum';
// import { OrderTopics } from './topics/mt5/order.topics.enum';
// import { PositionTopics } from './topics/mt5/position.topics.enum';
// import { TradeRequestTopics } from './topics/mt5/trade-requests.topics.enum';
// import { SendEmails } from './topics/sendEmail/sendEmail.enum';

export interface Dto {
  toString(): string;
}

@Injectable()
export class KafkaService {
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    // @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    // @Inject('MAIL_SERVICE') private readonly mailClient: ClientKafka,
  ) {}

  prefix = this.configService.getOrThrow('app.domain', {
    infer: true,
  });

  async SendMessage<T = any>(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
    server: string = 'live',
  ): Promise<T> {
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    return new Promise((resolve, reject) => {
      client
        // .send(`${server}.${topic}`, this.createPayload(message))
        .send(`${env}.${server}.${topic}`, this.createPayload(message))
        .subscribe({
          next: (res) => {
            // console.log('res====>', res);
            resolve(res);
          },
          error: (err) => {
            console.log('Error:', err);
            reject(err);
          },
        });
    });
  }

  async SendMessageToTopic<T = any>(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
    prefix: boolean = true,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      let topicName = topic;
      if (prefix) {
        topicName = `${this.prefix}.${topic}`;
      }
      client.send(topicName, this.createPayload(message)).subscribe({
        next: (res) => {
          resolve(res);
        },
        error: (err) => {
          console.log(err, 'ERROR');
          reject(err);
        },
      });
    });
  }

  async emitMt5Event(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
    server: string = 'live',
  ): Promise<void> {
    console.log('Event Payload: ', message);
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    await client.emit(`${env}.${server}.${topic}`, this.createPayload(message));
  }

  async emitMailEvent(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
  ): Promise<void> {
    // console.log('Mail Event Payload: ', message);
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    // console.log('Mail topic: ', `${env}.${this.prefix}.${topic}`);
    await client.emit(
      `${env}.${this.prefix}.${topic}`,
      this.createPayload(message),
    );
  }

  //world check event

  async emitWorldCheckEvent(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
  ): Promise<void> {
    console.log('world check Event Payload: ', message);
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    console.log('world check topic: ', `${env}.${this.prefix}.${topic}`);
    await client.emit(
      `${env}.${this.prefix}.${topic}`,
      this.createPayload(message),
    );
  }

  async sendMailMessage<T = any>(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
  ): Promise<T> {
    console.log('message', message);
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    return new Promise((resolve, reject) => {
      client
        // .send(`${server}.${topic}`, this.createPayload(message))
        .send(`${env}.${this.prefix}.${topic}`, this.createPayload(message))
        .subscribe({
          next: (res) => {
            // console.log('res====>', res);
            resolve(res);
          },
          error: (err) => {
            console.log('Error:', err);
            reject(err);
          },
        });
    });
  }

  async emitNotification(
    client: ClientKafka,
    topic: string,
    message: Record<string, any>,
  ): Promise<void> {
    console.log('Notification Event Payload: ', message);
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });
    console.log('Notification topic: ', `${env}.${topic}`);
    await client.emit(`${env}.${topic}`, this.createPayload(message));
  }

  createPayload(payload: Record<string, any>) {
    return Object.assign(payload, { toString: () => JSON.stringify(payload) });
  }
}
