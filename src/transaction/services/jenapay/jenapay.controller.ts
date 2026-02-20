import {
  Controller,
  Post,
  Body,
  NotFoundException,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { TransactionEvents } from 'src/transaction/entities/transaction-events.entity';
import { JenaPayService } from './jenapay.service';
import { IOnStatusChange } from './config/jenapay-config.type';

@Controller({
  path: 'transaction',
  version: '1',
})
export class JenaPayController {
  constructor(
    private readonly jenaPayService: JenaPayService,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionEventsService: TransactionEventsService,
  ) {}

  @Post('jenapay/event')
  async event(@Body() body: IOnStatusChange, @Request() req) {
    let isProcessed = false;
    let response = 'An Error Occurred During Processing';
    let event: TransactionEvents | null = null;
    let errorMsg = '';
    try {
      const payload = JSON.stringify(body ? body : {});
      console.log('JENAPAY WEBHOOK', payload, new Date());

      const hash = body?.order_number as string;
      if (!hash) {
        throw new BadRequestException('Reference Not Found');
      }

      const transaction = await this.transactionRepository.findOne({
        where: { hash },
        relations: {
          user: true,
          wallet: true,
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction Not Found');
      }

      event = await this.transactionEventsService.addNewEvent(
        transaction.id,
        payload,
        req?.ip,
        'JENAPAY',
      );
      await this.jenaPayService.onStatusChange(body, transaction);
      isProcessed = true;
      response = 'Successful';
    } catch (error) {
      console.error(error);
      let errorMessage = error?.message;
      if (errorMessage && typeof errorMessage === 'object') {
        errorMessage = JSON.stringify(errorMessage);
      }
      if (errorMessage) {
        errorMsg = errorMessage;
      }
    }
    if (event) {
      this.transactionEventsService.updateEvent(
        event.id,
        isProcessed,
        response,
        errorMsg,
      );
    }
    return response;
  }
}
