import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Funnel,
  FunnelType,
} from 'src/admin/leads/opportunity/entities/funnel.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class FunnelSeedService {
  constructor(
    @InjectRepository(Funnel)
    private readonly funnelRepository: Repository<Funnel>,
  ) {}

  async run() {
    const countStage = await this.funnelRepository.count();

    const funnelStageData: DeepPartial<Funnel>[] = [
      {
        sequence: 1,
        name: 'Qualification',
        probability: 20,
        type: FunnelType.LEAD,
      },
      {
        sequence: 2,
        name: 'Proposal/Offer',
        probability: 40,
        type: FunnelType.LEAD,
      },
      {
        sequence: 3,
        name: 'Negotiation/Consideration',
        probability: 60,
        type: FunnelType.LEAD,
      },
      {
        sequence: 4,
        name: 'Verbal Approval',
        probability: 80,
        type: FunnelType.LEAD,
      },
      {
        sequence: 5,
        name: 'Closed Won',
        probability: 100,
        type: FunnelType.LEAD,
      },
      {
        sequence: 6,
        name: 'Closed Lost',
        probability: 0,
        type: FunnelType.LEAD,
      },
      {
        sequence: 7,
        name: 'Closed Lost to Competition',
        probability: 0,
        type: FunnelType.LEAD,
      },
    ];

    if (countStage === 0) {
      await this.funnelRepository.save(
        this.funnelRepository.create(funnelStageData),
      );
    }
  }
}
