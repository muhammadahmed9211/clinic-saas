import { Controller, Post, Body, Logger } from '@nestjs/common';
import { ShuftiService } from './shufti.service';
import * as path from 'path';
@Controller({
  path: 'webhooks',
  version: '1',
})
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly shuftiService: ShuftiService) {}


@Post('shufti')
async handleShuftiWebhook(@Body() payload: any): Promise<any> {
  this.logger.log(
    `Shufti Webhook Received: ${JSON.stringify(payload, null, 2)}`
  );

  const response = await this.shuftiService.processWebhook(payload);

  return response;
}

}