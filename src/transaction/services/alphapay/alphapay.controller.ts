import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
} from '@nestjs/common';
import { AlphaPayService } from './alphapay.service';
import { TransactionEventsService } from '../transcation-events/transaction-events.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionEvents } from 'src/transaction/entities/transaction-events.entity';

@Controller({
  path: 'transaction',
  version: '1',
})
export class AlphaPayController {
  constructor(
    private readonly alphaPayService: AlphaPayService,
    private readonly transactionEventsService: TransactionEventsService,
    private readonly transactionService: TransactionService,
  ) { }

  @Post('alphapay/webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() body, @Request() req) {

    const payload = structuredClone(body);
    if(!payload?.secret){
      throw new BadRequestException("Webhook secret missing")
    }

    const isSecretVerified = this.alphaPayService.verifySecret(payload.secret);
    if(!isSecretVerified){
      throw new BadRequestException("Invalid Secret")
    };
    
    delete payload.secret;

    console.log(payload, 'Alphay Pay Webhook Call');

    let event: TransactionEvents | null = null
    let isProcessed = false;
    let errorMsg = ''
    let response = 'An Error Occurred During Processing';

    try {
      const data = payload.data;
      const transactionId = data?.tid;

      if (!transactionId) {
        throw new BadRequestException('Transaction id not found');
      }

      console.log(JSON.stringify({ transactionId, webhook: payload }));

      event = await this.transactionEventsService.addNewEvent(
        transactionId,
        JSON.stringify(payload),
        req?.id,
        "ALPHASPAY"
      );

      const transaction = await this.transactionService.getById(transactionId);

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      await this.alphaPayService.onStatusChange(data, transaction);
      isProcessed = true;
      response = "Successful"
    } catch (error) {
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
      this.transactionEventsService.updateEvent(event.id , isProcessed, response, errorMsg)
    }
    return response
  }
}
