import {
  Controller,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
import { DpoService } from './dpo.service';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
@Controller({
  path: 'transaction',
  version: '1',
})
export class DpoController {
  constructor(
    private readonly dpoService: DpoService,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionEventsService: TransactionEventsService,
  ) {}
  @Post('dpo/webhook')
  async webhook(@Body() body: string) {
    try {
      console.log(body, 'CALLING WEBHOOK OFF ALL ENV');
      return await this.dpoService.callWebHooks(body);
    } catch (error) {
      console.error(error);
      return 'Done';
    }
  }

  @Post('dpo/event')
  async event(@Body() body: any) {
    try {
      const payload = JSON.stringify({ xml: body });
      console.log('DPO WEBHOOK', payload);
      const token = body.match(
        /<TransactionToken>(.*?)<\/TransactionToken>/,
      )[1];
      if (!token) {
        throw new BadRequestException('Token Not Found');
      }
      const transaction = await this.transactionRepository.findOne({
        where: {
          hash: token,
        },
      });
      if (!transaction) {
        throw new NotFoundException('Transaction Not Found');
      }
      await this.transactionEventsService.addNewEvent(
        transaction.id,
        JSON.stringify(payload),
      );
      await this.dpoService.onStatusChange(transaction, body);
      return 'OK';
    } catch (error) {
      console.error(error);
      return 'Done';
    }
  }
}
