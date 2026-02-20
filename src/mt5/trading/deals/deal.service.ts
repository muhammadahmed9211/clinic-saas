import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { TradingTicketGlobal, TradingTotalDto } from '../dto/trading.dto';
import { KafkaService } from 'src/kafka/kafka.service';
import { DealPagedDto } from './dto/trading-deal.dto';
import { DealTopics } from 'src/kafka/topics/mt5/deal.topics.enum';
import { UpdateDealDto } from './dto/update-deal.dto';
import { User } from 'src/users/entities/user.entity';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { In } from 'typeorm';
@Injectable()
export class DealService {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    private readonly kafka: KafkaService,
    private readonly mt5AccountRepository: Mt5AccountRepository,
  ) {}

  async getDealTicket(dealTicketDto: TradingTicketGlobal, user) {
    if (!(await this.isOwner(dealTicketDto.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(dealTicketDto.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      DealTopics.dealTicket,
      dealTicketDto,
      server,
    );
  }

  async getDealTotal(dealTotalDto: TradingTotalDto, user) {
    if (!(await this.isOwner(dealTotalDto.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(dealTotalDto.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      DealTopics.dealTotal,
      dealTotalDto,
      server,
    );
  }

  async getDealPaged(dealPaged: DealPagedDto) {
    const server = await this.checkAccountServer(dealPaged.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      DealTopics.dealPaged,
      dealPaged,
      server,
    );
  }

  async getDealPagedFromServer(dealPaged: DealPagedDto, user) {
    if (!(await this.isOwner(dealPaged.login, user))) {
      throw new UnauthorizedException(
        'You are not authorized to make trade on this account',
      );
    }
    const server = await this.checkAccountServer(dealPaged.login);
    return this.kafka.SendMessage(
      this.mt5Client,
      DealTopics.dealPagedFromServer,
      dealPaged,
      server,
    );
  }

  async updateDeal(updateDealDto: UpdateDealDto) {
    const login = updateDealDto.Login?.toString();
    if (!login) {
      throw new UnauthorizedException('Login is required to update deal');
    }
    const server = await this.checkAccountServer(login);
    return this.kafka.SendMessage(
      this.mt5Client,
      DealTopics.updateDeal,
      updateDealDto,
      server,
    );
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
}
