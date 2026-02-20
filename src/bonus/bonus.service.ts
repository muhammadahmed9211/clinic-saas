import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, FindOptionsWhere, In, IsNull, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Bonus } from './entities/bonus.entity';
import { BonusReward } from 'src/transaction/entities/bonus-reward.entity';
import { ResponseWrapper } from 'src/utils/interface/mt5/base-response.interface';
import { User } from 'src/users/entities/user.entity';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { ActivityFields } from 'src/admin/active-log/active-log.service';
import { entityType } from 'src/admin/active-log/active-log.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { BonusRepository } from './repositories/bonus.repostitory';
import { Client } from 'src/users/entities/client.entity';
import { DepositType, AccountClassification } from './enum/bonus.enum';
import { Currencies } from 'src/currencies/entities/currencies.entity';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { Countries } from 'src/psp/entities/countries.entity';
import { BonusCountries } from './entities/bonus-countries.entity';
import { Methods } from 'src/transaction/entities/transaction-method.entity';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { BankAccountService } from 'src/admin/bank-account/bank-account.service';

interface IValidateBonus {
  bonusCode: string;
  amount: number;
}

@Injectable()
export class BonusService {
  constructor(
    private readonly bonusRepository: BonusRepository,
    @InjectRepository(BonusReward)
    private readonly bonusRewardRepository: Repository<BonusReward>,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Currencies)
    private readonly currenciesRepository: Repository<Currencies>,
    private readonly configService:ConfigService<AllConfigType>,
    private readonly dataSource: DataSource,
    private readonly bankAccountService: BankAccountService
  ) {}

async getBonusList(userId: number, method?:string) {
  const client = await this.clientRepository.findOne({
    where: { userId },
    relations:{
      regulation:true,
      commissionProfile:{
        classification:true
      }
    }
  });
  if (!client || !client.regulation) {
    throw new NotFoundException('Client not found');
  }

  const accountType: AccountClassification = (client?.commissionProfile?.classification?.name as AccountClassification) ?? AccountClassification.STANDARD;
  const hasFTD = client.FTD || false;

  const allowedDepositTypes = hasFTD
    ? [DepositType.RTD, DepositType.GENERAL]
    : [DepositType.FTD, DepositType.GENERAL];

  let userCountryId: number | null = null;
  let currencyIso : string = "USD";
  const billingInfo = await this.dataSource.getRepository(BillingInformation).findOne({
      where: { user: { id: userId } }
    });
  if (billingInfo?.country) {
    const userCountry = await this.dataSource.getRepository(Countries).findOne({
        where: { iso: billingInfo.country },
        relations:{
          currency:true
        }
      });
    userCountryId = userCountry?.id || null;
    currencyIso = userCountry?.currency?.iso || "USD";
  }

    const depositMinValue = this.configService.getOrThrow(
      'app.depositMinValue',
      {
        infer: true,
      },
    );

    let depositMaxValue = this.configService.getOrThrow(
      'app.depositMaxValue',
      {
        infer: true,
      },
    );

  const paymentMethod = {
    'crypto': Methods.CRYPTO,
    'credit-card': Methods.CREDIT_CARD,
    'e-wallets': Methods.E_WALLET,
  }
  const currentMethod = method ? paymentMethod[method] : null;

  if (currentMethod === Methods.CRYPTO) {
      depositMaxValue = this.configService.getOrThrow(
        'app.cryptoMaxDepositValue',
        {
          infer: true,
        },
      );
  }

  const qb = this.bonusRepository
    .createQueryBuilder('bonus')
    .leftJoinAndSelect('bonus.title', 'title')
    .leftJoinAndSelect('bonus.description', 'description')
    .leftJoinAndSelect('bonus.bonusCountries', 'bonusCountries')
    .leftJoinAndSelect('bonusCountries.country', 'country')
    .leftJoinAndSelect('bonus.currency', 'currency')
    .where('bonus.isActive = 1')
    .andWhere('bonus.depositType IN (:...depositTypes)', {
      depositTypes: allowedDepositTypes,
    })
    .andWhere('bonus.accountClassification = :accountType', {
      accountType,
    }).andWhere('currency.iso = :currencyIso', {
      currencyIso,
    });

  if (userCountryId) {
    qb.andWhere(
      '(bonusCountries.countryId = :countryId OR bonusCountries.countryId IS NULL)',
      { countryId: userCountryId },
    );
  } else {
    qb.andWhere('bonusCountries.countryId IS NULL');
  }

  const filterMethods = [Methods.CREDIT_CARD, Methods.E_WALLET, Methods.CRYPTO];

  if (filterMethods.includes(currentMethod)) {
    qb.andWhere(
      '(bonus.minimumAmount / COALESCE(currency.conversionRate, 1)) BETWEEN :min AND :max',
      {
        min: depositMinValue,
        max: depositMaxValue,
      },
    );
  } else {
    qb.andWhere(
      '(bonus.minimumAmount / COALESCE(currency.conversionRate, 1)) >= :min',
      { min: 1 },
    );
  }

  qb.orderBy('bonus.depositType', 'DESC').addOrderBy(
    'bonus.createdAt',
    'DESC',
  );

  const bonuses = await qb.getMany();

  const titleIds = bonuses.map((b) => b.title?.id).filter(Boolean);
  const descriptionIds = bonuses.map((b) => b.description?.id).filter(Boolean);
  const labelIds = Array.from(new Set([...titleIds, ...descriptionIds]));

  const translations = await this.labelTranslationRepository.find({
    where: {
      label: { id: In(labelIds) },
    },
  });

  const translationMap = new Map<number, { en?: string; ar?: string }>();
  for (const tr of translations) {
    const labelId = tr.label.id;
    if (!translationMap.has(labelId)) {
      translationMap.set(labelId, {});
    }
    if (tr.langCode === 'en') {
      translationMap.get(labelId)!.en = tr.text;
    } else if (tr.langCode === 'ar') {
      translationMap.get(labelId)!.ar = tr.text;
    }
  }

  const enrichedBonuses = bonuses.map((bonus) => ({
    ...bonus,
    titleEn: translationMap.get(bonus.title?.id)?.en ?? null,
    titleAr: translationMap.get(bonus.title?.id)?.ar ?? null,
    descriptionEn: translationMap.get(bonus.description?.id)?.en ?? null,
    descriptionAr: translationMap.get(bonus.description?.id)?.ar ?? null,
    countries: bonus.bonusCountries?.map(bc => ({
        id: bc.country.id,
        name: bc.country.name,
        nameAr: bc.country.nameAr,
        iso: bc.country.iso
      })) ?? []
  }));

  const grouped = enrichedBonuses.reduce((acc, bonus) => {
    const depositType = bonus.depositType || 'Uncategorized';
    if (!acc[depositType]) {
      acc[depositType] = {
        depositType,
        bonuses: [],
      };
    }
    acc[depositType].bonuses.push(bonus);
    return acc;
  }, {} as Record<string, any>);

  return ResponseWrapper.wrap({
    status: 0,
    statusCode: 200,
    statusText: 'Bonus list fetched successfully',
    data: Object.values(grouped),
  });
}


  async validate(user: User, dto: IValidateBonus) {
    const resp = await this.validateBonusCode(user, dto);
    if (resp.statusCode === 200 && resp.result.id) {
      return resp.result;
    }
    throw new BadRequestException(resp.message);
  }

  async validateAmount(user: User, dto: IValidateBonus) {
    const resp = await this.validateBonusAmount(user, dto);
    if (resp.statusCode === 200 && resp.result.id) {
      return resp.result;
    }
    throw new BadRequestException(resp.message);
  }

 async validateBonusCode(user: User, dto: IValidateBonus) {
  let { bonusCode, amount } = dto;
  const bonus = await this.bonusRepository.findOne({
    where: { bonusCode, isActive: true },
    relations:{
      bonusCountries:{
        country:true
      }
    }
  });
  if (!bonus) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 404,
      statusText: 'Invalid or inactive bonus code',
      data: null,
    });
  }
  amount = Number(Number(amount * bonus.currency.conversionRate).toFixed(2));

  // 1. Validate start and end date
  const now = new Date();
  if (
    (bonus.startDateTime && now < bonus.startDateTime) ||
    (bonus.endDateTime && now > bonus.endDateTime)
  ) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 400,
      statusText: 'Bonus code is inactive',
      data: null,
    });
  }

  // 2. Validate amount
  if (amount < bonus.minimumAmount) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 400,
      statusText: `Amount must be at least ${bonus.minimumAmount} to use this bonus`,
      data: null,
    });
  }

   // ✅ 3. Validate deposit type eligibility
   const client = await this.clientRepository.findOne({
     where: { userId: user.id },
     relations: {
      regulation:true,
       commissionProfile: {
         classification: true
       }
     }
   });
   if (!client) {
     return ResponseWrapper.wrap({
       status: 1,
       statusCode: 404,
       statusText: 'Client not found',
       data: null,
     });
   }

  const localMethods = await this.bankAccountService.getCountryBankAndMethods(client.regulation.id, user.id)
  if(localMethods && bonus.bonusCountries.length === 0){
      return ResponseWrapper.wrap({
       status: 1,
       statusCode: 404,
       statusText: 'Global bonus not allowed to local user',
       data: null,
     });
  }
  if (bonus.bonusCountries && bonus.bonusCountries.length > 0) {
    const billingInfo = await this.dataSource.getRepository(BillingInformation).findOne({
      where: { user: { id: user.id } }
    });

    if (!billingInfo?.country) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 400,
        statusText: 'Client billing country not found',
        data: null,
      });
    }

    const allowedCountryIsoCodes = bonus.bonusCountries.map(bc => bc.country.iso);
    const userCountryIso = billingInfo.country; 
    if (!userCountryIso) {
      console.warn(`⚠️ User ${user.id} has no country ISO set in client record`);
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 403,
        statusText: 'This bonus is not available in your country',
        data: null,
      });
    }
  
    if (!allowedCountryIsoCodes.includes(userCountryIso)) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 403,
        statusText: 'This bonus is not available in your country',
        data: null,
      });
    }
  } 

  const accountType: AccountClassification =
    (client?.commissionProfile?.classification?.name as AccountClassification) ?? AccountClassification.STANDARD;
  const hasFTD = client.FTD || false;

  const allowedDepositTypes = hasFTD
    ? [DepositType.RTD, DepositType.GENERAL]
    : [DepositType.FTD, DepositType.GENERAL];

  if (!allowedDepositTypes.includes(bonus.depositType)) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 403,
      statusText: `You are not eligible for ${bonus.depositType} bonus`,
      data: null,
    });
  }

  // Also check account classification if needed
  if (bonus.accountClassification !== accountType) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 403,
      statusText: `This bonus is not available for your account type`,
      data: null,
    });
  }

  // 4. Check if this user has already used this bonus  (only for FTD)
  if (bonus.depositType === DepositType.FTD) {
  const alreadyUsed = await this.bonusRewardRepository.findOne({
    where: {
      user: { id: user.id },
      bonus: { id: bonus.id },
      code: bonusCode,
    },
    relations: ['user', 'bonus'],
  });

  if (alreadyUsed) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 409,
      statusText: 'Bonus code already used',
      data: { bonusCodeUsed: true },
    });
  }
  }
  return ResponseWrapper.wrap({
    status: 0,
    statusCode: 200,
    statusText: 'Bonus code is valid and applicable',
    data: bonus,
  });
 }

 async validateBonusAmount(user: User, dto: IValidateBonus) {
  let { bonusCode, amount } = dto;

  const bonus = await this.bonusRepository.findOne({
    where: { bonusCode },
  });

  if(!bonus?.currency?.conversionRate){
    throw new BadRequestException("Conversion Rate Not Found!")
  }

  amount = Number(Number(amount * bonus.currency.conversionRate).toFixed(2));

  if (!bonus) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 404,
      statusText: 'Invalid or inactive bonus code',
      data: null,
    });
  }

  // // 1. Validate start and end date
  // const now = new Date();
  // if (
  //   (bonus.startDateTime && now < bonus.startDateTime) ||
  //   (bonus.endDateTime && now > bonus.endDateTime)
  // ) {
  //   return ResponseWrapper.wrap({
  //     status: 1,
  //     statusCode: 400,
  //     statusText: 'Bonus code is inactive',
  //     data: null,
  //   });
  // }

  // 2. Validate amount
  if (amount < bonus.minimumAmount) {
    return ResponseWrapper.wrap({
      status: 1,
      statusCode: 400,
      statusText: `Amount must be at least ${bonus.minimumAmount} to use this bonus`,
      data: null,
    });
  }

  // ✅ 3. Validate deposit type eligibility
  // const client = await this.clientRepository.findOne({
  //   where: { userId: user.id },
  //   relations:{
  //     commissionProfile:{
  //       classification:true
  //     }
  //   }
  // });
  // if (!client) {
  //   return ResponseWrapper.wrap({
  //     status: 1,
  //     statusCode: 404,
  //     statusText: 'Client not found',
  //     data: null,
  //   });
  // }

  // const accountType: AccountClassification =
  //   (client?.commissionProfile?.classification?.name as AccountClassification) ?? AccountClassification.STANDARD;
  // const hasFTD = client.FTD || false;

  // const allowedDepositTypes = hasFTD
  //   ? [DepositType.RTD, DepositType.GENERAL]
  //   : [DepositType.FTD, DepositType.GENERAL];

  // if (!allowedDepositTypes.includes(bonus.depositType)) {
  //   return ResponseWrapper.wrap({
  //     status: 1,
  //     statusCode: 403,
  //     statusText: `You are not eligible for ${bonus.depositType} bonus`,
  //     data: null,
  //   });
  // }

  // Also check account classification if needed
  // if (bonus.accountClassification !== accountType) {
  //   return ResponseWrapper.wrap({
  //     status: 1,
  //     statusCode: 403,
  //     statusText: `This bonus is not available for your account type`,
  //     data: null,
  //   });
  // }

  // 4. Check if this user has already used this bonus
  // const alreadyUsed = await this.bonusRewardRepository.findOne({
  //   where: {
  //     user: { id: user.id },
  //     bonus: { id: bonus.id },
  //     code: bonusCode,
  //   },
  //   relations: ['user', 'bonus'],
  // });

  // if (alreadyUsed) {
  //   return ResponseWrapper.wrap({
  //     status: 1,
  //     statusCode: 409,
  //     statusText: 'Bonus code already used',
  //     data: { bonusCodeUsed: true },
  //   });
  // }

  return ResponseWrapper.wrap({
    status: 0,
    statusCode: 200,
    statusText: 'Bonus code is valid and applicable',
    data: bonus,
  });
 }

  async updateBonus(id: number, dto: UpdateBonusDto, userId: number): Promise<any> {
    return await this.bonusRepository.manager.transaction(async (transactionalEntityManager) => {
      try {
        const bonus = await transactionalEntityManager.findOne(Bonus, {
          where: { id },
          relations: ['titleEn', 'titleAr', 'descriptionEn', 'descriptionAr', 'bonusCountries', 'bonusCountries.country']
        });

        if (!bonus) {
          throw new NotFoundException('Bonus not found');
        }

        const oldData = JSON.parse(JSON.stringify(bonus));

        const { titleEn, titleAr, descriptionEn, descriptionAr, countryIds, ...bonusFields } = dto;

        const translationUpdates: { value?: string; entity?: LabelTranslation }[] = [
          { value: titleEn, entity: bonus.titleEn },
          { value: titleAr, entity: bonus.titleAr },
          { value: descriptionEn, entity: bonus.descriptionEn },
          { value: descriptionAr, entity: bonus.descriptionAr }
        ];

        for (const { value, entity } of translationUpdates) {
          if (value && entity?.id) {
            await transactionalEntityManager.update(LabelTranslation, entity.id, { text: String(value) });
            entity.text = String(value);
          }
        }

        Object.assign(bonus, bonusFields);
        if(dto.currencyId){
        const currency = await this.currenciesRepository.findOne({where:{
            id:dto.currencyId
        }});

        if(!currency){
          throw new BadRequestException("Currency not found")
        }

        bonus.currency = currency
      }

        const updatedBonus = await transactionalEntityManager.save(Bonus, bonus);

        if (countryIds !== undefined) {
          await transactionalEntityManager.delete(BonusCountries, { bonusId: id });

          if (countryIds.length > 0) {
            const validCountries = await transactionalEntityManager.findBy(Countries, {
              id: In(countryIds)
            });

            if (validCountries.length > 0) {
              const bonusCountries = validCountries.map(country =>
                transactionalEntityManager.create(BonusCountries, {
                  bonusId: id,
                  countryId: country.id,
                })
              );
              await transactionalEntityManager.save(BonusCountries, bonusCountries);
            }
          }
        }

        // Fetch the updated bonus with countries relation
        const bonusWithCountries = await transactionalEntityManager.findOne(Bonus, {
          where: { id },
          relations: ['bonusCountries', 'bonusCountries.country', 'titleEn', 'titleAr', 'descriptionEn', 'descriptionAr']
        });

        if (!bonusWithCountries) {
          throw new InternalServerErrorException('Failed to retrieve updated bonus');
        }

        setImmediate(() => {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: bonusWithCountries,
            oldData: oldData,
            entityId: bonus.id,
            entityType: entityType.BONUS,
            performerId: userId,
            performerType: 'Operator',
            field: ActivityFields.DETAILS_UPDATED,
          });

          this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
            action: 'DetailsUpdated',
            entity_id: bonus.id,
            entity_type: entityType.BONUS,
            json_object: bonusWithCountries,
            performer_id: userId,
            performer_type: 'Operator',
            is_from_archive: 0,
            trigger_type: 'Default'
          });
        });

        return {
          ...bonusWithCountries,
          titleEn: bonusWithCountries.titleEn?.text,
          titleAr: bonusWithCountries.titleAr?.text,
          descriptionEn: bonusWithCountries.descriptionEn?.text,
          descriptionAr: bonusWithCountries.descriptionAr?.text,
          countries: bonusWithCountries.bonusCountries?.map(bc => ({
            id: bc.country.id,
            name: bc.country.name,
            nameAr: bc.country.nameAr,
            iso: bc.country.iso
          })) || []
        };

      } catch (error) {
        if (error.message && (error.message.includes('bonusCode') || error.message.includes('Violation of UNIQUE KEY constraint'))) {
          throw new ConflictException({
            statusCode: 409,
            message: `Bonus program with bonus code "${dto.bonusCode}" already exists`,
            error: 'Conflict'
          });
        }
        if (error.name === 'QueryFailedError') {
          throw new BadRequestException('Invalid data provided');
        }
        if (error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('An unexpected error occurred while updating the bonus');
      }
    });
  }

  async getBonusById(id: number): Promise<any> {
    const bonus = await this.bonusRepository.findOne({
      where: { id },
      relations:{
        currency:true,
        bonusCountries:{
          country:true
        } 
      }
    });
    if (!bonus) {
      throw new NotFoundException(`Bonus with ID ${id} not found`);
    }

    return {
      ...bonus,
      titleEn: bonus.titleEn?.text ?? null,
      titleAr: bonus.titleAr?.text ?? null,
      descriptionEn: bonus.descriptionEn?.text ?? null,
      descriptionAr: bonus.descriptionAr?.text ?? null,
    };
  }

  async updateStatus(id: number, isActive: boolean): Promise<{ message: string }> {
  const bonus = await this.bonusRepository.findOne({ where: { id } });
  if (!bonus) {
    throw new NotFoundException(`Bonus with ID ${id} not found`);
  }
  bonus.isActive = isActive;
  await this.bonusRepository.save(bonus);
  return {
    message: `Bonus status updated to ${isActive ? 'Active' : 'Inactive'}.`,
  };
}

async softDeleteBonus(id: number, userId: number): Promise<{ message: string }> {
  const bonus = await this.bonusRepository.findOne({ where: { id } });
  if (!bonus) {
    throw new NotFoundException(`Bonus with ID ${id} not found`);
  }
  const result = await this.bonusRepository.softDelete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`Bonus with ID ${id} not found`);
  }

  this.eventEmitter.emit(EventTypes.USER_LOG, {
    newData: null,
    oldData: bonus,
    entityId: id,
    entityType: entityType.BONUS,
    performerId: userId,
    performerType: 'Operator',
    field: ActivityFields.RECORD_DELETED,
  });

  this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
    action: 'RecordDeleted',
    entity_id: id,
    entity_type: entityType.BONUS,
    json_object: bonus,
    performer_id: userId,
    performer_type: 'Operator',
    is_from_archive: 0,
    trigger_type: 'Default',
  });

  return { message: `Bonus with ID ${id} has been deleted.` };
}

async createBonus(dto: CreateBonusDto, userId: number): Promise<any> {
  return await this.bonusRepository.manager.transaction(async (transactionalEntityManager) => {
    try {
      const existing = await transactionalEntityManager.findOneBy(Bonus, { 
        bonusCode: dto.bonusCode 
      });
      
      if (existing) {
        throw new ConflictException({
          statusCode: 409,
          message: `Bonus program with bonus code "${dto.bonusCode}" already exists`,
          error: 'Conflict'
        });
      }

      const titleKey = `BONUS_PROGRAM_TITLE_${dto.bonusCode}`;
      const descKey = `BONUS_PROGRAM_DESC_${dto.bonusCode}`;

      const [savedTitleLabel, savedDescLabel] = await Promise.all([
        transactionalEntityManager.save(
          transactionalEntityManager.create(Label, {
            key: titleKey,
            description: titleKey,
            user: { id: userId }
          })
        ),
        transactionalEntityManager.save(
          transactionalEntityManager.create(Label, {
            key: descKey,
            description: descKey,
            user: { id: userId }
          })
        )
      ]);

      const [titleEn, titleAr, descEn, descAr] = await Promise.all([
        transactionalEntityManager.save(
          transactionalEntityManager.create(LabelTranslation, {
            label: savedTitleLabel,
            langCode: 'en',
            text: dto.titleEn
          })
        ),
        transactionalEntityManager.save(
          transactionalEntityManager.create(LabelTranslation, {
            label: savedTitleLabel,
            langCode: 'ar',
            text: dto.titleAr
          })
        ),
        transactionalEntityManager.save(
          transactionalEntityManager.create(LabelTranslation, {
            label: savedDescLabel,
            langCode: 'en',
            text: dto.descriptionEn
          })
        ),
        transactionalEntityManager.save(
          transactionalEntityManager.create(LabelTranslation, {
            label: savedDescLabel,
            langCode: 'ar',
            text: dto.descriptionAr
          })
        )
      ]);

   const { countryIds, ...bonusData } = dto;
    const currency = await this.currenciesRepository.findOne({where:{
        id:dto.currencyId
    }});

    if(!currency){
      throw new BadRequestException("Currency not found")
    }
    const bonus = transactionalEntityManager.create(Bonus, {
      ...bonusData, 
        isActive: true,
        titleEn,
        titleAr,
        descriptionEn: descEn,
        descriptionAr: descAr,
        title: savedTitleLabel,
        description: savedDescLabel,
        currency
      });
       const saved = await transactionalEntityManager.save(Bonus, bonus);

      if (countryIds && countryIds.length > 0) {
        const validCountries = await transactionalEntityManager.findBy(Countries, {
          id: In(countryIds)
        });
        
        if (validCountries.length > 0) {
          const bonusCountries = validCountries.map(country =>
            transactionalEntityManager.create(BonusCountries, {
              bonusId: saved.id,
              countryId: country.id,
            })
          );
          await transactionalEntityManager.save(BonusCountries, bonusCountries);
        }
      }

      const savedWithCountries = await transactionalEntityManager.findOne(Bonus, {
        where: { id: saved.id },
        relations: ['bonusCountries', 'bonusCountries.country']
      });

      if (!savedWithCountries) {
        throw new InternalServerErrorException('Failed to retrieve saved bonus');
      }

      setImmediate(() => {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: savedWithCountries,
          oldData: null,
          entityId: savedWithCountries.id,
          entityType: entityType.BONUS,
          performerId: userId,
          performerType: 'Operator',
          field: ActivityFields.RECORD_CREATED
        });
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordCreated',
          entity_id: savedWithCountries.id,
          entity_type: entityType.BONUS,
          json_object: savedWithCountries,
          performer_id: userId,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default'
        });
      });

      return {
        ...savedWithCountries,
        titleEn: savedWithCountries.titleEn?.text,
        titleAr: savedWithCountries.titleAr?.text,
        descriptionEn: savedWithCountries.descriptionEn?.text,
        descriptionAr: savedWithCountries.descriptionAr?.text,
        countries: savedWithCountries.bonusCountries?.map(bc => ({
        id: bc.country.id,
        name: bc.country.name,
        nameAr: bc.country.nameAr,
        iso: bc.country.iso
  })) || []
      };

    } catch (error) {
      if (error.message && (error.message.includes('bonusCode') || error.message.includes('Violation of UNIQUE KEY constraint'))) {
        throw new ConflictException({
          statusCode: 409,
          message: `Bonus program with bonus code "${dto.bonusCode}" already exists`,
          error: 'Conflict'
        });
      }
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the bonus');
    }
  });
}

  async getFilteredBonusList({
    paginationOptions,
    userId,
    dto,
  }: {
    userId: number;
    paginationOptions: { page: number; limit: number };
    dto: ApplyListFilterSortColumnDto;
  }) {
  const bonuses = await this.bonusRepository.advanceFilters({
  userId,
  page: paginationOptions.page,
  limit: paginationOptions.limit,
  listName: ListNames.BONUS,
  filterList: dto?.filters || undefined,
  sortList: dto?.sort || undefined,
  defaultSortKey: 'createdAt',
  listViewId: dto?.listViewId,
  relations: [
    'title',
    'description',
    'titleEn',
    'titleAr',
    'descriptionEn',
    'descriptionAr',
    'bonusCountries',
    'bonusCountries.country'
  ],
  });
  return bonuses;
  }

  async validateBonusCodeV1(user: User, dto: IValidateBonus) {
    const { bonusCode, amount } = dto;
    const bonus = await this.bonusRepository.findOne({
      where: { bonusCode, isActive: true, currency:{iso:"USD"} },
    });

    if (!bonus) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 404,
        statusText: 'Invalid or inactive bonus code',
        data: null,
      });
    }

    // 1. Validate start and end date
    const now = new Date();
    if (
      (bonus.startDateTime && now < bonus.startDateTime) ||
      (bonus.endDateTime && now > bonus.endDateTime)
    ) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 400,
        statusText: 'Bonus code is inactive',
        data: null,
      });
    }

    // 2. Validate amount
    if (amount < bonus.minimumAmount) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 400,
        statusText: `Amount must be at least ${bonus.minimumAmount} to use this bonus`,
        data: null,
      });
    }

    // ✅ 3. Validate deposit type eligibility
    const client = await this.clientRepository.findOne({
      where: { userId: user.id },
      relations: {
        commissionProfile: {
          classification: true
        }
      }
    });
    if (!client) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 404,
        statusText: 'Client not found',
        data: null,
      });
    }

    const accountType: AccountClassification =
      (client?.commissionProfile?.classification?.name as AccountClassification) ?? AccountClassification.STANDARD;
    const hasFTD = client.FTD || false;

    const allowedDepositTypes = hasFTD
      ? [DepositType.RTD, DepositType.GENERAL]
      : [DepositType.FTD, DepositType.GENERAL];

    if (!allowedDepositTypes.includes(bonus.depositType)) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 403,
        statusText: `You are not eligible for ${bonus.depositType} bonus`,
        data: null,
      });
    }

    // Also check account classification if needed
    if (bonus.accountClassification !== accountType) {
      return ResponseWrapper.wrap({
        status: 1,
        statusCode: 403,
        statusText: `This bonus is not available for your account type`,
        data: null,
      });
    }

    // 4. Check if this user has already used this bonus  (only for FTD)
    if (bonus.depositType === DepositType.FTD) {
      const alreadyUsed = await this.bonusRewardRepository.findOne({
        where: {
          user: { id: user.id },
          bonus: { id: bonus.id },
          code: bonusCode,
        },
        relations: ['user', 'bonus'],
      });

      if (alreadyUsed) {
        return ResponseWrapper.wrap({
          status: 1,
          statusCode: 409,
          statusText: 'Bonus code already used',
          data: { bonusCodeUsed: true },
        });
      }
    }
    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Bonus code is valid and applicable',
      data: bonus,
    });
  }

  async getBonusListV1(userId: number, method?: string) {
    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: {
        commissionProfile: {
          classification: true
        }
      }
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    const accountType: AccountClassification = (client?.commissionProfile?.classification?.name as AccountClassification) ?? AccountClassification.STANDARD;
    const hasFTD = client.FTD || false;

    const allowedDepositTypes = hasFTD
      ? [DepositType.RTD, DepositType.GENERAL]
      : [DepositType.FTD, DepositType.GENERAL];

    const where: FindOptionsWhere<Bonus> = {
      isActive: true,
      depositType: In(allowedDepositTypes),
      accountClassification: accountType,
      currency:{
        iso:"USD"
      }
    }


    const depositMinValue = this.configService.getOrThrow(
      'app.depositMinValue',
      {
        infer: true,
      },
    );
    let depositMaxValue = this.configService.getOrThrow(
      'app.depositMaxValue',
      {
        infer: true,
      },
    );

    const paymentMethod = {
      'crypto': Methods.CRYPTO,
      'credit-card': Methods.CREDIT_CARD,
      'e-wallets': Methods.E_WALLET,
    }
    const currentMethod = method ? paymentMethod[method] : null;

    if (currentMethod === Methods.CRYPTO) {
      depositMaxValue = this.configService.getOrThrow(
        'app.cryptoMaxDepositValue',
        {
          infer: true,
        },
      );
    }

    const filterMethods = [Methods.CREDIT_CARD, Methods.E_WALLET, Methods.CRYPTO];
    if (filterMethods.find((m) => m === currentMethod)) {
      where.minimumAmount = Between(depositMinValue, depositMaxValue);
    }else {
      where.minimumAmount = MoreThanOrEqual(1);
    }

    const bonuses = await this.bonusRepository.find({
      where,
      order: { depositType: 'DESC', createdAt: 'DESC' },
      relations: ['title', 'description'],
    });

    const titleIds = bonuses.map((b) => b.title?.id).filter(Boolean);
    const descriptionIds = bonuses.map((b) => b.description?.id).filter(Boolean);
    const labelIds = Array.from(new Set([...titleIds, ...descriptionIds]));

    const translations = await this.labelTranslationRepository.find({
      where: {
        label: { id: In(labelIds) },
      },
    });

    const translationMap = new Map<number, { en?: string; ar?: string }>();
    for (const tr of translations) {
      const labelId = tr.label.id;
      if (!translationMap.has(labelId)) {
        translationMap.set(labelId, {});
      }
      if (tr.langCode === 'en') {
        translationMap.get(labelId)!.en = tr.text;
      } else if (tr.langCode === 'ar') {
        translationMap.get(labelId)!.ar = tr.text;
      }
    }

    const enrichedBonuses = bonuses.map((bonus) => {
      //@ts-expect-error rempve-currency
      delete bonus.currency

      //@ts-expect-error rempve-currency
      delete bonus.currencyId
      return {
      ...bonus,
      titleEn: translationMap.get(bonus.title?.id)?.en ?? null,
      titleAr: translationMap.get(bonus.title?.id)?.ar ?? null,
      descriptionEn: translationMap.get(bonus.description?.id)?.en ?? null,
      descriptionAr: translationMap.get(bonus.description?.id)?.ar ?? null,
    }
    });

    const grouped = enrichedBonuses.reduce((acc, bonus) => {
      const depositType = bonus.depositType || 'Uncategorized';
      if (!acc[depositType]) {
        acc[depositType] = {
          depositType,
          bonuses: [],
        };
      }
      acc[depositType].bonuses.push(bonus);
      return acc;
    }, {} as Record<string, any>);

    return ResponseWrapper.wrap({
      status: 0,
      statusCode: 200,
      statusText: 'Bonus list fetched successfully',
      data: Object.values(grouped),
    });
  }
}