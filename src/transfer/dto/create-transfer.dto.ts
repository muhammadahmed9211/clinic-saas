import { CreateTransferDto } from 'src/transaction/dto/create-transfer.dto';
import { Transaction } from 'src/transaction/entities/transaction.entity';

export interface ITransferResponseType {
  from: Transaction;
  to: Transaction;
}

interface User {
  id: number;
}

export class CreateTransferPayload extends CreateTransferDto {
  user: User;
  clientId?: string | undefined;
}
