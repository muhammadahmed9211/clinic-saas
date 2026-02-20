import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PositionService } from './position.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  PositionBackupDto,
  PositionPagedDto,
  PositionSymbolDto,
  PositionTotalDto,
  TradingPositionDto,
} from './dto/trading-position.dto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { PositionTopics } from 'src/kafka/topics/mt5/position.topics.enum';
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
export class PositionController implements OnModuleInit {
  constructor(
    private readonly mt5Service: PositionService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  @Get('position-symbol')
  dealTicket(
    @Query() positionSymbol: PositionSymbolDto,
    @GetUser() user: User,
  ) {
    return this.mt5Service.getPositionSymbol(positionSymbol, user);
  }

  @Get('position-total')
  positionTotal(
    @Query() dealTotalDto: PositionTotalDto,
    @GetUser() user: User,
  ) {
    return this.mt5Service.getPositionTotal(dealTotalDto, user);
  }

  @Get('position-paged')
  positionPaged(
    @Query() positionPaged: PositionPagedDto,
    @GetUser() user: User,
  ) {
    return this.mt5Service.getPositionPagedFromServerRest(positionPaged, user);
  }

  @Get('position-backup')
  positionPagedBackup(
    @Query() positionPaged: PositionBackupDto,
    @GetUser() user: User,
  ) {
    return this.mt5Service.getPositionPagedBackup(positionPaged, user);
  }

  @Patch('update-position')
  updatePosition(@Body() dto: TradingPositionDto, @GetUser() user: User) {
    return this.mt5Service.updatePosition(dto, user);
  }

  onModuleInit() {
    // const servers = this.configService.getOrThrow(
    //   'kafka.mt5KafkaConsumerServers',
    //   { infer: true },
    // );

    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(PositionTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
