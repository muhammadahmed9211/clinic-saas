import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePspCountryDto } from './dto/create-psp-country.dto';
import { UpdatePspCountryDto } from './dto/update-psp-country.dto';
import { PspCountriesPriority } from 'src/psp/entities/psp-countries-priority.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { Countries } from 'src/psp/entities/countries.entity';
import { PSP } from 'src/transaction/entities/psp.entity';
import { AggregatorNames } from 'src/aggregator/entities/aggregator.entity';
import { PspCountriesPriorityConfig } from 'src/psp/entities/psp-countries-priority-config.entity';
import {
  ActiveLogService,
  ActivityFields,
} from 'src/admin/active-log/active-log.service';
import { entityType } from 'src/admin/active-log/active-log.type';
import { PspCountriesPriorityConfigRepository } from './repositories/psp-countries-priority-config.repository';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';

@Injectable()
export class PspCountryService {
  constructor(
    @InjectRepository(PspCountriesPriority)
    private readonly pspCountriesPriorityRepository: Repository<PspCountriesPriority>,
    @InjectRepository(Countries)
    private readonly countriesRepository: Repository<Countries>,
    @InjectRepository(PSP)
    private readonly pspRepository: Repository<PSP>,
    private readonly pspCountriesPriorityConfigRepository: PspCountriesPriorityConfigRepository,
    private readonly activityLogsService: ActiveLogService,
  ) {}

  async create(createPspCountryDto: CreatePspCountryDto, userId: number) {
    const { countriesId, pspIds } = createPspCountryDto;
    const isExist = await this.pspCountriesPriorityRepository.findOne({
      where: {
        countryId: In(countriesId),
      },
      relations: {
        country: true,
      },
    });

    if (isExist) {
      throw new BadRequestException(
        `A priority already exists for the country ${isExist.country.name}.`,
      );
    }

    const countries = await this.countriesRepository.find({
      where: {
        id: In(countriesId),
        name: Not('Any'),
      },
    });

    if (countries.length !== countriesId.length) {
      throw new BadRequestException(`Invalid countriesId.`);
    }

    const psp = await this.pspRepository.find({
      where: {
        id: In(pspIds),
        isOperational: true,
        isActive: true,
        aggregator: {
          name: AggregatorNames.LOCAL_GATEWAY,
        },
      },
    });

    if (psp.length !== pspIds.length) {
      throw new BadRequestException(`Invalid pspIds.`);
    }


    const pspMap = new Map<number,PSP>()

    let priority = '';

    for (let i = 0; i < psp.length; i++) {
      const ele = psp[i];
      pspMap.set(ele.id , ele)
    }

    for (let i = 0; i < pspIds.length; i++) {
      const pspId = pspIds[i];
      const psp = pspMap.get(pspId);
      const name = psp?.displayName;
      const prefix = i === 0 ? '' : ', ';
      priority += `${prefix}${name}`;
    }

    const configs: PspCountriesPriorityConfig[] = [];

    const priorities: PspCountriesPriority[] = [];

    for (let i = 0; i < countriesId.length; i++) {
      const countryId = countriesId[i];
      const data = this.pspCountriesPriorityConfigRepository.create({
        countryId,
        userId,
        priority,
      });
      configs.push(data);
    }

    const pspConfigs =
      await this.pspCountriesPriorityConfigRepository.save(configs);

    for (let i = 0; i < pspConfigs.length; i++) {
      const config = pspConfigs[i];
      const countryId = config.countryId;

      for (let j = 0; j < pspIds.length; j++) {
        const priority = j + 1;
        const pspId = pspIds[j];
        const data = this.pspCountriesPriorityRepository.create({
          countryId,
          pspId,
          priority,
          config,
        });
        priorities.push(data);
      }
    }

    await this.pspCountriesPriorityRepository.save(priorities);

    const entities = await this.pspCountriesPriorityConfigRepository.find({
      where: {
        id: In(pspConfigs.map((p) => p.id)),
      },
      relations: {
        psp: {
          psp: true,
        },
        country: true,
      },
    });

    for (let i = 0; i < entities.length; i++) {
      const config = entities[i];
      this.activityLogsService.emitLog({
        entityId: config.id,
        entityType: entityType.PSP_COUNTRY_PRIORITY_CONFIG,
        field: ActivityFields.RECORD_CREATED,
        newData: config,
        oldData: null,
        performerId: userId,
      });
    }

    return entities;
  }

  findAll(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    userId: number,
  ) {
    return this.pspCountriesPriorityConfigRepository.advanceFilters({
      limit,
      page,
      listName: ListNames.PSP_COUNTRY_PRIORITY,
      relations: ['user', 'country', 'user'],
      filterList: body.filters,
      sortList: body.sort,
      userId,
      defaultSortKey: 'createdAt',
      listViewId: body.listViewId,
    });
  }

  async findOne(id: number) {
    const entity = this.pspCountriesPriorityConfigRepository.findOne({
      where: {
        id,
      },
      relations: {
        psp: {
          psp: true,
        },
        country: true,
      },
    });
    return entity;
  }

  async update(
    configId: number,
    updatePspCountryDto: UpdatePspCountryDto,
    userId: number,
  ) {
    const { pspIds } = updatePspCountryDto;

    const config = await this.pspCountriesPriorityConfigRepository.findOne({
      where: {
        id: configId,
      },
      relations: {
        psp: {
          psp: true,
        },
        country: true,
      },
    });

    if (!config) {
      throw new BadRequestException(`Invalid configId.`);
    }

    const psp = await this.pspRepository.find({
      where: {
        id: In(pspIds),
        isOperational: true,
        isActive: true,
        aggregator: {
          name: AggregatorNames.LOCAL_GATEWAY,
        },
      },
    });

    if (psp.length !== pspIds.length) {
      throw new BadRequestException(`Invalid pspIds.`);
    }

    const pspMap = new Map<number,PSP>()

    let priority = '';

    for (let i = 0; i < psp.length; i++) {
      const ele = psp[i];
      pspMap.set(ele.id , ele)
    }

    for (let i = 0; i < pspIds.length; i++) {
      const pspId = pspIds[i];
      const psp = pspMap.get(pspId);
      const name = psp?.displayName;
      const prefix = i === 0 ? '' : ', ';
      priority += `${prefix}${name}`;
    }

    const countryId = config.countryId;

    await this.pspCountriesPriorityRepository.delete({ countryId });

    const priorities: PspCountriesPriority[] = [];

    for (let i = 0; i < pspIds.length; i++) {
      const pspId = pspIds[i];
      const priority = i + 1;
      const data = this.pspCountriesPriorityRepository.create({
        countryId,
        pspId,
        priority,
        config,
      });
      priorities.push(data);
    }
    await this.pspCountriesPriorityConfigRepository.update(config.id, {
      priority,
    });
    const data = await this.pspCountriesPriorityRepository.save(priorities);

    const entity = await this.pspCountriesPriorityConfigRepository.findOne({
      where: {
        id: configId,
      },
      relations: {
        psp: {
          psp: true,
        },
        country: true,
      },
    });

    if (!entity) {
      throw new BadRequestException('Config not found');
    }

    this.activityLogsService.emitLog({
      entityId: entity.id,
      entityType: entityType.PSP_COUNTRY_PRIORITY_CONFIG,
      field: ActivityFields.DETAILS_UPDATED,
      newData: entity,
      oldData: config,
      performerId: userId,
    });

    return entity;
  }

  async remove(configId: number, userId: number) {
    const config = await this.pspCountriesPriorityConfigRepository.findOne({
      where: {
        id: configId,
      },
      relations: {
        psp: {
          psp: true,
        },
        country: true,
      },
    });

    if (!config) {
      throw new BadRequestException(`Invalid configId.`);
    }

    const countryId = config.countryId;

    await this.pspCountriesPriorityRepository.delete({
      countryId,
    });

    await this.pspCountriesPriorityConfigRepository.delete({
      id: config.id,
    });

    this.activityLogsService.emitLog({
      entityId: config.id,
      entityType: entityType.PSP_COUNTRY_PRIORITY_CONFIG,
      field: ActivityFields.DETAILS_UPDATED,
      newData: null,
      oldData: config,
      performerId: userId,
    });

    return config;
  }

  async getPsp() {
    const psp = await this.pspRepository.find({
      where: {
        aggregator: {
          name: AggregatorNames.LOCAL_GATEWAY,
        },
        isActive: true,
        isOperational: true,
      },
    });
    return psp;
  }

  async getCountries() {
    const countries = await this.countriesRepository.find({
      where: {
        name: Not('Any'),
      },
    });
    return countries;
  }
}
