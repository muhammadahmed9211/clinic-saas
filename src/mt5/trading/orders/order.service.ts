import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import {
  CancelOrderDto,
  ClosedDto,
  GetBackupDto,
  GetBackupListDto,
  OrderMultipleOpenDto,
  OrderOpenPagedDto,
  OrderTicketsDto,
  TradingTotalDto,
} from './dto/trading-order.dto';
import { OrderTopics } from 'src/kafka/topics/mt5/order.topics.enum';
import {
  OpenMultipleResponse,
  Order,
  TradingOpenCloseTicket,
  TradingOpenPaged,
  UpdateOrderResponse,
} from 'src/utils/types/mt5/orders/order.type';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { In, Repository } from 'typeorm';
import {
  IResponseWrapper,
  ResponseWrapper,
} from 'src/utils/interface/mt5/base-response.interface';
import { Mt5RetCode } from 'src/utils/enums/mt5/response-codes.enum.';
import { Mt5HttpService } from 'src/mt5/http/mt5-http.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    private readonly kafka: KafkaService,
    private readonly mt5HttpService: Mt5HttpService,
  ) {}

  async orderByTicket(
    payload: OrderTicketsDto,
    user: User,
    server: string = 'live',
  ): Promise<IResponseWrapper<TradingOpenCloseTicket>> {
    const result = await this.kafka.SendMessage<
      IResponseWrapper<TradingOpenCloseTicket>
    >(this.mt5Client, OrderTopics.orderOpenTicket, payload, server);
    if (result.result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(result.result.answer.Login, user))) {
      throw new BadRequestException(
        'User is not authorized to access this order',
      );
    }
    return result;
  }

  async orderTotal(payload: TradingTotalDto, user: User): Promise<any> {
    const server = await this.checkAccountServer(payload.login);
    const result = await this.kafka.SendMessage<any>(
      this.mt5Client,
      OrderTopics.orderOpenTotal,
      payload,
      server,
    );
    if (result.result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access these orders',
      );
    }
    return result;
  }

  async getOpenPaged(
    payload: OrderOpenPagedDto,
    user: User,
  ): Promise<TradingOpenPaged> {
    const server = await this.checkAccountServer(payload.login);
    // const result = await this.kafka.SendMessage(
    //   this.mt5Client,
    //   OrderTopics.orderOpenPaged,
    //   payload,
    //   server,
    // );
    const result = await this.mt5HttpService.makeRequest<any>(
      'GET',
      `order/${OrderTopics.orderOpenPaged}`,
      server,
      {},
      payload,
    );
    if (result.result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access these orders',
      );
    }
    if (
      result.result?.retcode === Mt5RetCode.SUCCESS &&
      result.result?.answer &&
      payload.symbol
    ) {
      result.result.answer = result.result?.answer.filter(
        (order) => order.Symbol === payload.symbol,
      );
    }
    return result;
  }

  async getOpenMultiple(
    payload: OrderMultipleOpenDto,
    user: User,
  ): Promise<OpenMultipleResponse> {
    const server = await this.checkAccountServer(payload.login[0]);
    const result = await this.kafka.SendMessage<OpenMultipleResponse>(
      this.mt5Client,
      OrderTopics.orderOpenMultiple,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access these orders',
      );
    }
    return result;
  }

  async updateOpen(payload: any, user: User): Promise<UpdateOrderResponse> {
    const server = await this.checkAccountServer(payload.Login.toString());
    if (!(await this.isOwner(payload.Login.toString(), user))) {
      throw new BadRequestException(
        'User is not authorized to update this order',
      );
    }
    const result = await this.kafka.SendMessage<UpdateOrderResponse>(
      this.mt5Client,
      OrderTopics.updateOrder,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    return result;
  }

  async deleteOpen(
    payload: number[],
    user: User,
  ): Promise<{ retcode: string }> {
    const server = await this.checkAccountServer(payload[0]?.toString());
    const result = await this.kafka.SendMessage<{ retcode: string }>(
      this.mt5Client,
      OrderTopics.deleteOrder,
      payload,
      server,
    );
    return result;
  }

  async cancelOpen(
    payload: CancelOrderDto,
    user: User,
  ): Promise<{ retcode: string }> {
    const order = await this.orderByTicket(
      { ticket: payload.orderId.toString() },
      user,
      payload.demo ? 'demo' : 'live',
    );

    if (!order.result.answer) {
      throw new NotFoundException('Order not found');
    }

    if (order.result.answer) {
      if (!(await this.isOwner(order.result.answer.Login, user))) {
        throw new BadRequestException(
          'You are not authorized to access these orders',
        );
      }
    }

    const server = await this.checkAccountServer(order.result.answer.Login);

    console.log('server', server);

    const result = await this.kafka.SendMessage<{ retcode: string }>(
      this.mt5Client,
      OrderTopics.cancelOrder,
      [payload.orderId.toString()],
      server,
    );
    return result;
  }

  async getClosedTicket(
    payload: OrderTicketsDto,
    user: User,
  ): Promise<IResponseWrapper<TradingOpenCloseTicket>> {
    const server = await this.checkAccountServer(payload.ticket);
    const result = await this.kafka.SendMessage<
      IResponseWrapper<TradingOpenCloseTicket>
    >(this.mt5Client, OrderTopics.orderCloseTicket, payload, server);
    if (result.result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(result.result.answer.Login, user))) {
      throw new BadRequestException(
        'User is not authorized to access this order',
      );
    }
    return result;
  }

  async getClosedTotal(payload: ClosedDto, user: User): Promise<any> {
    const server = await this.checkAccountServer(payload.login);
    const result = await this.kafka.SendMessage<any>(
      this.mt5Client,
      OrderTopics.orderCloseTotal,
      payload,
      server,
    );
    if (result.result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access these orders',
      );
    }
    return result;
  }

  async getClosedPaged(
    payload: OrderOpenPagedDto,
    user: User,
  ): Promise<TradingOpenPaged> {
    const server = await this.checkAccountServer(payload.login);
    const result = await this.mt5HttpService.makeRequest<any>(
      'GET',
      `order/${OrderTopics.orderClosePaged}`,
      server,
      {},
      payload,
    );
    // const result = await this.kafka.SendMessage<TradingOpenPaged>(
    //   this.mt5Client,
    //   OrderTopics.orderClosePaged,
    //   payload,
    //   server,
    // );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access these orders',
      );
    }
    return result;
  }

  async getClosedMultiple(
    payload: OrderMultipleOpenDto,
    user: User,
  ): Promise<OpenMultipleResponse> {
    const server = await this.checkAccountServer(payload.login[0]);
    const result = await this.kafka.SendMessage<OpenMultipleResponse>(
      this.mt5Client,
      OrderTopics.orderClosedMultiple,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access these orders',
      );
    }
    return result;
  }

  async updateClosed(payload: any, user: User): Promise<UpdateOrderResponse> {
    const server = await this.checkAccountServer(payload.Login.toString());
    const result = await this.kafka.SendMessage<UpdateOrderResponse>(
      this.mt5Client,
      OrderTopics.updateClosed,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.Login.toString(), user))) {
      throw new BadRequestException(
        'User is not authorized to update this order',
      );
    }
    return result;
  }

  async deleteClosed(
    payload: number[],
    user: User,
  ): Promise<{ retcode: string }> {
    const server = await this.checkAccountServer(payload[0]?.toString());
    const result = await this.kafka.SendMessage<{ retcode: string }>(
      this.mt5Client,
      OrderTopics.deleteClosed,
      payload,
      server,
    );
    return result;
  }

  async getBackupList(
    payload: GetBackupListDto,
    user: User,
  ): Promise<{ retcode: string; answer: string[] }> {
    const result = await this.kafka.SendMessage<{
      retcode: string;
      answer: string[];
    }>(this.mt5Client, OrderTopics.getBackupList, payload);
    // if (!(await this.isOwner(payload.login, user))) {
    //   throw new BadRequestException(
    //     'User is not authorized to access these backups',
    //   );
    // }
    return result;
  }

  async getOrderFromBackup(
    payload: GetBackupDto,
    user: User,
  ): Promise<TradingOpenPaged> {
    const server = await this.checkAccountServer(payload.login);
    const result = await this.kafka.SendMessage<TradingOpenPaged>(
      this.mt5Client,
      OrderTopics.getOrderFromBackup,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.login, user))) {
      throw new BadRequestException(
        'User is not authorized to access this backup',
      );
    }
    return result;
  }

  async restoreFromBackup(
    payload: any,
    user: User,
  ): Promise<UpdateOrderResponse> {
    const server = await this.checkAccountServer(payload.Login.toString());
    const result = await this.kafka.SendMessage<UpdateOrderResponse>(
      this.mt5Client,
      OrderTopics.restoreOrderFromBackup,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(payload.Login.toString(), user))) {
      throw new BadRequestException(
        'User is not authorized to restore this order',
      );
    }
    return result;
  }

  async reopenOrder(
    payload: { ticket: string },
    user: User,
  ): Promise<UpdateOrderResponse> {
    const server = await this.checkAccountServer(payload.ticket);
    const result = await this.kafka.SendMessage<UpdateOrderResponse>(
      this.mt5Client,
      OrderTopics.reopenOrder,
      payload,
      server,
    );
    if (result.retcode === Mt5RetCode.NOT_FOUND) {
      throw new NotFoundException('Order not found');
    }
    if (result.retcode !== Mt5RetCode.SUCCESS) {
      return result;
    }
    if (!(await this.isOwner(result.answer.Login.toString(), user))) {
      throw new BadRequestException(
        'User is not authorized to restore this order',
      );
    }
    return result;
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
