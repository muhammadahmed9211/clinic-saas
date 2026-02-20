import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UpdateBalanceRequest } from './dto/update-balance.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { TradeRequestTopics } from 'src/kafka/topics/mt5/trade-requests.topics.enum';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { TradeRequestDto } from 'src/trading/dto/trade-request.dto';
import { User } from 'src/users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TradeRequestService implements OnModuleInit {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
    private readonly kafka: KafkaService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly httpService: HttpService,
  ) {}

  private readonly mt5DemoUrl = this.configService.getOrThrow(
    'app.mt5ManagerDemoUrl',
    { infer: true },
  );
  private readonly mt5LiveUrl = this.configService.getOrThrow(
    'app.mt5ManagerLiveUrl',
    { infer: true },
  );

  async updateBalance(updateBalanceDto: UpdateBalanceRequest) {
    return this.kafka.SendMessage(
      this.mt5Client,
      TradeRequestTopics.updateBalance,
      updateBalanceDto,
    );
  }

  async updateDemoBalance(updateBalanceDto: UpdateBalanceRequest) {
    return this.kafka.SendMessage(
      this.mt5ClientDemo,
      TradeRequestTopics.updateBalance,
      updateBalanceDto,
      'demo',
    );
  }

  async tradeRequest(user: User, data: TradeRequestDto, demo: boolean = false) {
    return this.kafka.SendMessage(
      demo ? this.mt5ClientDemo : this.mt5Client,
      TradeRequestTopics.tradeRequest,
      data,
      demo ? 'demo' : 'live',
    );
  }

  async tradeRequestRest(
    user: User,
    data: TradeRequestDto,
    demo: boolean = false,
  ) {
    let res;
    if (demo) {
      res = await firstValueFrom(
        this.httpService.post(`${this.mt5DemoUrl}/trading/trade-request`, data),
      );
    } else {
      res = await firstValueFrom(
        this.httpService.post(`${this.mt5LiveUrl}/trading/trade-request`, data),
      );
    }
    return res.data;
  }

  async tradeRequestResult(user: User, ids: string[], demo: boolean = false) {
    return this.kafka.SendMessage(
      demo ? this.mt5ClientDemo : this.mt5Client,
      TradeRequestTopics.tradeRequestResult,
      { id: ids.join(',') },
      demo ? 'demo' : 'live',
    );
  }

  onModuleInit() {
    const servers = this.configService.getOrThrow(
      'kafka.mt5KafkaConsumerServers',
      { infer: true },
    );

    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    servers.map((server) => {
      Object.values(TradeRequestTopics).forEach((topic) => {
        this.mt5Client.subscribeToResponseOf(`${env}.${server}.${topic}`);
      });
    });
  }
}
