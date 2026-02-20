import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  OnModuleInit,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TradeRequestService } from './trade-requests.service';
import { UpdateBalanceRequest } from './dto/update-balance.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { TradeRequestTopics } from 'src/kafka/topics/mt5/trade-requests.topics.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { TradeRequestDto } from 'src/trading/dto/trade-request.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('MT5 Trading')
@Controller({
  path: 'mt5/trade-request',
  version: '1',
})
export class TradeRequestController implements OnModuleInit {
  constructor(
    private readonly tradeRequestService: TradeRequestService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  // @UseGuards(AuthGuard('jwt'))
  // @Post('update-balance')
  // updateBalance(@Body() updateBalanceDto: UpdateBalanceRequest) {
  //   return this.mt5Service.updateBalance(updateBalanceDto);
  // }

  // @ApiBearerAuth()
  // @Post('send-trade-request')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // tradeRequest(@GetUser() user: User, @Body() body: TradeRequestDto) {
  //   return this.tradeRequestService.tradeRequest(user, body);
  // }

  onModuleInit() {
    // const servers = this.configService.getOrThrow(
    //   'kafka.mt5KafkaConsumerServers',
    //   { infer: true },
    // );

    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(TradeRequestTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
