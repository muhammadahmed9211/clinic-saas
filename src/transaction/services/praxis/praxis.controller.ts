import {
  Controller,
  Post,
  Body,
  NotFoundException,
  Request
} from '@nestjs/common';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
import { PraxisService } from './praxis.service';
import { TransactionEvents } from 'src/transaction/entities/transaction-events.entity';
@Controller({
  path: 'transaction',
  version: '1',
})
export class PraxisController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly praxisService: PraxisService,
    private readonly transactionEventsService: TransactionEventsService,
  ) {}
  @Post('praxis/webhook')
  async webhook(@Body() body, @Request() req) {
    let isProcessed = false;
    const timestamp = Math.floor(Date.now() / 1000);
    let event :TransactionEvents | null = null;
    let errorMsg= ''
    const response = {
      status: 0,
      description: 'Ok',
      version: '1.3',
      timestamp,
    };
    try {
      const payload = structuredClone(body);
      const transactionId: string = body?.session?.order_id;

      console.log(JSON.stringify({ transactionId, webhook: payload }));
      event = await this.transactionEventsService.addNewEvent(
        transactionId,
        JSON.stringify(payload),
        req?.ip,
        "PRAXIS"
      );
      const transaction = await this.transactionService.getById(transactionId);
      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }
      try{
        await this.praxisService.getStatus(transaction)
      }
      catch(error){
        console.log(error, "ERROR")
      }
      await this.praxisService.onStatusChange(transaction, body);
      isProcessed = true;
    } catch (error) {
      console.error(error);
      console.log(error)
      let errorMessage = error?.message;
      if(errorMessage && typeof errorMessage === 'object'){
        errorMessage = JSON.stringify(errorMessage) 
      }
      if(errorMessage){
        errorMsg = errorMessage
      }
    }

    if(event){
      await this.transactionEventsService.updateEvent(event.id, isProcessed, JSON.stringify(response), errorMsg); 
    }
    return response
  }
}