import { HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillingInformationDto } from './dto/create-billing-information.dto';
import { UpdateBillingInformationDto } from './dto/update-billing-information.dto';
import { BillingInformationRepository } from './repositories/billing-information.repository';
import { User } from 'src/users/entities/user.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Countries } from 'src/psp/entities/countries.entity';

@Injectable()
export class BillingInformationService {
  constructor(
    private readonly billingInformationRepository: BillingInformationRepository,
    @InjectRepository(Countries) private readonly countriesRepository: Repository<Countries>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(
    createBillingInformationDto: CreateBillingInformationDto,
    userId: number,
  ) {
    const isExist = await this.billingInformationRepository.findOne({
      where: { user: { id: userId } },
    });
    if (isExist) {
      throw new HttpException('User already has a billing information', 400);
    }
    const user = new User();
    user.id = userId;

    let countryInfo: Countries | undefined | null;
    if (createBillingInformationDto.country) {
      countryInfo = await this.countriesRepository.findOneBy({
        iso: createBillingInformationDto.country
      })
    }
    await this.cacheManager.del(`get-me-api-${userId}`);

    const entity = await this.billingInformationRepository.insertOne({
      ...createBillingInformationDto,
      ...(countryInfo ? {countryInfo} : {}),
      user,
    });
    return entity;
  }

  async findOne(userId: number) {
    const entity = await this.billingInformationRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!entity) {
      throw new NotFoundException('User does not have a billing information');
    }
    return entity;
  }

  async findUserBillingInfo(userId: number) {
    const entity = await this.billingInformationRepository.findOne({
      where: { user: { id: userId } },
    });
    return entity;
  }

  async update(
    userId: number,
    updateBillingInformationDto: UpdateBillingInformationDto,
  ) {
    let countryInfo: Countries | undefined | null;
    await this.cacheManager.del(`get-me-api-${userId}`);
    if (updateBillingInformationDto.country) {
      countryInfo = await this.countriesRepository.findOneBy({
        iso: updateBillingInformationDto.country
      })
    }
    return this.billingInformationRepository.updateOne(
      { user: { id: userId } },
      { ...updateBillingInformationDto, ...(countryInfo ? {countryInfo} : {}) },
    );
  }
}
