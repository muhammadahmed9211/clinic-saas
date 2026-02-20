import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerListSeedService {
  constructor(
    @InjectRepository(PartnerType)
    private partnerTypeRepository: Repository<PartnerType>,
  ) {}

  async run() {
    const count = await this.partnerTypeRepository.count();

    if (count === 0) {
      const partnerTypeData = [
        {
          title: 'Introducing Broker',
        },
        {
          title: 'Funds Managers',
        },
        {
          title: 'Liquidity Solution',
        },
        {
          title: 'Affiliates',
        },
        {
          title: 'Franchise Partner',
        },
        {
          title: 'Employee',
        },
      ];

      await this.partnerTypeRepository.save(partnerTypeData);
    }
  }
}
