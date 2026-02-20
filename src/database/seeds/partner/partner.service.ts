import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ActiveStatus,
  Approved,
  Partner,
} from 'src/settings/entities/partner.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';

@Injectable()
export class PartnerSeedService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(PartnerTradingGroups)
    private readonly partnerTradingGroupsRepository: Repository<PartnerTradingGroups>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async run() {
    const partnerCount = await this.partnerRepository.count();

    const partnerData = [
      {
        id: 1,
        email: 'partner@example.com',
        externalId: '1',
        isDeleted: false,
        status: ActiveStatus.ACTIVE,
        maxPay: 1,
        title: 'John',
        name: 'John Doe',
        overPaid: 1,
        platformId: 1,
        registrationIp: '62.90.177.110',
        revSharePercent: 50,
        managerOperatorId: 0,
        contactName: 'John Doe',
        isRecycleActive: true,
        notes: '',
        allowedCountry: '',
        blockedCountry: '["Iran","United States of America"]',
        dailyCount: 10,
        dailyLimit: 100,
        totalCount: 29,
        regulated: false,
        isApproved: true,
        password: 'p%G467i9BR$X$8LV',
        bypassIpWhitelist: true,
        referralPercentage: 10,
        referrer: { id: 1196 },
        onlyShowFtds: false,
        country: '["Pakistan","United Arab Emirates"]',
        minDepositAmount: 50,
        isPrivate: false,
        ib: true,
        userIbId: "11651",
        apiWhitelistIps: '192.168.0.1, 10.0.0.1',
        uuid: 'F910DA7F-8F3B-42F1-BFA7-F0C54E3F7E56',
        approved: Approved.APPROVE,
      },
    ];

    if (partnerCount === 0) {
      for (const iterator of partnerData) {
        await this.partnerRepository.save(
          this.partnerRepository.create(iterator),
        );

        const user = await this.userRepository.findOneBy({
          email: iterator.email,
        });

        if (!user) {
          await this.userRepository.save(
            this.userRepository.create({
              email: iterator.email,
              firstName: iterator.name,
              password: iterator.password ? iterator.password : 'Test@123',
              // telephone: iterator.telephone,
              country: iterator.country,
              role: {
                id: RoleEnum.partner,
              },
              status: {
                id: StatusEnum.active,
              },
              partnerId: iterator.id,
              isPartner: true,
            }),
          );
        }
        await this.userRepository.update(
          { email: iterator.email },
          { partnerId: iterator.id, isPartner: true },
        );

        await this.partnerTradingGroupsRepository.save(
          this.partnerTradingGroupsRepository.create({
            // tradingGroup: `Live\\B\\S\\R\\C00R00`,
            // tradingGroupSw: `Live\\B\\S\\R\\C00R00_SW`,
            office: 1,
            salesDesk: 13,
            retentionDesk: 3,
            supportDesk: 14,
            financeDesk: 15,
            partner: { id: iterator.id },
            kycDesk: 10,
          }),
        );
      }
    }
  }
}
