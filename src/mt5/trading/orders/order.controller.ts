import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Inject,
  OnModuleInit,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ClientKafka } from '@nestjs/microservices';
import { OrderTopics } from 'src/kafka/topics/mt5/order.topics.enum';
import {
  CancelOrderDto,
  ClosedDto,
  GetBackupDto,
  GetBackupListDto,
  OrderMultipleOpenDto,
  OrderOpenPagedDto,
  OrderTicketsDto,
  TradingTotalDto,
  UpdateOrderDto,
} from './dto/trading-order.dto';
import { Order } from 'src/utils/types/mt5/orders/order.type';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('MT5 Trading')
@Controller({
  path: 'mt5/trading',
  version: '1',
})
export class OrderController implements OnModuleInit {
  constructor(
    private readonly mt5Service: OrderService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    @Inject('MT5_SERVICE_DEMO') private readonly mt5ClientDemo: ClientKafka,
  ) {}

  @Get('order-open-ticket')
  @ApiOperation({ summary: 'Get open order by ticket' })
  ordersByTicket(@Query() payload: OrderTicketsDto, @GetUser() user: User) {
    return this.mt5Service.orderByTicket(payload, user);
  }

  @Get('order-open-total')
  @ApiOperation({ summary: 'Get total open orders' })
  ordersTotal(@Query() payload: TradingTotalDto, @GetUser() user: User) {
    return this.mt5Service.orderTotal(payload, user);
  }

  @Get('order-open-paged')
  @ApiOperation({ summary: 'Get paged open orders' })
  orderOpenPaged(@Query() payload: OrderOpenPagedDto, @GetUser() user: User) {
    return this.mt5Service.getOpenPaged(payload, user);
  }

  // @Post('order-open-multiple')
  // @ApiOperation({ summary: 'Get multiple open orders' })
  // orderMultipleOpen(
  //   @Body() payload: OrderMultipleOpenDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.mt5Service.getOpenMultiple(payload, user);
  // }

  @Patch('update-order')
  @ApiOperation({ summary: 'Update order' })
  updateOrder(@Body() payload: UpdateOrderDto, @GetUser() user: User) {
    return this.mt5Service.updateOpen(payload, user);
  }

  @Delete('delete-order/:id')
  @ApiOperation({ summary: 'Delete order' })
  deleteOrder(@Param('id') id: number, @GetUser() user: User) {
    return this.mt5Service.deleteOpen([id], user);
  }

  @Post('cancel-order')
  @ApiOperation({ summary: 'Cancel order' })
  cancelOpen(@Body() payload: CancelOrderDto, @GetUser() user: User) {
    return this.mt5Service.cancelOpen(payload, user);
  }

  @Get('order-close-ticket')
  @ApiOperation({ summary: 'Get closed order by ticket' })
  orderClosedTicket(@Query() payload: OrderTicketsDto, @GetUser() user: User) {
    return this.mt5Service.getClosedTicket(payload, user);
  }

  @Get('order-close-total')
  @ApiOperation({ summary: 'Get total closed orders' })
  orderClosedTotal(@Query() payload: ClosedDto, @GetUser() user: User) {
    return this.mt5Service.getClosedTotal(payload, user);
  }

  @Get('order-close-paged')
  @ApiOperation({ summary: 'Get paged closed orders' })
  orderClosedPaged(@Query() payload: OrderOpenPagedDto, @GetUser() user: User) {
    return this.mt5Service.getClosedPaged(payload, user);
  }

  // @Post('order-closed-multiple')
  // @ApiOperation({ summary: 'Get multiple closed orders' })
  // orderMultipleClosed(
  //   @Body() payload: OrderMultipleOpenDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.mt5Service.getClosedMultiple(payload, user);
  // }

  @Post('update-closed')
  @ApiOperation({ summary: 'Update closed order' })
  updateClosed(@Body() payload: UpdateOrderDto, @GetUser() user: User) {
    return this.mt5Service.updateClosed(payload, user);
  }

  @Delete('delete-closed/:id')
  @ApiOperation({ summary: 'Delete closed order' })
  deleteClosed(@Param('id') id: number, @GetUser() user: User) {
    return this.mt5Service.deleteClosed([id], user);
  }

  // @Get('backup-list')
  // @ApiOperation({ summary: 'Get backup list' })
  // getBackupList(@Query() payload: GetBackupListDto, @GetUser() user: User) {
  //   return this.mt5Service.getBackupList(payload, user);
  // }

  // @Get('order-from-backup')
  // @ApiOperation({ summary: 'Get order from backup' })
  // getOrderFromBackup(@Query() payload: GetBackupDto, @GetUser() user: User) {
  //   return this.mt5Service.getOrderFromBackup(payload, user);
  // }

  // @Post('restore-order-from-backup')
  // @ApiOperation({ summary: 'Restore order from backup' })
  // restoreOrderFromBackup(
  //   @Body() payload: UpdateOrderDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.mt5Service.restoreFromBackup(payload, user);
  // }

  @Post('reopen-order')
  @ApiOperation({ summary: 'Reopen order' })
  reopenOrder(@Body() payload: OrderTicketsDto, @GetUser() user: User) {
    return this.mt5Service.reopenOrder(payload, user);
  }

  onModuleInit() {
    const env = this.configService.getOrThrow('app.environment', {
      infer: true,
    });

    Object.values(OrderTopics).forEach((topic) => {
      this.mt5Client.subscribeToResponseOf(`${env}.${'live'}.${topic}`);
      this.mt5Client.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
      this.mt5ClientDemo.subscribeToResponseOf(`${env}.${'demo'}.${topic}`);
    });
  }
}
