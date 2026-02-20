import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartnerDTO } from './dto/create-partner.dto';
import { PartnerRepository } from './repositories/partner.repository';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdatePartnerDTO } from './dto/update-partner.dto';
import { EntityManager, IsNull, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GeneratePartnerLinkDto,
  UpdateGeneratedLinkDto,
} from './dto/generate-partner-link.dto';
import { ConfigService } from '@nestjs/config';

import crypto from 'crypto';
import { CreatePartnerLinkDto } from './dto/create-partner-link.dto';
import { LinkType, partner_links } from './entities/partner-links.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventTypes } from 'src/common/services/event.type';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { User } from 'src/users/entities/user.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { Operator } from '../custom-dropdown/custom-dropdown/entities/operator.entity';
import { I18nContext } from 'nestjs-i18n';
import { PartnerTradingGroups } from 'src/settings/entities/partner-trading-groups.entity';
import { Office } from '../custom-dropdown/custom-dropdown/entities/office.entity';
import { DeskType } from '../custom-dropdown/custom-dropdown/entities/desk_type.entity';
import { Desk } from '../custom-dropdown/custom-dropdown/entities/desk.entity';
import { ActiveStatus, Partner } from 'src/settings/entities/partner.entity';
import { AllConfigType } from 'src/config/config.type';
import { UpdatePartnerConfigDto } from './dto/update-partner-config.dto';
import { OperatorDeskRel } from '../custom-dropdown/custom-dropdown/entities/operator-desk.entity';
import { Client } from 'src/users/entities/client.entity';
import { NullableType } from 'src/utils/types/nullable.type';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { PlugitService } from 'src/plugit/plugit.service';
import { LeadsRepository } from '../leads/repositories/lead.repository';
import { actionType, entityType } from '../active-log/active-log.type';
import ISO6391 from 'iso-639-1';
import { UpdatePartnerLinkUrlDto } from './dto/update-partner-link.dto';
import { UpdatePartnerProfileAssignmentDto } from './dto/update-partner-profile-assignment.dto';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { IbProfileService } from 'src/ib/ib_profile/ib_profile.service';
import { PartnerType } from '../custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { ClientService } from '../client/client.service';

@Injectable()
export class PartnerService {
  constructor(
    @InjectRepository(partner_links)
    private readonly partnerLinksRepository: Repository<partner_links>,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly partnerRepository: PartnerRepository,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Operator)
    private readonly operatorRepository: Repository<Operator>,
    @InjectRepository(PartnerTradingGroups)
    private readonly partnerGroupRepository: Repository<PartnerTradingGroups>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(DeskType)
    private readonly deskTypeRepository: Repository<DeskType>,
    @InjectRepository(Desk)
    private readonly deskRepository: Repository<Desk>,
    @InjectRepository(OperatorDeskRel)
    private readonly operatorDeskRelRepository: Repository<OperatorDeskRel>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly plugitService: PlugitService,
    private readonly leadRepository: LeadsRepository,
    private entityManager: EntityManager,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    @InjectRepository(Regulations)
    private readonly regulationsRepository: Repository<Regulations>,
    private readonly ibProfileService: IbProfileService,
    @InjectRepository(PartnerType)
    private readonly partnerTypeRepository: Repository<PartnerType>,
    private readonly clientService: ClientService
  ) { }

  generateUuid() {
    const buffer = crypto.randomBytes(16);
    buffer[6] = (buffer[6] & 0x0f) | 0x40;
    buffer[8] = (buffer[8] & 0x3f) | 0x80;
    const uuid = `${buffer.toString('hex', 0, 4)}-${buffer.toString(
      'hex',
      4,
      6,
    )}-${buffer.toString('hex', 6, 8)}-${buffer.toString(
      'hex',
      8,
      10,
    )}-${buffer.toString('hex', 10, 16)}`;
    return uuid;
  }

  async createPartner(
    createPartnerDTO: CreatePartnerDTO,
    userJwtPayload: JwtPayloadType,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const existPartner = await this.partnerRepository.findOne({
      where: { email: createPartnerDTO.email },
    });
    if (existPartner) {
      const message = await i18n?.t('errors.auth.emailExists');
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const uuid = this.generateUuid();
    if (createPartnerDTO.operatorId) {
      const createPartnerDTOWithStrings = {
        ...createPartnerDTO,
        allowedCountry: JSON.stringify(createPartnerDTO.allowedCountry),
        blockedCountry: JSON.stringify(createPartnerDTO.blockedCountry),
        country: createPartnerDTO.country,
        uuid,
      };
      const savedPartner = await this.partnerRepository.save(
        await this.partnerRepository.create(createPartnerDTOWithStrings),
      );

      await this.ibProfileService.assignDefaultProfiles(savedPartner.id)

      await this.operatorRepository.update(createPartnerDTO.operatorId, {
        isPartner: true,
        partnerId: savedPartner.id,
      });

      await this.userRepository.update(
        { operator: { id: createPartnerDTO.operatorId } },
        { isPartner: true },
      );

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: null,
        entityId: savedPartner.id,
        entityType: 'Affiliate',
        performerId: userJwtPayload.id,
        performerType: 'Operator',
        field: 'Partner Created',
      });

      await this.createPartnerTradingGroup(savedPartner);
      return savedPartner;
    }
    const existingPartner = await this.userRepository.findOne({
      where: { email: createPartnerDTO.email },
    });

    if (existingPartner) {
      const createPartnerDTOWithStrings = {
        ...createPartnerDTO,
        allowedCountry: JSON.stringify(createPartnerDTO.allowedCountry),
        blockedCountry: JSON.stringify(createPartnerDTO.blockedCountry),
        country: createPartnerDTO.country,
        uuid,
      };
      const savedPartner = await this.partnerRepository.save(
        this.partnerRepository.create(createPartnerDTOWithStrings),
      );

      await this.userRepository.update(
        { id: existingPartner.id },
        { isPartner: true, partnerId: savedPartner.id },
      );

      const client = await this.clientRepository.findOne({
        where: { user: { id: existingPartner.id } },
      });

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData: null,
        oldData: null,
        entityId: savedPartner.id,
        entityType: 'Affiliate',
        performerId: userJwtPayload.id,
        performerType: 'Operator',
        field: 'Partner Created',
      });

      await this.createPartnerTradingGroup(savedPartner, client?.affid);
      return savedPartner;
    }
    const createPartnerDTOWithStrings = {
      ...createPartnerDTO,
      allowedCountry: JSON.stringify(createPartnerDTO.allowedCountry),
      blockedCountry: JSON.stringify(createPartnerDTO.blockedCountry),
      country: createPartnerDTO.country,
      uuid,
    };
    // const partner = this.partnerRepository.create(createPartnerDTOWithStrings);
    const savedPartner = await this.partnerRepository.save(
      await this.partnerRepository.create(createPartnerDTOWithStrings),
    );
    await this.userRepository.save(
      this.userRepository.create({
        firstName: savedPartner.contactName,
        email: savedPartner.email,
        isPartner: true,
        partnerId: savedPartner.id,
        password: createPartnerDTO.password,
        status: { id: 1 },
        role: { id: RoleEnum.partner },
      }),
    );

    savedPartner.country = savedPartner.country;
    savedPartner.allowedCountry = JSON.parse(savedPartner.allowedCountry);
    savedPartner.blockedCountry = JSON.parse(savedPartner.blockedCountry);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: savedPartner.id,
      entityType: 'Affiliate',
      performerId: userJwtPayload.id,
      performerType: 'Operator',
      field: 'Partner Created',
    });

    const partnerGroup = await this.createPartnerTradingGroup(savedPartner);

    return savedPartner;
  }

  async getAllPartners(
    limit: number,
    page: number,
    userId: number,
    dto: ApplyListFilterSortColumnDto,
  ): Promise<any> {
    return await this.partnerRepository.advanceFilters({
      limit,
      page,
      userId,
      relations: ['referrer', "commissionProfile"],
      filterList: dto.filters || undefined,
      listName: ListNames.PARTNER,
      sortList: dto.sort || undefined,
      defaultSortKey: 'created_at',
      listViewId: dto.listViewId,
      filters: [
        {
          name: 'operatorId',
          operation: FilterOperation.EQUALS,
          //@ts-expect-error error
          value: [null],
        },
      ],
    });
  }

  async getSinglePartner(id: number): Promise<any> {
    const partner = await this.partnerRepository.findOne({
      where: { id }, relations: {
        commissionProfiles: {
          commissionProfile: true
        },
        mt5Account: true,
        partnerType: true,
      }
    });
    if (partner) {
      partner.country = partner.country;
      partner.allowedCountry = JSON.parse(partner.allowedCountry);
      partner.blockedCountry = JSON.parse(partner.blockedCountry);
    }
    const i18n = I18nContext.current();
    if (!partner) {
      const message = await i18n?.t('errors.partner.notFound');
      throw new NotFoundException(message);
    }
    if (partner.ibPath) {

      const masterIb = await this.partnerRepository.findOne({
        where: { id: partner.masterIbId, status: ActiveStatus.ACTIVE },
      });
      if (!masterIb) {
        return partner.ibPath
      }
      if (masterIb.id !== Number(id)) {
        partner.ibPath = partner.userIbId + ' > ' + (masterIb.ibPath || masterIb.userIbId);
      }
    }
    return partner;
  }

  async updatePartner(
    id: number,
    updatePartnerDTO: UpdatePartnerDTO,
    userId: number,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerNotFound');
    const partner = await this.partnerRepository.findOne({ where: { id } });

    if (!partner) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const oldPartner = JSON.parse(JSON.stringify(partner));

    if (updatePartnerDTO.userIbId) {
      const mt5Account = await this.mt5AccountRepository.findOne({ where: { login: updatePartnerDTO.userIbId } });
      if (!mt5Account) {
        throw new BadRequestException('MT5 account not found');
      }
      partner.mt5Account = mt5Account;
    }

    const parsedUpdatePartnerDTO = {
      ...updatePartnerDTO,
      country: updatePartnerDTO.country,
      allowedCountry: JSON.stringify(updatePartnerDTO.allowedCountry),
      blockedCountry: JSON.stringify(updatePartnerDTO.blockedCountry),
    };

    Object.assign(partner, parsedUpdatePartnerDTO);
    const updatePartner = await this.partnerRepository.save(partner);

    await this.userRepository.update(
      { email: updatePartner.email },
      {
        firstName: updatePartner.contactName,
        partnerId: updatePartner.id,
        country: updatePartner.country,
        telephone: updatePartner.telephone,
      },
    );

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updatePartner,
      oldData: oldPartner,
      entityId: partner.id,
      entityType: 'Affiliate',
      performerId: userId,
      performerType: 'Operator',
      field: 'Partner Update',
    });

    const user = await this.userRepository.findOne({
      where: { email: updatePartner.email },
    });

    await this.cacheManager.del(`get-me-api-${user?.id}`);

    return { message: 'partner updated successfully' };
  }

  async updatePartnerConfig(
    id: number,
    dto: UpdatePartnerConfigDto,
    user: User,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerNotFound');

    const existingPartnerGroup = await this.partnerGroupRepository.findOne({
      where: { partner: { id: id } },
    });

    if (!existingPartnerGroup) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const oldConfig = JSON.parse(JSON.stringify(existingPartnerGroup));

    const desks = await this.deskRepository.find({
      where: [
        { id: oldConfig?.salesDesk, type: 0 },
        { id: oldConfig?.retentionDesk, type: 1 },
        { id: oldConfig?.kycDesk, type: 3 },
        { id: oldConfig?.supportDesk, type: 4 },
        { id: oldConfig?.financeDesk, type: 5 },
      ],
    });
    const office = await this.officeRepository.findOne({
      where: { id: oldConfig?.office },
    });
    let salesRep: Operator | null = null;
    let retentionRep: Operator | null = null;
    let newSalesRep: Operator | null = null;
    let newRetentionRep: Operator | null = null;
    if (dto.salesRep && dto.salesRep > 0) {
      salesRep = await this.operatorRepository.findOne({
        where: { id: oldConfig.salesRep },
      });
    }
    if (dto.retentionRep && dto.retentionRep > 0) {
      retentionRep = await this.operatorRepository.findOne({
        where: { id: oldConfig.retentionRep },
      });
    }

    const salesDesk = desks.find((desk) => desk.type === 0);
    const retentionDesk = desks.find((desk) => desk.type === 1);
    const kycDesk = desks.find((desk) => desk.type === 3);
    const supportDesk = desks.find((desk) => desk.type === 4);
    const financeDesk = desks.find((desk) => desk.type === 5);

    Object.assign(existingPartnerGroup, dto);
    if (dto.regulation) {
      existingPartnerGroup.regulation = { id: dto.regulation } as any;
    } else {
      existingPartnerGroup.regulation = oldConfig.regulation;
    }

    const result = await this.partnerGroupRepository.save(existingPartnerGroup);
    const newDesk = await this.deskRepository.find({
      where: [
        { id: result?.salesDesk, type: 0 },
        { id: result?.retentionDesk, type: 1 },
        { id: result?.kycDesk, type: 3 },
        { id: result?.supportDesk, type: 4 },
        { id: result?.financeDesk, type: 5 },
      ],
    });
    const newOffice = await this.officeRepository.findOne({
      where: { id: result?.office },
    });
    if (dto.salesRep && dto.salesRep > 0) {
      newSalesRep = await this.operatorRepository.findOne({
        where: { id: result.salesRep },
      });
    }
    if (dto.retentionRep && dto.retentionRep > 0) {
      newRetentionRep = await this.operatorRepository.findOne({
        where: { id: result.retentionRep },
      });
    }

    const newSalesDesk = newDesk.find((desk) => desk.type === 0);
    const newRetentionDesk = newDesk.find((desk) => desk.type === 1);
    const newKycDesk = newDesk.find((desk) => desk.type === 3);
    const newSupportDesk = newDesk.find((desk) => desk.type === 4);
    const newFinanceDesk = newDesk.find((desk) => desk.type === 5);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: {
        ...result,
        salesDesk: newSalesDesk?.name,
        retentionDesk: newRetentionDesk?.name,
        kycDesk: newKycDesk?.name,
        supportDesk: newSupportDesk?.name,
        financeDesk: newFinanceDesk?.name,
        office: newOffice?.name,
        salesRep: newSalesRep?.full_name,
        retentionRep: newRetentionRep?.full_name,
      },
      oldData: {
        ...oldConfig,
        salesDesk: salesDesk?.name,
        retentionDesk: retentionDesk?.name,
        kycDesk: kycDesk?.name,
        supportDesk: supportDesk?.name,
        financeDesk: financeDesk?.name,
        office: office?.name,
        salesRep: salesRep?.full_name,
        retentionRep: retentionRep?.full_name,
      },
      entityId: id,
      entityType: 'Affiliate',
      performerId: user.id,
      performerType: 'Operator',
      field: 'Partner Config Updated',
    });

    return result;
  }

  async deletePartner(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerNotFound');
    const partner = await this.partnerRepository.findOne({ where: { id } });

    if (!partner) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.partnerRepository.softDelete(id);

    return { message: 'partner deleted successfully' };
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
    userJwtPayload: JwtPayloadType,
  ): Promise<any> {
    const user = await this.partnerRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.password = updatePasswordDto.password;

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: null,
      oldData: null,
      entityId: user.id,
      entityType: 'Affiliate',
      performerId: userJwtPayload.id,
      performerType: 'Operator',
      field: 'Partner Password Updated',
    });

    return this.partnerRepository.save(user);
  }
  async getPartnerLinks(id: number): Promise<any> {
    return await this.partnerLinksRepository.find({ where: { partnerId: id, isActive: true } });
  }

  async getPartnerConfigById(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerNotFound');
    const partnerGroupConfig = await this.partnerGroupRepository.findOne({
      where: { partner: { id: id } },
      relations: ['regulation']
    });
    if (!partnerGroupConfig) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const result = { ...partnerGroupConfig, regulation: partnerGroupConfig.regulation ? partnerGroupConfig.regulation.id : null };
    return result;
  }
  async generatePartnerLink(
    headers: any,
    dto: GeneratePartnerLinkDto,
    userId: number,
    linkType: LinkType = LinkType.CLIENT
  ): Promise<any> {
    const tldRegex = /(\.[a-z]{2,6})$/i;
    const hostname = new URL(headers.origin).hostname;
    const match = hostname.match(tldRegex);
    const tld = match ? match[1] : '';
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerNotFound');
    const {
      partnerId,
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      popUnder,
      name,
      description,
      utmSource,
      source,
    } = dto;
    let baseUrl = this.configService.get('app.frontendDomain', {
      infer: true,
    });

    if (tld === '.ae') {
      baseUrl = this.configService.get('app.aeFrontendDomain', {
        infer: true,
      });
    }

    const partner = await this.partnerRepository.findOneBy({ id: partnerId });

    if (!partner) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (partnerId && dto.commissionProfileId) {
      await this.ibProfileService.getIbSingleCommissionProfile(partnerId, dto.commissionProfileId)
    }

    const partnerLink = new partner_links();

    const params = { p1, p2, p3, p4, p5, p6 };
    const paramsArray = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${value}`);

    let url = `${baseUrl}/register-live-trading-account-F1?partner_uuid=${partner.uuid}`;

    if (paramsArray.length > 0) {
      url += `&${paramsArray.join('&')}`;
    }

    if (popUnder !== undefined) {
      url += `&pu=${popUnder ? 'true' : 'false'}`;
    }
    if (source !== undefined) {
      url += `&source=${source}`;
    }
    if (utmSource !== undefined) {
      url += `&utmSource=${utmSource}`;
    }

    if (dto.commissionProfileId) {
      url += `&commissionProfileId=${dto.commissionProfileId}`;
      partnerLink.commissionProfileId = dto.commissionProfileId;
    }

    if (!dto.commissionProfileId && linkType !== LinkType.SUB_IB) {
      throw new BadRequestException("Commission profile is required")
    }

    if (dto.commissionProfileId && linkType === LinkType.SUB_IB) {
      throw new BadRequestException("Commission profile cannot be specified in the Sub IB onboarding URL")
    }

    if (linkType === LinkType.SUB_IB) {
      const partnerType = await this.partnerTypeRepository.findOne({
        where: {
          title: "Introducing Broker (IB)"
        }
      });
      if (partnerType) {
        url += `&partnerTypeId=${partnerType.id}`
        partnerLink.partnerTypeId = partnerType.id
      }
    }

    partnerLink.url = url;

    const partnerLinkWithPartnerId = {
      ...partnerLink,
      partnerId,
      ...(name && { name }),
      p1,
      p2,
      p3,
      p4,
      p5,
      p6,
      description,
      source,
      utmSource,
      linkType
    };
    const result = await this.partnerLinksRepository.save(
      partnerLinkWithPartnerId,
    );

    // If no name was provided, update the name with the partner link ID
    if (!name) {
      result.name = result.id.toString();
      await this.partnerLinksRepository.save(result);
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: dto,
      entityId: result.id,
      entityType: 'Affiliate',
      parentId: partner.id,
      parentType: 'Affiliate',
      performerId: userId,
      performerType: 'Operator',
      field: 'Partner Link Created',
    });

    return result;
  }

  async createPartnerLink(createPartnerLinkDto: CreatePartnerLinkDto) {
    const partnerLink =
      this.partnerLinksRepository.create(createPartnerLinkDto);

    return this.partnerLinksRepository.save(partnerLink);
  }

  async updatePartnerLink(
    id: number,
    dto: UpdateGeneratedLinkDto,
    userId: number,
    isPartnerUser?: boolean,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerNotFound');
    let partnerLink;
    if (isPartnerUser) {
      const userDetails = await this.userRepository.findOne({
        where: { id: userId, partner: { status: ActiveStatus.ACTIVE } },
      });
      if (!userDetails?.partnerId) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            error: {
              msg: message,
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      partnerLink = await this.partnerLinksRepository.findOneBy({ id, partnerId: userDetails?.partnerId });
    } else {
      partnerLink = await this.partnerLinksRepository.findOneBy({ id });
    }
    if (!partnerLink) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    let linkOld = {};

    if (partnerLink.url) {
      const paramList = partnerLink.url?.split('?')[1]?.split('&');

      paramList.map((param) => {
        const [key, value] = param.split('=');

        if (key === 'pu') {
          dto[key] =
            dto.popUnder !== undefined ? dto.popUnder.toString() : value;
          linkOld[key] = value;
        } else {
          dto[key] = dto[key] === undefined ? value : dto[key];
          linkOld[key] = value;
        }

        return { [key]: value };
      });
    }

    let brokerIds: any = undefined;

    if (dto.brokerIds) {
      brokerIds = JSON.stringify(dto.brokerIds);
    }

    if (partnerLink.partnerId && dto.commissionProfileId) {
      await this.ibProfileService.getIbSingleCommissionProfile(partnerLink.partnerId, dto.commissionProfileId)
    };

    const { partner_uuid, p1, p2, p3, p4, p5, p6, pu, utmMedium, campaignId, utmContent, utmTerm, utmCampaign } = dto;
    const params = { ...linkOld, partner_uuid, p1, p2, p3, p4, p5, p6, pu, utmMedium, campaignId, utmContent, utmTerm, utmCampaign };
    if (dto.commissionProfileId) {
      //@ts-expect-error type-error
      params.commissionProfileId = dto.commissionProfileId
    }
    const paramsArray = Object.entries(params)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${value}`);

    const paramsString = paramsArray.join('&');

    let url = partnerLink.url.split('?')[0];

    if (paramsString) {
      url += `?${paramsString}`;
    }

    partnerLink.url = url;

    const oldLink = JSON.parse(JSON.stringify(partnerLink));

    Object.assign(partnerLink, dto);
    const resp = await this.partnerLinksRepository.save({
      ...partnerLink,
      url,
      brokerIds,
    });

    if (resp.brokerIds) {
      resp.brokerIds = JSON.parse(resp.brokerIds.replace(/\\"/g, '"'));
    }

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: resp,
      oldData: { ...oldLink, ...linkOld },
      entityId: resp.id,
      entityType: 'Affiliate',
      parentId: resp.partnerId,
      parentType: 'Affiliate',
      performerId: userId,
      performerType: 'Operator',
      field: 'Update Partner Link',
    });

    return resp;
  }

  async deletePartnerLink(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerUrlNotFound');
    const result = await this.partnerLinksRepository.delete(id);
    if (result.affected === 0) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    return { message: 'Url deleted successfuly' };
  }

  async getPartnerLinkById(id: number): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerUrlNotFound');
    const partnerLink = await this.partnerLinksRepository.findOneBy({ id });

    if (!partnerLink?.url) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const url = new URL(partnerLink?.url);
    const params = Object.fromEntries(url.searchParams.entries());
    const popUnder = params.pu === 'true';

    delete params.pu;

    const allParams = {
      p1: params.p1 || null,
      p2: params.p2 || null,
      p3: params.p3 || null,
      p4: params.p4 || null,
      p5: params.p5 || null,
      p6: params.p6 || null,
    };

    if (partnerLink.brokerIds && typeof partnerLink.brokerIds === 'string') {
      partnerLink.brokerIds = JSON.parse(partnerLink.brokerIds);
    }

    return {
      ...allParams,
      popUnder,
      ...partnerLink,
    };
  }

  async getPartnersDowns(search?: string): Promise<any> {
    const searchCondition = search ? { name: Like(`%${search}%`) } : {};

    return this.partnerRepository.find({
      where: {
        ib: true,
        status: ActiveStatus.ACTIVE,
        ...searchCondition,
      },
      select: ['id', 'name', 'ib'],
      order: {
        name: 'ASC',
      },
    });
  }

  async createPartnerTradingGroup(partner: Partner, partnerId?: number) {
    // const desksTypes = await this.deskTypeRepository.find();
    // const office = await this.officeRepository.find();

    // const salesDesk = await this.deskRepository.findOne({
    //   where: {
    //     type: desksTypes.find((type) => type.name === 'sales')?.id ?? 0,
    //   },
    // });
    // const retentionDesk = await this.deskRepository.findOne({
    //   where: {
    //     type: desksTypes.find((type) => type.name === 'retention')?.id ?? 1,
    //   },
    // });
    // const supportDesk = await this.deskRepository.findOne({
    //   where: {
    //     type: desksTypes.find((type) => type.name === 'Support')?.id ?? 4,
    //   },
    // });
    // const financeDesk = await this.deskRepository.findOne({
    //   where: {
    //     type: desksTypes.find((type) => type.name === 'finance')?.id ?? 5,
    //   },
    // });
    // const kycDesk = await this.deskRepository.findOne({
    //   where: {
    //     type: desksTypes.find((type) => type.name === 'KYC')?.id ?? 3,
    //   },
    // });
    let partnerGroup: NullableType<PartnerTradingGroups> = null;

    if (partnerId) {
      partnerGroup = await this.partnerGroupRepository.findOne({
        where: { partner: { id: partnerId } },
      });
      if (!partnerGroup) {
        partnerGroup = await this.partnerGroupRepository.findOne({
          where: {
            partner: { name: 'Default' },
          },
        });
      }
    } else {
      partnerGroup = await this.partnerGroupRepository.findOne({
        where: {
          partner: { name: 'Default' },
        },
      });
    }

    return this.partnerGroupRepository.save(
      this.partnerGroupRepository.create({
        partner,
        office: partnerGroup?.office,
        kycDesk: partnerGroup?.kycDesk,
        supportDesk: partnerGroup?.supportDesk,
        salesDesk: partnerGroup?.salesDesk,
        retentionDesk: partnerGroup?.retentionDesk,
        financeDesk: partnerGroup?.financeDesk,
      }),
    );
  }

  async assignPartnerSetting({
    salesRep,
    desk,
    partnerUUID,
    speakingLanguage,
  }: {
    salesRep?: number;
    desk?: number;
    partnerUUID?: string;
    speakingLanguage?: string;
  }) {
    let salesRepDefaultSetting: PartnerTradingGroups | null = null;

    const defaultPartner = await this.partnerGroupRepository.findOne({
      where: { partner: { name: 'Default' } },
      relations: ['partner'],
    });

    let salesRepExist: User | null = null;

    let givenPartner: PartnerTradingGroups | null = null;

    let salesDesk: number | null = null;
    let office: number | undefined = undefined;

    if (speakingLanguage && speakingLanguage.length <= 2) {
      const language = ISO6391.getName(speakingLanguage.toLocaleLowerCase());
      speakingLanguage = language;
    }

    const createBaseQueryBuilder = () => {
      return this.operatorDeskRelRepository
        .createQueryBuilder('operatorDeskRel')
        .innerJoinAndSelect('operatorDeskRel.operator', 'operator')
        .innerJoinAndSelect('operatorDeskRel.desk', 'desk')
        .leftJoinAndSelect(
          'partner_trading_groups',
          'tradingGroup',
          'tradingGroup.partnerId = operator.partnerId',
        )
        .addSelect('tradingGroup')
        .where('operator.is_active = :isActive', { isActive: true })
        .andWhere('operator.autoLeadAssign = :autoLeadAssign', {
          autoLeadAssign: true,
        })
        .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
          speakingLanguage: `%${speakingLanguage}%`,
        });
    };

    if (salesRep) {
      salesRepExist = await this.userRepository.findOne({
        where: { operator: { id: salesRep }, isActive: true },
        relations: ['operator'],
      });

      if (salesRepExist) {
        const partnerGroup = await this.partnerGroupRepository.findOne({
          where: { partner: { operatorId: salesRepExist.operator.id } },
          relations: ['partner'],
        });

        if (!partnerGroup) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: {
                msg: `Sale operator default setting not found`,
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        const operatorDesk = await this.operatorDeskRelRepository.findOne({
          where: {
            operator: { id: salesRepExist.operator.id },
            desk: { type: 0 },
          },
          relations: ['operator', 'desk'],
        });

        if (!operatorDesk) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: {
                msg: `Operator sales desk not found`,
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        salesDesk = partnerGroup?.salesDesk
          ? partnerGroup.salesDesk
          : operatorDesk.desk.id;

        office = partnerGroup?.office
          ? partnerGroup.office
          : operatorDesk.desk.office_id;

        if (!office) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              error: {
                msg: `Desk office is null`,
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }

        return {
          partner: partnerGroup?.partner,
          operator: salesRepExist.operator,
          group: { ...partnerGroup, office, salesDesk },
        };
      }
    } else if (partnerUUID) {
      givenPartner = await this.partnerGroupRepository.findOne({
        where: { partner: { uuid: partnerUUID } },
        relations: ['partner'],
      });

      let salesRep: OperatorDeskRel | null = null;

      if (!givenPartner?.salesRep || givenPartner?.salesRep == 0) {
        const queryBuilder = createBaseQueryBuilder();

        if (givenPartner?.salesDesk && givenPartner.salesDesk > 0) {
          queryBuilder.andWhere('desk.id = :deskId', {
            deskId: givenPartner.salesDesk,
          });
        } else if (givenPartner?.office && givenPartner.office > 0) {
          queryBuilder
            .andWhere('desk.office_id = :deskOffice', {
              deskOffice: givenPartner.office,
            })
            .andWhere('desk.type = :deskType', { deskType: 0 });
        } else {
          queryBuilder.andWhere('desk.type = :deskType', { deskType: 0 });
        }

        salesRep = await queryBuilder
          .orderBy('operator.weeklyCount', 'ASC')
          .getOne();

        if (salesRep) {
          salesRepDefaultSetting = await this.partnerGroupRepository.findOne({
            where: { partner: { id: salesRep.operator.partnerId } },
          });

          salesDesk = givenPartner?.salesDesk
            ? givenPartner.salesDesk
            : salesRepDefaultSetting?.salesDesk
              ? salesRepDefaultSetting.salesDesk
              : salesRep.desk.id;
          office = givenPartner?.office
            ? givenPartner.office
            : salesRepDefaultSetting?.office
              ? salesRepDefaultSetting.office
              : salesRep.desk.office_id;

          await this.operatorRepository.update(salesRep.operator.id, {
            weeklyCount: salesRep.operator.weeklyCount + 1,
          });
        } else {
          queryBuilder.andWhere('desk.type = :deskType', { deskType: 0 });

          salesRep = await queryBuilder
            .orderBy('operator.weeklyCount', 'ASC')
            .getOne();

          if (salesRep) {
            if (salesRep.operator.partnerId) {
              salesRepDefaultSetting =
                await this.partnerGroupRepository.findOne({
                  where: { partner: { id: salesRep.operator.partnerId } },
                });
            }

            salesDesk = salesRepDefaultSetting?.salesDesk
              ? salesRepDefaultSetting.salesDesk
              : salesRep.desk.id;
            office = salesRepDefaultSetting?.office
              ? salesRepDefaultSetting.office
              : salesRep.desk?.office_id;

            await this.operatorRepository.update(salesRep.operator.id, {
              weeklyCount: salesRep.operator.weeklyCount + 1,
            });
          } else {
            const queryBuilder = createBaseQueryBuilder();

            queryBuilder
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              })
              .andWhere('desk.type = :deskType', { deskType: 0 });

            salesRep = await queryBuilder
              .orderBy('operator.weeklyCount', 'ASC')
              .getOne();

            if (salesRep) {
              office = givenPartner?.office
                ? givenPartner.office
                : salesRep.desk.office_id;
              salesDesk = givenPartner?.salesDesk
                ? givenPartner.salesDesk
                : salesRep.desk.id;

              await this.operatorRepository.update(salesRep.operator.id, {
                weeklyCount: salesRep.operator.weeklyCount + 1,
              });
            }
          }
        }
      } else {
        salesRep = await this.operatorDeskRelRepository.findOne({
          where: {
            operator: { id: givenPartner.salesRep, is_active: true },
            desk: { type: 0 },
          },
          relations: ['operator', 'desk'],
        });

        if (!salesRep) {
          const queryBuilder = createBaseQueryBuilder();

          if (givenPartner?.salesDesk && givenPartner.salesDesk > 0) {
            queryBuilder.andWhere('desk.id = :deskId', {
              deskId: givenPartner.salesDesk,
            });
          } else if (givenPartner?.office && givenPartner.office > 0) {
            queryBuilder
              .andWhere('desk.office_id = :deskOffice', {
                deskOffice: givenPartner.office,
              })
              .andWhere('desk.type = :deskType', { deskType: 0 });
          } else {
            queryBuilder.andWhere('desk.type = :deskType', { deskType: 0 });
          }

          salesRep = await queryBuilder
            .orderBy('operator.weeklyCount', 'ASC')
            .getOne();

          if (salesRep) {
            office = givenPartner.office
              ? givenPartner.office
              : salesRep.desk.office_id;
            salesDesk = givenPartner.salesDesk
              ? givenPartner.salesDesk
              : salesRep.desk.id;

            await this.operatorRepository.update(salesRep.operator.id, {
              weeklyCount: salesRep.operator.weeklyCount + 1,
            });
          } else {
            const queryBuilder = createBaseQueryBuilder();

            if (givenPartner?.salesDesk && givenPartner.salesDesk > 0) {
              queryBuilder
                .andWhere('desk.id = :deskId', {
                  deskId: givenPartner.salesDesk,
                })
                .andWhere('1=1')
                .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                  speakingLanguage: `%English%`,
                });
            } else if (givenPartner?.office && givenPartner.office > 0) {
              queryBuilder
                .andWhere('desk.office_id = :deskOffice', {
                  deskOffice: givenPartner.office,
                })
                .andWhere('desk.type = :deskType', { deskType: 0 })
                .andWhere('1=1')
                .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                  speakingLanguage: `%English%`,
                });
            } else {
              queryBuilder
                .andWhere('1=1')
                .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                  speakingLanguage: `%English%`,
                })
                .andWhere('desk.type = :deskType', { deskType: 0 });
            }

            salesRep = await queryBuilder
              .orderBy('operator.weeklyCount', 'ASC')
              .getOne();
          }
        }

        if (salesRep) {
          office = givenPartner.office
            ? givenPartner.office
            : salesRep.desk.office_id;
          salesDesk = givenPartner.salesDesk
            ? givenPartner.salesDesk
            : salesRep.desk.id;

          await this.operatorRepository.update(salesRep.operator.id, {
            weeklyCount: salesRep.operator.weeklyCount + 1,
          });
        }
      }

      return {
        partner: givenPartner?.partner,
        operator: salesRep?.operator,
        group: { ...givenPartner, office, salesDesk },
      };
    }

    let defaultSalesRep: OperatorDeskRel | null = null;

    if (!defaultPartner?.salesRep || defaultPartner?.salesRep == 0) {
      const queryBuilder = createBaseQueryBuilder();

      if (defaultPartner?.salesDesk && defaultPartner.salesDesk > 0) {
        queryBuilder.andWhere('desk.id = :deskId', {
          deskId: defaultPartner.salesDesk,
        });
      } else if (defaultPartner?.office && defaultPartner.office > 0) {
        queryBuilder
          .andWhere('desk.office_id = :deskOffice', {
            deskOffice: defaultPartner.office,
          })
          .andWhere('desk.type = :deskType', { deskType: 0 });
      }

      defaultSalesRep = await queryBuilder
        .orderBy('operator.weeklyCount', 'ASC')
        .getOne();

      if (defaultSalesRep) {
        if (defaultSalesRep.operator.partnerId) {
          salesRepDefaultSetting = await this.partnerGroupRepository.findOne({
            where: { partner: { id: defaultSalesRep.operator.partnerId } },
          });
        }

        salesDesk = defaultPartner?.salesDesk
          ? defaultPartner.salesDesk
          : salesRepDefaultSetting?.salesDesk
            ? salesRepDefaultSetting.salesDesk
            : defaultSalesRep.desk.id;
        office = defaultPartner?.office
          ? defaultPartner.office
          : salesRepDefaultSetting?.office
            ? salesRepDefaultSetting.office
            : defaultSalesRep.desk.office_id;

        await this.operatorRepository.update(defaultSalesRep.operator.id, {
          weeklyCount: defaultSalesRep.operator.weeklyCount + 1,
        });
      } else {
        queryBuilder.andWhere('desk.type = :deskType', { deskType: 0 });

        defaultSalesRep = await queryBuilder
          .orderBy('operator.weeklyCount', 'ASC')
          .getOne();

        if (defaultSalesRep) {
          salesRepDefaultSetting = await this.partnerGroupRepository.findOne({
            where: { partner: { id: defaultSalesRep.operator.partnerId } },
          });

          salesDesk = salesRepDefaultSetting?.salesDesk
            ? salesRepDefaultSetting.salesDesk
            : defaultSalesRep.desk.id;
          office = salesRepDefaultSetting?.office
            ? salesRepDefaultSetting.office
            : defaultSalesRep.desk?.office_id;

          await this.operatorRepository.update(defaultSalesRep.operator.id, {
            weeklyCount: defaultSalesRep.operator.weeklyCount + 1,
          });
        } else {
          const queryBuilder = createBaseQueryBuilder();

          if (defaultPartner?.salesDesk && defaultPartner.salesDesk > 0) {
            queryBuilder
              .andWhere('desk.id = :deskId', {
                deskId: defaultPartner.salesDesk,
              })
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              });
          } else if (defaultPartner?.office && defaultPartner.office > 0) {
            queryBuilder
              .andWhere('desk.office_id = :deskOffice', {
                deskOffice: defaultPartner.office,
              })
              .andWhere('desk.type = :deskType', { deskType: 0 })
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              });
          } else {
            queryBuilder
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              });
          }

          defaultSalesRep = await queryBuilder
            .orderBy('operator.weeklyCount', 'ASC')
            .getOne();

          if (defaultSalesRep) {
            salesDesk = defaultPartner?.salesDesk
              ? defaultPartner.salesDesk
              : defaultSalesRep.desk.id;
            office = defaultPartner?.office
              ? defaultPartner.office
              : defaultSalesRep.desk?.office_id;

            await this.operatorRepository.update(defaultSalesRep.operator.id, {
              weeklyCount: defaultSalesRep.operator.weeklyCount + 1,
            });
          } else {
            queryBuilder
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              })
              .andWhere('desk.type = :deskType', { deskType: 0 });

            defaultSalesRep = await queryBuilder
              .orderBy('operator.weeklyCount', 'ASC')
              .getOne();

            if (defaultSalesRep) {
              office = defaultPartner?.office
                ? defaultPartner.office
                : defaultSalesRep.desk.office_id;
              salesDesk = defaultPartner?.salesDesk
                ? defaultPartner.salesDesk
                : defaultSalesRep.desk.id;

              await this.operatorRepository.update(
                defaultSalesRep.operator.id,
                {
                  weeklyCount: defaultSalesRep.operator.weeklyCount + 1,
                },
              );
            } else {
              office = defaultPartner?.office && defaultPartner.office;
              salesDesk = defaultPartner?.salesDesk
                ? defaultPartner.salesDesk
                : null;
            }
          }
        }
      }
    } else {
      defaultSalesRep = await this.operatorDeskRelRepository.findOne({
        where: {
          operator: { id: defaultPartner.salesRep, is_active: true },
          desk: { type: 0 },
        },
        relations: ['operator', 'desk'],
      });

      if (!defaultSalesRep) {
        const queryBuilder = createBaseQueryBuilder();

        if (defaultPartner?.salesDesk && defaultPartner.salesDesk > 0) {
          queryBuilder.andWhere('desk.id = :deskId', {
            deskId: defaultPartner.salesDesk,
          });
        } else if (defaultPartner?.office && defaultPartner.office > 0) {
          queryBuilder
            .andWhere('desk.office_id = :deskOffice', {
              deskOffice: defaultPartner.office,
            })
            .andWhere('desk.type = :deskType', { deskType: 0 });
        } else {
          queryBuilder.andWhere('desk.type = :deskType', { deskType: 0 });
        }

        defaultSalesRep = await queryBuilder
          .orderBy('operator.weeklyCount', 'ASC')
          .getOne();

        if (defaultSalesRep) {
          office = defaultPartner.office
            ? defaultPartner.office
            : defaultSalesRep.desk.office_id;
          salesDesk = defaultPartner.salesDesk
            ? defaultPartner.salesDesk
            : defaultSalesRep.desk.id;

          await this.operatorRepository.update(defaultSalesRep.operator.id, {
            weeklyCount: defaultSalesRep.operator.weeklyCount + 1,
          });
        } else {
          const queryBuilder = createBaseQueryBuilder();

          if (defaultPartner?.salesDesk && defaultPartner.salesDesk > 0) {
            queryBuilder
              .andWhere('desk.id = :deskId', {
                deskId: defaultPartner.salesDesk,
              })
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              });
          } else if (defaultPartner?.office && defaultPartner.office > 0) {
            queryBuilder
              .andWhere('desk.office_id = :deskOffice', {
                deskOffice: defaultPartner.office,
              })
              .andWhere('desk.type = :deskType', { deskType: 0 })
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              });
          } else {
            queryBuilder
              .andWhere('1=1')
              .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
                speakingLanguage: `%English%`,
              });
          }

          defaultSalesRep = await queryBuilder
            .orderBy('operator.weeklyCount', 'ASC')
            .getOne();
        }
      }

      if (defaultSalesRep) {
        office = defaultPartner.office
          ? defaultPartner.office
          : defaultSalesRep.desk.office_id;
        salesDesk = defaultPartner.salesDesk
          ? defaultPartner.salesDesk
          : defaultSalesRep.desk.id;

        await this.operatorRepository.update(defaultSalesRep.operator.id, {
          weeklyCount: defaultSalesRep.operator.weeklyCount + 1,
        });
      } else {
        const queryBuilder = createBaseQueryBuilder();

        queryBuilder.andWhere('desk.type = :deskType', { deskType: 0 });

        defaultSalesRep = await queryBuilder
          .orderBy('operator.weeklyCount', 'ASC')
          .getOne();

        if (defaultSalesRep) {
          office = defaultPartner.office
            ? defaultPartner.office
            : defaultSalesRep.desk.office_id;
          salesDesk = defaultPartner.salesDesk
            ? defaultPartner.salesDesk
            : defaultSalesRep.desk.id;
        } else {
          queryBuilder
            .andWhere('1=1')
            .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
              speakingLanguage: `%English%`,
            })
            .andWhere('desk.type = :deskType', { deskType: 0 });

          defaultSalesRep = await queryBuilder
            .orderBy('operator.weeklyCount', 'ASC')
            .getOne();

          if (defaultSalesRep) {
            office = defaultPartner?.office
              ? defaultPartner.office
              : defaultSalesRep.desk.office_id;
            salesDesk = defaultPartner?.salesDesk
              ? defaultPartner.salesDesk
              : defaultSalesRep.desk.id;
          } else {
            office = defaultPartner.office && defaultPartner.office;
            salesDesk = defaultPartner.salesDesk && defaultPartner.salesDesk;
          }
        }
      }
    }

    return {
      partner: defaultPartner?.partner,
      operator: defaultSalesRep?.operator,
      group: { ...defaultPartner, office, salesDesk },
    };
  }

  async assignPartnerAndOperatorToClient(
    speakingLanguage: string,
    partnerUUID?: string,
    salesRepId?: number,
  ) {
    let partner: Partner | null;
    const defaultPartner = await this.partnerRepository.findOneBy({
      name: 'Default',
    });
    if (partnerUUID) {
      partner = await this.partnerRepository.findOneBy({ uuid: partnerUUID });
      if (!partner) {
        partner = defaultPartner;
      }
    } else if (salesRepId) {
      const partnerGroup = await this.partnerGroupRepository.findOne({
        where: { salesRep: salesRepId },
        relations: ['partner'],
      });
      partner = partnerGroup?.partner ? partnerGroup?.partner : defaultPartner;
    } else {
      partner = defaultPartner;
    }

    if (speakingLanguage.length <= 2) {
      const language = ISO6391.getName(speakingLanguage.toLocaleLowerCase());
      speakingLanguage = language;
    }

    let group = await this.partnerGroupRepository.findOneBy({
      partner: { id: partner?.id },
    });

    const createBaseQueryBuilder = () => {
      return this.operatorDeskRelRepository
        .createQueryBuilder('operatorDeskRel')
        .innerJoinAndSelect('operatorDeskRel.operator', 'operator')
        .innerJoinAndSelect('operatorDeskRel.desk', 'desk')
        .leftJoinAndSelect(
          'partner_trading_groups',
          'tradingGroup',
          'tradingGroup.partnerId = operator.partnerId',
        )
        .where('operator.is_active = :isActive', { isActive: true })
        .andWhere('operator.autoLeadAssign = :autoLeadAssign', {
          autoLeadAssign: true,
        })
        .andWhere('operator.speakingLanguage LIKE :speakingLanguage', {
          speakingLanguage: `%${speakingLanguage}%`,
        });
    };

    let operator: Operator | null = null;
    let operatorDeskRelation: OperatorDeskRel | null = null;
    let tradingGroup: PartnerTradingGroups | null = null;

    if (group?.salesRep) {
      operator = await this.operatorRepository.findOne({
        where: { id: group.salesRep },
        relations: ['operator_rel', 'operator_rel.desk'],
      });

      if (operator?.partnerId) {
        tradingGroup = await this.partnerGroupRepository.findOne({
          where: { partner: { id: operator.partnerId } },
        });
      }

      if (group) {
        group = {
          ...group,
          ...((!group.salesDesk || group.salesDesk <= 0) && {
            salesDesk: Number(operator?.operator_rel[0].desk.id),
          }),
          ...((!group.office || group.office <= 0) &&
            tradingGroup?.office && { office: Number(tradingGroup.office) }),
        };
      }
    } else {
      const queryBuilder = createBaseQueryBuilder();

      if (group?.salesDesk && group?.salesDesk > 0) {
        if (group?.office && group?.office > 0) {
          queryBuilder
            .andWhere('desk.id = :deskId', { deskId: group.salesDesk })
            .andWhere('tradingGroup.office = :office', {
              office: group.office,
            });
        } else {
          queryBuilder.andWhere('desk.id = :deskId', {
            deskId: group.salesDesk,
          });
        }
      } else if (group?.office && group?.office > 0) {
        queryBuilder.andWhere('tradingGroup.office = :office', {
          office: group.office,
        });
      }
      const salesDesk = await queryBuilder
        .orderBy('operator.weeklyCount', 'ASC')
        .getOne();

      if (salesDesk) {
        operator = salesDesk.operator;
        operatorDeskRelation = salesDesk;

        if (operator.partnerId) {
          tradingGroup = await this.partnerGroupRepository.findOne({
            where: { partner: { id: operator.partnerId } },
          });
        }

        if (group) {
          group = {
            ...group,
            ...((!group.salesDesk || group.salesDesk <= 0) && {
              salesDesk: Number(salesDesk.desk.id),
            }),
            ...((!group.office || group.office <= 0) &&
              tradingGroup?.office && { office: Number(tradingGroup.office) }),
          };
        }
      }
    }

    if (operator && !salesRepId) {
      await this.operatorRepository.update(operator.id, {
        weeklyCount: operator.weeklyCount + 1,
      });
    }

    return { partner, operator, group };
  }

  async createIb(id: number, commissionProfileId?: number) {
    const partner = await this.partnerRepository.findOne({
      where: { id },
    });
    if (!partner) {
      throw new NotFoundException('Partner or User not found');
    }
    if (!partner.userIbId) {
      throw new BadRequestException('Please enter User IB ID first');
    }
    const user = await this.userRepository.findOne({
      where: {
        isPartner: true,
        partnerId: id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const firstName = partner.firstName
      ? `IB - ${partner.firstName}`
      : `IB - ${partner.name.trim().split(' ')[0]}`;
    return this.partnerRepository.save({
      ...partner,
      ib: true,
      firstName,
      ...(commissionProfileId ? { commissionProfile: { id: commissionProfileId } } : {})
    });
  }

  async updatePartnerLinkUrl(
    id: number,
    dto: UpdatePartnerLinkUrlDto,
    userId: number,
  ): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerUrlNotFound');

    const partnerLink = await this.partnerLinksRepository.findOne({
      where: { id },
      relations: ['partner'],
    });

    if (!partnerLink) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const oldLink = JSON.parse(JSON.stringify(partnerLink));

    partnerLink.url = dto.url;
    const updatedLink = await this.partnerLinksRepository.save(partnerLink);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: updatedLink,
      oldData: oldLink,
      entityId: updatedLink.id,
      entityType: 'Affiliate',
      parentId: partnerLink.partner?.id,
      parentType: 'Affiliate',
      performerId: userId,
      performerType: 'Operator',
      field: 'Partner Link URL Updated',
    });

    return updatedLink;
  }

  async deletePartnerLinks(id: number): Promise<any> {
    await this.partnerLinksRepository.delete({ partnerId: id });
    return { message: 'Url deleted successfuly' };
  }

  async getPartnerByName(name: string): Promise<any> {
    const partner = await this.partnerRepository.findOne({ where: { name } });
    if (partner) {
      partner.country = partner.country;
      partner.allowedCountry = JSON.parse(partner.allowedCountry);
      partner.blockedCountry = JSON.parse(partner.blockedCountry);
    }
    const i18n = I18nContext.current();
    if (!partner) {
      const message = await i18n?.t('errors.partner.notFound');
      throw new NotFoundException(message);
    }

    return partner;
  }

  async deletePartnerTradingGroup(partnerId: number) {
    const tradingGroup = await this.partnerGroupRepository.findOne({
      where: { partner: { id: partnerId } },
    });

    if (!tradingGroup) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: 'Trading group not found',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    await this.partnerGroupRepository.softDelete(tradingGroup.id);

    return { message: 'Partner trading group deleted successfully' };
  }

  async softDeletePartnerLink(id: number, userId: number): Promise<any> {
    const i18n = I18nContext.current();
    const message = await i18n?.t('errors.auth.partnerUrlNotFound');

    const partnerLink = await this.partnerLinksRepository.findOne({
      where: { id },
      relations: ['partner'],
    });

    if (!partnerLink) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: {
            msg: message,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    partnerLink.isActive = false;
    const deletedLink = await this.partnerLinksRepository.save(partnerLink);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: { isActive: false },
      oldData: { isActive: true },
      entityId: deletedLink.id,
      entityType: 'Affiliate',
      parentId: partnerLink.partner?.id,
      parentType: 'Affiliate',
      performerId: userId,
      performerType: 'Operator',
      field: 'Partner Link Soft Deleted',
    });

    return { message: 'Partner link deleted successfully' };
  }

  async updatePartnerProfileAssignment(
    id: number,
    body: UpdatePartnerProfileAssignmentDto,
    user: User,
    isAutomation = false
  ): Promise<any> {
    const partnerData = await this.partnerRepository.findOne({
      where: { id, status: ActiveStatus.ACTIVE },
      relations: {
        commissionProfiles: {
          commissionProfile: true
        }
      }
    });
    if (!partnerData) {
      throw new BadRequestException('Partner not found');
    }
    if (body.partnerLevel == 1) {
      partnerData.ibPath = null as unknown as string;
    }

    if (body.masterIbId) {
      const masterIb = await this.partnerRepository.findOne({
        where: { id: body.masterIbId, status: ActiveStatus.ACTIVE, ib: true },
      });
      if (!masterIb) {
        throw new BadRequestException('Master IB not found');
      }

      if (!masterIb.userIbId) {
        throw new BadRequestException('Master IB MT5 account is required');
      }

      if ((body.partnerLevel || partnerData.partnerLevel) - 1 !== masterIb.partnerLevel) {
        if (!isAutomation) {
          throw new BadRequestException('Master IB level is not valid');
        }
      }
      const userData = await this.userRepository.findOne({
        where: {
          partnerId: id
        }
      });
      if (userData) {
        this.clientService.updateAffid(userData.id, masterIb, user.id)
      }

      partnerData.ibPath = partnerData.userIbId;
      if (masterIb.ibPath || masterIb.userIbId && masterIb.id !== id) {
        partnerData.ibPath = `${partnerData.ibPath} > ${(masterIb.ibPath || masterIb.userIbId)}`
      }
    }
    let profiles = partnerData.commissionProfiles;


    const { commissionProfiles: _, ...restBody } = body;
    const { commissionProfiles, ...partnerDataWithoutProfile } = partnerData;

    const result = await this.partnerRepository.save({ ...partnerDataWithoutProfile, ...restBody });

    if (Array.isArray(body.commissionProfiles)) {
      profiles = await this.ibProfileService.assignCommissionProfiles(partnerData.id, body.commissionProfiles)
    };

    result.commissionProfiles = profiles;
    this.eventEmitter.emit(EventTypes.USER_LOG, {
      newData: result,
      oldData: partnerData,
      entityId: result.id,
      entityType: 'Affiliate',
      performerId: user.id,
      performerType: 'Operator',
      field: 'Partner Profile Assignment Updated',
    });

    return result

  }


  async getPartnersByLevel(level: number): Promise<any> {

    const targetLevel = level - 1;

    const partners = await this.partnerRepository.find({
      where: {
        partnerLevel: targetLevel,
        status: ActiveStatus.ACTIVE,
        ib: true,
      },
      select: ['id', 'name', 'partnerLevel', 'userIbId', 'ibPath'],
      order: {
        name: 'ASC',
      },
    });

    return partners;
  }
  async getPartnerMt5Accounts(partnerId: number): Promise<any> {
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId, status: ActiveStatus.ACTIVE },
    });

    if (!partner) {
      throw new BadRequestException('Partner not found');
    }

    const user = await this.userRepository.findOne({
      where: { partnerId: partnerId },
    });

    if (!user) {
      return {
        partnerName: partner.name,
        partnerId: partner.id,
        totalAccounts: 0,
        accounts: []
      };
    }

    const mt5Accounts = await this.mt5AccountRepository.find({
      where: { user: { id: user.id } },
    });

    return {
      partnerName: partner.name,
      partnerId: partner.id,
      totalAccounts: mt5Accounts.length,
      accounts: mt5Accounts
    };
  }

  async getPartnerLevel(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        isPartner: true,
        partner: {
          ib: true,
          id
        },
        client: {
          type: 'Introducing Broker (IB)'
        }
      },
      relations: {
        partner: true
      }
    });
    const level = user?.partner?.partnerLevel || 0;
    return {
      level,
      partner: user?.partner
    }
  }
}
