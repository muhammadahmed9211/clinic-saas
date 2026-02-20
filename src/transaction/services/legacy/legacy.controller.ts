import {
  Controller,
  Body,
  NotFoundException,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
import { LegacyService } from './legacy.service';
@Controller({
  path: 'transaction',
  version: '1',
})
export class LegacyController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly legacyService: LegacyService,
    private readonly transactionEventsService: TransactionEventsService,
  ) {}
  @Patch('legacy/webhook')
  async webhook(@Body() body) {
    console.log('BODY', body);
    const payload = body.payload;
    const transactionId: string = body.transactionId;

    if (!payload || !transactionId || !body?.event) {
      throw new BadRequestException('Invalid params');
    }

    console.log(JSON.stringify({ transactionId, webhook: payload }));
    await this.transactionEventsService.addNewEvent(
      transactionId,
      JSON.stringify(payload),
    );

    const transaction = await this.transactionService.getById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return await this.legacyService.onChangeEvent(transaction, body.event);
  }
}
