import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { TransactionRepository } from 'src/transaction/repositories/transaction.repository';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
import { MyFatoorahService } from './myfatoorah.service';

@Controller({
  path: 'transaction',
  version: '1',
})
export class MyFatoorahController {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionEventsService: TransactionEventsService,
    private readonly myFatoorahService: MyFatoorahService,
  ) {}

  @Post('my-fatoorah/webhook')
  async webhook(@Body() body) {
    try {
      const payload = JSON.stringify(body ? body : {});
      console.log('MY-FATOORAH WEBHOOK', payload, new Date());

      const id = body?.Data?.Invoice?.ExternalIdentifier;
      if (!id) {
        throw new BadRequestException('Reference Not Found');
      }

      const transaction = await this.transactionRepository.findOneBy({
        id,
      });
      if (!transaction) {
        throw new NotFoundException('Transaction Not Found');
      }
      await this.transactionEventsService.addNewEvent(transaction.id, payload);
      await this.myFatoorahService.onStatusChange(body, transaction);
      return 'OK';
    } catch (error) {
      console.error(error);
      return 'Done';
    }
  }

  @Post('my-fatoorah/webhook-error')
  async webhookError(@Body() body) {
    try {
      const payload = JSON.stringify(body ? body : {});
      console.log('MY-FATOORAH WEBHOOK', payload, new Date());

      const id = body?.Data?.CustomerReference;
      if (!id) {
        throw new BadRequestException('Reference Not Found');
      }

      const transaction = await this.transactionRepository.findOneBy({
        id,
      });
      if (!transaction) {
        throw new NotFoundException('Transaction Not Found');
      }
      await this.transactionEventsService.addNewEvent(transaction.id, payload);
      await this.myFatoorahService.onStatusChange(body, transaction);
      return 'OK';
    } catch (error) {
      console.error(error);
      return 'Done';
    }
  }
}
