import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PushNotificationService } from './push-notification.service';
import { RegisterDeviceDto } from './dto/device-info.dto';
import { SendPushNotificationDto } from './dto/push-notification.dto';

@Controller({
  path: 'push-notifications',
  version: '1',
})
@ApiTags('Push Notifications')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post('register-device')
  async registerDevice(@Body() body: RegisterDeviceDto) {
    return this.pushNotificationService.registerDevice(body);
  }

  @Post('send')
  async sendPushNotification(
    @Body()
    body: SendPushNotificationDto,
  ) {
    return this.pushNotificationService.sendPushNotificationToFirebase(body);
  }
}
