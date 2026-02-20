import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateTransferPayload,
  ITransferResponseType,
} from './dto/create-transfer.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { User } from 'src/users/entities/user.entity';
import TransferTopics from './topic';

@Controller()
export class TransferController {
  constructor(
    private readonly transactionService: TransactionService) {}

  @MessagePattern(TransferTopics.TRANSFER_FUNDS)
  async create(@Payload() createTransferDto: CreateTransferPayload) {
    const { user, clientId = undefined, ...dto } = createTransferDto;
    let data: ITransferResponseType | null = null;
    let isSuccess = false;
    try {
      data = await this.transactionService.transferAmount(
        dto,
        user as User,
        clientId,
      );
      isSuccess = true;
      return { isSuccess, data };
    } catch (error) {
      isSuccess = false;
      console.error(error);
      return { isSuccess, error };
    }
  }
}
