import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { Partner } from 'src/settings/entities/partner.entity';
import { DeepPartial, Repository } from 'typeorm';
import { PartnerListSeedService } from '../partner-list/create-partner-list-seed.service';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { DeskTypes } from 'src/utils/enums/desk-types.enum';

@Injectable()
export class PartnerGroupsService {
  constructor(
    @InjectRepository(PartnerTradingGroups)
    private readonly partnerGroupRepository: Repository<PartnerTradingGroups>,
    @InjectRepository(Partner)
    private readonly partnerListRepository: Repository<Partner>,
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
    private readonly partnerSeedService: PartnerListSeedService,
  ) {}

  async run() {
    const count = await this.partnerGroupRepository.count();

    if (count === 0) {
      await this.partnerSeedService.run();

      const partners = await this.partnerListRepository.find();
      const desks = await this.deskRepository.find();

      const desk = {
        SALES: 1,
        RETENTION: 1,
        KYC: 10,
        SUPPORT: 14,
        FINANCE: 15,
      };

      desks.forEach((item) => {
        const type = DeskTypes[item.type];
        desk[type] = item.id;
      });

      if (partners.length > 1 && desks.length > 0) {
        const partnerGroupData: DeepPartial<PartnerTradingGroups>[] = [
          {
            partner: partners[0],
            office: 1,
            salesDesk: +desk[DeskTypes[DeskTypes.SALES]],
            retentionDesk: +desk[DeskTypes[DeskTypes.RETENTION]],
            supportDesk: +desk[DeskTypes[DeskTypes.SUPPORT]],
            financeDesk: +desk[DeskTypes[DeskTypes.FINANCE]],
            kycDesk: +desk[DeskTypes[DeskTypes.KYC]],
          },
          {
            partner: partners[1],
            office: 1,
            salesDesk: +desk[DeskTypes[DeskTypes.SALES]],
            retentionDesk: +desk[DeskTypes[DeskTypes.RETENTION]],
            supportDesk: +desk[DeskTypes[DeskTypes.SUPPORT]],
            financeDesk: +desk[DeskTypes[DeskTypes.FINANCE]],
            kycDesk: +desk[DeskTypes[DeskTypes.KYC]],
          },
          {
            partner: partners.find((item) => item.title === 'Example'),
            office: 1,
            salesDesk: +desk[DeskTypes[DeskTypes.SALES]],
            retentionDesk: +desk[DeskTypes[DeskTypes.RETENTION]],
            supportDesk: +desk[DeskTypes[DeskTypes.SUPPORT]],
            financeDesk: +desk[DeskTypes[DeskTypes.FINANCE]],
            kycDesk: +desk[DeskTypes[DeskTypes.KYC]],
          },
        ];

        for (const item of partnerGroupData) {
          const itemData = this.partnerGroupRepository.create(item);
          await this.partnerGroupRepository.save(itemData);
        }
      }
    }
  }
}
