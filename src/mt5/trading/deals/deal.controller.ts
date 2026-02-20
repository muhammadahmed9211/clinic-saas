import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DealService } from './deal.service';
import { TradingTicketGlobal, TradingTotalDto } from '../dto/trading.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DealPagedDto } from './dto/trading-deal.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { DealTopics } from 'src/kafka/topics/mt5/deal.topics.enum';
import { UpdateDealDto } from './dto/update-deal.dto';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('MT5 Trading')
@Controller({
  path: 'mt5/trading',
  version: '1',
})
export class DealController implements OnModuleInit {
  constructor(
    private readonly mt5Service: DealService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  @Get('deal-ticket')
  dealTicket(
    @GetUser() user: User,
    @Query() dealTicketDto: TradingTicketGlobal,
  ) {
    return this.mt5Service.getDealTicket(dealTicketDto, user);
  }

  @Get('deal-total')
  dealTotal(@GetUser() user: User, @Query() dealTotalDto: TradingTotalDto) {
    return this.mt5Service.getDealTotal(dealTotalDto, user);
  }

  @Get('deal-paged')
  dealPaged(@GetUser() user: User, @Query() dealPaged: DealPagedDto) {
    return this.mt5Service.getDealPagedFromServer(dealPaged, user);
  }

  // @Patch('deal/:id/update')
  // updateDeal(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateDealDto: UpdateDealDto,
  // ) {
  //   return this.mt5Service.updateDeal({ ...updateDealDto, Deal: id });
  // }

  onModuleInit() {
    // const servers = this.configService.getOrThrow(
    //   'kafka.mt5KafkaConsumerServers',
    //   { infer: true },
    // );

    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(DealTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
