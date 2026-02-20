import { Body, Controller, ForbiddenException, Inject, Post, UseGuards } from '@nestjs/common';
import { IbConfigService } from './ib_config.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { EventPatternWithPrefix } from 'src/common/decorators/event-pattern-with-prefix';
import { MT5DealData } from '../interfaces/Mt5Deal.interface';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { CommissionTopics } from 'src/kafka/topics/ib/commission.topics.enum';
import { ClientKafka } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { DealIdsDto } from './dto/ib_config.dto';

@ApiTags('IB Profile Config')
@Controller({ path: 'admin/ib-config-calculation', version: '1' })
export class IbConfigCalculationController {
  constructor(
    private readonly ibConfigService: IbConfigService,
    private readonly configService: ConfigService<AllConfigType>,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
  ) {}

  @EventPatternWithPrefix('deal-executed')
  async handleDealsEventFromKafka(body: MT5DealData) {
    console.log('Received deal event from Kafka:', body);

    const data = await this.ibConfigService.calculateCommission(body);

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Commission calculated successfully',
      data,
    });
  }


// @Post()
// @ApiBearerAuth()
// @UseGuards(AuthGuard('jwt'))
// async handleDealsHttp(@Body() body: DealIdsDto, @GetUser() user: User) {
//  const roleId = user?.role?.id;
//     if (!roleId) {
//       throw new ForbiddenException('Admin role not found');
//     }
//     if (roleId !== 1) {
//       throw new ForbiddenException('You not have permission to access this resource');
//     }

//   const data = await this.ibConfigService.calculateCommissionById(body);

//   return ResponseWrapper.wrap({
//     status: 0,
//     statusCode: 200,
//     statusText: 'Commission calculated successfully',
//     data,
//   });
// }

  // async onModuleInit() {
  //   const env = this.configService.getOrThrow('app.environment', {
  //     infer: true,
  //   });

  //   Object.values(CommissionTopics).forEach((topic) => {
  //     const fullTopic = `${env}.${'live'}.${topic}`;
  //     console.log('subscribing to topic:', fullTopic);
  //     this.mt5Client.subscribeToResponseOf(fullTopic);
  //   });

  //   try {
  //     await this.mt5Client.connect();
  //     console.log('Kafka client connected successfully');
  //   } catch (error) {
  //     console.error('Kafka client failed to connect:', error);
  //   }
  // }
}
