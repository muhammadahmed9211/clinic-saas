import {
  Inject,
  Injectable,
  OnModuleInit,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
import { PowerBiTopics } from 'src/kafka/topics/power-bi/topics';
import { GetReportToken } from './dto/get-power-bi-report-token.dto';

@Injectable()
export class PowerBiService implements OnModuleInit {
  constructor(
    @Inject('POWER_BI_SERVICE') private readonly powerBiClient: ClientKafka,
    private readonly kafka: KafkaService,
  ) {}

  async getReportToken(dto: GetReportToken) {
    try {
      const { dashboardId, tileId } = dto;
      const resp = await this.kafka.SendMessageToTopic(
        this.powerBiClient,
        PowerBiTopics.GetToken,
        { dashboardId, tileId },
      );
      return resp;
    } catch (err) {
      console.log(err);
      throw new UnprocessableEntityException(err);
    }
  }

  onModuleInit() {
    Object.values(PowerBiTopics).forEach((topic) => {
      this.powerBiClient.subscribeToResponseOf(`${topic}`);
    });
  }
}
