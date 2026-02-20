import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { CreateTransferDto } from 'src/transaction/dto/create-transfer.dto';
import { User } from 'src/users/entities/user.entity';
import TransferTopics from './topic';


@Injectable()
export class TransferService implements OnModuleInit {
  constructor(
    @Inject('TRANSFER_SERVICE') private readonly transferClient: ClientKafka,
    private readonly kafka: KafkaService,
  ) {}

  async transfer(dto: CreateTransferDto, user: User, clientId?: string) {
    const message = {
      ...dto,
      user,
      clientId,
    };
    const response = await this.kafka.SendMessageToTopic(
      this.transferClient,
      `${TransferTopics.TRANSFER_FUNDS}`,
      message,
      false,
    );

    if (response?.isSuccess && response?.data) {
      return response.data;
    }
    const error = response?.error?.message;
    throw new BadRequestException(error);
  }

  onModuleInit() {
    const topics = Object.keys(TransferTopics);
    topics.forEach((t) => {
      const topic = TransferTopics[t];
      this.transferClient.subscribeToResponseOf(topic);
      this.transferClient.subscribeToResponseOf(`${topic}.reply`);
    });
  }

}
