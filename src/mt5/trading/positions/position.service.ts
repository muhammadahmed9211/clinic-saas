import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import {
  PositionBackupDto,
  PositionPagedDto,
  PositionPagedFromServerDto,
  PositionSymbolDto,
  PositionTotalDto,
  TradingPositionDto,
} from './dto/trading-position.dto';
import { PositionTopics } from 'src/kafka/topics/mt5/position.topics.enum';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { In } from 'typeorm';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { Mt5HttpService } from 'src/mt5/http/mt5-http.service';

@Injectable()
export class PositionService implements OnModuleInit {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    private readonly kafka: KafkaService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly mt5AccountRepository: Mt5AccountRepository,
    private readonly httpService: Mt5HttpService,
  ) {}

  async getPositionSymbol(positionSymbol: PositionSymbolDto, user: User) {
    if (!(await this.isOwner(positionSymbol.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(positionSymbol.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      PositionTopics.positionSymbol,
      positionSymbol,
      server,
    );
  }

  async getPositionTotal(positionTotal: PositionTotalDto, user: User) {
    if (!(await this.isOwner(positionTotal.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(positionTotal.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      PositionTopics.positionTotal,
      positionTotal,
      server,
    );
  }

  async getPositionPaged(positionPaged: PositionPagedDto) {
    const server = await this.checkAccountServer(positionPaged.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      PositionTopics.positionPaged,
      positionPaged,
      server,
    );
  }

  async getPositionPagedBackup(positionPaged: PositionBackupDto, user: User) {
    if (!(await this.isOwner(positionPaged.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(positionPaged.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      PositionTopics.positionBackup,
      positionPaged,
      server,
    );
  }

  async getPositionPagedFromServerKafka(
    positionPaged: PositionPagedFromServerDto,
    user: User,
  ) {
    if (!(await this.isOwner(positionPaged.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized access this account',
      );
    }
    const server = await this.checkAccountServer(positionPaged.login);
    let res;

    if (positionPaged.symbol) {
      res = await this.kafka.SendMessage(
        this.mt5Client,
        PositionTopics.positionSymbol,
        positionPaged,
        server,
      );
    } else {
      res = await this.kafka.SendMessage(
        this.mt5Client,
        PositionTopics.positionPagedFromServer,
        positionPaged,
        server,
      );
    }

    return res;
  }

  async getPositionPagedFromServerRest(
    positionPaged: PositionPagedFromServerDto,
    user: User,
  ) {
    if (!(await this.isOwner(positionPaged.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized access this account',
      );
    }
    const server = await this.checkAccountServer(positionPaged.login);
    let res;

    res = await this.httpService.makeRequest<any>(
      'GET',
      `trading/${PositionTopics.positionPagedFromServer}`,
      server,
      {},
      { login: positionPaged.login, symbol: positionPaged.symbol },
    );

    return res;
  }

  async updatePosition(positionDto: TradingPositionDto, user: User) {
    if (!(await this.isOwner(positionDto.Login, user))) {
      throw new UnauthorizedException(
        'You are not authorized access this account',
      );
    }
    const server = await this.checkAccountServer(positionDto.Login);
    const res = await this.kafka.SendMessage(
      this.mt5Client,
      PositionTopics.updatePosition,
      positionDto,
      server,
    );

    return res;
  }

  private async isOwner(
    logins: string | string[],
    user: User,
  ): Promise<boolean> {
    const loginArray = Array.isArray(logins) ? logins : [logins];

    const mt5accounts = await this.mt5AccountRepository.find({
      where: {
        login: In(loginArray),
        user: { id: user.id },
      },
    });

    return mt5accounts.length === loginArray.length;
  }

  async checkAccountServer(login: string) {
    const account = await this.mt5AccountRepository.findOneBy({ login });
    if (!account) throw new NotFoundException('Account not found');
    return account?.server?.name?.toLowerCase();
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
      Object.values(PositionTopics).forEach((topic) => {
        this.mt5Client.subscribeToResponseOf(`${env}.${server}.${topic}`);
      });
    });
  }
}
