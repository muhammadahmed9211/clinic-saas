import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { IbCommissionProfile } from 'src/ib/ib_profile/entities/ib_commission_profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TradingGroup, TradingGroupType } from 'src/trading-group/entities/trading-group.entity';
import { Classification } from 'src/classification/entities/classification.entity';
import { AccountClassification } from 'src/users/entities/client.entity';
import { CreateIbConfigDto } from 'src/ib/ib_config/dto/ib_config.dto';
import { CreateIBCommissionProfiles, KeyDTO } from './ib-migration.controller';
import { User } from 'src/users/entities/user.entity';
import { PartnerCommissionProfile } from 'src/settings/entities/partner-commission-profile.entity';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { partner_links } from 'src/admin/partner/entities/partner-links.entity';

@Injectable()
export class IbMigrationService {
  constructor(
    @InjectRepository(Classification)
    private readonly classificationRepository: Repository<Classification>,
    @InjectRepository(TradingGroup)
    private readonly tradingGroupRepository: Repository<TradingGroup>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService<AllConfigType>
  ) { }

  private async getClassifications() {
    const classification = await this.classificationRepository.find();
    const standard = classification.find((c) => c.name === AccountClassification.STANDARD);
    const premiere = classification.find((c) => c.name === AccountClassification.PREMIERE);
    const elite = classification.find((c) => c.name === AccountClassification.ELITE);

    if (!standard) {
      throw new BadRequestException("Standard Classification should exist")
    };

    if (!premiere) {
      throw new BadRequestException("Premiere Classification should exist")
    };

    if (!elite) {
      throw new BadRequestException("Elite Classification should exist")
    };

    return {
      standard,
      premiere,
      elite
    }
  }

  private async getTradingGroups() {
    const agentTradingGroup = await this.tradingGroupRepository.findOne({
      where: {
        type: TradingGroupType.AGENT
      }
    });
    const copyTradingGroup = await this.tradingGroupRepository.findOne({
      where: {
        type: TradingGroupType.COPY_TRADING
      }
    });
    if (!copyTradingGroup) {
      throw new BadRequestException("Copy Trading Group should exist")
    };

    if (!agentTradingGroup) {
      throw new BadRequestException("Agent Trading Group should exist")
    };
    return { agentTradingGroup, copyTradingGroup }
  }

  private async getAllTradingGroups() {
    const groups = await this.tradingGroupRepository.find({ where: { type: TradingGroupType.NORMAL } });
    return groups
  }

  async addProfiles(dto: CreateIBCommissionProfiles) {
    if (process.env.IB_MIGRATION_KEY !== dto.key) {
      throw new BadRequestException("KEY INVALID")
    };
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const ibCommissionProfileRepo = queryRunner.manager.getRepository('ib_commission_profile');
    const configRepo = queryRunner.manager.getRepository('ib_commission_profile_config');
    const distribRepo = queryRunner.manager.getRepository('ib_distribution');
    const distribValueRepo = queryRunner.manager.getRepository('ib_distribution_value');

    try {
      const oldProfiles = await ibCommissionProfileRepo.find({
        relations: {
          configs: {
            profileType: true,
            distributions: {
              distributionValues: true
            },
            createdBy: true
          }
        }
      });
      const { standard, premiere, elite } = await this.getClassifications();
      const { agentTradingGroup, copyTradingGroup } = await this.getTradingGroups()
      const groups = await this.getAllTradingGroups()
      const groupMap = new Map<string, TradingGroup>();

      groups.forEach((g) => {
        groupMap.set(g.name, g)
      });

      for (const p of oldProfiles) {
        const baseProfile = {
          name: p.name,
          description: p.description,
          copyTradingGroup,
          agentTradingGroup,
          level: p.level,
          server: p.server,
          calculateCommission: p.calculateCommission,
          createdBy: p.createdBy,
          isActive: p.isActive,
          isPublic: p.isPublic,
        }

        //@ts-ignore type-error
        const standardTradingGroup = groupMap.get(p.standardTradingGroup);
        //@ts-ignore type-error
        const premierTradingGroup = groupMap.get(p.premierTradingGroup);
        //@ts-ignore type-error
        const eliteTradingGroup = groupMap.get(p.eliteTradingGroup);
        const profiles: Partial<IbCommissionProfile>[] = [];

        if (standardTradingGroup) {
          const standardProfile: Partial<IbCommissionProfile> = {
            ...baseProfile,
            classification: standard,
            tradingGroup: standardTradingGroup
          }
          profiles.push(standardProfile)
        }

        if (premierTradingGroup) {
          const premiereProfile: Partial<IbCommissionProfile> = {
            ...baseProfile,
            classification: premiere,
            tradingGroup: premierTradingGroup
          }
          profiles.push(premiereProfile)
        }

        if (eliteTradingGroup) {
          const eliteProfile: Partial<IbCommissionProfile> = {
            ...baseProfile,
            classification: elite,
            tradingGroup: eliteTradingGroup
          }
          profiles.push(eliteProfile)
        }
        const newProfiles = await ibCommissionProfileRepo.save(profiles);

        for (const newProfile of newProfiles) {
          if (!newProfile || !newProfile.id) {
            throw new BadRequestException("An error ocurred")
          }

          for (const config of p.configs) {

            const profileType = config.profileType.id;
            const userId = config.createdBy.id;

            const distributions = config.distributions.map((d) => {
              const distributionValues = d.distributionValues.map((dv) => {
                return {
                  distributionContext: dv.distributionContext,
                  distributionLevel: dv.distributionLevel,
                  distributionAmount: dv.distributionAmount,
                  amount: dv.amount,
                  toAmount: dv.toAmount,
                  fromAmount: dv.fromAmount,
                  level: dv.level,
                }
              });

              return {
                key: d.key,
                value: d.value,
                distributionValues
              }
            });

            const configPayload: CreateIbConfigDto = {
              commissionProfile: newProfile.id,
              name: config.name,
              priority: config.priority,
              setCashback: config.setCashback,
              isDeductFromIb: config.isDeductFromIb,
              cashbackAmountType: config.cashbackAmountType,
              cashbackAmount: config.cashbackAmount,
              symbols: config.symbols,
              entry: config.entry,
              scalpingTrades: config.scalpingTrades,
              profileType,
              distributions
            };

            const newConfig = await configRepo.save({
              name: configPayload.name,
              priority: configPayload.priority,
              setCashback: configPayload.setCashback || false,
              isDeductFromIb: configPayload.isDeductFromIb || false,
              cashbackAmountType: configPayload.cashbackAmountType,
              cashbackAmount: configPayload.cashbackAmount,
              symbols: configPayload.symbols,
              entry: configPayload.entry,
              scalpingTrades: configPayload.scalpingTrades,
              commissionProfile: { id: configPayload.commissionProfile },
              profileType: { id: configPayload.profileType },
              createdBy: { id: userId },
            });

            for (const distribution of configPayload.distributions) {
              const newDistribution = await distribRepo.save({
                key: distribution.key,
                value: distribution.value,
                distribution: newConfig,
              });

              for (const value of distribution.distributionValues) {
                await distribValueRepo.save({
                  distributionLevel: value.distributionLevel,
                  distributionAmount: value.distributionAmount,
                  distributionContext: value.distributionContext,
                  distribution: newDistribution,
                });
              }
            }
          }
        }
      }
      await queryRunner.commitTransaction();
      return "DONE"
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error)
    } finally {
      await queryRunner.release();
    }

  }

  async addProfilesToIB(dto: KeyDTO) {
    if (process.env.IB_MIGRATION_KEY !== dto.key) {
      throw new BadRequestException("KEY INVALID");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);
    const ibCommissionProfileRepo = queryRunner.manager.getRepository(IbCommissionProfile);
    const partnerCommissionProfileRepository = queryRunner.manager.getRepository(PartnerCommissionProfile);

    try {
      // 1. Fetch all IB partner users
      const partnerUsers = await userRepo.find({
        where: {
          partner: {
            ib: true,
            userIbId: Not(IsNull())
          },
          client: {
            type: 'Introducing Broker (IB)'
          }
        },
        relations: {
          partner: true
        }
      });

      const commissionProfiles = await ibCommissionProfileRepo.find({
        where: {
          isActive: true,
          isPublic: true,
        },
      });

      const profilesMap = new Map<number, IbCommissionProfile[]>();

      commissionProfiles.forEach((c) => {
        const list = profilesMap.get(c.level);
        if (list) list.push(c);
        else profilesMap.set(c.level, [c]);
      });

      const entities: Partial<PartnerCommissionProfile>[] = [];

      for (let i = 0; i < partnerUsers.length; i++) {
        const { partner, partnerId } = partnerUsers[i];
        const { partnerLevel = 1 } = partner;

        const profiles = profilesMap.get(partnerLevel);

        if (Array.isArray(profiles)) {
          for (let j = 0; j < profiles.length; j++) {
            const profile = profiles[j];

            if (profile.id && partnerId) {
              entities.push({
                commissionProfile: { id: profile.id } as any,
                partner: { id: partnerId } as any
              });
            }
          }
        }
      }
      const data: any = []
      if (entities.length > 0) {
        const CHUNK = 300;
        for (let i = 0; i < entities.length; i += CHUNK) {
          const slice = entities.slice(i, i + CHUNK);
          const result = await partnerCommissionProfileRepository.insert(slice);
          data.push(result)
        }
      }
      await queryRunner.commitTransaction();
      return data
    } catch (error) {
      console.error(error)
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async addProfilesToOperator(dto: KeyDTO) {
    if (process.env.IB_MIGRATION_KEY !== dto.key) {
      throw new BadRequestException("KEY INVALID");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const userRepo = queryRunner.manager.getRepository(User);
    const ibCommissionProfileRepo = queryRunner.manager.getRepository(IbCommissionProfile);
    const partnerCommissionProfileRepository = queryRunner.manager.getRepository(PartnerCommissionProfile);

    try {
      const partnerUsers = await userRepo.find({
        where: {
          partner: {
            id: Not(IsNull()),
            ib: false
          },
          isOperator: true
        },
        relations: {
          partner: true
        }
      });

      const names = Object.keys(AccountClassification).map((c) => {
        const classification = AccountClassification[c];
        return `Default ${classification}`
      })
      const commissionProfiles = await ibCommissionProfileRepo.find({
        where: { level: 1, name: In(names), isActive: true },
      });

      if (commissionProfiles.length !== 3) {
        throw new BadRequestException("One of Default Profile Does not Exist");
      }

      const entities: Partial<PartnerCommissionProfile>[] = [];

      for (let i = 0; i < partnerUsers.length; i++) {
        const { partnerId } = partnerUsers[i];
        if (Array.isArray(commissionProfiles)) {
          for (let j = 0; j < commissionProfiles.length; j++) {
            const profile = commissionProfiles[j];
            if (profile.id && partnerId) {
              entities.push({
                commissionProfile: { id: profile.id } as any,
                partner: { id: partnerId } as any
              });
            }
          }
        }
      }
      const data: any[] = []
      if (entities.length > 0) {
        const CHUNK = 300;
        for (let i = 0; i < entities.length; i += CHUNK) {
          const slice = entities.slice(i, i + CHUNK);
          const result = await partnerCommissionProfileRepository.insert(slice);
          data.push(result)
        }
      }

      await queryRunner.commitTransaction();
      return data;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async createProfileLinks(dto: KeyDTO) {
    if (process.env.IB_MIGRATION_KEY !== dto.key) {
      throw new BadRequestException("KEY INVALID");
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const origin = this.configService.get('app.frontendDomain', {
      infer: true,
    });
    const data: any[] = []
    const utmSource = "IB";
    const source = "IBRegistrationLink";
    const partnerCommissionProfileRepository = queryRunner.manager.getRepository(PartnerCommissionProfile);
    const partnerLinkRepo = queryRunner.manager.getRepository(partner_links);

    try {
      const profiles = await partnerCommissionProfileRepository.find({
        relations: {
          commissionProfile: true,
          partner: true,
        },
        select: {
          commissionProfile: { id: true },
          partner: { id: true, uuid: true },
        },
      });
      const links: Partial<partner_links>[] = [];
      for (const profile of profiles) {
        let url = `${origin}/register-live-trading-account-F1?source=${source}&utmSource=${utmSource}`;
        const uuid = profile.partner.uuid;
        const commissionProfileId = profile.commissionProfile.id;
        if (uuid) {
          url += `&partner_uuid=${uuid}`;
        }
        if (commissionProfileId) {
          url += `&commissionProfileId=${commissionProfileId}`;
        }

        const link: Partial<partner_links> = {
          url,
          utmSource,
          source,
          commissionProfileId,
          partnerId: profile.partner.id,
          isActive: true,
        }

        links.push(link)
      }

      const CHUNK_SIZE = 200;
      for (let i = 0; i < links.length; i += CHUNK_SIZE) {
        const chunk = links.slice(i, i + CHUNK_SIZE);
        const inserted = await partnerLinkRepo.insert(chunk);
        data.push(inserted);
      }
      return data
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }

  }


}
