import {
  Controller,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BridgerPayService } from './bridgerpay.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
@Controller({
  path: 'transaction',
  version: '1',
})
export class BridgerPayController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly bridgerPayService: BridgerPayService,
    private readonly transactionEventsService: TransactionEventsService,
  ) {}
  @Post('bridgerpay/webhook')
  async webhook(@Body() body) {
    try {
      const payload = structuredClone(body);
      delete payload.meta.payload;
      const transactionId: string = body.data.order_id;

      console.log(JSON.stringify({ transactionId, webhook: payload }));
      await this.transactionEventsService.addNewEvent(
        transactionId,
        JSON.stringify(payload),
      );

      const type: string = body.webhook.type;
      const hash: string = body?.meta?.payload;
      const amount: number = body.data.charge.attributes.amount;
      if (!type || !transactionId || !hash) {
        throw new BadRequestException('Invalid params');
      }
      const transaction = await this.transactionService.get(
        transactionId,
        hash,
      );

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }
      return await this.bridgerPayService.onStatusChange(
        transaction,
        type,
        amount,
        body.data,
      );
    } catch (error) {
      console.error(error);
      return 'Done';
    }
  }
}
