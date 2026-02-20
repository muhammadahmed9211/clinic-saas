import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Regulations } from './entities/regulations.entity';
import { BlockCountriesDto, CreateRegulationDto, RegulationEmailEvent, UpdateRegulationDto } from './dto/regulations.dto';
import { RegulationTranslations } from './entities/regulations-translation.entity';
import { RegulationsCountries } from './entities/regulations-countries.entity';
import { RegulationBlockedCountries } from './entities/regulation-blocked-countries.entity';
import { RegulationsRepository } from './repositories/regulations.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { FilesService } from 'src/files/files.service';
import { Client } from 'src/users/entities/client.entity';
import { SettingsService } from 'src/settings/settings.service';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { EventTypes } from 'src/common/services/event.type';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { entityType, performerType } from '../active-log/active-log.type';
import { I18nContext } from 'nestjs-i18n';
import { User } from 'src/users/entities/user.entity';
import { SendEmailService } from 'src/common/services/send-email.service';

@Injectable()
export class RegulationService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly secretKey: Buffer;
  private readonly iv: Buffer;
  constructor(
    @InjectRepository(Regulations)
    private regulationRepository: Repository<Regulations>,
    @InjectRepository(RegulationTranslations)
    private translationRepository: Repository<RegulationTranslations>,
    @InjectRepository(RegulationsCountries)
    private regulationsCountriesRepository: Repository<RegulationsCountries>,
    @InjectRepository(RegulationBlockedCountries)
    private regulationBlockedCountries: Repository<RegulationBlockedCountries>,
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly regulationsRepository: RegulationsRepository,
    private readonly filesService: FilesService,
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly eventEmitter: EventEmitter2,
    private readonly sendEmailService: SendEmailService,

  ) {
    const key = this.configService.get<string>('app.encryptionKey', { infer: true });
    const rawKey = key;
    const trimmedKey = rawKey?.trim();
    this.secretKey = Buffer.from(trimmedKey as any,'hex');
    this.iv = crypto.randomBytes(16);
  }

  async create(createRegulationDto: CreateRegulationDto, req: any): Promise<any> {

    const { translations,
      // blockedCountries, 
      ...regulationData } = createRegulationDto;

    const existingRegulation = await this.regulationRepository.findOne({
      where: { name: regulationData.name },
    });

    if (existingRegulation) {
      throw new HttpException('Regulation with this name already exists', 400);
    }

    const userName = req.user?.role.name;
    let encryptedPassword:undefined|string;
    if(regulationData?.smtp_password){
    encryptedPassword = await this.encrypt(regulationData?.smtp_password);
    }

    const regulation = this.regulationRepository.create({
      ...regulationData,
      ...(regulationData.regulatedByLabelId && {
        regulatedByLabel: { id: regulationData.regulatedByLabelId }
      }),
      ...(regulationData.licenseLabelId && {
        licenseLabel: { id: regulationData.licenseLabelId }
      }),
      createdBy: userName,
      smtp_password: encryptedPassword
    });

    const savedRegulation = await this.regulationRepository.save(regulation);

    if (translations && translations.length > 0) {
      const translationEntities = translations.map(translation => {
        return this.translationRepository.create({
          ...translation,
          regulation: savedRegulation,

        });
      });
      await this.translationRepository.save(translationEntities);
    }

    // if (blockedCountries && blockedCountries.length > 0) {

    //   for (const countryCode of blockedCountries) {
    //     let country = await this.regulationsCountriesRepository.findOne({ where: { countryCode } });
    //     if (!country) {
    //       country = this.regulationsCountriesRepository.create({ countryCode });
    //     }

    //     const blockedCountry = this.regulationBlockedCountries.create({
    //       regulation: savedRegulation,
    //       country: country
    //     });
    //     await this.regulationBlockedCountries.save(blockedCountry);
    //   }

    // }


    // const fullRegulation = await this.regulationRepository.findOne({
    //   where: { id: savedRegulation.id },
    //   relations: ['blockedCountries', 'translations'],
    // });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: savedRegulation,
      oldData: null,
      entityId: savedRegulation?.id,
      entityType: entityType.REGULATION,
      performerId: req.user?.id,
      performerType: performerType.OPERATOR,
      field: 'Regulation Created',
    });

    return {
      message: "Regulation created successfully",
      //   name: fullRegulation?.name,
      //   postalCode: fullRegulation?.postalCode,
      //   website: fullRegulation?.website,
      //   contact: fullRegulation?.contact,
      //   logo: fullRegulation?.logo,
      //   subDomain: fullRegulation?.subDomain,
      //   blockedCountries: fullRegulation?.regulationsCountries.map(country => country.countryCode),
      //   translations: fullRegulation?.translations.map(translation => ({
      //     fieldName: translation.fieldName,
      //     languageCode: translation.languageCode,
      //     translationText: translation.translationText,
      //   })),
      // };
    }
  }

  async listAll(): Promise<any[]> {
    const regulations = await this.regulationRepository.find({
      relations: ['translations', 'blockedCountries', 'blockedCountries.country'],
    });

    const regulationsWithLogoUrls = await Promise.all(
      regulations.map(async (regulation) => {
        let logoUrl: string | null = null;
        if (regulation.logo) {
          try {
            logoUrl = await this.filesService.getSignedUrl(regulation.logo);
          } catch (error) {
            console.error('Error generating signed URL:', error.message);
          }
        }

        return {
          ...regulation,
          logo: regulation.logo ? regulation.logo : null,
          logoUrl: logoUrl,
          smtp_password: regulation?.smtp_password ? '*********' : null
        };
      })
    );

    return regulationsWithLogoUrls;
  }


  async findAll(
    limit: number,
    page: number,
    dto: ApplyListFilterSortColumnDto,
    userId: number,
  ): Promise<any> {
    const response = await this.regulationsRepository.advanceFilters({
      limit,
      page,
      userId,
      relations: ['translations', 'blockedCountries', 'blockedCountries.country'],
      filterList: dto.filters || undefined,
      listName: ListNames.REGULATION,
      sortList: dto.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto.listViewId,
    });

    const regulations = response.result || [];

    const regulationsWithLogoUrls = await Promise.all(
      regulations.map(async (regulation) => {
        let logoUrl: string | null = null;
        if (regulation.logo) {
          try {
            logoUrl = await this.filesService.getSignedUrl(regulation.logo);
          } catch (error) {
            console.error('Error generating signed URL:', error.message);
          }
        }

        return {
          ...regulation,
          logo: regulation.logo ? regulation.logo : null,
          logoUrl: logoUrl,
          smtp_password: regulation?.smtp_password ? '*********' : null
        };
      })
    );

    return {
      ...response,
      result: regulationsWithLogoUrls,
    };
  }


  async findOne(id: number): Promise<any> {
    const regulation = await this.regulationRepository.findOne({
      where: { id },
      relations: [
        'translations',
        'eventRule',
        'eventRule.event',
        'eventRule.rule',
        'blockedCountries',
        'blockedCountries.country',
      ],
    });

    if (!regulation) {
      throw new NotFoundException(`Regulation with ID ${id} not found`);
    }

    let logoUrl: string | null = null;
    if (regulation.logo) {
      try {
        logoUrl = await this.filesService.getSignedUrl(regulation.logo);
      } catch (error) {
        console.error('Error generating signed URL:', error.message);
      }
    }

    const { result: countriesList } = await this.settingsService.getCountriesIso();

    const blockedCountriesWithNames = regulation.blockedCountries.map((blocked) => {
      const countryDetails = countriesList.find(
        country => country.iso === blocked.country.countryCode
      );

      return {
        id: blocked.id,
        country: {
          id: blocked.country.id,
          countryCode: blocked.country.countryCode,
          countryName: countryDetails?.printableName || 'Unknown Country'
        }
      };
    });

    return {
      ...regulation,
      logo: regulation.logo ? regulation.logo : null,
      logoUrl: logoUrl,
      blockedCountries: blockedCountriesWithNames,
      smtp_password: regulation?.smtp_password ? '*********' : null
    };
  }

  async unbanCountries(id: number): Promise<any> {
    const getCountries = await this.settingsService.getCountriesIso();

    const blockedCountries = await this.regulationBlockedCountries.find({
      where: { regulation: { id } },
      relations: ['country'],
    });

    const blockedCountryCodes = blockedCountries.map(entry => entry.country.countryCode);

    const filteredCountries = getCountries.result.filter(country =>
      !blockedCountryCodes.includes(country.iso)
    );

    return filteredCountries;
  }


  async unblockCountry(id: number, countryCode: string): Promise<any> {
    const country = await this.regulationsCountriesRepository.findOne({
      where: { countryCode }
    });

    const blockedCountry = await this.regulationBlockedCountries.findOne({
      where: {
        country: { id: country?.id },
        regulation: { id },
      }
    });

    if (blockedCountry) {
      await this.regulationBlockedCountries.remove(blockedCountry);
    }
    return {
      message: 'Regulation country unblocked successfully',
    };
  }


  // async blockCountry(id: number, dto: BlockCountriesDto): Promise<any> {

  //   const {countryIso}= dto
  //   const country = await this.regulationsCountriesRepository.findOne({
  //     where: { countryCode: countryIso },
  //   });

  //   const blockedCountry = await this.regulationBlockedCountries.find({
  //     where: {
  //       regulation: { id }, 
  //       country: { id:country?.id },  
  //     },
  //   });

  //   if (!blockedCountry) {
  //     await this.regulationBlockedCountries.create({
  //       country: { id:country?.id },
  //       regulation: { id }
  //     });
  //   }

  //   return blockedCountry;
  // }

  async blockCountry(id: number, countryCode: string): Promise<any> {
    const country = await this.regulationsCountriesRepository.findOne({
      where: { countryCode }
    });

    const regulation = await this.regulationRepository.findOne({
      where: { id }
    });

    if (country && regulation) {
      const existingBlockedCountry = await this.regulationBlockedCountries.findOne({
        where: {
          country: { id: country.id },
          regulation: { id: regulation.id }
        }
      });

      if (!existingBlockedCountry) {
        const blockedCountry = this.regulationBlockedCountries.create({
          country,
          regulation
        });

        await this.regulationBlockedCountries.save(blockedCountry);
      }

    }
    return {
      message: 'Regulation country blocked successfully',
    };
  }

  async update(id: number, updateRegulationDto: UpdateRegulationDto, req: any): Promise<any> {
    const { translations,
      //  blockedCountries, 
      ...updateData } = updateRegulationDto;

    const regulation = await this.regulationRepository.findOne({
      where: { id },
      relations: ['translations', 'blockedCountries', 'blockedCountries.country'],
    });

    if (!regulation) {
      throw new NotFoundException(`Regulation with ID ${id} not found`);
    }
    let encryptedPassword: string | undefined = undefined;
    if(updateData?.smtp_password){
    encryptedPassword = await this.encrypt(updateData.smtp_password);
    }

    const validRegulationFields = {
      name: updateData.name,
      postalCode: updateData.postalCode,
      website: updateData.website,
      contact: updateData.contact,
      logo: updateData.logo,
      subDomain: updateData.subDomain,
      domainExtension: updateData.domainExtension,
      regulatedByLabel : {id : updateData.regulatedByLabelId},
      licenseLabel : {id : updateData.licenseLabelId},
      smtp_password: encryptedPassword,
      domain: updateData.domain,
      clientportal_url: updateData.clientportal_url,
      smtp_host: updateData.smtp_host,
      smtp_port: updateData.smtp_port,
      smtp_username: updateData.smtp_username,
      smtp_secure: updateData.smtp_secure,
      from_email : updateData.from_email
    };

    await this.regulationRepository.update(id, validRegulationFields);

    if (translations) {
      await this.translationRepository.delete({ regulation: { id } });

      const newTranslations = translations.map(translation =>
        this.translationRepository.create({
          regulation,
          ...translation,
        })
      );
      await this.translationRepository.save(newTranslations);
    }

    const updatedRegulation = await this.regulationRepository.findOne({
      where: { id },
      relations: ['translations', 'blockedCountries', 'blockedCountries.country'],
    });

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updatedRegulation,
      oldData: regulation,
      entityId: regulation?.id,
      entityType: entityType.REGULATION,
      performerId: req.user?.id,
      performerType: performerType.OPERATOR,
      field: 'Regulation Updated',
    });

    // if (blockedCountries && blockedCountries.length > 0) {
    //   const countryCode = blockedCountries[0];
    //   const country = await this.regulationsCountriesRepository.findOne({
    //     where: { countryCode },
    //   });

    //   if (!country) {
    //     throw new NotFoundException(`Country with code ${countryCode} not found`);
    //   }

    //   const isAlreadyBlocked = regulation.blockedCountries
    //     .some(bc => bc.country.countryCode === countryCode);

    //   if (!isAlreadyBlocked) {
    //     const blockedCountry = this.regulationBlockedCountries.create({
    //       regulation,
    //       country,
    //     });

    //     await this.regulationBlockedCountries.save(blockedCountry);
    //   }
    // } 

    return {
      message: 'Regulation updated successfully',
    };
  }

  async remove(id: number, req: any): Promise<any> {
    const regulation = await this.regulationRepository.findOne({ where: { id } });

    if (!regulation) {
      throw new NotFoundException(`Regulation with ID ${id} not found`);
    }

    const isAssignedToClient = await this.clientRepository.count({
      where: {
        regulation: {
          id
        }
      }
    })

    if (isAssignedToClient) {
      throw new BadRequestException(`Regulation with ID ${id} has already been assigned to clients`);
    }

    const deletedRegulation = await this.regulationRepository.softDelete(id);
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: deletedRegulation,
      oldData: regulation,
      entityId: regulation?.id,
      entityType: entityType.REGULATION,
      performerId: req.user?.id,
      performerType: performerType.OPERATOR,
      field: 'Regulation Deleted',
    });
    return { message: `Regulation with ID ${id} has been removed` };
  }

  async getAllowedRegulations(countryCode: string) {
    const i18n = I18nContext.current();
    const currentLangCode = i18n?.lang.toLowerCase();
    const getDefaultCountry = await this.regulationsCountriesRepository.findOne({where:{countryCode : countryCode }, relations : ['regulation', 'regulation.regulatedByLabel','regulation.regulatedByLabel.labelTranslation' , 'regulation.regulatedByLabel.labelTranslation.regulation','regulation.licenseLabel', 'regulation.licenseLabel.labelTranslation', 'regulation.licenseLabel.labelTranslation.regulation' ]})
    const blockedRegulations = await this.regulationBlockedCountries.find({
      where: {
        country: {
          countryCode: countryCode
        }
      },
      relations: ['regulation']
    });
    const defaultLabelTranslation = getDefaultCountry?.regulation?.regulatedByLabel?.labelTranslation?.find(
      trans => trans.langCode === currentLangCode && trans.regulation.id === getDefaultCountry?.regulation?.id
    );
    const defaultLicenseLabelTranslaation = getDefaultCountry?.regulation?.licenseLabel?.labelTranslation?.find(
      trans => trans.langCode === currentLangCode && trans.regulation.id === getDefaultCountry?.regulation?.id
    );

    const blockedRegulationIds = blockedRegulations
      .filter(br => br?.regulation?.id)
      .map(br => br.regulation.id);

    const allowedRegulations = await this.regulationRepository.find({
      where: blockedRegulationIds.length > 0 ? {
        id: Not(In(blockedRegulationIds))
      } : {},
      relations: ['regulatedByLabel','regulatedByLabel.labelTranslation','licenseLabel', 'licenseLabel.labelTranslation']
    });

    // Utility to omit specified keys from an object
    const omitKeys = (obj: any, keys: string[]) => {
      if (!obj) return obj;
      const newObj = { ...obj };
      keys.forEach(key => {
        delete newObj[key];
      });
      return newObj;
    };
    const keysToRemove = [
      'smtp_host',
      'smtp_port',
      'smtp_username',
      'smtp_password',
      'smtp_secure',
      'idwise_required',
      'from_email',
      'tradingGroupPrefix',
      'tradingGroupSuffix',
    ];

    const regulationsWithTranslations = allowedRegulations.map(regulation => {
      const labelTranslation = regulation.regulatedByLabel?.labelTranslation?.find(
        trans => trans.langCode === currentLangCode
      );
      const licenseLabelTranslaation = regulation.licenseLabel?.labelTranslation?.find(
        trans => trans.langCode === currentLangCode
      );

      const reg = {
        ...regulation,
        regulatedByLabel: {
          id: labelTranslation?.id,
          text: labelTranslation?.text,
          langCode: labelTranslation?.langCode,
        },
        licenseLabel: {
          id: licenseLabelTranslaation?.id,
          text: licenseLabelTranslaation?.text,
          langCode: licenseLabelTranslaation?.langCode,
        },
      };
      return omitKeys(reg, keysToRemove);
    });

    const defaultRegulation = omitKeys({
      ...getDefaultCountry?.regulation,
      regulatedByLabel: {
        id: defaultLabelTranslation?.id,
        text: defaultLabelTranslation?.text,
        langCode: defaultLabelTranslation?.langCode,
      },
      licenseLabel: {
        id: defaultLicenseLabelTranslaation?.id,
        text: defaultLicenseLabelTranslaation?.text,
        langCode: defaultLicenseLabelTranslaation?.langCode,
      },
    }, keysToRemove);

    const domainExtension = defaultRegulation?.domainExtension || []

    const regulationsWithTranslationsWithDomainExtension = regulationsWithTranslations.map((r)=>{
      const domainExtension = r?.domainExtension || []
      return {
        ...r,
        domainExtension
      }
    })
    return {
      defaultRegulation:{
        ...defaultRegulation,
        domainExtension
      },
      allRegulations: regulationsWithTranslationsWithDomainExtension
    };
  }

  async encrypt(text: string): Promise<string> {
    const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), this.iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return this.iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  async testSmtp(id:number, userId: number): Promise<any> {

    const existingRegulation = await this.regulationRepository.findOne({
      where: {id},
    });

    if (!existingRegulation) {
      throw new BadRequestException('Regulation with this id not found');
    }

    const user = await this.userRepository.findOne({
      where:{
        id: userId
      }
    })
    let userEmail;
    userEmail= user?.email

    return await this.sendEmailService.sendEmailToOperatorWithoutVariable({
      emailEventName: RegulationEmailEvent.TEST_SMTP,
      to: userEmail,
      testSmtp:true,
      testSmtpId: id
    })
  }
}
