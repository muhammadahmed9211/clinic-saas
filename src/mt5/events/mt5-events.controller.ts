import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Mt5EventsService } from './mt5-events.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('MT5 Events')
@Controller({ path: 'mt5/events', version: '1' })
export class Mt5EventsController {
  constructor(private readonly eventsService: Mt5EventsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('margin-call/webhook')
  async marginCallWebhook(@Body() body: any) {
    console.log('Margin Call Webhook Received:', body);
    return this.eventsService.processMarginCall(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('stop-out/webhook')
  async stopOutWebhook(@Body() body: any) {
    console.log('Stop Out Webhook Received:', body);
    return this.eventsService.processStopOut(body);
  }
}
