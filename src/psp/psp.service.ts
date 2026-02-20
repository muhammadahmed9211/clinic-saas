import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { PspRepository } from 'src/transaction/repositories/psp.repository';
import { CreatePspDto, PspTypes } from './dto/create-psp.dto';
import {
  AggregatorNames,
  AggregatorPSP,
} from 'src/aggregator/entities/aggregator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  In,
  Repository,
} from 'typeorm';
import { FeeType, UpdatePSPDto } from './dto/update-psp.dto';
import { PSP, PspNames, RestrictionType } from 'src/transaction/entities/psp.entity';
import { PspRegulations } from 'src/transaction/entities/psp-regulations.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import {
  ActiveLogService,
  ActivityFields,
} from 'src/admin/active-log/active-log.service';
import { entityType } from 'src/admin/active-log/active-log.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { Exchange } from 'src/transaction/entities/exchange.entity';
import { BankAccount } from 'src/admin/bank-account/entities/bank-account.entity';
import { Countries } from './entities/countries.entity';
import { PspCountries } from './entities/psp-countries.entity';
import { PspMethod } from './entities/psp-method.entity';
import { TransactionAttempts } from './entities/transaction-attempts.entity';
import { PspCountriesPriority } from './entities/psp-countries-priority.entity';
import { RedisCoreService } from 'src/redis/redis.service';
import { SinglePaymentMethod } from 'src/transaction/dto/create-transaction.dto';
import {
  Methods,
  SinglePaymentMethodWrapper,
  TransactionMethod,
} from 'src/transaction/entities/transaction-method.entity';
import { AggregatorRegulations } from 'src/aggregator/entities/aggregator-regulations.entity';

interface EligiblePspInfo {
  countryId: number;
  regulationId: number;
  methodId: number;
  amount: number;
}

interface GetEligiblePsp {
  country: string;
  regulationId: number;
  single_payment_method: SinglePaymentMethod;
  amount: number;
}
@Injectable()
export class PspService {
  constructor(
    private readonly pspRepository: PspRepository,
    @InjectRepository(AggregatorPSP)
    private readonly aggregatorPspRepository: Repository<AggregatorPSP>,
    @InjectRepository(PspRegulations)
    private readonly pspRegulationsRepository: Repository<PspRegulations>,
    @InjectRepository(Regulations)
    private readonly regulationsRepository: Repository<Regulations>,
    @InjectRepository(TransactionAttempts)
    private readonly transactionAttemptsRepository: Repository<TransactionAttempts>,
    @InjectRepository(PspCountriesPriority)
    private readonly pspCountriesPriorityRepository: Repository<PspCountriesPriority>,
    @InjectRepository(TransactionMethod)
    private readonly transactionMethodRepository: Repository<TransactionMethod>,
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,
    private readonly activityLogsService: ActiveLogService,
    private readonly redisService: RedisCoreService,
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(AggregatorRegulations)
    private readonly aggregatorRegulationsRepository: Repository<AggregatorRegulations>,
    @InjectRepository(PspMethod)
    private readonly pspMethodRepository: Repository<PspMethod>,
  ) {}

  async createExchangeOrBankPsp(
    name: string,
    userId: number,
    exchangeOrBankAccountId: number,
    type: 'Bank' | 'Exchange',
  ) {
    
    const aggregator = await this.aggregatorPspRepository.findOneBy({
      name: AggregatorNames.LOCAL_GATEWAY,
    });

    if (!aggregator) {
      throw new BadRequestException('Company Aggregator Not Found');
    }
    const psp = await this.create(
      {
        aggregatorId: aggregator.id,
        name,
        clientDepositFee: 0,
        clientWithdrawalFee: 0,
        depositCommission: 0,
        depositFee: 0,
        depositLimit: 0,
        rollover: 0,
        withdrawalCommission: 0,
        withdrawalFee: 0,
        withdrawalLimit: 0,
        clientDepositFeeType: FeeType.AMOUNT,
        depositCommissionType: FeeType.AMOUNT,
        clientWithdrawalFeeType: FeeType.AMOUNT,
        depositFeeType: FeeType.AMOUNT,
        withdrawalCommissionType: FeeType.AMOUNT,
        withdrawalFeeType: FeeType.AMOUNT,
        type: type == 'Bank' ? PspTypes.BANK : PspTypes.Exchange,
        depositMinLimit: 1,
        depositMaxLimit: 1000000,
        isRegulationRestricted: false,
        regulationRestrictionType: RestrictionType.Exclude,
        methodsId: [],
        regulationsId: [],
      },
      userId,
      exchangeOrBankAccountId,
      type,
    );
    return psp;
  }

  async updateExchangeOrBankPsp(
    name: string,
    exchangeOrBankAccountId: number,
    type: 'Bank' | 'Exchange',
  ) {
    const where: FindOptionsWhere<PSP> = {};
    if (type === 'Bank') {
      where.bankAccount = {
        id: exchangeOrBankAccountId,
      };
    } else if (type === 'Exchange') {
      where.exchange = {
        id: exchangeOrBankAccountId,
      };
    }
    const allPSP = await this.pspRepository.find({
      where: where,
    });
    const update = this.pspRepository.update(
      allPSP.map((p) => p.id),
      {
        name,
      },
    );

    return update;
  }

  async create(
    createPspDto: CreatePspDto,
    userId: User['id'],
    exchangeOrBankAccountId?: number,
    type?: 'Bank' | 'Exchange',
  ) {
    const { aggregatorId, name, methodsId, ...rest } = createPspDto;
    const aggregator = await this.aggregatorPspRepository.findOneBy({
      id: aggregatorId,
    });
    if (!aggregator) {
      throw new BadRequestException('Aggregator not found');
    }
    const data = this.pspRepository.create({
      ...rest,
      name,
      displayName: name,
      description: name,
      isActive: true,
      aggregator: {
        id: aggregator.id,
      },
      aggregatorName: aggregator.displayName,
      user: {
        id: userId,
      },
      type:createPspDto.type ? createPspDto.type : PspTypes.ALL,
      depositLimit:createPspDto.depositLimit || 0,
    });
    if (data && exchangeOrBankAccountId) {
      if (type === 'Bank') {
        const bankAccount = new BankAccount();
        bankAccount.id = exchangeOrBankAccountId;
        data.bankAccount = bankAccount;
      } else if (type === 'Exchange') {
        const exchange = new Exchange();
        exchange.id = exchangeOrBankAccountId;
        data.exchange = exchange;
      }
    }
    const entity = await this.pspRepository.save(data);

    if (createPspDto?.regulationsId) {
      const isRegulationsExist = await this.regulationsRepository.count({
        where: { id: In(createPspDto.regulationsId) },
      });

      if (isRegulationsExist !== createPspDto.regulationsId.length) {
        throw new BadRequestException('Regulations Id doest not exists');
      }
    }

    if (createPspDto?.regulationsId) {
      const regulations = createPspDto.regulationsId.map((reg) => {
        return this.pspRegulationsRepository.create({
          regulation: {
            id: reg,
          },
          psp: {
            id: entity.id,
          },
        });
      });
      await this.pspRegulationsRepository.save(regulations);
    }

    const psp = await this.pspRepository.findOne({
      where: {
        id: entity.id,
      },
      relations: {
        aggregator: true,
        regulations: {
          regulation: true,
        },
      },
    });
    if (psp) {
      const regulations = psp?.regulations.map((r) => {
        if (!r.regulation) {
          return {
            ...r,
          };
        }
        const regulation = {
          id: r.regulation.id,
          name: r.regulation.name,
        };
        return {
          ...r,
          regulation,
        };
      });
      //@ts-expect-error type-error
      psp.regulations = regulations;
    }
    const transactionMethods = await this.transactionMethodRepository.find({
      where: {
        id: In(methodsId),
      },
    });

    if (transactionMethods.length !== methodsId.length) {
      throw new BadRequestException('Give methods are invalid');
    }

    const methods: PspMethod[] = [];
    if (psp) {
      transactionMethods.forEach((method) => {
        const methodsData = this.pspMethodRepository.create({
          method: {
            id: method.id,
          },
          psp: {
            id: psp.id,
          },
        });
        methods.push(methodsData);
      });
      if (methods.length) {
        const pspMethods = await this.pspMethodRepository.save(methods);
        psp.methods = pspMethods;
      }
    }

    this.activityLogsService.emitLog({
      entityId: entity.id,
      entityType: entityType.PSP,
      field: ActivityFields.RECORD_CREATED,
      newData: psp,
      oldData: null,
      performerId: userId,
    });

    return entity;
  }
  async getOne(pspId:number){
  const psp = await this.pspRepository.findOne({
      where: {
        id: pspId,
      },
      relations: {
        aggregator: true,
        regulations: {
          regulation: true,
        },
        methods:{
          method:true,
        },
      },
    });
    return psp;
  }

  async getMethods(){
    const psp = await this.transactionMethodRepository.find();
    return psp;
  }


  findAll(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    userId: number,
  ) {
    const filters: FilterItem[] = [
      { name: 'isActive', operation: FilterOperation.EQUALS, value: [true] },
    ];
    return this.pspRepository.advanceFilters({
      limit,
      page,
      listName: ListNames.PSP,
      relations: ['user', 'regulations', 'regulations.regulation'],
      filterList: body.filters,
      sortList: body.sort,
      filters,
      userId,
      defaultSortKey: 'createdAt',
      listViewId: body.listViewId,
    });
  }

  async update(id: PSP['id'], updatePSPDto: UpdatePSPDto, userId: User['id']) {
    const { name, methodsId = null, ...rest } = updatePSPDto;
    const isExist = await this.pspRepository.findOne({
      where: { id },
      relations: ['user', 'regulations', 'regulations.regulation'],
    });

    if (!isExist) {
      throw new BadRequestException('PSP not found');
    }
    if (isExist.user && isExist.user.id !== userId) {
      throw new BadRequestException('PSP is created by different user');
    }
    const data = this.pspRepository.create({
      id,
      displayName: name,
      ...rest,
    });

    if (updatePSPDto?.regulationsId) {
      const isRegulationsExist = await this.regulationsRepository.count({
        where: { id: In(updatePSPDto.regulationsId) },
      });

      if (isRegulationsExist !== updatePSPDto.regulationsId.length) {
        throw new BadRequestException('Regulations Id doest not exists');
      }
    }

    if (updatePSPDto?.aggregatorId) {
      const aggregator = await this.aggregatorPspRepository.findOneBy({
        id: updatePSPDto.aggregatorId,
      });

      if (!aggregator) {
        throw new BadRequestException('Aggregator not found');
      }

      if (aggregator) {
        data.aggregator = aggregator;
        data.aggregatorName = aggregator.displayName;
      }
    }

    const allRegulations = {};
    const pspRegulation: PspRegulations['id'][] = [];
    isExist.regulations.forEach((r) => {
      const regulationId = r?.regulation?.id;
      if (regulationId) {
        allRegulations[regulationId] = true;
      } else {
        pspRegulation.push(r.id);
      }
    });
    const regulations: PspRegulations[] = [];

    if (updatePSPDto.regulationsId) {
      updatePSPDto.regulationsId.forEach((reg) => {
        // if regulations does not exist then add
        if (!allRegulations[reg]) {
          const regulation = this.pspRegulationsRepository.create({
            regulation: {
              id: reg,
            },
            psp: {
              id: isExist.id,
            },
          });
          regulations.push(regulation);
        } else {
          delete allRegulations[reg];
        }
      });
    }
    await this.pspRegulationsRepository.delete({
      psp: { id: isExist.id },
      regulation: {
        id: In(Object.keys(allRegulations)),
      },
    });
    await this.pspRegulationsRepository.delete({
      id: In(pspRegulation),
    });
    await this.pspRegulationsRepository.save(regulations);
    const entity = await this.pspRepository.save(data);

    const psp = await this.pspRepository.findOne({
      where: {
        id: entity.id,
      },
      relations: {
        aggregator: true,
        regulations: {
          regulation: true,
        },
      },
    });

    //@ts-expect-error ts-error
    delete isExist.user;

    if (psp) {
      const regulations = psp?.regulations.map((r) => {
        if (!r.regulation) {
          return {
            ...r,
          };
        }
        const regulation = {
          id: r.regulation.id,
          name: r.regulation.name,
        };
        return {
          ...r,
          regulation,
        };
      });
      //@ts-expect-error type-error
      psp.regulations = regulations;
    }
    if (methodsId && psp) {
      if (methodsId.length) {
        const transactionMethods = await this.transactionMethodRepository.find({
          where: {
            id: In(methodsId),
          },
        });

        if (transactionMethods.length !== methodsId.length) {
          throw new BadRequestException('Give methods are invalid');
        }
      }

      const oldMethods = await this.pspMethodRepository.find({
        where: {
          psp: {
            id: psp.id,
          },
        },
        relations:{
          method:true
        }
      });

      const methodsMaps = new Map<number, boolean>();

      oldMethods.forEach((o)=>{
        methodsMaps.set(o.method.id , true);
      });

      const newMethods:PspMethod[] = [];
      const deletedMethods:number[] = [];

      const newMethodsMaps = new Map<number, boolean>();

      methodsId.forEach((m)=>{
        if(!methodsMaps.get(m)){
          newMethods.push(this.pspMethodRepository.create({
            method:{
              id:m
            },
            psp:{
              id:psp.id
            }
          }))
        }
        newMethodsMaps.set(m , true)
      });

      oldMethods.forEach((o)=>{
        const methodId = o.method.id;
        if(!newMethodsMaps.get(methodId)){
          deletedMethods.push(o.id)
        }
      });

      if(deletedMethods.length){
        await this.pspMethodRepository.delete(deletedMethods);
      }

      if (newMethods.length) {
        await this.pspMethodRepository.save(newMethods);
      }

      const pspTransactionMethods = await this.pspMethodRepository.find({
        where: {
          psp: {
            id: psp.id,
          },
        },
        relations:{
          method:true
        }
      });

      psp.methods = pspTransactionMethods;
    }

    this.activityLogsService.emitLog({
      entityId: entity.id,
      entityType: entityType.PSP,
      field: ActivityFields.DETAILS_UPDATED,
      newData: psp,
      oldData: isExist,
      performerId: userId,
    });
    return entity;
  }

  async remove(id: number, userId: User['id']) {
    const isExist = await this.pspRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!isExist) {
      throw new BadRequestException('PSP not found');
    }
    if (isExist.user && isExist.user.id !== userId) {
      throw new BadRequestException('PSP is created by different user');
    }

    //@ts-expect-error ts-error
    delete isExist.user;

    this.activityLogsService.emitLog({
      entityId: isExist.id,
      entityType: entityType.PSP,
      field: ActivityFields.RECORD_DELETED,
      newData: null,
      oldData: isExist,
      performerId: userId,
    });
    const { affected } = await this.pspRepository.softDelete(isExist.id);
    return { isDeleted: affected === 1 };
  }

  private isCountryEligible(
    psp: PSP,
    countryId: number,
    countries: PspCountries[],
  ): boolean {
    if (!psp.isCountryRestricted) {
      return true;
    }

    const isExist = countries.some(
      (country) => country.country.id === countryId,
    );
    if (psp.countryRestrictionType === RestrictionType.Include) {
      return isExist;
    } else {
      return !isExist;
    }
  }

  private isRegulationEligible(
    psp: PSP,
    regulationId: number,
    regulations: PspRegulations[],
  ): boolean {
    if (!psp.isRegulationRestricted) {
      return true;
    }

    const isExist = regulations.some(
      (regulation) => regulation.regulation.id === regulationId,
    );
    if (psp.regulationRestrictionType === RestrictionType.Include) {
      return isExist;
    } else {
      return !isExist;
    }
  }

  private isMethodEligible(methodId: number, methods: PspMethod[]): boolean {
    const isExist = methods.some((method) => method.method.id === methodId);
    return isExist;
  }

  private isAmountInRange(psp: PSP, amount: number): boolean {
    return amount >= psp.minDeposit && amount <= psp.maxDeposit;
  }

  async getAllPsp(): Promise<{ psp: PSP[]; isRedisRefresh: boolean }> {
    const key = 'PSP';
    const data = (await this.redisService.get({ key })) as string;
    if (!data) {
      const relations: FindOptionsRelations<PSP> = {
        countries: {
          country: true,
        },
        regulations: {
          regulation: true,
        },
        methods: {
          method: true,
        },
      };
      const where: FindOptionsWhere<PSP> = {
        isActive: true,
        isOperational: true,
      };
      const value = await this.pspRepository.find({
        where,
        relations,
      });
      await this.redisService.set({
        key,
        value: JSON.stringify(value),
      });
      return { psp: value, isRedisRefresh: true };
    }

    return { psp: JSON.parse(data), isRedisRefresh: !data };
  }

  async sortPspByCountryPriority(psp: PSP[], countryId: number) {
    const pspIds = psp.map((p) => p.id);
    const priorities = await this.pspCountriesPriorityRepository.find({
      where: {
        pspId: In(pspIds),
        countryId,
      },
    });

    const priority = new Map<number, number>();
    priorities.forEach((cp) => {
      priority.set(cp.pspId, cp.priority);
    });

    const eligiblePsp = psp.sort((a, b) => {
      const priorityA = priority.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const priorityB = priority.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return priorityA - priorityB;
    });

    return eligiblePsp;
  }

  async getEligiblePsp(info: EligiblePspInfo) {
    const { countryId, regulationId, methodId, amount } = info;
    const { psp, isRedisRefresh } = await this.getAllPsp();

    const key = `COUNTRY:${countryId}:REGULATION:${regulationId}:METHOD:${methodId}`;
    const data = (await this.redisService.get({ key })) as string;
    let allPsp: PSP[] = [];

    if (!data || isRedisRefresh) {
      const eligiblePsp = psp.filter((p: PSP) => {
        const isCountryEligible = this.isCountryEligible(
          p,
          countryId,
          p.countries,
        );
        const isRegulationEligible = this.isRegulationEligible(
          p,
          regulationId,
          p.regulations,
        );
        const isMethodEligible = this.isMethodEligible(methodId, p.methods);
        return isCountryEligible && isRegulationEligible && isMethodEligible;
      });

      const sortedPsp = await this.sortPspByCountryPriority(
        eligiblePsp,
        countryId,
      );
      await this.redisService.set({
        key,
        value: JSON.stringify(sortedPsp),
      });
      allPsp = sortedPsp;
    } else {
      allPsp = JSON.parse(data);
    }

    const allowedPsp = allPsp.filter((p: PSP) => {
      return this.isAmountInRange(p, amount);
    });

    return allowedPsp;
  }

  async filterPsp(psp: PSP[], userId: number) {
    const pspIds = psp.map((psp) => psp.id);
    const failedAttempts = await this.transactionAttemptsRepository.find({
      where: {
        userId,
        isError: true,
        pspId: In(pspIds),
      },
      order: { createdAt: 'ASC' },
    });

    const failedPspIds = new Set(
      failedAttempts.map((attempt) => attempt.pspId),
    );

    const availablePsp = psp.filter((p) => !failedPspIds.has(p.id));

    if (availablePsp.length === 0) {
      const oldestFailedPspId = failedAttempts[0].pspId;
      const oldestPsp: PSP[] = [];
      const isOldestExist = psp.find((psp) => psp.id === oldestFailedPspId);
      if (isOldestExist) {
        oldestPsp.push(isOldestExist);
      }
      return oldestPsp;
    }

    return availablePsp;
  }

  async getPspForUser(info: GetEligiblePsp, userId: number) {
    const { single_payment_method, country, amount, regulationId } = info;

    const transactionMethod = SinglePaymentMethodWrapper[single_payment_method];
    if (!transactionMethod) {
      throw new BadRequestException('Transaction Method not found');
    }

    const method = await this.transactionMethodRepository.findOne({
      where: {
        method: transactionMethod,
      },
    });
    if (!method) {
      throw new BadRequestException('Method not found');
    }

    if (method.method === Methods.CRYPTO) {
      const localGateway = await this.aggregatorPspRepository.findOne({
        where: {
          name: AggregatorNames.LOCAL_GATEWAY,
        },
      });
      if (localGateway) {
        const alphaPay = await this.pspRepository.findOne({
          where: {
            name: PspNames.AlphaPay,
          },
        });
        
        if (alphaPay) {
          localGateway.psp = [alphaPay]
          return [localGateway];
        }
      }
      throw new BadRequestException('PSP not found');
    }

    const userCountry = await this.countriesRepository.findOne({
      where: {
        iso: country,
      },
    });
    if (!userCountry) {
      throw new BadRequestException('Country not found');
    }

    const allowedAggregators = await this.aggregatorRegulationsRepository.find({
      where: {
        regulation: {
          id: regulationId,
        },
      },
      relations: {
        aggregator: true,
      },
      order: {
        priority: 'ASC',
      },
    });

    const localGateway = allowedAggregators.findIndex(
      (a) => a.aggregator.name === AggregatorNames.LOCAL_GATEWAY,
    );

    const localPSP: PSP[] = [];

    if (localGateway !== -1) {
      let priority = await this.pspCountriesPriorityRepository.find({
        where: {
          countryId: userCountry.id,
        },
        relations: {
          psp: {
            regulations: {
              regulation: true,
            },
            methods: {
              method: true,
            },
          },
        },
        order: {
          priority: 'ASC',
        },
      });
      if (!priority.length) {
        priority = await this.pspCountriesPriorityRepository.find({
          where: {
            country: {
              name: 'Any',
            },
          },
          relations: {
            psp: {
              regulations: {
                regulation: true,
              },
              methods: {
                method: true,
              },
            },
          },
          order: {
            priority: 'ASC',
          },
        });
      }
      const psp: PSP[] = priority.map((p) => p.psp);

      const eligiblePsp = psp.filter((p: PSP) => {
        const isAmountInRange = this.isAmountInRange(p, amount);
        const isRegulationEligible = this.isRegulationEligible(
          p,
          regulationId,
          p.regulations,
        );
        const isMethodEligible = this.isMethodEligible(method.id, p.methods);
        return isRegulationEligible && isMethodEligible && isAmountInRange;
      });

      if (eligiblePsp.length) {
        const failedAttempts = await this.transactionAttemptsRepository
          .createQueryBuilder('ta')
          .select('ta.pspId', 'pspId')
          .addSelect('MAX(ta.createdAt)', 'lastFailedAt')
          .where('ta.userId = :userId', { userId })
          .andWhere('ta.isError = 1')
          .andWhere('ta.pspId IN (:...pspIds)', {
            pspIds: eligiblePsp.map((p) => p.id),
          })
          .groupBy('ta.pspId')
          .getRawMany();

        const failedMap = new Map<number, Date>();
        for (const f of failedAttempts) {
          failedMap.set(f.pspId, new Date(f.lastFailedAt));
        }

        const neverFailed: PSP[] = [];
        const failed: PSP[] = [];

        for (let i = 0; i < eligiblePsp.length; i++) {
          const element = eligiblePsp[i];
          const isFailed = failedMap.has(element.id);
          if (isFailed) {
            failed.push(element);
          } else {
            neverFailed.push(element);
          }
        }

        const failedSorted = failed.sort((a, b) => {
          const aTime = failedMap.get(a.id)?.getTime() ?? 0;
          const bTime = failedMap.get(b.id)?.getTime() ?? 0;
          return aTime - bTime;
        });

        for (let i = 0; i < neverFailed.length; i++) {
          const psp = neverFailed[i];
          localPSP.push(psp);
        }

        for (let i = 0; i < failedSorted.length; i++) {
          const psp = failedSorted[i];
          localPSP.push(psp);
        }
      }
    }

    if (
      allowedAggregators[localGateway] &&
      allowedAggregators[localGateway].aggregator
    ) {
      allowedAggregators[localGateway].aggregator.psp = localPSP;
    }

    return allowedAggregators.map((a) => a.aggregator);
  }

  async addAttempt(dto: {
    pspId?: number;
    requestPayload: string;
    responsePayload: string;
    errorMessage?: string;
    userId: number;
    isError: boolean;
    aggregator?: AggregatorPSP;
  }) {
    try {
      const { aggregator, ...data } = dto;
      if (!data.pspId && aggregator) {
        const psp = await this.pspRepository.findOne({
          where: { aggregator: { id: aggregator.id } },
        });
        if (!psp) {
          return;
        }
        data.pspId = psp.id;
      }

      if (!data.pspId) {
        return;
      }
      await this.transactionAttemptsRepository.save(
        this.transactionAttemptsRepository.create(data),
      );
    } catch (error) {
      console.log('ERROR Adding transaction attempt', error);
    }
  }
}
