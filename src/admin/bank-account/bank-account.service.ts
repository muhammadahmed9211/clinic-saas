import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { DeepPartial, FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { BankAccount } from './entities/bank-account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { BankAccountRepository } from './repositories/bank-account.repository';
import { BankAccountRegulations } from './entities/bank-account-regulation.entity';
import { Regulations } from '../regulations/entities/regulations.entity';
import { ActiveLogService, ActivityFields } from '../active-log/active-log.service';
import { entityType } from '../active-log/active-log.type';
import { PspService } from 'src/psp/psp.service';
import { Countries } from 'src/psp/entities/countries.entity';
import { BankAccountCountries } from './entities/bank-account-countries.entity';
import { BillingInformation } from 'src/billing-information/entities/billing-information.entity';
import { BankAccountMethods } from './entities/bank-account-methods.entity';
import { Methods } from 'src/transaction/entities/transaction-method.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Currencies } from 'src/currencies/entities/currencies.entity';

@Injectable()
export class BankAccountService {
  constructor(
    private readonly bankAccountRepository: BankAccountRepository,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(BankAccountRegulations)
    private readonly bankAccountRegulationsRepository: Repository<BankAccountRegulations>,
    @InjectRepository(BankAccountCountries)
    private readonly bankAccountCountriesRepository: Repository<BankAccountCountries>,
    @InjectRepository(BillingInformation)
    private readonly billingInformationRepository: Repository<BillingInformation>,
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,
    private readonly filesService: FilesService,
    @InjectRepository(Regulations)
    private readonly regulationsRepository: Repository<Regulations>,
    private readonly activeLogsService: ActiveLogService,
    private readonly pspService: PspService,
    @InjectRepository(BankAccountMethods)
    private readonly bankAccountMethodsRepository: Repository<BankAccountMethods>,
    @InjectRepository(Currencies)
    private readonly currenciesRepository: Repository<Currencies>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(createBankAccountDto: CreateBankAccountDto, userId: number) {
    if (createBankAccountDto.isLocalMethodsEnable) {
      await this.cacheManager.del(`get-me-api-*`);
    }
    const { logoId, currencyId, ...accountDetails } = createBankAccountDto;
    const isExist = await this.fileRepository.findOne({
      where: { id: logoId },
    });
    if (!isExist) {
      throw new BadRequestException('File with given id does not exist');
    }
    const logo = new FileEntity();
    logo.id = logoId;

    const isAlreadyExist = await this.bankAccountRepository.findOne({
      where: {
        bankName: createBankAccountDto.bankName,
        iban: createBankAccountDto.iban,
      },
    });
    if (isAlreadyExist) {
      throw new UnprocessableEntityException('Bank Account already exists');
    }

    if (createBankAccountDto?.regulationsId) {
      const isRegulationsExist = await this.regulationsRepository.count({
        where: { id: In(createBankAccountDto.regulationsId) },
      });

      if (isRegulationsExist !== createBankAccountDto.regulationsId.length) {
        throw new BadRequestException('Regulations Id doest not exists');
      }
    }

    if (createBankAccountDto?.countryIds) {
      const isCountryExist = await this.countriesRepository.count({
        where: { id: In(createBankAccountDto.countryIds), name: Not("Any") },
      });

      if (isCountryExist !== createBankAccountDto.countryIds.length) {
        throw new BadRequestException('Country Id doest not exists');
      }
    }

    const currency = await this.currenciesRepository.findOne({
      where: {
        id: currencyId
      }
    });

    if (!currency) {
      throw new BadRequestException("Currency not found")
    }

    const reference = createBankAccountDto?.reference ? createBankAccountDto?.reference : "";
    const additionalInformation = createBankAccountDto?.additionalInformation ? createBankAccountDto?.additionalInformation : ""
    const entity = this.bankAccountRepository.create({
      ...accountDetails,
      reference,
      additionalInformation,
      logo,
      bankCurrency:currency,
      currency:currency.iso
    });
    const bankAccount = await this.bankAccountRepository.save(entity);

    if (createBankAccountDto?.regulationsId) {
      const regulations = createBankAccountDto.regulationsId.map((reg) => {
        return this.bankAccountRegulationsRepository.create({
          regulation: {
            id: reg,
          },
          bankAccount: {
            id: bankAccount.id,
          },
        });
      });

      await this.bankAccountRegulationsRepository.save(regulations);
    }

    if (createBankAccountDto?.countryIds) {
      const countries = createBankAccountDto.countryIds.map((countryId) => {
        return this.bankAccountCountriesRepository.create({
          country: {
            id: countryId,
          },
          bankAccount: {
            id: bankAccount.id,
          },
        });
      });

      await this.bankAccountCountriesRepository.save(countries);
    }

    if (createBankAccountDto?.methodsIds) {
      bankAccount.methods = [];
      await this.addAndUpdateMethods(bankAccount, createBankAccountDto?.methodsIds)
    }

    const data = await this.bankAccountRepository.findOne({
      where: {
        id: bankAccount.id
      },
      relations: {
        regulations: {
          regulation: true
        },
        countries: {
          country: true
        },
        methods: true
      }
    });

    if (data && data.regulations) {
      const regulations = data?.regulations.map((r) => {
        if (!r.regulation) {
          return {
            ...r,
          }
        }
        const regulation = {
          id: r.regulation.id,
          name: r.regulation.name
        };
        return {
          ...r,
          regulation
        };
      });
      //@ts-expect-error type-error
      data.regulations = regulations
    }

    if (data && data.countries) {
      const countries = data?.countries.map((c) => {
        if (!c.country) {
          return {
            ...c,
          }
        }

        const country = {
          id: c.country.id,
          name: c.country.name,
          nameAr: c.country.nameAr,
          iso: c.country.iso
        };

        return {
          ...c,
          country
        };
      });
      //@ts-expect-error type-error
      data.countries = countries
    }


    this.activeLogsService.emitLog({
      entityId: bankAccount.id,
      field: ActivityFields.RECORD_CREATED,
      entityType: entityType.COMPANY_BANKS,
      newData: data,
      oldData: null,
      performerId: userId
    });
    let pspName = `${createBankAccountDto.bankName} - ${currency.iso}`;
    if (createBankAccountDto.country) {
      pspName += ` - ${createBankAccountDto.country}`
    }
    await this.pspService.createExchangeOrBankPsp(
      pspName,
      userId,
      bankAccount.id,
      'Bank',
    );
    return bankAccount;
  }

  async findAll(
    currency?: string,
    isClientVisible: boolean = false,
    userRegId: number | null = null,
    userId: number | null = null,
    userCountryId: number | null = null,
    isLocalMethodsBanks: boolean = false,
    country?: string
  ) {
    const qb = this.getFindAllQuery(currency, isClientVisible, userRegId, userCountryId, isLocalMethodsBanks, country)
    const data = await qb.getMany();
    const images: Promise<string>[] = [];
    if (Array.isArray(data)) {
      data.forEach((element) => {
        if (element?.logo?.id) {
          images.push(this.filesService.getCacheSignedUrl(element.logo.id));
        }
      });
    }
    const allImages = await Promise.all(images);
    const bankAccounts = allImages.map((image, i) => {
      return {
        ...data[i],
        image,
      };
    });
    return bankAccounts;
  }

  async getAll(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    userId: number,
  ) {
    const data = await this.bankAccountRepository.advanceFilters({
      limit,
      page,
      listName: ListNames.COMPANY_BANK_ACCOUNT,
      filterList: body.filters,
      sortList: body.sort,
      userId,
      defaultSortKey: 'createdAt',
      relations: ['regulations', 'regulations.regulation', 'countries', 'countries.country', 'methods', 'bankCurrency'],
      listViewId: body.listViewId,
    });
    const images: Promise<any>[] = [];
    if (Array.isArray(data?.result)) {
      data?.result.forEach((element) => {
        if (element?.logo?.id) {
          images.push(this.filesService.getSignedUrl(element.logo.id));
        }
      });
    }
    const bankData = data.result;
    const allImages = await Promise.all(images);
    const result = allImages.map((image, i) => {
      return {
        ...bankData[i],
        image,
      };
    });
    return { ...data, result };
  }

  async getCurrencies() {
    const data = await this.bankAccountRepository
      .createQueryBuilder('ba')
      .innerJoin('ba.bankCurrency', 'bankCurrency')
      .select('DISTINCT bankCurrency.iso', 'iso')
      .getRawMany();
    const currencies = data.map((d) => {
      return { currency: d.iso }
    })
    return currencies;
  }

  async findOne(id: number) {
    const isExist = await this.bankAccountRepository.findOne({
      where: { id },
      relations: ['regulations', 'regulations.regulation', 'countries', 'countries.country', 'methods'],
    });

    if (!isExist) {
      throw new BadRequestException("Bank Account Not Found")
    };

    const methodImagePromises: Promise<{ id: string; image: string }>[] = [];
    for (const method of isExist.methods) {
      methodImagePromises.push(this.getMethodImageByFileId(method.logoId));
    }

    const methodImages = await Promise.all(methodImagePromises);
    if (isExist?.logo?.id) {
      const image = await this.filesService.getSignedUrl(isExist?.logo?.id);
      //@ts-expect-error type-error
      isExist.image = image
    }

    //@ts-expect-error type-error
    isExist.methodImages = methodImages

    return isExist;
  }

  async update(id: number, updateBankAccountDto: UpdateBankAccountDto, userId: number) {
    const { logoId, currencyId = null, ...accountDetails } = updateBankAccountDto;
    let logo;
    if (updateBankAccountDto?.logoId) {
      const isExist = await this.fileRepository.findOne({
        where: { id: logoId },
      });
      if (!isExist) {
        throw new BadRequestException('File with given id does not exist');
      }
      logo = new FileEntity();
      logo.id = logoId;
    }

    const isExist = await this.bankAccountRepository.findOne({
      where: { id },
      relations: ['regulations', 'regulations.regulation', 'methods'],
    });

    if (updateBankAccountDto.isLocalMethodsEnable !== undefined && isExist?.isLocalMethodsEnable !== updateBankAccountDto.isLocalMethodsEnable) {
      await this.cacheManager.del(`get-me-api-*`);
    }

    if (!isExist) {
      throw new NotFoundException('Account does not exist');
    }

    if (updateBankAccountDto?.regulationsId) {
      const isRegulationsExist = await this.regulationsRepository.count({
        where: { id: In(updateBankAccountDto.regulationsId) },
      });

      if (isRegulationsExist !== updateBankAccountDto.regulationsId.length) {
        throw new BadRequestException('Regulations Id doest not exists');
      }
    }

    if (updateBankAccountDto?.countryIds) {
      const isCoutriesExist = await this.countriesRepository.count({
        where: { id: In(updateBankAccountDto.countryIds), name: Not("Any") },
      });

      if (isCoutriesExist !== updateBankAccountDto.countryIds.length) {
        throw new BadRequestException('Country Id doest not exists');
      }
    }

    const allRegulations = {};
    const bankAccountRegulations: BankAccountRegulations['id'][] = [];

    isExist.regulations.forEach((r) => {
      const regulationId = r?.regulation?.id;
      if (regulationId) {
        allRegulations[regulationId] = true;
      } else {
        bankAccountRegulations.push(r.id);
      }
    });

    const regulations: BankAccountRegulations[] = [];

    if (updateBankAccountDto.regulationsId) {
      updateBankAccountDto.regulationsId.forEach((reg) => {
        // if regulations does not exist then add
        if (!allRegulations[reg]) {
          const regulation = this.bankAccountRegulationsRepository.create({
            regulation: {
              id: reg,
            },
            bankAccount: {
              id: isExist.id,
            },
          });
          regulations.push(regulation);
        } else {
          delete allRegulations[reg];
        }
      });
    }

    const countries: BankAccountCountries[] = [];
    if (updateBankAccountDto.countryIds) {
      updateBankAccountDto.countryIds.forEach((countryId) => {
        const country = this.bankAccountCountriesRepository.create({
          country: {
            id: countryId,
          },
          bankAccount: {
            id: isExist.id,
          },
        });
        countries.push(country)
      });
    }

    await this.bankAccountRegulationsRepository.delete({
      bankAccount: { id: isExist.id },
      regulation: {
        id: In(Object.keys(allRegulations)),
      },
    });
    await this.bankAccountRegulationsRepository.delete({
      id: In(bankAccountRegulations),
    });

    await this.bankAccountCountriesRepository.delete({
      bankAccount: {
        id: isExist.id
      },
    });

    let currency: DeepPartial<Currencies> | null = null
    if (currencyId) {
      currency = await this.currenciesRepository.findOne({
        where: {
          id: currencyId
        }
      });

      if (!currency) {
        throw new BadRequestException("Currency not found")
      }
    }

    await this.bankAccountRegulationsRepository.save(regulations);
    await this.bankAccountCountriesRepository.save(countries);

    const entity = this.bankAccountRepository.create({
      ...accountDetails,
      logo,
      id,
      ...(currency ? { bankCurrency: currency } : {}),
      currency:currency?.iso,
    });

    if (updateBankAccountDto?.methodsIds) {
      await this.addAndUpdateMethods(isExist, updateBankAccountDto.methodsIds)
    }

    const newData = await this.bankAccountRepository.findOne({
      where: { id },
      relations: ['regulations', 'regulations.regulation', 'countries', 'countries.country', 'methods'],
    });

    if (isExist && isExist.regulations) {
      const regulations = isExist?.regulations.map((r) => {
        if (!r.regulation) {
          return {
            ...r,
          }
        }
        const regulation = {
          id: r.regulation.id,
          name: r.regulation.name
        };
        return {
          ...r,
          regulation
        };
      });
      //@ts-expect-error type-error
      isExist.regulations = regulations
    }

    if (isExist && isExist.countries) {
      const countries = isExist?.countries.map((c) => {
        if (!c.country) {
          return {
            ...c,
          }
        }
        const country = {
          id: c.country.id,
          name: c.country.name,
          nameAr: c.country.nameAr,
          iso: c.country.iso,
        };
        return {
          ...c,
          country
        };
      });
      //@ts-expect-error type-error
      isExist.countries = countries
    }

    if (newData && newData.regulations) {
      const regulations = newData?.regulations.map((r) => {
        if (!r.regulation) {
          return {
            ...r,
          }
        }
        const regulation = {
          id: r.regulation.id,
          name: r.regulation.name
        };
        return {
          ...r,
          regulation
        };
      });
      //@ts-expect-error type-error
      newData.regulations = regulations
    }

    this.activeLogsService.emitLog({
      entityId: entity.id,
      field: ActivityFields.DETAILS_UPDATED,
      entityType: entityType.COMPANY_BANKS,
      newData: newData,
      oldData: isExist,
      performerId: userId
    });

    const bank = await this.bankAccountRepository.save(entity);
    const bankAccount = await this.bankAccountRepository.findOneBy({ id: bank.id });
    if (bankAccount) {
      let pspName = `${bankAccount.bankName} - ${bankAccount.currency}`;
      if (bank.country) {
        pspName += ` - ${bankAccount.country}`
      }
      await this.pspService.updateExchangeOrBankPsp(pspName, entity.id, 'Bank');
    }
    return bank;
  }

  async remove(id: number, userId: number) {
    const isExist = await this.bankAccountRepository.findOne({
      where: { id },
      relations: ['regulations', 'regulations.regulation'],
    });
    if (!isExist) {
      throw new NotFoundException('Account does not exist');
    }
    const deleted = await this.bankAccountRepository.softDelete(id);
    this.activeLogsService.emitLog({
      entityId: id,
      field: ActivityFields.RECORD_DELETED,
      entityType: entityType.COMPANY_BANKS,
      newData: null,
      oldData: isExist,
      performerId: userId
    });
    return deleted.affected === 1;
  }

  async addAndUpdateMethods(bankAccount: BankAccount, logoIds: string[]) {
    const oldLogos = new Set(bankAccount.methods.map((m) => m.logoId));
    const newLogos = new Set(logoIds);

    const toAdd = [...newLogos].filter(id => !oldLogos.has(id));
    const toDelete = [...oldLogos].filter(id => !newLogos.has(id));

    if (toAdd.length > 0 || toDelete.length > 0) {
      await this.cacheManager.del(`get-me-api-*`);
    }

    if (toDelete.length > 0) {
      await this.bankAccountMethodsRepository.softDelete({
        bankAccount: { id: bankAccount.id },
        logoId: In(toDelete),
      });
    }

    const toBeAdded = toAdd.map((logoId) =>
      this.bankAccountMethodsRepository.create({
        bankAccount,
        logoId,
      })
    );

    if (toBeAdded.length > 0) {
      await this.bankAccountMethodsRepository.save(toBeAdded);
    }

    return { toAdd, toDelete };
  }

  async getCountryByBillingInfo(userId: number | null) {
    let country: Countries | null = null;
    if (userId) {
      const billingInformation = await this.billingInformationRepository.findOne({
        where: {
          user: {
            id: userId
          }
        }
      });
      if (billingInformation) {
        country = await this.countriesRepository.findOne({
          where: {
            iso: billingInformation.country
          }
        });
      }
    }
    return country
  }

  async getCountryBankAndMethods(regulationId: number, userId: number) {
    const country = await this.getCountryByBillingInfo(userId)

    if (!country || !country?.name) {
      return;
    }

    const query = this.getFindAllQuery(undefined, true, regulationId, country.id, true, country.iso)
    const count = await query.getCount();
    if (0 >= count) {
      return;
    }

    const method = {
      method: `${country?.name} Payment Methods` as Methods,
      isActive: true,
      depositFeeType: 'AMOUNT',
      depositFeeStart: 0,
      depositFeeEnd: 0,
      withdrawalFeeType: 'AMOUNT',
      withdrawalFeeStart: 0,
      withdrawalFeeEnd: 0,
      clientDepositFeeType: 'AMOUNT',
      clientDepositFeeStart: 0,
      clientDepositFeeEnd: 0,
      clientWithdrawalFeeType: 'AMOUNT',
      clientWithdrawalFeeStart: 0,
      clientWithdrawalFeeEnd: 0,
      depositLimit: 0,
      withdrawalLimit: 0,
      deletedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isDynamicMethod: true,
      country
    }

    return method
  }

  async findAllByCountry(
    currency?: string,
    isClientVisible: boolean = false,
    userRegId: number | null = null,
    userId: number | null = null,
  ) {
    const country = await this.getCountryByBillingInfo(userId)
    return this.findAll(currency, isClientVisible, userRegId, userId, country?.id)
  }

  getFindAllQuery(currency?: string, isClientVisible: boolean = false, userRegId?: number | null, userCountryId?: number | null, isLocalMethodsBanks: boolean = false, country?: string) {
    const qb = this.bankAccountRepository
      .createQueryBuilder('ba')
      .leftJoinAndSelect('ba.bankCurrency', 'bankCurrency')
      .leftJoinAndSelect('ba.regulations', 'bar')
      .leftJoinAndSelect('ba.logo', 'logo')
      .leftJoinAndSelect('bar.regulation', 'regulation')
      .leftJoinAndSelect('ba.countries', 'bac')
      .leftJoinAndSelect('bac.country', 'countriesCountry');

    if (isLocalMethodsBanks) {
      qb.leftJoinAndSelect('ba.methods', 'methods')
    }

    if (currency) {
      qb.andWhere('bankCurrency.iso = :currencyIso', { currencyIso:currency });
    }

    if (isLocalMethodsBanks && country) {
      qb.andWhere('ba.country = :country', { country })
      qb.andWhere('ba.isLocalMethodsEnable = 1');
    }

    if (isClientVisible) {
      qb.andWhere('ba.isClientVisible = 1');
    }

    if (userRegId) {
      qb.andWhere(`
      (
        ba.isRegulationRestricted = 0
        OR (ba.isRegulationRestricted = 1 AND regulation.id = :userRegId)
      )
    `, { userRegId });
    }

    if (userCountryId) {
      qb.andWhere(`
      (
        ba.isCountryRestricted = 0
        OR (ba.isCountryRestricted = 1 AND countriesCountry.id = :userCountryId)
      )
    `, { userCountryId });
    }

    return qb;
  }

  async getMethodImageByFileId(id: string) {
    const image = await this.filesService.getSignedUrl(id)
    return {
      id,
      image
    }
  }

  async getCountryMethodsBank(regulationId: number, userId: number) {
    const country = await this.getCountryByBillingInfo(userId);
    if (!country?.name) return;

    const query = this.getFindAllQuery(
      undefined,
      true,
      regulationId,
      country.id,
      true,
      country.iso,
    );

    const banks = await query.getMany();
    if (!Array.isArray(banks) || banks.length === 0) {
      return [];
    }

    const bankImagePromises: Promise<string>[] = [];
    const methodImagePromises: Promise<{ id: string; image: string }>[] = [];

    for (const bank of banks) {
      if (bank.logo?.id) {
        bankImagePromises.push(this.filesService.getSignedUrl(bank.logo.id));
      }

      for (const method of bank.methods) {
        methodImagePromises.push(this.getMethodImageByFileId(method.logoId));
      }
    }

    const bankImages = await Promise.all(bankImagePromises);
    const methodImages = await Promise.all(methodImagePromises);

    const methodImageMap: Record<string, string> = {};
    for (const { id, image } of methodImages) {
      methodImageMap[id] = image;
    }

    const resultBanks = banks.map((bank, index) => {
      const methodImages = bank.methods.map(
        (method) => methodImageMap[method.logoId]
      );

      return {
        ...bank,
        image: bankImages[index],
        methodsImages: methodImages,
      };
    });

    return resultBanks;
  }


}
