import { BadRequestException, Injectable } from '@nestjs/common';
import { IbCommissionProfileTypeRepository, IbProfileDistributionRepository, IbProfileRepository } from './repositories/ib_profile.repository';
import { IbProfileCreateDto, UpdateIbProfileDto } from './dto/ib_profile.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { IbCommissionProfileType } from './entities/ib_commission_profile_type.entity';
import { IbProfileDistribution } from './entities/ib_profile_distribution.entity';
import { IbConfigRepository } from '../ib_config/repositories/ib_config.repository';
import { Any, DataSource, FindOptionsRelations, In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { IbCommissionProfile } from './entities/ib_commission_profile.entity';
import { IbCommissionProfileConfig } from '../ib_config/entities/ib_commission_profile_config.entity';
import { IbDistribution } from '../ib_config/entities/ib_distribution.entity';
import { IbDistributionValue } from '../ib_config/entities/ib_distribution_value.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { entityType } from 'src/admin/active-log/active-log.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from 'src/settings/entities/partner.entity';
import { PartnerCommissionProfile } from 'src/settings/entities/partner-commission-profile.entity';
import { TradingGroup, TradingGroupType } from 'src/trading-group/entities/trading-group.entity';
import { I18nContext } from 'nestjs-i18n';
import { AccountClassification } from 'src/users/entities/client.entity';
import { ClassificationService } from 'src/classification/classification.service';
import { CommissionProfileKeyFeature } from './entities/ib_commission_profile_key_features.entity';

@Injectable()
export class IbProfileService {
  constructor(
    private readonly ibProfileRepository: IbProfileRepository,
    private readonly ibCommissionProfileTypeRepository: IbCommissionProfileTypeRepository,
    private readonly ibProfileDistributionRepository: IbProfileDistributionRepository,
    private readonly ibConfigRepository: IbConfigRepository,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PartnerCommissionProfile)
    private readonly partnerCommissionProfileRepository: Repository<PartnerCommissionProfile>,
    @InjectRepository(TradingGroup)
    private readonly tradingGroupRepository: Repository<TradingGroup>,
    private readonly classificationService:ClassificationService,
    @InjectRepository(CommissionProfileKeyFeature)
    private commissionProfileKeyFeatureRepository: Repository<CommissionProfileKeyFeature>,
  ) {}

  async create(dto: IbProfileCreateDto, userId: number) {
    const { classificationId, ...createIbProfileDto } = dto;
    const isExist = await this.ibProfileRepository.findOne({
      where: { name: createIbProfileDto.name, isActive: true },
    });

    if (isExist) {
      throw new BadRequestException('IB Commission Profile name already exist');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const classification = await this.classificationService.findOne(classificationId);

    if (!classification) {
      throw new BadRequestException("Classification not found")
    };

    const tradingGroup = await this.tradingGroupRepository.findOne({
      where: {
        id: createIbProfileDto.tradingGroupId,
        classificationId,
        type: TradingGroupType.NORMAL
      }
    });

    if (!tradingGroup) {
      throw new BadRequestException("Trading Group Id is Invalid");
    }

    const agentTradingGroup = await this.tradingGroupRepository.findOne({
      where: {
        id: createIbProfileDto.agentTradingGroupId,
        type: TradingGroupType.AGENT
      }
    });

    if (!agentTradingGroup) {
      throw new BadRequestException("Agent Trading Group Id is Invalid");
    }

    const copyTradingGroup = await this.tradingGroupRepository.findOne({
      where: {
        id: createIbProfileDto.copyTradingGroupId,
        type: TradingGroupType.COPY_TRADING
      }
    });

    if (!copyTradingGroup) {
      throw new BadRequestException("Copy Trading Group Id is Invalid");
    }

    try {
      const newProfile = queryRunner.manager.create(IbCommissionProfile, {
        name: createIbProfileDto.name,
        description: createIbProfileDto?.description,
        level: createIbProfileDto.level,
        server: createIbProfileDto.server,
        isPublic: createIbProfileDto.isPublic,
        calculateCommission:createIbProfileDto.calculateCommission || false,
        classification,
        tradingGroup,
        copyTradingGroup,
        agentTradingGroup,
        createdBy: { id: userId } as User,
        isActive: true
      });

      const savedProfile = await queryRunner.manager.save(newProfile);

      if (createIbProfileDto.keyFeatures?.length) {
        const features = createIbProfileDto.keyFeatures.map((f) =>
          queryRunner.manager.create(CommissionProfileKeyFeature, {
            ...f,
            commissionProfile: savedProfile,
          }),
        );

        const savedFeatures = await queryRunner.manager.save(features); // single DB call
        savedProfile.keyFeatures = savedFeatures;
      }

      if (createIbProfileDto.copyConfig && createIbProfileDto.configs) {
        const sourceProfile = await this.ibProfileRepository.findOne({
          where: { id: createIbProfileDto.configs, isActive: true },
          relations: [
            'configs',
            'configs.profileType',
            'configs.distributions',
            'configs.distributions.distributionValues'
          ]
        });

        if (!sourceProfile) {
          throw new BadRequestException('Source IB Commission Profile not found');
        }

        if (sourceProfile.level !== savedProfile.level) {
          throw new BadRequestException('Source IB Commission Profile level is not equal to the new profile level');
        }

        if (Array.isArray(sourceProfile.configs)) {
          for (const sourceConfig of sourceProfile.configs) {
            await this.copyConfigToNewProfile(queryRunner, sourceConfig, savedProfile, userId);
          }
        } else if (sourceProfile.configs) {
          await this.copyConfigToNewProfile(queryRunner, sourceProfile.configs, savedProfile, userId);
        }
      }

      await queryRunner.commitTransaction();
      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: savedProfile,
        oldData: null,
        entityId: savedProfile.id,
        entityType: entityType.IB_COMMISSION_PROFILE,
        performerId: userId,
        performerType: 'Operator',
        field: 'Create IB Commission Profile',
      });

      return savedProfile;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(`${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private async copyConfigToNewProfile(
    queryRunner,
    sourceConfig: IbCommissionProfileConfig,
    newProfile: IbCommissionProfile,
    userId: number
  ) {
    const newConfig = queryRunner.manager.create(IbCommissionProfileConfig, {
      name: sourceConfig.name,
      priority: sourceConfig.priority,
      commissionProfile: newProfile,
      profileType: sourceConfig.profileType,
      setCashback: sourceConfig.setCashback,
      isDeductFromIb: sourceConfig.isDeductFromIb,
      cashbackAmountType: sourceConfig.cashbackAmountType,
      cashbackAmount: sourceConfig.cashbackAmount,
      symbols: sourceConfig.symbols,
      entry: sourceConfig.entry,
      scalpingTrades: sourceConfig.scalpingTrades,
      createdBy: { id: userId } as User,
      isActive: true
    });

    const savedConfig = await queryRunner.manager.save(newConfig);

    if (Array.isArray(sourceConfig.distributions)) {
      for (const sourceDistribution of sourceConfig.distributions) {
        await this.copyDistributionToNewConfig(queryRunner, sourceDistribution, savedConfig);
      }
    } else if (sourceConfig.distributions) {
      await this.copyDistributionToNewConfig(queryRunner, sourceConfig.distributions, savedConfig);
    }

    return savedConfig;
  }

  private async copyDistributionToNewConfig(
    queryRunner,
    sourceDistribution: IbDistribution,
    newConfig: IbCommissionProfileConfig
  ) {
    const newDistribution = queryRunner.manager.create(IbDistribution, {
      key: sourceDistribution.key,
      value: sourceDistribution.value,
      distribution: newConfig
    });

    const savedDistribution = await queryRunner.manager.save(newDistribution);

    if (Array.isArray(sourceDistribution.distributionValues)) {
      for (const sourceValue of sourceDistribution.distributionValues) {
        await this.copyDistributionValueToNewDistribution(queryRunner, sourceValue, savedDistribution);
      }
    } else if (sourceDistribution.distributionValues) {
      await this.copyDistributionValueToNewDistribution(queryRunner, sourceDistribution.distributionValues, savedDistribution);
    }

    return savedDistribution;
  }

  private async copyDistributionValueToNewDistribution(
    queryRunner,
    sourceValue: IbDistributionValue,
    newDistribution: IbDistribution
  ) {
    const newValue = queryRunner.manager.create(IbDistributionValue, {
      distributionLevel: sourceValue.distributionLevel,
      distributionAmount: sourceValue.distributionAmount,
      level: sourceValue.level,
      fromAmount: sourceValue.fromAmount,
      toAmount: sourceValue.toAmount,
      amount: sourceValue.amount,
      distributionContext: sourceValue.distributionContext,
      distribution: newDistribution
    });

    return await queryRunner.manager.save(newValue);
  }

  async findOne(id: number) {
    const isExist = await this.ibProfileRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'keyFeatures',
        'configs',
        'configs.distributions',
        'configs.profileType',
        'createdBy',
        'classification',
        'tradingGroup',
        'copyTradingGroup',
        'agentTradingGroup',
      ],
    });

    if (!isExist) {
      throw new BadRequestException('IB Commission Profile not exist');
    }

    return isExist;
  }

  async findAll() {
    return await this.ibProfileRepository.find({
      where: { isActive: true },
      relations: ['configs', 'createdBy'],
    });
  }

  async findAllLevelOne() {
    return await this.ibProfileRepository.find({
      where: { isActive: true, level: 1, isPublic: true },
      relations: ['configs'],
    });
  }

  async getIbProfileList(payload: {
    userId: number;
    limit: number;
    page: number;
    dto: ApplyListFilterSortColumnDto;
  }) {
    const { userId, limit, page, dto } = payload;
    const filters = [
      {
        name: 'isActive',
        operation: FilterOperation.EQUALS,
        value: [true],
      },
    ];
    return this.ibProfileRepository.advanceFilters({
      listName: ListNames.IB_PROFILE,
      userId,
      limit,
      page,
      filters,
      relations: ['configs', 'createdBy'],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async update(id: number, updateIbProfileDto: UpdateIbProfileDto, userId: number) {
    //@ts-expect-error type-error
    updateIbProfileDto.classificationId = undefined;

    const today = new Date();
    const isExist = await this.ibProfileRepository.findOne({
      where: { id, isActive: true },
      relations: ['keyFeatures'],
    });

    if (!isExist) {
      throw new BadRequestException('IB Commission Profile not exist');
    }

    if (
      updateIbProfileDto.name &&
      updateIbProfileDto.name !== isExist.name
    ) {
      const nameExist = await this.ibProfileRepository.findOne({
        where: { name: updateIbProfileDto.name },
      });

      if (nameExist) {
        throw new BadRequestException('IB Commission Profile name already exists');
      }
    }

    let tradingGroup;
    let agentTradingGroup;
    let copyTradingGroup;

    if (updateIbProfileDto.tradingGroupId) {
      tradingGroup = await this.tradingGroupRepository.findOne({
        where: {
          id: updateIbProfileDto.tradingGroupId,
          classificationId: isExist.classificationId,
          type: TradingGroupType.NORMAL
        }
      });

      if (!tradingGroup) {
        throw new BadRequestException("Trading Group Id is Invalid");
      }
    }

    if (updateIbProfileDto.agentTradingGroupId) {
      agentTradingGroup = await this.tradingGroupRepository.findOne({
        where: {
          id: updateIbProfileDto.agentTradingGroupId,
          type: TradingGroupType.AGENT

        }
      });

      if (!agentTradingGroup) {
        throw new BadRequestException("Agent Trading Group Id is Invalid");
      }
    }

    if (updateIbProfileDto.copyTradingGroupId) {
      copyTradingGroup = await this.tradingGroupRepository.findOne({
        where: {
          id: updateIbProfileDto.copyTradingGroupId,
          type: TradingGroupType.COPY_TRADING
        }
      });

      if (!copyTradingGroup) {
        throw new BadRequestException("Copy Trading Group Id is Invalid");
      }
    }

    let updatedKeyFeatures = isExist.keyFeatures || [];
    let deletedKeyFeatures: any[] = [];

    if (updateIbProfileDto.keyFeatures) {
      const current = isExist.keyFeatures || [];
      const incoming = updateIbProfileDto.keyFeatures;
      const incomingIds = incoming.filter((f) => f.id).map((f) => f.id);

      const toDelete = current.filter((f) => !incomingIds.includes(f.id));
      if (toDelete.length) {
        const deletedIds = toDelete.map(f => f.id);
        await this.commissionProfileKeyFeatureRepository.softDelete(deletedIds);
        deletedKeyFeatures =
         await this.commissionProfileKeyFeatureRepository.find({
           where: { id: In(deletedIds) },
           withDeleted: true,
         });
      }
      updatedKeyFeatures = [];
      for (const f of current) {
        if (toDelete.find((d) => d.id === f.id)) continue;

        const dto = incoming.find((i) => i.id === f.id);
        if (dto && f.feature !== (dto.feature ?? '')) {
          const updated = await this.commissionProfileKeyFeatureRepository.save(
            {
              id: f.id,
              feature: dto.feature ?? '',
            },
          );
          updatedKeyFeatures.push(updated);
        } else {
          updatedKeyFeatures.push(f);
        }
      }
      // Add new features
      const toCreate = incoming
        .filter((f) => !f.id)
        .map((f) => ({
          feature: f.feature,
          commissionProfile: { id: isExist.id },
        }));
      if (toCreate.length) {
        const created =
          await this.commissionProfileKeyFeatureRepository.save(toCreate);
        updatedKeyFeatures = [...updatedKeyFeatures, ...created];
      }
    }

    const isPublic =
      typeof updateIbProfileDto?.isPublic === 'boolean'
        ? updateIbProfileDto?.isPublic
        : undefined;
    const isCalculateCommission =
      typeof updateIbProfileDto.calculateCommission === 'boolean'
        ? updateIbProfileDto.calculateCommission
        : undefined;
    const result = await this.ibProfileRepository.save({
      id:isExist.id,
      name: updateIbProfileDto?.name,
      description: updateIbProfileDto?.description,
      isPublic,
      calculateCommission: isCalculateCommission,
      updatedAt: today,
      tradingGroup,
      agentTradingGroup,
      copyTradingGroup
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { ...result, keyFeatures: updatedKeyFeatures, deletedKeyFeatures: deletedKeyFeatures.length > 0 ? deletedKeyFeatures : undefined },
      oldData: isExist,
      entityId: isExist.id,
      entityType: entityType.IB_COMMISSION_PROFILE,
      performerId: userId,
      performerType: 'Operator',
      field: 'Update IB Commission Profile',
    });
    return { ...result, keyFeatures: updatedKeyFeatures };
  }

  async delete(id: number, userId: number) {
    const isExist = await this.ibProfileRepository.findOne({
      where: { id, isActive: true },
      relations: ['keyFeatures'],
    });

    if (!isExist) {
      throw new BadRequestException('IB Commission Profile not exist');
    }

    const keyFeatureIds = isExist.keyFeatures.map((kf) => kf.id);
    if (keyFeatureIds.length > 0) {
     const deleteKeys = await this.commissionProfileKeyFeatureRepository.softDelete(
        keyFeatureIds,
      );
    }

    const result = await this.ibProfileRepository.save({
      ...isExist,
      isActive: false,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        ...result,
        keyFeatures: isExist.keyFeatures.map((kf) => ({
          ...kf,
          deletedAt: new Date(),
        })),
      },
      oldData: isExist,
      entityId: isExist.id,
      entityType: entityType.IB_COMMISSION_PROFILE,
      performerId: userId,
      performerType: 'Operator',
      field: 'Delete IB Commission Profile',
    });
    return result;
  }

  async deleteConfig(id: number, userId: number) {
    const isExist = await this.ibConfigRepository.findOne({
      where: { id },
    });

    if (!isExist) {
      throw new BadRequestException('IB Commission Config not exist');
    }

    const result = await this.ibConfigRepository.softDelete(id);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: isExist,
      entityId: isExist.id,
      entityType: entityType.IB_COMMISSION_PROFILE,
      performerId: userId,
      performerType: 'Operator',
      field: 'Delete IB Commission Profile Config',
    });
    return result;
  }

  async findAllCommissionProfileTypes() {
    const data = await this.ibCommissionProfileTypeRepository.find({
      // relations: ['distributions'],
    })
    console.log("data", data)
    return data;

  }

  async findDistributionsByProfileType(profileTypeId: number) {
    const distributions = await this.ibProfileDistributionRepository.find({
      where: {
        profileType: { id: profileTypeId }
      },
      relations: ['profileType']
    });

    return distributions;
  }

  async findProfilesByLevel(level: number) {
    const profiles = await this.ibProfileRepository.find({
      where: {
        level,
        isActive: true
      },
    });

    return profiles;
  }

  async getCommisonProfileForUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }, relations: {
        partner: true
      }
    });
    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (!user.partner) {
      throw new BadRequestException("Partner not found");
    }
    return this.getCommisonProfileForIb(user.partner.id)
  }

  async getPartnerLevel(partnerId: number) {
    const partner = await this.partnerRepository.findOne({
      where: {
        id: partnerId
      }
    });
    if (!partner) {
      throw new BadRequestException("Partner not found");
    };
    return partner.partnerLevel || 1;
  }

  async getCommisonProfileForIb(partnerId: number, profileId?: number) {
    const level = await this.getPartnerLevel(partnerId);

    if (profileId) {
      const profile = await this.ibProfileRepository.findOne({
        where: {
          isPublic: true,
          level,
          id: profileId,
          isActive: true
        }
      });
      if (!profile) {
        throw new BadRequestException("Profile not found");
      };
      return profile;
    }
    const profiles = await this.ibProfileRepository.find({
      where: {
        isPublic: true,
        isActive: true,
        level
      }
    });
    return profiles
  }

  async getIbCommissionProfile(partnerId: number, findOptionsRelations?: FindOptionsRelations<PartnerCommissionProfile>, profileId?:number) {
    const profiles = await this.partnerCommissionProfileRepository.find({
      where: {
        partner: {
          id: partnerId
        },
        ...(profileId ? {
          commissionProfile:{
            id:profileId
            }
        } : {})
      },
      relations: findOptionsRelations ? findOptionsRelations : undefined
    });
    return profiles;
  }

  async getIbSingleCommissionProfile(partnerId: number, profileId:number) {
    const profile = await this.partnerCommissionProfileRepository.findOne({
      where: {
        partner: {
          id: partnerId
        },
        commissionProfile:{
          id:profileId
        }
      },
    });
    if(!profile){
      throw new BadRequestException("Profile not found");
    }
    return profile;
  }

  async getIbCommissionProfileInfo(partnerId: number) {
    const info = await this.getIbCommissionProfile(partnerId, { commissionProfile: {keyFeatures:true} });
    const profiles: IbCommissionProfile[] = [];
    info.forEach((i) => {
      if (i.commissionProfile) {
        profiles.push(i.commissionProfile)
      }
    });
    return profiles;
  }

  async assignCommissionProfiles(partnerId: number, profileIds: number[]) {
    const level = await this.getPartnerLevel(partnerId);

    const profiles = await this.ibProfileRepository.find({
      where: { level, id: In(profileIds), isActive: true },
    });

    if (profileIds.length !== profiles.length) {
      throw new BadRequestException(
        'Some commission profile IDs are invalid for this partner level',
      );
    }

    const assignedProfiles = await this.getIbCommissionProfileInfo(partnerId);

    const assignedProfileIds = new Set(assignedProfiles.map((p) => p.id));

    const newProfileIds = new Set(profileIds);

    const toAdd = profileIds.filter((id) => !assignedProfileIds.has(id));
    const toDelete = [...assignedProfileIds].filter((id) => !newProfileIds.has(id));

    // Create new profiles to insert
    const newProfiles = toAdd.map((id) =>
      this.partnerCommissionProfileRepository.create({
        partner: { id: partnerId },
        commissionProfile: { id },
      }),
    );

    await this.dataSource.transaction(async (manager) => {
      if (toDelete.length > 0) {
        await manager.delete(PartnerCommissionProfile, {
          partner: { id: partnerId },
          commissionProfile: { id: In(toDelete) },
        });
      }

      if (newProfiles.length > 0) {
        await manager.save(PartnerCommissionProfile, newProfiles);
      }
    });

    return this.getIbCommissionProfile(partnerId, { commissionProfile: true });
  }

  async getCommissionProfileOfPartner(id?: number, partner_uuid?: string) {
    const i18n = I18nContext.current();

    if (id && partner_uuid) {
      const partner = await this.partnerRepository.findOne({
        where: {
          uuid:partner_uuid
        }
      });

      if (!partner) {
        throw new BadRequestException("Partner not found");
      };

      const profile = await this.partnerCommissionProfileRepository.findOne({
        where: {
          partner: {
            id: partner.id
          },
          commissionProfile: {
            id
          }
        },
        relations: {
          commissionProfile: true
        }
      });

      if (!profile || !profile.commissionProfile) {
        throw new BadRequestException("Commission profile not assigned to ib")
      }
      return profile.commissionProfile;
    };

    const profile = await this.getDefaultProfile();
    return profile

  }

  async getUserPartnerCommssionProfile(userId:number) {
    const user = await this.userRepository.findOne({
      where:{
        id:userId
      },
      relations: {
        client: {
          partner: true
        }
      }
    });

    if(!user){
      throw new BadRequestException("User not found");
    }

    if (!user?.client?.partner) {
      throw new BadRequestException("User Partner not found");
    }

    return await this.getIbCommissionProfileInfo(user.client.partner.id)
  }

  async getDefaultProfile(){
    const profile = await this.ibProfileRepository.findOne({
      where: {
        classification: {
          name: AccountClassification.STANDARD
        },
        name:`Default ${AccountClassification.STANDARD}`
      }
    });
    return profile || undefined;
  }

  async assignDefaultProfiles(partnerId: number) {
    const names = Object.keys(AccountClassification).map((c) => {
      const classification = AccountClassification[c];
      return `Default ${classification}`
    })
    const profiles = await this.ibProfileRepository.find({
      where: { level: 1, name: In(names), isActive: true },
    });

    const profileIds = profiles.map((p) => {
      return p.id;
    })

    return this.assignCommissionProfiles(partnerId, profileIds)
  }

}


