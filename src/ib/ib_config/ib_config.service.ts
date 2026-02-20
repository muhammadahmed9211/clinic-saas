import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  IbConfigRepository,
  IbDistributionRepository,
  IbDistributionValueRepository,
} from './repositories/ib_config.repository';
import {
  CreateIbConfigDto,
  DealIdsDto,
  DistributionValueDto,
  UpdateIbConfigDto,
} from './dto/ib_config.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { DataSource, Like, LessThan, Repository, In } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { entityType } from 'src/admin/active-log/active-log.type';
import {
  CreateCommissionDealDto,
  MT5DealData,
} from '../interfaces/Mt5Deal.interface';
import { Mt5AccountRepository } from 'src/mt5/account/repositories/mt5-account.repository';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { PartnerRepository } from 'src/admin/partner/repositories/partner.repository';
import { ActiveStatus, Partner } from 'src/settings/entities/partner.entity';
import { transformKeysToCamelCase } from 'src/common/helper';
import { InjectRepository } from '@nestjs/typeorm';
import { IbCommissionDeals } from '../entities/ib-commission-deals.entity';
import { KafkaService } from 'src/kafka/kafka.service';
import { ClientKafka } from '@nestjs/microservices';
import { CommissionTopics } from 'src/kafka/topics/ib/commission.topics.enum';
import { AccountService as Mt5AccountService } from 'src/mt5/account/account.service';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { User } from 'src/users/entities/user.entity';
import { Mt5Deal } from 'src/mt5/entities/mt5-deals.entity';

/**
 * Helper service for matching symbols using wildcards
 */
class SymbolMatcher {
  /**
   * Check if a deal symbol matches a config symbol pattern
   * @param dealSymbol The deal symbol to check (e.g., 'EURUSD')
   * @param configSymbol The config symbol pattern (e.g., '*EUR*.s')
   * @returns boolean Whether the deal symbol matches the pattern
   */
  static matchSymbol(dealSymbol: string, configSymbol: string): boolean {
    // Convert wildcard pattern to regex
    const regexPattern = configSymbol
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex characters
      .replace(/\*/g, '.*'); // Replace * with .*

    const regex = new RegExp(`^${regexPattern}$`, 'i'); // Case-insensitive matching
    return regex.test(dealSymbol);
  }
}

// Before calculateCommissionForCTP method, add these interfaces
interface LevelCommission {
  level: number;
  percentageAmount: number;
  commissionAmount: number;
}

interface CTPCommissionResult {
  type: string;
  levelCommissions: LevelCommission[];
  totalCommission: number;
}

interface CTPLevelCommission {
  level: number;
  commission: number;
  markup: number;
  swaps: number;
  commissionAmount: number;
}
interface IbHierarchyNode {
  id: number;
  name: string;
  email?: string;
  login?: string;
  clients: number;
  children?: IbHierarchyNode[];
}

@Injectable()
export class IbConfigService {
  constructor(
    private readonly ibConfigRepository: IbConfigRepository,
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly mt5AccountRepository: Mt5AccountRepository,
    private readonly clientRepository: ClientRepository,
    private readonly partnerRepository: PartnerRepository,
    @InjectRepository(IbCommissionDeals)
    private readonly ibCommissionDealsRepository: Repository<IbCommissionDeals>,
    private readonly kafka: KafkaService,
    @Inject('MT5_SERVICE') private readonly mt5Client: ClientKafka,
    private readonly mt5AccountService: Mt5AccountService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
     @InjectRepository(Mt5Deal)
    private readonly mt5DealRepository: Repository<Mt5Deal>,
  ) { }
 
  async createConfig(data: CreateIbConfigDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const configRepo = queryRunner.manager.getRepository(
        'ib_commission_profile_config',
      );
      const distribRepo = queryRunner.manager.getRepository('ib_distribution');
      const distribValueRepo = queryRunner.manager.getRepository(
        'ib_distribution_value',
      );

      const existingPriority = await configRepo.findOne({
        where: {
          priority: data.priority,
          profileType: { id: data.profileType },
          commissionProfile: { id: data.commissionProfile },
        },
      });

      if (existingPriority) {
        throw new BadRequestException(
          'Priority must be unique within the same profile type',
        );
      }

      const newConfig = await configRepo.save({
        name: data.name,
        priority: data.priority,
        setCashback: data.setCashback || false,
        isDeductFromIb: data.isDeductFromIb || false,
        cashbackAmountType: data.cashbackAmountType,
        cashbackAmount: data.cashbackAmount,
        symbols: data.symbols,
        entry: data.entry,
        scalpingTrades: data.scalpingTrades,
        commissionProfile: { id: data.commissionProfile },
        profileType: { id: data.profileType },
        createdBy: { id: userId },
      });

      // Process distributions
      for (const distribution of data.distributions) {
        const newDistribution = await distribRepo.save({
          key: distribution.key,
          value: distribution.value,
          distribution: newConfig,
        });

        // Process distribution values
        for (const value of distribution.distributionValues) {
          await distribValueRepo.save({
            distributionLevel: value.distributionLevel,
            distributionAmount: value.distributionAmount,
            // level: value.level,
            // fromAmount: value.fromAmount,
            // toAmount: value.toAmount,
            // amount: value.amount,
            distributionContext: value.distributionContext,
            distribution: newDistribution,
          });
        }
      }

      await queryRunner.commitTransaction();

      const result =
        await this.ibConfigRepository.getProfileConfigWithRelations(
          newConfig.id,
        );

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: result,
        oldData: null,
        entityId: newConfig.id,
        entityType: entityType.IB_COMMISSION_PROFILE_CONFIG,
        performerId: userId,
        performerType: 'Operator',
        field: 'Create IB Commission Profile Config',
      });

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  // async findAll() {
  //   return await this.ibConfigRepository.getAllProfileConfigsWithRelations();
  // }

  async findOne(id: number) {
    const isExist = await this.ibConfigRepository.findOne({
      where: { id, isActive: true },
    });

    if (!isExist) {
      throw new BadRequestException('IB Config not found');
    }

    return await this.ibConfigRepository.getProfileConfigWithRelations(id);
  }

  async getIbConfigList(payload: {
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
    return this.ibConfigRepository.advanceFilters({
      listName: ListNames.IB_PROFILE_CONFIG,
      userId,
      limit,
      page,
      filters,
      relations: ['createdBy', 'commissionProfile', 'profileType'],
      filterList: dto?.filters || undefined,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
      overrideFilters: true,
      orList: dto.or,
    });
  }

  async update(id: number, data: UpdateIbConfigDto, userId: number) {
    const isExist = await this.ibConfigRepository.findOne({
      where: { id, isActive: true },
      relations: [
        'profileType',
        'createdBy',
        'commissionProfile',
        'distributions',
        'distributions.distributionValues',
      ],
    });
    console.log('isExist', isExist);

    if (!isExist) {
      throw new BadRequestException('IB Config not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update base configuration
      const configRepo = queryRunner.manager.getRepository(
        'ib_commission_profile_config',
      );
      const distribRepo = queryRunner.manager.getRepository('ib_distribution');
      const distribValueRepo = queryRunner.manager.getRepository(
        'ib_distribution_value',
      );

      const updateData: any = {
        ...isExist,
        updatedAt: new Date(),
      };

      if (data.name) updateData.name = data.name;
      if (data.priority !== undefined) {
        const existingPriority = await configRepo.findOne({
          where: {
            priority: data.priority,
            profileType: { id: isExist.profileType.id },
            commissionProfile: { id: isExist.commissionProfile.id },
          },
        });

        if (existingPriority) {
          throw new BadRequestException(
            'Priority must be unique within the same profile type',
          );
        }
        updateData.priority = data.priority;
      }
      // if (data.setCashback !== undefined) updateData.setCashback = data.setCashback;
      // if (data.isDeductFromIb !== undefined) updateData.isDeductFromIb = data.isDeductFromIb;
      // if (data.cashbackAmountType) updateData.cashbackAmountType = data.cashbackAmountType;
      // if (data.cashbackAmount) updateData.cashbackAmount = data.cashbackAmount;
      if (data.symbols) updateData.symbols = data.symbols;
      if (data.entry) {
        if (data.entry === 'In') {
          updateData.scalpingTrades = null;
        }
        updateData.entry = data.entry;
      }
      if (data.scalpingTrades && data.entry !== 'In')
        updateData.scalpingTrades = data.scalpingTrades;

      await configRepo.save(updateData);

      if (data.distributions && data.distributions.length > 0) {
        const existingDistributions = await distribRepo.find({
          where: { distribution: { id } },
          relations: ['distributionValues'],
        });

        for (const dist of existingDistributions) {
          if (dist.distributionValues) {
            await Promise.all(
              Array.isArray(dist.distributionValues)
                ? dist.distributionValues.map((value) =>
                  distribValueRepo.delete(value.id),
                )
                : [distribValueRepo.delete(dist.distributionValues.id)],
            );
          }
          // Delete distribution
          await distribRepo.delete(dist.id);
        }

        // Add new distributions and values
        for (const distribution of data.distributions) {
          const newDistribution = await distribRepo.save({
            key: distribution.key,
            value: distribution.value,
            distribution: { id },
          });

          for (const value of distribution.distributionValues) {
            await distribValueRepo.save({
              distributionLevel: value.distributionLevel,
              distributionAmount: value.distributionAmount,
              // level: value.level,
              // fromAmount: value.fromAmount,
              // toAmount: value.toAmount,
              // amount: value.amount,
              distributionContext: value.distributionContext,
              distribution: newDistribution,
            });
          }
        }
      }

      await queryRunner.commitTransaction();

      const result =
        await this.ibConfigRepository.getProfileConfigWithRelations(id);

      const copyResult = { ...result };

      if (!data.distributions) {
        copyResult.distributions = undefined as any;
        isExist.distributions = undefined as any;
      }

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: copyResult,
        oldData: isExist,
        entityId: isExist.id,
        entityType: entityType.IB_COMMISSION_PROFILE_CONFIG,
        performerId: userId,
        performerType: 'Operator',
        field: 'Update IB Commission Profile Config',
      });

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, userId: number) {
    const isExist = await this.ibConfigRepository.findOne({
      where: { id, isActive: true },
    });

    if (!isExist) {
      throw new BadRequestException('IB Config not found');
    }

    const result = await this.ibConfigRepository.save({
      ...isExist,
      isActive: false,
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: isExist,
      entityId: isExist.id,
      entityType: entityType.IB_COMMISSION_PROFILE_CONFIG,
      performerId: userId,
      performerType: 'Operator',
      field: 'Delete IB Commission Profile Config',
    });

    return result;
  }

// async calculateCommissionById(body: DealIdsDto){
//   const deals = await this.getDealsByIds(body.dealIds);

//   if (deals.length === 0 || deals.length !== body.dealIds.length) {
//     console.log('No MT5 deals found for commission calculation', { dealIds: body.dealIds });
//     return [];
//   }

//   return Promise.all(
//     deals.map(deal =>
//       this.processCommissionForDeal(deal).catch(error =>
//         this.handleCommissionError(deal, error)
//       )
//     )
//   );
// }

// private async getDealsByIds(dealIds: number[]) {
//   if (!Array.isArray(dealIds) || dealIds.length === 0) {
//     return [];
//   }

//   return this.mt5DealRepository.find({
//     where: { deal: In(dealIds) },
//   });
// }

// private async processCommissionForDeal(deal: Mt5Deal) {
//   const dealData = this.convertToMT5DealData(deal);
//   const commission = await this.calculateCommission(dealData);

//   return {
//     dealId: deal.id,
//     success: true,
//     result: commission,
//   };
// }

// private handleCommissionError(deal: Mt5Deal, error: Error) {
//   console.log('Commission calculation failed', {
//     dealId: deal.id,
//     dealNumber: deal.deal,
//     error: error.message,
//   });

//   return {
//     dealId: deal.id,
//     success: false,
//     result: error.message,
//   };
// }
// private convertToMT5DealData(deal: Mt5Deal): MT5DealData {
//         return {
//             Action: deal.action || 0,
//             Comment: deal.comment || '',
//             Commission: deal.commission || 0,
//             ContractSize: deal.contractSize || 0,
//             Deal: deal.deal || 0,
//             Dealer: deal.dealer || 0,
//             Digits: deal.digits || 0,
//             DigitsCurrency: deal.digitsCurrency || 0,
//             Entry: deal.entry || 0,
//             ExpertID: deal.expertId || 0,
//             ExternalID: deal.externalId || '',
//             Fee: deal.fee || 0,
//             Flags: deal.flags || 0,
//             Gateway: deal.gateway || '',
//             Login: deal.login || 0,
//             MarketAsk: deal.marketAsk || 0,
//             MarketBid: deal.marketBid || 0,
//             MarketLast: deal.marketLast || 0,
//             ModificationFlags: deal.modifyFlags || 0,
//             Order: deal.order || 0,
//             PositionID: deal.positionId || 0,
//             Price: deal.price || 0,
//             PriceGateway: deal.priceGateway || 0,
//             PricePosition: deal.pricePosition || 0,
//             PriceSL: deal.priceSl || 0,
//             PriceTP: deal.priceTp || 0,
//             Print: '', // This field doesn't exist in your entity, setting empty string
//             Profit: deal.profit || 0,
//             ProfitRaw: deal.profitRaw || 0,
//             RateMargin: deal.rateMargin || 0,
//             RateProfit: deal.rateProfit || 0,
//             Reason: deal.reason || 0,
//             Storage: deal.storage || 0,
//             Symbol: deal.symbol || '',
//             TickSize: deal.tickSize || 0,
//             TickValue: deal.tickValue || 0,
//             Time: 0, // Convert to timestamp
//             TimeMsc: 0, // Convert to timestamp
//             Value: deal.value || 0,
//             Volume: deal.volume || 0,
//             VolumeClosed: deal.volumeClosed || 0,
//             VolumeClosedExt: deal.volumeClosedExt || 0,
//             VolumeExt: deal.volumeExt || 0
//         };
//  }

async calculateCommission(body) {
  if (body.Commission) {
    body.Commission = Math.abs(body.Commission);
  }

  // 1. Find MT5 Account and check its commission calculation flag
  const mt5Account = await this.mt5AccountRepository.findOne({
    where: { login: body.Login.toString() },
    relations: ['user', 'commissionProfile'],
  });

  if (!mt5Account) {
    throw new BadRequestException('MT5 Account not found');
  }

  if (!mt5Account.calculateCommission) {
    console.log('MT5 Account commission calculation is disabled');
    return {
      message: 'MT5 Account commission calculation is disabled',
    };
  }

  if (!mt5Account.commissionProfile || !mt5Account.commissionProfile.id) {
  console.log('Commission Profile not found on MT5 Account');
  return { message: 'Commission Profile not found on MT5 Account' };
}


  // Check IB Commission Profile flag
  if (!mt5Account.commissionProfile.calculateCommission) {
    console.log('IB Commission Profile calculation is disabled');
    return {
      message: 'IB Commission Profile calculation is disabled',
    };
  }

  
  if (mt5Account.commissionProfile?.name === 'Default Premier' || mt5Account.commissionProfile.name === 'Default Standard' || mt5Account.commissionProfile?.name === 'Default Elite' || mt5Account.commissionProfile?.name === 'Default') {
    console.log('Default partner Not Calculate Commission');
    return {
      message: 'Default partner Not Calculate Commission',
    };
  }

  // 3. Find client and partner
  const client = await this.clientRepository.findOne({
    where: {
      userId: mt5Account.user.id,
      isActive: true,
      partner: { ib: true },
    },
    relations: {
      partner: true,
    },
  });

  console.log('client response check');

  if (!client) {
    console.log('Client Not Found');
    return {
      message: 'Client Not Found',
    };
  }

  const partner = await this.partnerRepository.findOne({
    where: { id: client.partner.id },
  });

  if (!partner) {
    console.log('Partner Not Found');
    return {
      message: 'Partner Not Found',
    };
  }


  // Check partner commission calculation flag
  if (!partner.calculateCommission) {
    console.log('Partner commission calculation is disabled');
    return {
      message: 'Partner commission calculation is disabled',
    };
  }

  console.log('Partner Get Successfully', partner.id);

  // 5. Find all active profiles for the MT5 account's commission profile
  const ibProfileConfigs = await this.ibConfigRepository.find({
    where: {
      commissionProfile: { id: mt5Account.commissionProfile.id },
      isActive: true,
    },
    relations: [
      'profileType',
      'createdBy',
      'distributions',
      'distributions.distributionValues',
      'commissionProfile',
    ],
    order: {
      priority: 'ASC',
    },
  });

  if (!ibProfileConfigs.length) {
    console.log('No IB Profile Commission configurations found');
    return {
      message: 'No IB Profile Commission configurations found',
    };
  }

  // Continue with the rest of the logic (symbol matching, etc.)
  // ... [rest of the existing calculateCommission logic remains the same]
  
  // Find the config that matches the symbol pattern
  let selectedConfig: any = null;
  
  for (const config of ibProfileConfigs) {
    console.log(
      'Checking symbol match:',
      body.Symbol,
      'against pattern:',
      config.symbols,
    );
    
    const configSymbols = config.symbols
      ? config.symbols.split(',').filter(Boolean)
      : [];

    const includePatterns = configSymbols
      .filter((pattern) => !pattern.startsWith('!'))
      .map((pattern) => {
        const regexPattern = pattern
          .trim()
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${regexPattern}$`, 'i');
      });

    const excludePatterns = configSymbols
      .filter((pattern) => pattern.startsWith('!'))
      .map((pattern) => {
        const regexPattern = pattern
          .slice(1)
          .trim()
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*');
        return new RegExp(`^${regexPattern}$`, 'i');
      });

    const isExcluded = excludePatterns.some((regex) =>
      regex.test(body.Symbol),
    );
    if (isExcluded) {
      console.log('Symbol excluded:', body.Symbol);
      continue;
    }

    const isMatch = includePatterns.some((regex) => regex.test(body.Symbol));
    if (isMatch) {
      selectedConfig = config;
      console.log(
          '``Found matching config for`` symbol',
        body.Symbol,
        ':',
        config.symbols,
      );
      break;
    }
  }
  
  console.log('selectedConfig', selectedConfig);
  if (!selectedConfig) {
    console.log(`No matching configuration found for symbol ${body.Symbol}`);
    return {
      message: `No matching configuration found for symbol ${body.Symbol}`,
    };
  }

  console.log(
    'Selected config:',
    selectedConfig.id,
    selectedConfig,
    'for symbol:',
    body.Symbol,
  );

  // Get partner level from the commission profile
  const partnerLevel = selectedConfig.commissionProfile.level || 1;

  // Get all partners in the hierarchy
  const partnerHierarchy: Partner[] = [];

  if (partnerLevel > 1) {
    let currentPartner = partner;

    while (currentPartner && currentPartner.masterIbId) {
      console.log('loop while');

      const masterPartner = await this.partnerRepository.findOne({
        where: {
          id: currentPartner.masterIbId,
          ib: true,
          status: ActiveStatus.ACTIVE,
          calculateCommission: true,
        },
        relations: ['commissionProfile'],
      });

      console.log('masterPartner', masterPartner);

      if (masterPartner) {
        partnerHierarchy.push(masterPartner);
        currentPartner = masterPartner;
      } else {
        break;
      }
    }
  }

  // Check the profile type and calculate commission accordingly
  const profileType = selectedConfig.profileType.name;

  let calculationResult: any = null;
  if (profileType === 'Commission Trades Lot - CTL') {
    calculationResult = this.calculateCommissionForCTL(
      selectedConfig,
      body,
      partnerLevel,
    );
  } else if (profileType === 'Commission Trades Perc - CTP') {
    calculationResult = this.calculateCommissionForCTP(
      selectedConfig,
      body,
      partnerLevel,
    );
  } else {
    return {
      message: `Profile type ${profileType} calculation not implemented yet`,
    };
  }

  console.log('calculationResult', calculationResult);

  // Distribute commissions across partner hierarchy
  if (calculationResult?.levelCommissions) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const allPartners = [...partnerHierarchy, partner];
      const distributedCommissions = allPartners.map((partner, index) => {
        const commissionLevel = allPartners.length - index;

        const levelCommission = calculationResult.levelCommissions.find(
          (lc: any) => lc.level === commissionLevel,
        );

        return {
          partnerId: partner.id,
          partnerName: partner.name,
          partnerLevel: partner.partnerLevel,
          userIbId: partner.userIbId,
          commission: levelCommission ? levelCommission.commissionAmount : 0,
        };
      });

      calculationResult.distributedCommissions = distributedCommissions;

      const dealDataArray = distributedCommissions.map(
        (partnerCommission) => {
          const dealData: MT5DealData = {
            ...body,
            Login: Number(partnerCommission.userIbId),
            Commission: partnerCommission.commission,
            PartnerId: partnerCommission.partnerId,
            Deal: 0,
            client: client.userId,
          };
          return dealData;
        },
      );

      calculationResult.dealDataArray = dealDataArray;

      const savedDeals: IbCommissionDeals[] = [];
      let savedDealCount = 0;

   for (const dealData of dealDataArray) {
  console.log('savedDealCount', ++savedDealCount);

  const camelCaseData = transformKeysToCamelCase(dealData);
  const transformedData = this.transformDealDataTypes(camelCaseData);

  const mt5Account = await this.mt5AccountRepository.findOne({
    where: { login: camelCaseData.login },
  });

  const dealEntityData = {
    ...transformedData,
    apiData: '[]',
    login: mt5Account ? mt5Account : camelCaseData.login,
    partner: { id: camelCaseData.partnerId },
    parentDealId: body.Deal,
  } as Partial<IbCommissionDeals>;

  const ibCommissionDeal = queryRunner.manager
    .getRepository(IbCommissionDeals)
    .create(dealEntityData);

  savedDeals.push(ibCommissionDeal);

}

        // Save all deals in transaction
      const savedDealEntities = await queryRunner.manager
        .getRepository(IbCommissionDeals)
        .save(savedDeals);
      console.log(`Saved ${savedDealEntities.length} commission deals`);
      calculationResult.savedDeals = savedDealEntities;

      let commissionDealCount = 0;
      const kafkaResults: any[] = [];

      for (let index = 0; index < distributedCommissions.length; index++) {
        const partnerCommission = distributedCommissions[index];
        const savedDeal = savedDealEntities[index];

        console.log('commissionDealCount', ++commissionDealCount);

        const createCommissionDealDto: CreateCommissionDealDto = {
          clientLogin: body.Login,
          ibLogin: Number(partnerCommission.userIbId),
          commission: partnerCommission.commission,
          commissionType: '',
          dealId: String(body.Deal),
          symbol: body.Symbol,
        };

        console.log('createCommissionDealDto ', createCommissionDealDto);

        try {
          const response = await this.mt5AccountService.addCommission(
            createCommissionDealDto,
          );

          console.log(
            `Commission deal created successfully for deal ${partnerCommission.userIbId}`,
          );

          await queryRunner.manager
            .getRepository(IbCommissionDeals)
            .update(savedDeal.id, {
              deal: response?.result?.answer?.ticket,
            });

          kafkaResults.push(response);
        } catch (error) {
          console.error(
            `Failed to create commission deal for deal ${partnerCommission.userIbId}:`,
            error,
          );
          await queryRunner.rollbackTransaction();
          throw new BadRequestException(
            `Failed to process commission deal: ${error.message}`,
          );
        }
      }

      await queryRunner.commitTransaction();

      console.log(
        'All commission deals processed successfully:',
        kafkaResults.length,
      );
      calculationResult.kafkaResults = kafkaResults;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction rolled back due to error:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  return calculationResult;
}

  private calculateCommissionForCTL(
    config: any,
    deal: MT5DealData,
    partnerLevel: number,
  ) {
    console.log('Calculating commission for CTL profile type');

    // Find distribution
    if (!config.distributions || !config.distributions.length) {
      return { message: 'No distributions found in the configuration' };
    }

    const distribution = config.distributions[0];
    const distributionValuesObj = distribution?.distributionValues;

    if (!distributionValuesObj) {
      return { message: 'No distribution values found in the configuration' };
    }

    // Determine distribution type (Pips, USD Per Lot, CTPercents)
    const distributionType = distribution.value;
    console.log('Distribution type:', distributionType);

    if (distributionType === 'Pips') {
      return this.calculatePipsCommission(
        distributionValuesObj,
        partnerLevel,
        deal,
      );
    } else if (distributionType === 'USD Per Lot') {
      return this.calculateUsdPerLotCommission(
        distributionValuesObj,
        partnerLevel,
        deal,
      );
    } else if (distributionType === 'CTPercents') {
      return this.calculateCTPercentsCommission(
        distributionValuesObj,
        partnerLevel,
        deal,
      );
    } else {
      return {
        message: `Distribution type ${distributionType} calculation not implemented yet`,
      };
    }
  }

  private calculateCommissionForCTP(
    config: any,
    deal: MT5DealData,
    partnerLevel: number,
  ) {
    console.log('Calculating commission for CTP profile type');
    // console.log("config.entry", config.entry)
    // Find all distributions
    if (!config.distributions || !config.distributions.length) {
      return { message: 'No distributions found in the configuration' };
    }

    // Calculate lotSize (same as in other methods)
    const lotSize =
      deal.Volume / deal.ContractSize / (10000 / deal.ContractSize);

    // Group distributions by their value (Commission, Markup, Swaps)
    const commissionDistribution = config.distributions.find(
      (d) => d.value === 'Commission',
    );
    // const markupDistribution = config.distributions.find(d => d.value === "Markup");
    // const swapsDistribution = config.distributions.find(d => d.value === "Swaps");

    // console.log("CTP Distributions found:", {
    //   commission: commissionDistribution,
    //   markup: markupDistribution,
    //   swaps: swapsDistribution
    // });

    // Initialize results for each level
    // const levelResults = {};
    // let totalCommission = 0;

    // Calculate commissions for each level up to the partner's level
    const levelCommissions: Array<{
      level: number;
      pipAmount: number;
      commissionAmount: number;
    }> = [];
    let totalCommission = 0;

    // Process Commission distribution if exists
    if (commissionDistribution && commissionDistribution.distributionValues) {
      const distributionValues = Array.isArray(
        commissionDistribution.distributionValues,
      )
        ? commissionDistribution.distributionValues
        : [commissionDistribution.distributionValues];
      console.log('distributionValues  checkingg', distributionValues);

      for (const value of distributionValues) {
        if (value.distributionLevel <= partnerLevel) {
          const level = value.distributionLevel;
          const commissionPercentage = value.distributionAmount;
          let dealCommission;
          if (config.entry === 'In' || config.entry === 'Out') {
            dealCommission = deal.Commission / 2;
          } else {
            dealCommission = deal.Commission;
          }
          const commissionAmount =
            (dealCommission * commissionPercentage) / 100;

          console.log(
            `Commission calculation for level ${level}: ${deal.Commission} * ${commissionPercentage}% = ${commissionAmount}`,
          );

          levelCommissions.push({
            level: value.distributionLevel,
            pipAmount: commissionPercentage,
            commissionAmount: commissionAmount,
          });

          totalCommission += commissionAmount;
          // if (!levelResults[level]) {
          //   levelResults[level] = {
          //     level,
          //     commission: 0,
          //     markup: 0,
          //     swaps: 0,
          //     commissionAmount: 0
          //   };
          // }

          // levelResults[level].commission = commissionAmount;
          // levelResults[level].commissionAmount += commissionAmount;
          // totalCommission += commissionAmount;
        }
      }
    }

    // Process Markup distribution if exists
    // if (markupDistribution && markupDistribution.distributionValues) {
    //   const distributionValues = Array.isArray(markupDistribution.distributionValues)
    //     ? markupDistribution.distributionValues
    //     : [markupDistribution.distributionValues];

    //   for (const value of distributionValues) {
    //     if (value.distributionLevel <= partnerLevel) {
    //       const level = value.distributionLevel;
    //       const percentageAmount = parseFloat(value.distributionAmount);
    //       const spread = Math.abs((deal.MarketAsk || 0) - (deal.MarketBid || 0));
    //       const markupAmount = spread * lotSize * (percentageAmount / 100);

    //       console.log(`Markup calculation for level ${level}: ${spread} * ${lotSize} * ${percentageAmount}% = ${markupAmount}`);

    //       if (!levelResults[level]) {
    //         levelResults[level] = {
    //           level,
    //           commission: 0,
    //           markup: 0,
    //           swaps: 0,
    //           commissionAmount: 0
    //         };
    //       }

    //       levelResults[level].markup = markupAmount;
    //       levelResults[level].commissionAmount += markupAmount;
    //       totalCommission += markupAmount;
    //     }
    //   }
    // }

    // // Process Swaps distribution if exists
    // if (swapsDistribution && swapsDistribution.distributionValues) {
    //   const distributionValues = Array.isArray(swapsDistribution.distributionValues)
    //     ? swapsDistribution.distributionValues
    //     : [swapsDistribution.distributionValues];

    //   for (const value of distributionValues) {
    //     if (value.distributionLevel <= partnerLevel) {
    //       const level = value.distributionLevel;
    //       const percentageAmount = parseFloat(value.distributionAmount);
    //       const swapsAmount = Math.abs(deal.Storage || 0) * (percentageAmount / 100);

    //       console.log(`Swaps calculation for level ${level}: ${deal.Storage} * ${percentageAmount}% = ${swapsAmount}`);

    //       if (!levelResults[level]) {
    //         levelResults[level] = {
    //           level,
    //           commission: 0,
    //           markup: 0,
    //           swaps: 0,
    //           commissionAmount: 0
    //         };
    //       }

    //       levelResults[level].swaps = swapsAmount;
    //       levelResults[level].commissionAmount += swapsAmount;
    //       totalCommission += swapsAmount;
    //     }
    //   }
    // }

    // Convert to array and sort by level
    // const levelCommissions = Object.values(levelResults).sort((a: any, b: any) => a.level - b.level);

    // console.log("Final CTP calculation result:", {
    //   levelCommissions,
    //   totalCommission
    // });

    return {
      trade: {
        symbol: deal.Symbol,
        volume: deal.Volume,
        lotSize,
      },
      calculationType: 'CTP',
      partnerLevel,
      levelCommissions,
      totalCommission,
    };
  }

  private calculatePipsCommission(
    distributionValuesObj: any,
    partnerLevel: number,
    deal: MT5DealData,
  ) {
    console.log('Calculating commission based on Pips');

    // lot size Formula
    // lotSize = volume / contract size / (10000 / contract size)
    const lotSize =
      deal.Volume / deal.ContractSize / (10000 / deal.ContractSize);

    // Implementation for Pips calculation
    // Make sure distributionValues is properly treated as an array
    const distributionValues = Array.isArray(distributionValuesObj)
      ? distributionValuesObj
      : [distributionValuesObj];

    // Calculate commissions for each level up to the partner's level
    const levelCommissions: Array<{
      level: number;
      pipAmount: number;
      commissionAmount: number;
    }> = [];
    let totalCommission = 0;

    // Pip Value = (Pip Size × Lot Size × Contract Size) / Exchange Rate

    // Pip formula
    // pip = lotSize * pipValue * rateProfit

    // Change Formula
    const PipConversionFactor = this.getPipConversionFactor(deal.Digits);
    const isUSD = deal.Symbol.toUpperCase().startsWith('USD');

    let onePipValue: number = 0;

    if (deal.RateProfit !== 1) {
      onePipValue = (deal.ContractSize * PipConversionFactor) / deal.Price;
    } else {
      onePipValue = deal.ContractSize * PipConversionFactor;
    }

    for (const value of distributionValues) {
      if (value.distributionLevel <= partnerLevel) {
        // const pipAmount = parseFloat(value.distributionAmount);
        // const pipAmount = value.distributionAmount * 10;
        const pipAmount = value.distributionAmount;
        // console.log("Math.pow(10, deal.Digits - 1)", Math.pow(10, deal.Digits - 1))
        // const pipUSD = deal.Price / Math.pow(10, deal.Digits - 1) * deal.RateProfit * pipAmount
        // console.log("pipUSD", pipUSD)
        // const commissionAmount = pipUSD * deal.RateProfit;
        // const commissionAmount = lotSize * pipAmount * deal.RateProfit;
        // new formula
        const commissionAmount = lotSize * pipAmount * onePipValue;
        // console.log("Commission calculation for level", value.distributionLevel, ":", lotSize, "*", pipAmount, "=", commissionAmount);

        levelCommissions.push({
          level: value.distributionLevel,
          pipAmount: pipAmount,
          commissionAmount: commissionAmount,
        });

        totalCommission += commissionAmount;
      }
    }

    console.log('Final Pips calculation result:', {
      levelCommissions,
      totalCommission,
    });

    return {
      trade: {
        symbol: deal.Symbol,
        volume: deal.Volume,
        lotSize: lotSize,
      },
      calculationType: 'Pips',
      partnerLevel: partnerLevel,
      levelCommissions: levelCommissions,
      totalCommission: totalCommission,
    };
  }

  private calculateUsdPerLotCommission(
    distributionValuesObj: any,
    partnerLevel: number,
    deal: MT5DealData,
  ) {
    console.log('Calculating commission based on USD Per Lot');

    // lot size Formula
    // lotSize = volume / contract size / (10000 / contract size)
    const lotSize =
      deal.Volume / deal.ContractSize / (10000 / deal.ContractSize);

    // Make sure distributionValues is properly treated as an array
    const distributionValues = Array.isArray(distributionValuesObj)
      ? distributionValuesObj
      : [distributionValuesObj];

    // Calculate commissions for each level up to the partner's level
    const levelCommissions: Array<{
      level: number;
      lotAmount: number;
      commissionAmount: number;
    }> = [];
    let totalCommission = 0;

    for (const value of distributionValues) {
      if (value.distributionLevel <= partnerLevel) {
        // const pipAmount = parseFloat(value.distributionAmount);
        const lotAmount = value.distributionAmount;
        const commissionAmount = lotSize * lotAmount;

        console.log(
          'Commission calculation for level',
          value.distributionLevel,
          ':',
          lotSize,
          '*',
          lotAmount,
          '=',
          commissionAmount,
        );

        levelCommissions.push({
          level: value.distributionLevel,
          lotAmount: lotAmount,
          commissionAmount: commissionAmount,
        });

        totalCommission += commissionAmount;
      }
    }

    console.log('Final USD Per Lot calculation result:', {
      levelCommissions,
      totalCommission,
    });

    return {
      trade: {
        symbol: deal.Symbol,
        volume: deal.Volume,
        lotSize: lotSize,
      },
      calculationType: 'USD Per Lot',
      partnerLevel: partnerLevel,
      levelCommissions: levelCommissions,
      totalCommission: totalCommission,
    };
  }

  private calculateCTPercentsCommission(
    distributionValuesObj: any,
    partnerLevel: number,
    deal: MT5DealData,
  ) {
    console.log('Calculating commission based on CT Percents');

    // Implementation for CT Percents calculation
    return {
      message: 'CT Percents calculation not implemented yet',
    };
  }

  transformDealDataTypes(data: Record<string, any>): Record<string, any> {
    const result = { ...data };

    // Convert timestamps to Date objects
    if (result.time) {
      result.time = new Date(result.time * 1000); // Convert seconds to milliseconds
    }

    if (result.timeMsc) {
      result.timeMsc = new Date(result.timeMsc); // Already milliseconds
    }

    // Generate timestamp from time
    if (result.time) {
      result.timestamp = result.time.getTime().toString();
    }

    // Fix field naming inconsistencies
    if (result.modificationFlags !== undefined) {
      result.modifyFlags = result.modificationFlags;
      delete result.modificationFlags;
    }

    // Fix SL/TP casing
    if (result.priceSL !== undefined) {
      result.priceSl = result.priceSL;
      delete result.priceSL;
    }

    if (result.priceTP !== undefined) {
      result.priceTp = result.priceTP;
      delete result.priceTP;
    }

    // Remove fields not in the entity schema and fields that will be set through relations
    const fieldsToRemove = ['print', 'login'];
    fieldsToRemove.forEach((field) => {
      if (result[field] !== undefined) {
        delete result[field];
      }
    });

    return result;
  }

  async getIbHierarchyByPartnerId(partnerId: number): Promise<IbHierarchyNode | null> {
    const parentChain: Partner[] = [];
    let current = await this.partnerRepository.findOne({ where: { id: partnerId } });
    if (!current) return null;
    while (current) {
      parentChain.push(current);
      if (!current.masterIbId) break;
      current = await this.partnerRepository.findOne({ where: { id: current.masterIbId } });
    }
    parentChain.reverse();

    let rootNode: IbHierarchyNode | null = null;
    let lastNode: IbHierarchyNode | null = null;
    for (const partner of parentChain) {
      const login = await this.getPartnerMt5Login(partner.id);
      const clients = await this.getPartnerClientsCount(partner.id);
      const node: IbHierarchyNode = {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        login,
        clients,
        children: [],
      };
      if (!rootNode) {
        rootNode = node;
      } else if (lastNode) {
        lastNode.children = [node];
      }
      lastNode = node;
    }
    if (lastNode) {
      lastNode.children = await this.buildIbChildrenHierarchy(lastNode.id);
    }
    return rootNode;
  }

  private async buildIbChildrenHierarchy(partnerId: number): Promise<IbHierarchyNode[]> {
    const children = await this.partnerRepository.find({ where: { masterIbId: partnerId } });
    const nodes: IbHierarchyNode[] = [];
    for (const child of children) {
      const login = await this.getPartnerMt5Login(child.id);
      const clients = await this.getPartnerClientsCount(child.id);
      const node: IbHierarchyNode = {
        id: child.id,
        name: child.name,
        email: child.email,
        login,
        clients,
        children: await this.buildIbChildrenHierarchy(child.id),
      };
      nodes.push(node);
    }
    return nodes;
  }

  private async getPartnerMt5Login(partnerId: number): Promise<string | undefined> {
    const user = await this.userRepository.findOne({ where: { partnerId: partnerId } });
    const mt5 = user ? await this.mt5AccountRepository.findOne({ where: { user: { id: user?.id } } }) : null;
    return mt5?.login;
  }

  private async getPartnerClientsCount(partnerId: number): Promise<number> {
    return this.clientRepository
      .createQueryBuilder('client')
      .leftJoin('client.user', 'user')
      .leftJoin('user.mt5Account', 'mt5Account')
      .where('client.affid = :partnerId', { partnerId })
      .andWhere('mt5Account.id IS NOT NULL')
      .getCount();
  }

  private getPipConversionFactor(length: number) {
    // if (typeof price !== 'number') return 0;

    // const decimalPart = price.toString().split('.')[1] || '';

    // // Remove all zeroes from decimal part
    // // const nonZeroDigits = decimalPart.replace(/0/g, '');

    // const len = decimalPart.length;

    switch (length) {
      case 1: return 0.1;
      case 2: return 0.01;
      case 3: return 0.001;
      case 4: return 0.0001;
      case 5: return 0.00001;
      case 6: return 0.000001;
      default: return 1;
    }
  }

}
