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
import { NGeniusService } from './n-genius.service';
import { TransactionEvents } from 'src/transaction/entities/transaction-events.entity';

@Controller({
  path: 'transaction',
  version: '1',
})
export class NGeniusController {
  constructor(
    private readonly nGeniusService: NGeniusService,
    private readonly transactionRepository: TransactionRepository,
    private readonly transactionEventsService: TransactionEventsService,
  ) { }
  @Post('n-genius/webhook')
  async webhook(@Body() body) {
    try {
      const payload = JSON.stringify(body ? body : {});
      console.log('N-GENIUS WEBHOOK RECEIVED', payload, new Date());
      return await this.nGeniusService.callWebHooks(body);
    } catch (error) {
      return 'DONE';
    }
  }

  @Post('n-genius/event')
  async event(@Body() body, @Request() req) {
    let isProcessed = false;
    let response = 'An Error Occurred During Processing';
    let event :TransactionEvents | null= null
    let errorMsg= ''
    try {
      const payload = JSON.stringify(body ? body : {});
      console.log('N-GENIUS WEBHOOK', payload, new Date());

      const hash = body?.order?.reference as string;
      if (!hash) {
        throw new BadRequestException('Reference Not Found');
      }

      const transaction = await this.transactionRepository.findOneBy({
        hash,
      });
      if (!transaction) {
        throw new NotFoundException('Transaction Not Found');
      }
      event = await this.transactionEventsService.addNewEvent(transaction.id, payload, req?.ip, "N-GENIUS");
      const data = await this.nGeniusService.getStatus(hash);
      await this.transactionEventsService.updateGeneratedData(event.id , data)
      await this.nGeniusService.onStatusChange(data, transaction);
      isProcessed = true;
      response = "Successful"
    } catch (error) {
      console.error(error);
      let errorMessage = error?.message;
      if(errorMessage && typeof errorMessage === 'object'){
        errorMessage = JSON.stringify(errorMessage) 
      }
      if(errorMessage){
        errorMsg = errorMessage
      }
    }
    if(event){
      this.transactionEventsService.updateEvent(event.id , isProcessed, response, errorMsg)
    }
    return response
  }
}