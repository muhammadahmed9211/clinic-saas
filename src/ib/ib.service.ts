import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerType } from 'src/admin/custom-dropdown/custom-dropdown/entities/partner-type.entity';
import { LeadsRepository } from 'src/admin/leads/repositories/lead.repository';
import { ActiveStatus, Partner } from 'src/settings/entities/partner.entity';
import { User } from 'src/users/entities/user.entity';
import { ClientRepository } from 'src/users/repositories/client.repository';
import {
  Between,
  FindOptionsWhere,
  ILike,
  In,
  IsNull,
  Like,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import {
  QueryIbClients,
  QueryIbLinks,
  QuerySubIbs,
} from './dtos/ib-client-filters.dto';
import { Lead } from 'src/admin/leads/entities/lead.entity';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import {
  IbClientCreateLinkDto,
  IbClientUpdateLinkDto,
  IbCustomParamDto,
} from './dtos/ib-client-create-link.dto';
import { AllConfigType } from 'src/config/config.type';
import { ConfigService } from '@nestjs/config';
import { IbLinks } from './entities/ib-link.entity';
import { PartnerService } from 'src/admin/partner/partner.service';
import {
  GeneratePartnerLinkDto,
  UpdateGeneratedLinkDto,
} from 'src/admin/partner/dto/generate-partner-link.dto';
import {
  LinkType,
  partner_links,
} from 'src/admin/partner/entities/partner-links.entity';
import {
  CommissionReportItemDto,
  CommissionReportPaginationDto,
  CommissionReportQueryDto,
  PaginationMetaDto,
  QueryOptionsDto,
} from './dtos/ib-commission-report.dto';
import { dateToUnixTimestamp } from 'src/utils/utility';
import { RegistrationStatsResponseDto } from './dtos/registration-stats.dto';
import moment from 'moment-timezone';
import { IbCommissionDeals } from './commission/entities/ib-comission-deals.entity';
import {
  PerformancePeriod,
  SubIbPerformanceDto,
} from './dtos/sub-ib-performance.dto';
import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';

interface IbHierarchyNode {
  id: number;
  name: string;
  login?: string;
  email?: string;
  clients: number;
  subIbs?: number;
  subIbsClients?: number;
  children?: IbHierarchyNode[];
}
import { TransactionService } from 'src/transaction/transaction.service';
import { GetTransactionList } from 'src/transaction/dto/get-transaction.list';
import { IbProfileService } from './ib_profile/ib_profile.service';
import { ClassificationService } from 'src/classification/classification.service';
import { CreateClientDto } from 'src/users/dto/create-client.dto';
import {
  AuthRegisterLoginDto,
  AuthRegisterQueryDto,
} from 'src/auth/dto/auth-register-login.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ClientService } from 'src/mt5/client/client.service';

@Injectable()
export class IbService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly leadRepository: LeadsRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly partnerService: PartnerService,
    private readonly transactionService: TransactionService,
    private readonly ibProfileService: IbProfileService,
    private readonly classificationService: ClassificationService,
    private readonly service: AuthService,
    private readonly userRepository: UserRepository,
    @InjectRepository(PartnerType)
    private readonly partnerTypeRepository: Repository<PartnerType>,
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
    @InjectRepository(IbLinks)
    private readonly ibLinksRepository: Repository<IbLinks>,
    @InjectRepository(partner_links)
    private readonly partnerLinksRepository: Repository<partner_links>,
    @InjectRepository(IbCommissionDeals)
    private readonly ibCommissionDealsRepository: Repository<IbCommissionDeals>,
    @InjectRepository(Mt5Account)
    private readonly mt5AccountRepository: Repository<Mt5Account>,
    private readonly clientService: ClientService,
  ) { }
  async getAllOnboardClients({ user }): Promise<{
    classifications: any[];
    subIbLink: any | null;
  }> {
    const userDetails = await this.userRepository.findOne({
      where: { id: user.id, partner: { status: ActiveStatus.ACTIVE } },
    });
    if (!userDetails?.partnerId) {
      throw new NotFoundException(`partner ID not found: ${user?.id}`);
    }

    const partnerId = userDetails?.partnerId;
    const [commissionProfiles, classifications, partnerLinks] =
      await Promise.all([
        this.ibProfileService.getIbCommissionProfileInfo(partnerId),
        this.classificationService.findAll(true),
        this.partnerLinksRepository.find({ where: { partnerId } }),
      ]);

    const subIbLink = partnerLinks.find(
      (link) => link.linkType === LinkType.SUB_IB,
    );

    const linksMap = new Map<number, any>();
    partnerLinks.forEach((link) => {
      linksMap.set(Number(link.commissionProfileId), link);
    });

    const classificationProfilesMap = new Map<number, any[]>();
    classifications.forEach((c) => {
      classificationProfilesMap.set(c.id, []);
    });

    commissionProfiles.forEach((profile) => {
      const classificationId = profile.classificationId;
      const link = linksMap.get(Number(profile.id));

      const profileWithLink = {
        ...profile,
        links: link ? [link] : [],
      };

      const profilesArr = classificationProfilesMap.get(classificationId);
      if (profilesArr) {
        profilesArr.push(profileWithLink);
      }
    });

    const result: any[] = [];
    classifications.forEach((classification) => {
      const profiles = classificationProfilesMap.get(classification.id) ?? [];

      result.push({
        classificationId: classification.id,
        classificationName: classification.name,
        eligibility: classification.eligibility,
        keyFeatures: classification.keyFeatures,
        profiles,
      });
    });

    return {
      classifications: result,
      subIbLink: subIbLink?.url || null,
    };
  }

  async onboardClientByPartner(createClientDto, user): Promise<any> {
    const userDetails = await this.userRepository.findOne({
      where: { id: user.id, partner: { status: ActiveStatus.ACTIVE } },
      relations: ['partner'],
    });


    if (!userDetails?.partnerId) {
      throw new NotFoundException(`partner ID not found: ${user?.id}`);
    }

    const partnerLink = await this.partnerLinksRepository.findOne({
      where: {
        id: createClientDto?.partnerLinkId,
        partnerId: userDetails?.partnerId,
      },
    });
    if (!partnerLink) {
      throw new NotFoundException('Partner link not found');
    }
    createClientDto.commissionProfileId = partnerLink?.commissionProfileId;
    createClientDto.partner_uuid = userDetails?.partner?.uuid;
    createClientDto.p2 = partnerLink?.p2;
    createClientDto.p3 = partnerLink?.p3;
    createClientDto.p4 = partnerLink?.p4;
    createClientDto.p5 = partnerLink?.p5;
    createClientDto.p6 = partnerLink?.p6;
    createClientDto.utmSource = partnerLink?.utmSource;
    createClientDto.utmCampaign = partnerLink?.utmCampaign;
    createClientDto.utmContent = partnerLink?.utmContent;
    createClientDto.utmTerm = partnerLink?.utmTerm;
    createClientDto.campaignId = partnerLink?.campaignId;
    createClientDto.utmMedium = partnerLink?.utmMedium;
    createClientDto.affiliateLinkUrl = partnerLink?.url;
    createClientDto.userType = 2; 
    createClientDto.isPhoneCountryChanged = true; 
    const verificationBypass = this.configService.getOrThrow(
      'app.bypassOtpVerification',
      { infer: true },
    );
    console.log(createClientDto, userDetails?.partner, userDetails?.partner?.uuid, userDetails);
    const verificationKey: AuthRegisterQueryDto = { key: verificationBypass };
    const authClients = await this.service.register(
      createClientDto,
      verificationKey,
    );
    return authClients;
  }
  async findManyClientsWithPagination({
    userId,
    query,
  }: {
    userId: number;
    query: QueryIbClients;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 100;

    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: { partner: true, user: true },
    });

    if (!client?.user.partnerId) {
      throw new NotFoundException('IB Client not found');
    }

    let where: any = { partner: { id: client.user.partnerId } };

    where.userLifeCycle = UserLifeCycle.CLIENT;

    if (query.name) {
      where = [
        {
          partner: { id: client.user.partnerId },
          firstName: ILike(`%${query.name}%`),
          country: query.country ? ILike(`%${query.country}%`) : undefined,
          telephone: query.telephone
            ? ILike(`%${query.telephone}%`)
            : undefined,
          isActive: query.status
            ? query.status === 'active'
              ? 1
              : 0
            : undefined,
          createdAt:
            query.from && query.to ? Between(query.from, query.to) : undefined,
        },
        {
          partner: { id: client.user.partnerId },
          lastName: ILike(`%${query.name}%`),
          country: query.country ? ILike(`%${query.country}%`) : undefined,
          telephone: query.telephone
            ? ILike(`%${query.telephone}%`)
            : undefined,
          isActive: query.status
            ? query.status === 'active'
              ? 1
              : 0
            : undefined,
          createdAt:
            query.from && query.to ? Between(query.from, query.to) : undefined,
        },
      ];
    } else {
      if (query.country) {
        where.country = ILike(`%${query.country}%`);
      }
      if (query.telephone) {
        where.telephone = ILike(`%${query.telephone}%`);
      }
      if (query.email) {
        where.email = ILike(`%${query.email}%`);
      }
      if (query.status) {
        where.isActive = query.status === 'active' ? true : false;
      }
      if (query.from || query.to) {
        const fromDate = query.from
          ? new Date(query.from)
          : new Date('1970-01-01');

        const toDate = query.to
          ? new Date(query.to)
          : new Date();

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        where.createdAt = Between(fromDate, toDate);
      }
    }

    const [clients, total] = await this.clientRepository.findAndCount({
      where,
      relations: {
        user: true,
        customSaleStatus: true,
        customRetentionStatus: true,
        commissionProfile:{
          classification: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const hasNextPage = total > page * limit;

    return {
      data: clients,
      hasNextPage,
      total,
    };
  }

  async findOneClientById(id: number, userId: number, isClientEndpoint = false,
  ) {
    if (isClientEndpoint) {
      await this.userRepository.isUserAccessToIB(id, userId);
    }
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const client = await this.clientRepository.findOne({
        where: { userId: id, userLifeCycle: UserLifeCycle.CLIENT },
        relations: {
          user: { mt5Account: { mt5AccountsReplicated: true } },
          customSaleStatus: true,
          customRetentionStatus: true,
          commissionProfile:{
          classification: true,
          },
        },
      });
      if (!client) {
        throw new NotFoundException('Client not found');
      }
      if (!user.partnerId) {
        throw new NotFoundException('IB Client not found');
      }
      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId },
      });
      if (client.partner.id !== partner?.id) {
        throw new NotFoundException('Lead not found');
      }
      return client;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error finding client', error);
    }
  }

  async findManyApplicantsWithPagination({
    userId,
    query,
  }: {
    userId: number;
    query: QueryIbClients;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 100;

    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: { partner: true, user: true },
    });

    if (!client?.user.partnerId) {
      throw new NotFoundException('IB Applicant not found');
    }

    let where: any = { partner: { id: client.user.partnerId } };

    where.userLifeCycle = UserLifeCycle.APPLICANT;

    if (query.name) {
      where = [
        {
          partner: { id: client.user.partnerId },
          firstName: ILike(`%${query.name}%`),
          country: query.country ? ILike(`%${query.country}%`) : undefined,
          telephone: query.telephone
            ? ILike(`%${query.telephone}%`)
            : undefined,
          isActive: query.status
            ? query.status === 'active'
              ? 1
              : 0
            : undefined,
          createdAt:
            query.from && query.to ? Between(query.from, query.to) : undefined,
        },
        {
          partner: { id: client.user.partnerId },
          lastName: ILike(`%${query.name}%`),
          country: query.country ? ILike(`%${query.country}%`) : undefined,
          telephone: query.telephone
            ? ILike(`%${query.telephone}%`)
            : undefined,
          isActive: query.status
            ? query.status === 'active'
              ? 1
              : 0
            : undefined,
          createdAt:
            query.from && query.to ? Between(query.from, query.to) : undefined,
        },
      ];
    } else {
      if (query.country) {
        where.country = ILike(`%${query.country}%`);
      }
      if (query.telephone) {
        where.telephone = ILike(`%${query.telephone}%`);
      }
      if (query.email) {
        where.email = ILike(`%${query.email}%`);
      }
      if (query.status) {
        where.isActive = query.status === 'active' ? true : false;
      }
      if (query.from || query.to) {
        const fromDate = query.from
          ? new Date(query.from)
          : new Date('1970-01-01');

        const toDate = query.to
          ? new Date(query.to)
          : new Date();

        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);

        where.createdAt = Between(fromDate, toDate);
      }
    }

    const [clients, total] = await this.clientRepository.findAndCount({
      where,
      relations: {
        user: true,
        customSaleStatus: true,
        customRetentionStatus: true,
         commissionProfile:{
          classification: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const hasNextPage = total > page * limit;

    return {
      data: clients,
      hasNextPage,
      total,
    };
  }

  async findOneApplicantsById(id: number, userId: number, isClientEndpoint = false,) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (isClientEndpoint) {
        await this.userRepository.isUserAccessToIB(id, userId);
      }
      const client = await this.clientRepository.findOne({
        where: { userId: id, userLifeCycle: UserLifeCycle.APPLICANT },
        relations: {
          user: { mt5Account: { mt5AccountsReplicated: true } },
          customSaleStatus: true,
          customRetentionStatus: true,
          commissionProfile:{
          classification: true,
          },
        },
      });
      if (!client) {
        throw new NotFoundException('Applicant not found');
      }
      if (!user.partnerId) {
        throw new NotFoundException('IB Applicant not found');
      }
      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId },
      });
      if (client.partner.id !== partner?.id) {
        throw new NotFoundException('Lead not found');
      }
      return client;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error finding applicant', error);
    }
  }

  async findManyLeadsWithPagination({
    userId,
    query,
  }: {
    userId: number;
    query: QueryIbClients;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 100;

    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: { partner: true, user: true },
    });

    if (!client?.user.partnerId) {
      throw new NotFoundException('IB Client not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: client?.user.partnerId },
    });

    if (!partner?.uuid) {
      throw new NotFoundException('IB Client not found');
    }

    const where: FindOptionsWhere<Lead> = {
      affId: partner?.uuid,
      userLifeCycle: In([UserLifeCycle.LEAD, UserLifeCycle.REGISTERED]),
    };

    if (query.name) {
      where.title = ILike(`%${query.name}%`);
    }
    if (query.country) {
      where.country = ILike(`%${query.country}%`);
    }
    if (query.telephone) {
      where.phoneNumber = ILike(`%${query.telephone}%`);
    }
    if (query.email) {
      where.email = ILike(`%${query.email}%`);
    }
    if (query.status) {
      where.isActive = query.status === 'active' ? true : false;
    }
    if (query.from || query.to) {
      const fromDate = query.from
        ? new Date(query.from)
        : new Date('1970-01-01');

      const toDate = query.to
        ? new Date(query.to)
        : new Date();

      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      where.createdAt = Between(fromDate, toDate);
    }

    const [leads, total] = await this.leadRepository.findAndCount({
      where,
      relations: { salesStatus: true, retentionStatus: true,client:{commissionProfile:{classification:true}} },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    const hasNextPage = total > page * limit;

    return {
      data: leads,
      hasNextPage,
      total,
    };
  }

  async findOneLeadById(id: number, userId: number, isClientEndpoint = false,
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const lead = await this.leadRepository.findOne({
        where: { id },
        relations: { salesStatus: true, retentionStatus: true,client:{commissionProfile:{classification:true}} },
      });
      if (!lead) {
        throw new NotFoundException('Lead not found');
      }
      if (isClientEndpoint) {
        await this.userRepository.isUserAccessToIB(id, userId, UserLifeCycle.LEAD);
      }
      if (!user.partnerId) {
        throw new NotFoundException('IB Client not found');
      }
      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId },
      });
      if (lead.affId !== partner?.uuid) {
        throw new NotFoundException('Lead not found');
      }
      return lead;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error finding lead', error);
    }
  }

  async createLink(dto: IbClientCreateLinkDto, userId: number) {
    try {
      const { p1, p2, p3 } = dto;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user.partnerId) {
        throw new NotFoundException('IB Client not found');
      }

      const partner = await this.partnerRepository.findOne({
        where: { id: user?.partnerId },
      });
      if (!partner) {
        throw new NotFoundException('IB not found');
      }

      const baseUrl = this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      });

      const url = this.buildUrlWithQueryParams(
        { p1, p2, p3, partner_uuid: partner.uuid },
        baseUrl,
      );

      return this.ibLinksRepository.save(
        this.ibLinksRepository.create({
          ...dto,
          url,
          ib: user,
        }),
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating link', error);
    }
  }

  async createPartnerLink(
    headers: any,
    dto: IbClientCreateLinkDto,
    userId: number,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.partnerId) {
      throw new NotFoundException('IB Client not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: user?.partnerId },
    });
    if (!partner) {
      throw new NotFoundException('IB not found');
    }

    const generateLinkDto: GeneratePartnerLinkDto = {
      partnerId: user?.partnerId,
      p1: dto.p1,
      p2: dto.p2,
      p3: dto.p3,
      p4: dto.p4,
      p5: dto.p5,
      p6: dto.p6,
      name: dto.name,
      description: dto.description,
      utmSource: dto.utmSource,
      source: dto.source,
    };

    return this.partnerService.generatePartnerLink(
      headers,
      generateLinkDto,
      userId,
    );
  }

  async findManyLinksWithPagination({
    userId,
    query,
  }: {
    userId: number;
    query: QueryIbLinks;
  }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 100;

    const client = await this.clientRepository.findOne({
      where: { userId },
      relations: { partner: true, user: true },
    });

    if (!client?.user.partnerId) {
      throw new NotFoundException('IB Client not found');
    }

    const where: FindOptionsWhere<partner_links> = {
      partnerId: client.user.partnerId,
    };

    if (query.name) {
      where.name = Like(`%${query.name}%`);
    }
    if (query.description) {
      where.description = Like(`%${query.description}%`);
    }
    if (query.from && query.to) {
      where.creationTime = Between(query.from, query.to);
    }
    if (query.status) {
      where.isActive = query.status === 'active' ? true : false;
    }

    const [links, total] = await this.partnerLinksRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { creationTime: 'DESC' },
    });

    const data: any[] = [];
    for (const link of links) {
      const url = new URL(link?.url);
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

      data.push({
        ...link,
        ...allParams,
        popUnder,
      });
    }

    const hasNextPage = total > page * limit;

    return {
      data,
      hasNextPage,
      total,
    };
  }

  async findOneLinkById(id: number, userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.partnerId) {
      throw new NotFoundException('IB Client not found');
    }
    // const link = await this.partnerLinksRepository.findOne({
    //   where: { id, partnerId: user.partnerId },
    // });

    const link = await this.partnerService.getPartnerLinkById(id);
    if (!link) {
      throw new NotFoundException('Link not found');
    }
    if (link && link.partnerId !== user.partnerId) {
      throw new NotFoundException('Link not found');
    }
    return link;
  }

  async updateLink(id: number, dto: IbClientUpdateLinkDto, userId: number) {
    const link = await this.findOneLinkById(id, userId);
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user?.partnerId) {
      throw new NotFoundException('IB not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: user?.partnerId },
    });

    if (!partner) {
      throw new NotFoundException('IB not found');
    }

    // const baseUrl = this.configService.getOrThrow('app.frontendDomain', {
    //   infer: true,
    // });

    // const p1 = dto.p1 ?? link.p1;
    // const p2 = dto.p2 ?? link.p2;
    // const p3 = dto.p3 ?? link.p3;

    // const url = this.buildUrlWithQueryParams(
    //   { p1, p2, p3, partner_uuid: partner.uuid },
    //   baseUrl,
    // );

    // return this.ibLinksRepository.save({
    //   ...link,
    //   ...dto,
    //   url,
    // });

    const updateLinkDto: UpdateGeneratedLinkDto = {
      partnerId: user?.partnerId,
      partner_uuid: partner.uuid,
      p1: dto.p1,
      p2: dto.p2,
      p3: dto.p3,
      p4: dto.p4,
      p5: dto.p5,
      p6: dto.p6,
      name: dto.name,
      description: dto.description,
    };

    return this.partnerService.updatePartnerLink(id, updateLinkDto, userId);
  }

  async deleteLink(id: number, userId: number) {
    const link = await this.findOneLinkById(id, userId);
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    await this.partnerLinksRepository.save({
      ...link,
      isActive: false,
    });
    return null;
  }

  async getStats(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user?.partnerId) {
      throw new NotFoundException('IB not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: user?.partnerId },
    });
    if (!partner) {
      throw new NotFoundException('IB not found');
    }

    let leads = 0;
    const clients = await this.clientRepository.find({
      where: {
        affid: partner.id,
        userLifeCycle: In([UserLifeCycle.CLIENT, UserLifeCycle.APPLICANT]),
        // user: { partnerId: IsNull() },
      },
      relations: { user: true },
    });
    if (partner.uuid) {
      leads = await this.leadRepository.count({
        where: {
          affId: partner.uuid,
          userLifeCycle: In([UserLifeCycle.LEAD, UserLifeCycle.REGISTERED]),
        },
      });
    }
    const clientCount =
      clients.filter((client) => client.userLifeCycle === UserLifeCycle.CLIENT)
        ?.length ?? 0;
    const applicantsCount =
      clients.filter(
        (client) => client.userLifeCycle === UserLifeCycle.APPLICANT,
      )?.length ?? 0;
    const ibs =
      clients.filter((client) => client.user.partnerId !== null)?.length ?? 0;
    const links = await this.partnerLinksRepository.count({
      where: { partnerId: partner?.id },
    });

    return {
      clients: clientCount,
      leads,
      ibs,
      links,
      applicants: applicantsCount,
    };
  }

  async getRegistrationStats(
    userId: number,
  ): Promise<RegistrationStatsResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user?.partnerId) {
      throw new NotFoundException('IB not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: user?.partnerId },
    });
    if (!partner) {
      throw new NotFoundException('IB not found');
    }

    const clients = await this.clientRepository.find({
      where: {
        affid: partner.id,
      },
      relations: { user: true },
    });

    const monthlyStats = new Map<string, number>();
    const currentYear = new Date().getFullYear();

    for (let month = 0; month < 12; month++) {
      const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
      monthlyStats.set(monthKey, 0);
    }

    clients.forEach((client) => {
      if (client.createdAt) {
        const date = new Date(client.createdAt);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1,
        ).padStart(2, '0')}`;

        if (monthlyStats.has(monthKey)) {
          monthlyStats.set(monthKey, monthlyStats.get(monthKey)! + 1);
        }
      }
    });

    const data = Array.from(monthlyStats.entries()).map(([month, count]) => ({
      month: moment(month).format('MMM'),
      count,
    }));

    return {
      data,
      total: clients.length,
    };
  }

  buildUrlWithQueryParams(
    params: { partner_uuid: string } & IbCustomParamDto,
    baseUrl: string,
  ): string {
    const validParams = Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    );

    if (validParams.length === 0) {
      return baseUrl;
    }

    const queryString = validParams
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join('&');

    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}${queryString}`;
  }

  private sanitizeStringForSql(input: string): string {
    return input.replace(/'/g, "''"); // Escape single quotes
  }

  // Helper method to validate numeric inputs
  private validateNumeric(value: any, fieldName: string): number {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new BadRequestException(
        `Invalid ${fieldName}: must be a positive number`,
      );
    }
    return num;
  }

  async getCommissionReport(
    user: User,
    query: CommissionReportQueryDto,
    subIbId?: number,
  ): Promise<any> {
    const { startDate, endDate, search, clientName, login, clientId, page = 1, pageSize = 50 } = query;

    // Validate user is an IB
    const partnerUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!partnerUser?.partnerId) {
      throw new NotFoundException('You are not an IB');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: partnerUser.partnerId, ib: true },
    });

    if (!partner) {
      throw new NotFoundException('IB not found');
    }

    // 2️⃣ Determine the target partner (user's IB or sub-IB)
    let targetPartnerId = this.validateNumeric(partnerUser.partnerId, 'partnerId');

    if (subIbId) {
      const validatedSubIbId = this.validateNumeric(subIbId, 'subIbId');

  const subIbUser = await this.userRepository.findOne({ 
    where: { partnerId: validatedSubIbId } 
  });

  if (!subIbUser) {
    throw new NotFoundException('Sub-IB user not found');
  }

     await this.userRepository.isUserAccessToIB(subIbUser.id, user.id);

      targetPartnerId = validatedSubIbId;
    }

    // 3️⃣ Validate pagination
    const validatedPage = this.validateNumeric(page, 'page');
    const validatedPageSize = this.validateNumeric(pageSize, 'pageSize');
    const offset = (validatedPage - 1) * validatedPageSize;

    // Build date conditions
    let dateCondition1 = '';
    let dateCondition2 = '';
    let dateCondition3 = '';

    if (startDate && endDate) {
      // Validate date format (basic check)
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        throw new BadRequestException('Invalid date format');
      }

      // Format dates properly for SQL Server and include time range
      const formattedStartDate = `${startDate}`;
      const formattedEndDate = `${endDate}`;

      dateCondition1 = `AND client_deal.[CreatedAt] >= '${formattedStartDate}' AND client_deal.[CreatedAt] <= '${formattedEndDate}'`;
      dateCondition2 = `AND mt5_deal.[CreatedAt] >= '${formattedStartDate}' AND mt5_deal.[CreatedAt] <= '${formattedEndDate}'`;
      dateCondition3 = `AND commission_deal.[CreatedAt] >= '${formattedStartDate}' AND commission_deal.[CreatedAt] <= '${formattedEndDate}'`;
    }

    let searchCondition = '';
    if (clientName?.trim()) {
      const sanitizedName = this.sanitizeStringForSql(clientName.trim());
      searchCondition += `AND (c.firstName + ' ' + c.lastName LIKE '%${sanitizedName}%') `;
    }
    if (login?.trim()) {
      const sanitizedLogin = this.sanitizeStringForSql(login.trim());
      searchCondition += `AND CAST(ma.[login] AS VARCHAR) LIKE '%${sanitizedLogin}%' `;
    }
    if (clientId?.trim()) {
      const sanitizedClientId = this.sanitizeStringForSql(clientId.trim());
      searchCondition += `AND CAST(c.userId AS VARCHAR) LIKE '%${sanitizedClientId}%' `;
    }

    if (search?.trim()) {
      const sanitizedSearch = this.sanitizeStringForSql(search.trim());
      searchCondition = `AND (
      c.firstName + ' ' + c.lastName LIKE '%${sanitizedSearch}%' 
      OR c.email LIKE '%${sanitizedSearch}%'
      OR CAST(c.userId AS VARCHAR) LIKE '%${sanitizedSearch}%'
      OR CAST(ma.[login] AS VARCHAR) LIKE '%${sanitizedSearch}%'
    )`;
    }

    let classificationCondition = '';
    if (query.classification?.trim()) {
      const sanitizedClassification = this.sanitizeStringForSql(query.classification.trim());
      classificationCondition = `AND cls.name = '${sanitizedClassification}'`;
    }


    const finalQuery = `
    WITH ClientTradingData AS (
      SELECT 
        c.userId AS clientId, 
        ma.id AS mt5AccountId, 
        ma.[login] AS mt5Login, 
        commission_deal.partnerId AS partnerId, 
        SUM(client_deal.Volume) AS totalVolume
      FROM client c 
      INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL 
      INNER JOIN ib_commission_deals client_deal ON client_deal.[login] = ma.[login] 
        AND client_deal.[Action] IN (0, 1) 
        AND client_deal.ParentDealId IS NULL
      INNER JOIN ib_commission_deals commission_deal ON commission_deal.ParentDealId = client_deal.deal 
        AND commission_deal.[Action] IN (0, 1)  
        ${dateCondition1}
      GROUP BY c.userId, ma.id, ma.[login], commission_deal.partnerId
    ),
    ClientDepositWithdrawal AS (
      SELECT
        c.userId AS clientId,
        ma.id AS mt5AccountId,
        ROUND(SUM(CASE WHEN mt5_deal.[Action] = 2 AND mt5_deal.Profit > 0 THEN mt5_deal.Profit ELSE 0 END), 3) AS totalDeposits,
        ROUND(SUM(CASE WHEN mt5_deal.[Action] = 2 AND mt5_deal.Profit < 0 THEN ABS(mt5_deal.Profit) ELSE 0 END), 3) AS totalWithdrawals
      FROM client c
      INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
      LEFT JOIN mt5_deals mt5_deal ON mt5_deal.[Login] = CAST(ma.[login] AS int)
      WHERE mt5_deal.[Action] IN (2, 3)
      ${dateCondition2}
      GROUP BY c.userId, ma.id
    ),
    ClientCommission AS (
      SELECT
        c.userId AS clientId,
        ma.id AS mt5AccountId,
        ROUND(SUM(commission_deal.Commission), 3) AS directCommission
      FROM client c
      INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
      INNER JOIN ib_commission_deals client_deal ON client_deal.[Login] = CAST(ma.[login] AS int)
      INNER JOIN ib_commission_deals commission_deal ON commission_deal.ParentDealId = client_deal.Deal
      WHERE commission_deal.PartnerId = ${partner.id}
        AND commission_deal.Commission IS NOT NULL
        AND commission_deal.ParentDealId IS NOT NULL
        AND client_deal.ParentDealId IS NULL
      ${dateCondition3}
      GROUP BY c.userId, ma.id
    )
    SELECT
      c.userId AS clientId,
      c.userLifeCycle AS userLifeCycle,
      ma.[login] AS mt5AccountId,
      c.firstName + ' ' + c.lastName AS clientName,
      c.email AS clientEmail,
      c.createdAt AS registrationDate,
      ma.createdAt AS mt5AccountCreatedDate,
      cls.name AS classification,
      ROUND(COALESCE(cdw.totalDeposits, 0), 3) AS totalDeposit,
      ROUND(COALESCE(cdw.totalDeposits, 0) - COALESCE(cdw.totalWithdrawals, 0), 3) AS totalNetDeposit,
      ROUND(COALESCE(cdw.totalWithdrawals, 0), 3) AS totalWithdrawal,
      COALESCE(ctd.totalVolume / 10000, 0) AS totalVolume,
      ROUND(COALESCE(ABS(cc.directCommission), 0), 3) AS totalCommission,
      COUNT(*) OVER() AS totalRecords
    FROM client c
    INNER JOIN lead l ON c.leadId = l.id
    INNER JOIN partner p ON l.affId = p.uuid
    INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
    INNER JOIN server s ON s.id = ma.serverId AND s.name = 'LIVE'
    LEFT JOIN ib_commission_profile cp ON cp.id = c.commissionProfileId
    LEFT JOIN classification cls ON cls.id = cp.classificationId
    LEFT JOIN ClientTradingData ctd ON ctd.clientId = c.userId AND ctd.mt5AccountId = ma.id AND ctd.partnerId = p.id
    LEFT JOIN ClientDepositWithdrawal cdw ON cdw.clientId = c.userId AND cdw.mt5AccountId = ma.id
    LEFT JOIN ClientCommission cc ON cc.clientId = c.userId AND cc.mt5AccountId = ma.id
    WHERE p.id = ${targetPartnerId}
      AND p.ib = 1
      AND c.deletedAt IS NULL
      ${searchCondition}
      ${classificationCondition}
    ORDER BY ROUND(COALESCE(ABS(cc.directCommission), 0), 3) DESC, c.userId, ma.isDefault DESC, ma.createdAt
    OFFSET ${offset} ROWS
    FETCH NEXT ${validatedPageSize} ROWS ONLY
  `;

    try {
      // Execute the query without parameters since we've built it as a complete string
      const rawResults = await this.userRepository.query(finalQuery);

      // Transform results
      const data: CommissionReportItemDto[] = rawResults.map((row: any) => ({
        clientId: row.clientId,
        userLifeCycle: row.userLifeCycle,
        mt5AccountId: row.mt5AccountId,
        clientName: row.clientName,
        clientEmail: row.clientEmail,
        registrationDate: row.registrationDate,
        mt5AccountCreatedDate: row.mt5AccountCreatedDate,
        classification: row?.classification,
        totalDeposit: parseFloat(row.totalDeposit) || 0,
        totalNetDeposit: parseFloat(row.totalNetDeposit) || 0,
        totalWithdrawal: parseFloat(row.totalWithdrawal) || 0,
        totalVolume: parseFloat(row.totalVolume) || 0,
        totalCommission: parseFloat(row.totalCommission) || 0,
      }));

      const totalRecords = rawResults.length > 0 ? rawResults[0].totalRecords : 0;
      const totalPages = Math.ceil(totalRecords / validatedPageSize);

      const meta: PaginationMetaDto = {
        currentPage: validatedPage,
        pageSize: validatedPageSize,
        totalRecords,
        totalPages,
        hasPreviousPage: validatedPage > 1,
        hasNextPage: validatedPage < totalPages,
      };

      return {
        status: 0,
        statusCode: 200,
        message: 'Commission report fetched successfully',
        result: { data, meta },
      };
    } catch (error) {
      console.error('Commission Report Query Error:', error);
      console.error('Final Query:', finalQuery);
      throw error;
    }
  }

async getClientCommissionReport(
  user: User,
  mt5Login: number,
  query: CommissionReportPaginationDto,
  isClientEndpoint = false
) {
  const { page = 1, pageSize = 10, symbol, dealId, startDate, endDate } = query;
  const offset = (page - 1) * pageSize;

  // Check if client endpoint has access to this MT5 login
  if (isClientEndpoint) {
    await this.userRepository.isUserAccessToLogin(mt5Login.toString(), user.id);
  }

  // Validate user is an IB
  const partnerUser = await this.userRepository.findOne({
    where: { id: user.id },
  });

  if (!partnerUser?.partnerId) {
    throw new NotFoundException('You are not an IB');
  }

  const partner = await this.partnerRepository.findOne({
    where: { id: partnerUser.partnerId, ib: true },
  });

  if (!partner) {
    throw new NotFoundException('IB not found');
  }

  const validatedPartnerId = this.validateNumeric(partnerUser.partnerId, 'partnerId');

  // Build dynamic WHERE conditions
  let whereConditions = `
    client_ma.[login] = @0
    AND commission_deal.PartnerId = @1
    AND commission_deal.[Action] IN (0, 1)
    AND commission_deal.Commission <> 0
    AND commission_deal.ParentDealId IS NOT NULL 
    AND commission_deal.deletedAt IS NULL
    AND client_deal.deletedAt IS NULL
  `;

  const parameters: any[] = [mt5Login, validatedPartnerId];

  // Optional filters
  if (symbol?.trim()) {
    whereConditions += ` AND commission_deal.Symbol LIKE '%' + @${parameters.length} + '%'`;
    parameters.push(symbol.trim());
  }

  if (dealId) {
    whereConditions += ` AND commission_deal.Deal = @${parameters.length}`;
    parameters.push(dealId);
  }

  if (startDate) {
    const startDateObj = new Date(startDate);
    if (isNaN(startDateObj.getTime())) {
      throw new BadRequestException('Invalid startDate');
    }
    whereConditions += ` AND commission_deal.[Time] >= @${parameters.length}`;
    parameters.push(startDateObj);
  }

  if (endDate) {
    const endDateObj = new Date(endDate);
    if (isNaN(endDateObj.getTime())) {
      throw new BadRequestException('Invalid endDate');
    }
    whereConditions += ` AND commission_deal.[Time] <= @${parameters.length}`;
    parameters.push(endDateObj);
  }

  // Count query for pagination
  const countQuery = `
    SELECT COUNT(*) as total
    FROM ib_commission_deals commission_deal
    INNER JOIN ib_commission_deals client_deal ON commission_deal.ParentDealId = client_deal.Deal
    INNER JOIN mt5_account client_ma ON client_deal.[Login] = CAST(client_ma.[login] AS int)
    WHERE ${whereConditions}
  `;

  // Data query with pagination
  const dataQuery = `
    SELECT
      commission_deal.partnerId,
      commission_deal.clientId,
      commission_deal.parentDealId,
      commission_deal.deal AS ticket,
      CASE 
        WHEN commission_deal.Entry = 0 THEN 'In'
        WHEN commission_deal.Entry = 1 THEN 'Out'
        WHEN commission_deal.Entry = 2 THEN 'InOut'
        ELSE 'Unknown'
      END AS entry,
      commission_deal.Symbol AS symbol,
      CASE 
        WHEN commission_deal.[Action] = 0 THEN 'Long'
        WHEN commission_deal.[Action] = 1 THEN 'Short'
        ELSE CAST(commission_deal.[Action] AS varchar)
      END AS side,
      ROUND(CAST(commission_deal.Volume AS decimal(18,2)) / 10000, 3) AS volume,
      ROUND(commission_deal.Commission, 3) AS commission,
      ROUND(commission_deal.Storage, 3) AS swap,
      commission_deal.[Time] AS time,
      ROUND(commission_deal.Price, 3) AS price,
      ROUND(commission_deal.Profit, 3) AS profit,
      commission_deal.Comment AS comment,
      commission_deal.[Order] AS orderNumber,
      commission_deal.PositionID AS positionId
    FROM ib_commission_deals commission_deal
    INNER JOIN ib_commission_deals client_deal ON commission_deal.ParentDealId = client_deal.Deal
    INNER JOIN mt5_account client_ma ON client_deal.[Login] = CAST(client_ma.[login] AS int)
    WHERE ${whereConditions}
    ORDER BY commission_deal.[Time] DESC
    OFFSET @${parameters.length} ROWS
    FETCH NEXT @${parameters.length + 1} ROWS ONLY
  `;

  // Add pagination parameters
  parameters.push(offset, pageSize);

  try {
    // Execute both queries in parallel
    const [countResult, dataResult] = await Promise.all([
      this.userRepository.query(countQuery, parameters.slice(0, parameters.length - 2)),
      this.userRepository.query(dataQuery, parameters),
    ]);

    const totalRecords = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const meta = {
      currentPage: page,
      pageSize,
      totalRecords,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };

    return {
      status: 0,
      statusCode: 200,
      message: 'Commission report fetched successfully',
      result: dataResult,
      meta,
    };
  } catch (error) {
    console.error('Error fetching commission report:', error);
    throw new Error('Failed to fetch commission report');
  }
}


async getCommissionStats(
  user: User,
  type?: string,
  userId?: number,
  subIbId?: number,
): Promise<any> {
  // Validate user is an IB
  const partnerUser = await this.userRepository.findOne({
    where: { id: user.id },
  });

  if (!partnerUser?.partnerId) {
    throw new NotFoundException('You are not an IB');
  }

  const partner = await this.partnerRepository.findOne({
    where: { id: partnerUser.partnerId, ib: true },
  });

  if (!partner) {
    throw new NotFoundException('IB not found');
  }

  const validatedPartnerId = this.validateNumeric(partnerUser.partnerId, 'partnerId');

  // ========== RECURSIVE HIERARCHY CTE (FOR DEPOSIT/WITHDRAWAL) ==========
  const getHierarchyFinStatsCTE = (startPartnerId: number, excludeDirect: boolean = false) => `
    HierarchyTree AS (
      SELECT id, uuid FROM partner WHERE id = ${startPartnerId}
      UNION ALL
      SELECT p.id, p.uuid FROM partner p 
      INNER JOIN HierarchyTree ht ON p.masterIbId = ht.id 
      WHERE p.ib = 1
    ),
    AllHierarchyLogins AS (
      SELECT DISTINCT ma.login 
      FROM mt5_account ma
      INNER JOIN client c ON c.userId = ma.userId
      INNER JOIN lead l ON c.leadId = l.id
      INNER JOIN partner p ON l.affId = p.uuid
      INNER JOIN HierarchyTree ht ON p.id = ht.id
      WHERE c.deletedAt IS NULL AND ma.deletedAt IS NULL
      ${excludeDirect ? `AND ht.id <> ${startPartnerId}` : ''}
    ),
    RecursiveFinStats AS (
      SELECT 
        SUM(CASE WHEN d.Action = 2 AND d.Profit > 0 THEN d.Profit ELSE 0 END) AS totalDeposit,
        SUM(CASE WHEN d.Action = 2 AND d.Profit < 0 THEN ABS(d.Profit) ELSE 0 END) AS totalWithdrawal
      FROM mt5_deals d
      INNER JOIN AllHierarchyLogins ahl ON d.Login = CAST(ahl.login AS INT)
      WHERE d.Action IN (2, 3)
    )
  `;

  // ========== Reusable Query Builders (Original) ==========
  
  const getClientAccountsCTE = (clientUserId: number) => `
    ClientAccounts AS (
      SELECT ma.login, ma.commissionProfileId
      FROM mt5_account ma
      WHERE ma.userId = ${clientUserId} AND ma.deletedAt IS NULL
    )
  `;

  const getDepositWithdrawalCTE = () => `
    DepositWithdrawal AS (
      SELECT 
        SUM(CASE WHEN d.Action = 2 AND d.Profit > 0 THEN d.Profit ELSE 0 END) AS totalDeposit,
        SUM(CASE WHEN d.Action = 2 AND d.Profit < 0 THEN ABS(d.Profit) ELSE 0 END) AS totalWithdrawal
      FROM mt5_deals d
      INNER JOIN ClientAccounts ca ON d.Login = CAST(ca.login AS INT)
    )
  `;

  const getCommissionEarnedCTE = (partnerId: number) => `
    CommissionEarned AS (
      SELECT SUM(ABS(cd.Commission)) AS totalCommission
      FROM ib_commission_deals client_deal
      INNER JOIN ClientAccounts ca ON client_deal.Login = CAST(ca.login AS INT)
      INNER JOIN ib_commission_deals cd ON cd.ParentDealId = client_deal.Deal
      WHERE cd.PartnerId = ${partnerId}
        AND client_deal.ParentDealId IS NULL
    )
  `;

  const getClientProfileCTE = () => `
    ClientProfile AS (
      SELECT TOP 1 cls.name AS profileName
      FROM ClientAccounts ca
      INNER JOIN ib_commission_profile cp ON cp.id = ca.commissionProfileId
      INNER JOIN classification cls ON cls.id = cp.classificationId
    )
  `;

  const buildClientFilterCTE = (targetPartnerId: number, includeSubIbs: boolean) => `
    DirectClients AS (
      SELECT c.userId AS clientId
      FROM client c
      INNER JOIN lead l ON c.leadId = l.id
      INNER JOIN partner p ON l.affId = p.uuid
      WHERE p.id = ${targetPartnerId} AND c.deletedAt IS NULL
    ),
    AllClients AS (
      SELECT 
        c.userId AS clientId,
        ma.id AS mt5AccountId,
        ma.login AS mt5Login
      FROM client c
      INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
      INNER JOIN lead l ON c.leadId = l.id
      INNER JOIN partner p ON l.affId = p.uuid
      WHERE ${includeSubIbs ? `(p.id = ${targetPartnerId} OR p.masterIbId = ${targetPartnerId})` : `p.id = ${targetPartnerId}`}
        AND c.deletedAt IS NULL
    )
  `;

  const buildAggregationCTEs = () => `
    ClientDepositWithdrawal AS (
      SELECT 
        ac.clientId,
        SUM(CASE WHEN d.Action = 2 AND d.Profit > 0 THEN d.Profit ELSE 0 END) AS totalDeposits,
        SUM(CASE WHEN d.Action = 2 AND d.Profit < 0 THEN ABS(d.Profit) ELSE 0 END) AS totalWithdrawals
      FROM AllClients ac
      LEFT JOIN mt5_deals d ON d.Login = CAST(ac.mt5Login AS INT) AND d.Action IN (2, 3)
      GROUP BY ac.clientId
    )
  `;

  const getClientCommissionCTE = (partnerId: number) => `
    ClientCommission AS (
      SELECT 
        ac.clientId,
        SUM(cd.Commission) AS totalCommission
      FROM AllClients ac
      INNER JOIN ib_commission_deals client_deal ON client_deal.Login = CAST(ac.mt5Login AS INT) AND client_deal.ParentDealId IS NULL
      INNER JOIN ib_commission_deals cd ON cd.ParentDealId = client_deal.Deal
      WHERE cd.PartnerId = ${partnerId} AND cd.Commission IS NOT NULL
      GROUP BY ac.clientId
    )
  `;

  const buildIndividualClientQuery = (clientUserId: number, partnerId: number) => `
    WITH
    ${getClientAccountsCTE(clientUserId)},
    ${getDepositWithdrawalCTE()},
    ${getCommissionEarnedCTE(partnerId)},
    ${getClientProfileCTE()}
    SELECT 
      ${clientUserId} AS crmId,
      ROUND(COALESCE(dw.totalDeposit, 0), 3) AS totalDeposit,
      ROUND(COALESCE(dw.totalWithdrawal, 0), 3) AS totalWithdrawal,
      ROUND(COALESCE(dw.totalDeposit, 0) - COALESCE(dw.totalWithdrawal, 0), 3) AS netDeposit,
      ROUND(COALESCE(ce.totalCommission, 0), 3) AS totalCommission,
      cp.profileName AS profile
    FROM DepositWithdrawal dw
    CROSS JOIN CommissionEarned ce
    CROSS JOIN ClientProfile cp;
  `;

  const validateClientOwnership = async (clientUserId: number, partnerId: number) => {
    const clientCheck = await this.userRepository.query(`
      SELECT 1 
      FROM client c
      INNER JOIN lead l ON c.leadId = l.id
      INNER JOIN partner p ON l.affId = p.uuid
      WHERE c.userId = ${clientUserId}
        AND p.id = ${partnerId}
        AND c.deletedAt IS NULL
    `);

    if (!clientCheck.length) {
      throw new ForbiddenException(
        partnerId === validatedPartnerId 
          ? 'This client does not belong to you' 
          : 'This client does not belong to the specified SubIB'
      );
    }
  };

  // ========== SCENARIO 8: type='client' + userId + subIbId ==========
  if (type === 'client' && userId && subIbId) {
      const subIbUser = await this.userRepository.findOne({
        where: { partnerId: subIbId },
      });

       if (!subIbUser) {
        throw new NotFoundException('User not found');
      }

    if (subIbId) {
      await this.userRepository.isUserAccessToIB(subIbUser.id, user.id);
    }
    const validatedClientUserId = this.validateNumeric(userId, 'userId');
    await validateClientOwnership(validatedClientUserId, subIbId);

    const query = buildIndividualClientQuery(validatedClientUserId, validatedPartnerId);
    const res = await this.userRepository.query(query);
    
    return {
      status: 0,
      statusCode: 200,
      message: 'SubIB client individual stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 4: type='client' + userId ==========
  if (type === 'client' && userId && !subIbId) {
    const validatedClientUserId = this.validateNumeric(userId, 'userId');
    await validateClientOwnership(validatedClientUserId, validatedPartnerId);

    const query = buildIndividualClientQuery(validatedClientUserId, validatedPartnerId);
    const res = await this.userRepository.query(query);
    return {
      status: 0,
      statusCode: 200,
      message: 'Client commission stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 5: type='client' + subIbId ==========
  if (type === 'client' && subIbId && !userId) {
    const subIbUser = await this.userRepository.findOne({
        where: { partnerId: subIbId },
      });

       if (!subIbUser) {
        throw new NotFoundException('User not found');
      }

    if (subIbId) {
      await this.userRepository.isUserAccessToIB(subIbUser.id, user.id);
    }

    const query = `
      WITH
      ${buildClientFilterCTE(subIbId, false)},
      ${buildAggregationCTEs()},
      ${getClientCommissionCTE(validatedPartnerId)}
      SELECT 
        ROUND(COALESCE((SELECT SUM(totalDeposits) FROM ClientDepositWithdrawal), 0), 3) AS totalDeposit,
        ROUND(COALESCE((SELECT SUM(totalWithdrawals) FROM ClientDepositWithdrawal), 0), 3) AS totalWithdrawal,
        ROUND(COALESCE((SELECT SUM(totalCommission) FROM ClientCommission), 0), 3) AS totalCommission,
        COUNT(DISTINCT ac.clientId) AS totalClients
      FROM AllClients ac;
    `;

    const res = await this.userRepository.query(query);
    return {
      status: 0,
      statusCode: 200,
      message: 'SubIB client stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 6: type='subIb' + subIbId (FIXED) ==========
  if (type === 'subIb' && subIbId) {
    const subIbUser = await this.userRepository.findOne({
        where: { partnerId: subIbId },
      });

       if (!subIbUser) {
        throw new NotFoundException('User not found');
      }

    if (subIbId) {
    await this.userRepository.isUserAccessToIB(subIbUser.id, user.id);
    }

    const query = `
      WITH
      ${getHierarchyFinStatsCTE(subIbId, true)}, -- Exclude subIbId and its direct clients
      NestedSubIbs AS (
        SELECT sp.id AS subIbId FROM partner sp WHERE sp.masterIbId = ${subIbId} AND sp.ib = 1
      ),

      DirectNestedClients AS (
        SELECT DISTINCT c.userId AS clientId
        FROM client c
        INNER JOIN lead l ON c.leadId = l.id
        INNER JOIN partner p ON l.affId = p.uuid
        WHERE c.deletedAt IS NULL AND p.masterIbId = ${subIbId}
      ),

      AllHierarchyClients AS (
        SELECT DISTINCT c.userId AS clientId
        FROM client c
        INNER JOIN lead l ON c.leadId = l.id
        INNER JOIN partner p ON l.affId = p.uuid
        INNER JOIN HierarchyTree ht ON p.id = ht.id
        WHERE c.deletedAt IS NULL AND ht.id <> ${subIbId}
      ),
      NestedClientCommission AS (
        SELECT SUM(cd.Commission) AS totalCommission
        FROM ib_commission_deals cd
        WHERE cd.PartnerId = ${validatedPartnerId} 
        AND cd.clientId IN (SELECT clientId FROM AllHierarchyClients)
      )
      SELECT 
        (SELECT COUNT(DISTINCT subIbId) FROM NestedSubIbs) AS totalSubIbs,
        (SELECT COUNT(*) FROM DirectNestedClients) AS totalSubIbClients,
        (SELECT totalDeposit FROM RecursiveFinStats) AS totalDeposit,
        (SELECT totalWithdrawal FROM RecursiveFinStats) AS totalWithdrawal,
        ROUND(COALESCE((SELECT totalCommission FROM NestedClientCommission), 0), 3) AS totalCommission
      FROM NestedSubIbs nsi;
    `;

    const res = await this.userRepository.query(query);
    return {
      status: 0,
      statusCode: 200,
      message: 'Nested SubIB stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 7: type='all' + subIbId ==========
  if (type === 'all' && subIbId) {
   const subIbUser = await this.userRepository.findOne({
        where: { partnerId: subIbId },
      });

       if (!subIbUser) {
        throw new NotFoundException('User not found');
      }

    if (subIbId) {
      await this.userRepository.isUserAccessToIB(subIbUser.id, user.id);
    }

    const query = `
      WITH
      ${getHierarchyFinStatsCTE(subIbId, false)}, -- Include subIbId clients for 'all'
      DirectClients AS (
        SELECT c.userId AS clientId
        FROM client c
        INNER JOIN lead l ON c.leadId = l.id
        INNER JOIN partner p ON l.affId = p.uuid
        WHERE p.id = ${subIbId} AND c.deletedAt IS NULL
      ),
      ClientVolumePnl AS (
        SELECT
          SUM(cd.Volume) AS totalVolume,
          SUM(cd.Profit) AS totalPnl
        FROM ib_commission_deals cd
        WHERE cd.PartnerId = ${subIbId}
      ),
      ClientCommission AS (
        SELECT SUM(cd.Commission) AS totalCommission
        FROM ib_commission_deals cd
        WHERE cd.PartnerId = ${validatedPartnerId} AND cd.clientId IN (
           SELECT DISTINCT ma.userId FROM mt5_account ma 
           INNER JOIN AllHierarchyLogins ahl ON ma.login = ahl.login
        )
      )
      SELECT 
        (SELECT totalDeposit FROM RecursiveFinStats) AS totalDeposit,
        (SELECT totalWithdrawal FROM RecursiveFinStats) AS totalWithdrawal,
        ROUND(COALESCE((SELECT totalCommission FROM ClientCommission), 0), 3) AS totalCommission,
        (SELECT COUNT(*) FROM DirectClients) AS totalClients,
        ROUND(COALESCE((SELECT totalVolume FROM ClientVolumePnl) / 10000.0, 0), 3) AS totalVolume,
        ROUND(COALESCE((SELECT totalPnl FROM ClientVolumePnl), 0), 3) AS totalPnl,
        (SELECT COUNT(*) FROM partner WHERE masterIbId = ${subIbId} AND ib = 1) AS totalSubIbs,
        (SELECT COUNT(DISTINCT c.userId) 
         FROM client c 
         INNER JOIN lead l ON c.leadId = l.id 
         INNER JOIN partner p ON l.affId = p.uuid 
         WHERE p.masterIbId = ${subIbId} AND c.deletedAt IS NULL) AS totalSubIbClients;
    `;

    const res = await this.userRepository.query(query);
    return {
      status: 0,
      statusCode: 200,
      message: 'SubIB all stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 3: type='subIb' (no subIbId) (FIXED) ==========
  if (type === 'subIb' && !subIbId) {
    const query = `
      WITH 
      ${getHierarchyFinStatsCTE(validatedPartnerId, true)}, -- Deposits/Withdrawals niche tak
      
      SubIbs AS (
        SELECT sp.id AS subIbId
        FROM partner sp
        WHERE sp.masterIbId = ${validatedPartnerId} AND sp.ib = 1
      ),
      DirectSubIbClients AS (
        SELECT DISTINCT c.userId AS clientId
        FROM client c
        INNER JOIN lead l ON c.leadId = l.id
        INNER JOIN partner p ON l.affId = p.uuid -- lead/partner join logic
        WHERE c.deletedAt IS NULL AND p.masterIbId = ${validatedPartnerId}
      ),

      AllHierarchyClients AS (
        SELECT DISTINCT c.userId AS clientId
        FROM client c
        INNER JOIN partner p ON c.affId = p.id
        INNER JOIN HierarchyTree ht ON p.id = ht.id
        WHERE c.deletedAt IS NULL AND ht.id <> ${validatedPartnerId}
      ),

      SubIbClientCommission AS (
        SELECT SUM(cd.Commission) AS totalCommission
        FROM ib_commission_deals cd
        WHERE cd.PartnerId = ${validatedPartnerId}
          AND cd.clientId IN (SELECT clientId FROM AllHierarchyClients)
      )
      SELECT 
        (SELECT COUNT(*) FROM SubIbs) AS totalSubIbs,
        (SELECT COUNT(*) FROM DirectSubIbClients) AS totalSubIbClients,
        (SELECT totalDeposit FROM RecursiveFinStats) AS totalDeposit,
        (SELECT totalWithdrawal FROM RecursiveFinStats) AS totalWithdrawal,
        ROUND(COALESCE((SELECT totalCommission FROM SubIbClientCommission), 0), 3) AS totalCommission;
    `;

    const res = await this.userRepository.query(query);
    return {
      status: 0,
      statusCode: 200,
      message: 'Sub-IB stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 2: type='client' ==========
  if (type === 'client' && !userId && !subIbId) {
    const query = `
      WITH
      ${buildClientFilterCTE(validatedPartnerId, false)},
      ${buildAggregationCTEs()},
      ${getClientCommissionCTE(validatedPartnerId)}
      SELECT 
        ROUND(COALESCE((SELECT SUM(totalDeposits) FROM ClientDepositWithdrawal), 0), 3) AS totalDeposit,
        ROUND(COALESCE((SELECT SUM(totalWithdrawals) FROM ClientDepositWithdrawal), 0), 3) AS totalWithdrawal,
        ROUND(COALESCE((SELECT SUM(ABS(totalCommission)) FROM ClientCommission), 0), 3) AS totalCommission,
        COUNT(DISTINCT ac.clientId) AS totalClients
      FROM AllClients ac;
    `;

    const res = await this.userRepository.query(query);
    return {
      status: 0,
      statusCode: 200,
      message: 'Direct client stats fetched successfully',
      result: res[0],
    };
  }

  // ========== SCENARIO 1: type='all' (default) ==========
  const query = `
    WITH
    ${getHierarchyFinStatsCTE(validatedPartnerId, false)}, -- Include Main IB clients for 'all'
    DirectClients AS (
      SELECT c.userId AS clientId
      FROM client c
      INNER JOIN lead l ON c.leadId = l.id
      INNER JOIN partner p ON l.affId = p.uuid
      WHERE p.id = ${validatedPartnerId} AND c.deletedAt IS NULL
    ),
    DirectSubIbs AS (
      SELECT id
      FROM partner
      WHERE masterIbId = ${validatedPartnerId} AND ib = 1
    ),
    ClientCommission AS (
      SELECT SUM(cd.Commission) AS totalCommission
      FROM ib_commission_deals cd
      WHERE cd.PartnerId = ${validatedPartnerId} AND cd.Commission IS NOT NULL
    ),
    ClientVolumePnl AS (
      SELECT
        SUM(cd.Volume) AS totalVolume,
        SUM(cd.Profit) AS totalPnl
      FROM ib_commission_deals cd
      WHERE cd.PartnerId = ${validatedPartnerId}
    )
    SELECT
      (SELECT totalDeposit FROM RecursiveFinStats) AS totalDeposit,
      (SELECT totalWithdrawal FROM RecursiveFinStats) AS totalWithdrawal,
      ROUND(COALESCE((SELECT totalCommission FROM ClientCommission), 0), 3) AS totalCommission,
      ROUND(COALESCE((SELECT totalVolume FROM ClientVolumePnl) / 10000.0, 0), 3) AS totalVolume,
      ROUND(COALESCE((SELECT totalPnl FROM ClientVolumePnl), 0), 3) AS totalPnl,
      (SELECT COUNT(*) FROM DirectClients) AS totalClients,
      (SELECT COUNT(*) FROM DirectSubIbs) AS totalSubIbs,
      (SELECT COUNT(DISTINCT c.userId) FROM client c 
       INNER JOIN lead l ON c.leadId = l.id 
       INNER JOIN partner p ON l.affId = p.uuid 
       WHERE p.masterIbId = ${validatedPartnerId} AND c.deletedAt IS NULL) AS totalSubIbClients;
  `;

  const res = await this.userRepository.query(query);
  return {
    status: 0,
    statusCode: 200,
    message: 'Commission stats fetched successfully',
    result: res[0],
  };
}

  // Helper function to calculate percentage change
  private calculatePercentageChange(
    oldValue: number,
    newValue: number,
  ): number {
    if (oldValue === 0) return newValue === 0 ? 0 : 100;
    return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
  }

async getSubIbBreakdown(
  user: User,
  options: QueryOptionsDto,
  isClientEndpoint = false,
) {
    let { login, startDate, endDate, page = 1, limit = 50, subIbId, clientName , clientId } = options;

  let mt5Id = "";
    // Step 1: Determine MT5 ID for the main IB if not provided
  if (!mt5Id) {
    const partnerUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!partnerUser?.partnerId) throw new NotFoundException('You are not an IB');

    const partner = await this.partnerRepository.findOne({
      where: { id: partnerUser.partnerId, ib: true },
      relations: { mt5Account: true },
    });

      if (!partner) throw new NotFoundException('IB not found');
      if (!partner.mt5Account) throw new NotFoundException('MT5 ID not found for IB');

    mt5Id = partner.mt5Account.login;
  }

    // Step 2: Validate access for client endpoints
    if (options.partnerId && isClientEndpoint) {
      const pUser = await this.userRepository.findOne({ where: { partnerId: options.partnerId } });
      if (!pUser) throw new NotFoundException('Partner user not found');
      await this.userRepository.isUserAccessToIB(pUser.id, user.id);
    }

    // Step 3: Determine parent ID whose direct sub-IBs we need to query
  const mainPartnerResult = await this.clientRepository.query(
    `SELECT p.id FROM partner p 
     INNER JOIN mt5_account m ON p.mt5AccountId = m.id AND m.deletedAt IS NULL
     INNER JOIN server s ON m.serverId = s.id 
       WHERE m.login = @0 AND s.name = 'LIVE'`,
      [mt5Id]
  );

    if (!mainPartnerResult || !mainPartnerResult[0])
      throw new Error('Main partner not found for given MT5 ID');

  const mainPartnerId = mainPartnerResult[0].id;
  const parentIdToQuery = subIbId || mainPartnerId;
  const mainIbIdForCommission = mainPartnerId;

    // Step 4: Get direct sub-IB IDs (LIVE accounts only)
  const subIBs = await this.clientRepository.query(
      `SELECT p.id 
       FROM partner p 
     INNER JOIN mt5_account m ON p.mt5AccountId = m.id AND m.deletedAt IS NULL
     INNER JOIN server s ON m.serverId = s.id 
       WHERE p.masterIbId = @0 
         AND p.ib = 1 
         AND p.status = 'ACTIVE' 
         AND p.deleted_at IS NULL 
         AND s.name = 'LIVE'`,
      [parentIdToQuery]
  );

  const ibIdsToQuery = subIBs.map((r: any) => r.id);
    if (ibIdsToQuery.length === 0)
      throw new NotFoundException('No sub-IBs found');


  let searchFilters = `p.id IN (${ibIdsToQuery.join(',')})`;

if (login) {
  searchFilters += ` AND CAST(lma_partner.[login] AS VARCHAR) LIKE '%${login.trim()}%'`;
}

if (clientId) {
  searchFilters += ` AND CAST(u.id AS VARCHAR) LIKE '%${clientId.trim()}%'`;
}

if (clientName) {
  searchFilters += ` AND u.fullName LIKE '%${clientName.trim()}%'`;
}
  // DATE FILTERS
  const dealDateFilter = (startDate && endDate) ? `AND d.[Time] BETWEEN '${startDate}' AND '${endDate}'` : '';
  const commissionDateFilter = (startDate && endDate) ? `AND cd.CreatedAt BETWEEN '${startDate}' AND '${endDate}'` : '';

  const offset = (page - 1) * limit;

    // Step 4: Pagination count
  const countQuery = `
    SELECT COUNT(*) AS totalCount 
    FROM partner p 
    INNER JOIN [user] u ON u.partnerId = p.id
    INNER JOIN mt5_account lma_partner ON p.mt5AccountId = lma_partner.id AND lma_partner.deletedAt IS NULL
    INNER JOIN server s ON lma_partner.serverId = s.id AND s.name = 'LIVE'
    WHERE ${searchFilters}
  `;
  const countResult = await this.clientRepository.query(countQuery);
  const totalCount = countResult[0]?.totalCount || 0;

  const mainQuery = `
  WITH LiveMT5Accounts AS (
    SELECT ma.id, ma.userId, ma.login, ma.serverId
    FROM mt5_account ma
    INNER JOIN server s ON ma.serverId = s.id AND s.name = 'LIVE'
    WHERE ma.deletedAt IS NULL
  ),
  
  SubIbHierarchy AS (
    SELECT 
      p.id AS rootSubIbId,
      p.id AS currentPartnerId
    FROM partner p
    INNER JOIN [user] u ON u.partnerId = p.id
    INNER JOIN mt5_account lma_partner ON p.mt5AccountId = lma_partner.id
    WHERE ${searchFilters} 
    UNION ALL
    SELECT 
      sih.rootSubIbId,
      p.id AS currentPartnerId
    FROM SubIbHierarchy sih
    INNER JOIN partner p ON p.masterIbId = sih.currentPartnerId
    WHERE p.ib = 1 AND p.status = 'ACTIVE' AND p.deleted_at IS NULL
  ),
  
  HierarchyLogins AS (
    SELECT DISTINCT
      sih.rootSubIbId,
      lma.login AS mt5Login
    FROM SubIbHierarchy sih
    INNER JOIN client c ON c.affid = sih.currentPartnerId AND c.deletedAt IS NULL
    INNER JOIN LiveMT5Accounts lma ON lma.userId = c.userId
  ),

  HierarchicalFinStats AS (
    SELECT 
      hl.rootSubIbId,
      SUM(CASE WHEN d.Action = 2 AND d.Profit > 0 THEN d.Profit ELSE 0 END) AS totalDeposits,
      SUM(CASE WHEN d.Action = 2 AND d.Profit < 0 THEN ABS(d.Profit) ELSE 0 END) AS totalWithdrawals
    FROM HierarchyLogins hl
    INNER JOIN mt5_deals d ON d.Login = CAST(hl.mt5Login AS INT)
    WHERE d.Action IN (2, 3)
    ${dealDateFilter}
    GROUP BY hl.rootSubIbId
  ),
  
  HierarchyClients AS (
    SELECT sih.rootSubIbId, c.userId AS clientId, lma.login AS clientMt5Login
    FROM SubIbHierarchy sih
    INNER JOIN client c ON c.affid = sih.currentPartnerId AND c.deletedAt IS NULL
    INNER JOIN LiveMT5Accounts lma ON lma.userId = c.userId
  ),
  
  ClientCommissions AS (
    SELECT hc.rootSubIbId, SUM(COALESCE(cd.Commission, 0)) AS totalCommission
    FROM HierarchyClients hc
    INNER JOIN ib_commission_deals client_deal ON client_deal.Login = CAST(hc.clientMt5Login AS INT) AND client_deal.ParentDealId IS NULL
    INNER JOIN ib_commission_deals cd ON cd.ParentDealId = client_deal.Deal AND cd.PartnerId = ${mainIbIdForCommission}
    WHERE 1=1 ${commissionDateFilter}
    GROUP BY hc.rootSubIbId
  ),

  TotalHierarchicalCommission AS (
    SELECT rootSubIbId, ROUND(SUM(totalCommission), 3) AS hierarchicalCommission
    FROM ClientCommissions
    GROUP BY rootSubIbId
  )
  
  SELECT 
    p.id AS subPartnerId,
    lma_partner.login AS mt5Login,
    u.id AS userId,
    u.fullName AS fullName,
    (SELECT COUNT(DISTINCT userId) FROM client WHERE affid = p.id AND deletedAt IS NULL) AS directClients,
    ROUND(COALESCE(hfs.totalDeposits, 0), 3) AS totalDeposits,
    ROUND(COALESCE(hfs.totalWithdrawals, 0), 3) AS totalWithdrawals,
    ROUND(COALESCE(thc.hierarchicalCommission, 0), 3) AS hierarchicalCommission
  FROM partner p
  INNER JOIN [user] u ON u.partnerId = p.id
  INNER JOIN LiveMT5Accounts lma_partner ON p.mt5AccountId = lma_partner.id
  LEFT JOIN HierarchicalFinStats hfs ON hfs.rootSubIbId = p.id
  LEFT JOIN TotalHierarchicalCommission thc ON thc.rootSubIbId = p.id
  WHERE ${searchFilters}
  ORDER BY p.id ASC
  OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY;
`;
  const rawRows = await this.clientRepository.query(mainQuery);

  return {
    status: 0,
    statusCode: 200,
    message: 'Sub IB breakdown fetched successfully',
    result: {
      data: rawRows,
      pagination: {
          page,
          limit,
          totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPreviousPage: page > 1,
      },
    },
  };
}


  async depositFundSummary(
    userId: number,
    period: 'today' | 'week' | 'month' | 'quarter' | 'year' = 'month',
    userDate: Date, // User timezone date
  ) {
    try {
      // 1️⃣ Get User
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user?.partnerId) {
        throw new NotFoundException('IB not found');
      }

      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId, ib: true },
      });

      if (!partner) {
        throw new NotFoundException('IB partner not found');
      }

      const baseDate = new Date(userDate);
      let startDate = new Date(baseDate);
      let endDate = new Date(baseDate);
      endDate.setHours(23, 59, 59, 999);

      switch (period) {
        case 'today': {
          startDate.setHours(0, 0, 0, 0);
          break;
        }

        case 'week': {
          startDate.setDate(startDate.getDate() - 7);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case 'month': {
          startDate.setMonth(startDate.getMonth() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case 'quarter': {
          startDate.setMonth(startDate.getMonth() - 3);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
        case 'year': {
          startDate.setFullYear(startDate.getFullYear() - 1);
          startDate.setHours(0, 0, 0, 0);
          break;
        }
      }

      // 3️⃣ Lead filter (IB UUID)
      const leadFilter = partner.uuid
        ? ` AND l.affId = '${partner.uuid}'`
        : '';

      const dateFilter = `
      AND l.createdAt BETWEEN '${startDate.toISOString()}'
      AND '${endDate.toISOString()}'
    `;

      // 4️⃣ Final Query
      const rawQuery = `
      SELECT
        UPPER(l.userLifeCycle) AS Category,
        COUNT(*) AS 'All',
        SUM(CASE WHEN l.FTD = 1 THEN 1 ELSE 0 END) AS Funded,
        SUM(CASE WHEN l.FTD = 0 THEN 1 ELSE 0 END) AS NonFunded
      FROM lead l
      WHERE l.isActive = 1
        ${leadFilter}
        ${dateFilter}
      GROUP BY l.userLifeCycle;
    `;

      const result = await this.leadRepository.query(rawQuery);

      // 5️⃣ Normalize response
      const categories = ['CLIENT', 'APPLICANT', 'REGISTERED', 'LEAD'];
      const resultMap = new Map(
        result.map((item: any) => [item.Category, item]),
      );

      const data = categories.map((cat) => {
        const item = resultMap.get(cat) as any;
        return {
          Category: cat,
          All: Number(item?.All ?? 0),
          Funded: Number(item?.Funded ?? 0),
          NonFunded: Number(item?.NonFunded ?? 0),
        };
      });

      // 6️⃣ Return
      return {
        data,
        period,
        startDate,
        endDate,
        success: true,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error getting deposit fund summary',
        error,
      );
    }
  }


  async getLeadClientsSummary(userId: number, date: Date) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user?.partnerId) {
        throw new NotFoundException('IB not found');
      }

      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId, ib: true },
      });

      if (!partner) {
        throw new NotFoundException('IB partner not found');
      }

      const leadFilter = partner.uuid
        ? ` AND l.affId = '${partner.uuid}'`
        : '';

      // 2️⃣ ROLLING DATE RANGES
      const now = new Date(date);

      const endDate = new Date(now);
      endDate.setHours(23, 59, 59, 999);

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now);
      startOfMonth.setMonth(startOfMonth.getMonth() - 1);
      startOfMonth.setHours(0, 0, 0, 0);

      const startOfQuarter = new Date(now);
      startOfQuarter.setMonth(startOfQuarter.getMonth() - 3);
      startOfQuarter.setHours(0, 0, 0, 0);

      const startOfYear = new Date(now);
      startOfYear.setFullYear(startOfYear.getFullYear() - 1);
      startOfYear.setHours(0, 0, 0, 0);

      // 3️⃣ SQL QUERY (ROLLING LOGIC)
      const query = `
    SELECT
      UPPER(l.userLifeCycle) AS Category,
      SUM(CASE
        WHEN (
          (l.userLifeCycle = 'lead' AND l.createdAt BETWEEN '${startOfToday.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'applicant' AND l.applicantCreatedTime BETWEEN '${startOfToday.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'registered' AND l.registeredCreatedTime BETWEEN '${startOfToday.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'client' AND l.clientCreatedTime BETWEEN '${startOfToday.toISOString()}' AND '${endDate.toISOString()}')
        )
        THEN 1 ELSE 0
      END) AS Today,
      SUM(CASE
        WHEN (
          (l.userLifeCycle = 'lead' AND l.createdAt BETWEEN '${startOfWeek.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'applicant' AND l.applicantCreatedTime BETWEEN '${startOfWeek.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'registered' AND l.registeredCreatedTime BETWEEN '${startOfWeek.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'client' AND l.clientCreatedTime BETWEEN '${startOfWeek.toISOString()}' AND '${endDate.toISOString()}')
        )
        THEN 1 ELSE 0
      END) AS Week,
      SUM(CASE
        WHEN (
          (l.userLifeCycle = 'lead' AND l.createdAt BETWEEN '${startOfMonth.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'applicant' AND l.applicantCreatedTime BETWEEN '${startOfMonth.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'registered' AND l.registeredCreatedTime BETWEEN '${startOfMonth.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'client' AND l.clientCreatedTime BETWEEN '${startOfMonth.toISOString()}' AND '${endDate.toISOString()}')
        )
        THEN 1 ELSE 0
      END) AS Month,
      SUM(CASE
        WHEN (
          (l.userLifeCycle = 'lead' AND l.createdAt BETWEEN '${startOfQuarter.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'applicant' AND l.applicantCreatedTime BETWEEN '${startOfQuarter.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'registered' AND l.registeredCreatedTime BETWEEN '${startOfQuarter.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'client' AND l.clientCreatedTime BETWEEN '${startOfQuarter.toISOString()}' AND '${endDate.toISOString()}')
        )
        THEN 1 ELSE 0
      END) AS Quarter,
      SUM(CASE
        WHEN (
          (l.userLifeCycle = 'lead' AND l.createdAt BETWEEN '${startOfYear.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'applicant' AND l.applicantCreatedTime BETWEEN '${startOfYear.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'registered' AND l.registeredCreatedTime BETWEEN '${startOfYear.toISOString()}' AND '${endDate.toISOString()}') OR
          (l.userLifeCycle = 'client' AND l.clientCreatedTime BETWEEN '${startOfYear.toISOString()}' AND '${endDate.toISOString()}')
        )
        THEN 1 ELSE 0
      END) AS Year
    FROM lead l
    WHERE l.isActive = 1
      ${leadFilter}
    GROUP BY l.userLifeCycle;
    `;

      const result = await this.leadRepository.query(query);

      const widgets: any[] = [
        { Category: 'CLIENT', Today: 0, Week: 0, Month: 0, Quarter: 0, Year: 0 },
        { Category: 'APPLICANT', Today: 0, Week: 0, Month: 0, Quarter: 0, Year: 0 },
        { Category: 'REGISTERED', Today: 0, Week: 0, Month: 0, Quarter: 0, Year: 0 },
        { Category: 'LEAD', Today: 0, Week: 0, Month: 0, Quarter: 0, Year: 0 },
      ];

      for (const row of result) {
        const index =
          row.Category === 'CLIENT' ? 0 :
            row.Category === 'APPLICANT' ? 1 :
              row.Category === 'REGISTERED' ? 2 :
                3;

        widgets[index] = row;
      }

      return widgets;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting lead clients summary',
        error,
      );
    }
  }


  async getClientDepositTarget(
    userId: number,
    timeZone: { userDate: Date; utcOffsetMinutes: number },
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user?.partnerId) {
        throw new NotFoundException('IB not found');
      }
      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId, ib: true },
      });

      if (!partner) {
        throw new NotFoundException('IB partner not found');
      }

      const clientFilter = partner.id ? ` AND c.affId = '${partner.id}'` : '';

      const currentDate = new Date(timeZone.userDate);

      // Calculate date ranges
      const today = new Date(currentDate);
      today.setHours(0, 0, 0, 0);

      const weekStart = new Date(currentDate);
      weekStart.setDate(today.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const monthStart = new Date(currentDate);
      monthStart.setDate(today.getDate() - 29);
      monthStart.setHours(0, 0, 0, 0);

      const quarterStart = new Date(currentDate);
      quarterStart.setDate(today.getDate() - 89);
      quarterStart.setHours(0, 0, 0, 0);

      const yearStart = new Date(currentDate);
      yearStart.setDate(today.getDate() - 364);
      yearStart.setHours(0, 0, 0, 0);

      // Previous month range (30 days before monthStart)
      const previousMonthStart = new Date(monthStart);
      previousMonthStart.setDate(previousMonthStart.getDate() - 30);

      const previousMonthEnd = new Date(monthStart);
      previousMonthEnd.setDate(previousMonthEnd.getDate() - 1);

      // Format dates
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedToday = formatDate(today);
      const formattedWeekStart = formatDate(weekStart);
      const formattedMonthStart = formatDate(monthStart);
      const formattedQuarterStart = formatDate(quarterStart);
      const formattedYearStart = formatDate(yearStart);
      const formattedCurrentDate = formatDate(currentDate);
      const formattedPrevMonthStart = formatDate(previousMonthStart);
      const formattedPrevMonthEnd = formatDate(previousMonthEnd);

      const rawQuery = `
      WITH RankedTransactions AS (
        SELECT
          t.userId,
          t.paidAmount AS amount,
          CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) AS localDate,
          ROW_NUMBER() OVER (
            PARTITION BY t.userId
            ORDER BY DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)
          ) AS txn_rank
        FROM [TRANSACTION] t
        INNER JOIN client c ON c.userId = t.userId AND c.isActive = 1 ${clientFilter}
        WHERE t.type = 'DEPOSIT' AND t.status = 'APPROVED'
      )

      SELECT
        'First-Time-Deposit' AS TYPE,
        ROUND(ISNULL(SUM(CASE WHEN txn_rank = 1 AND localDate = '${formattedToday}' THEN amount END), 0), 0) AS today,
        ROUND(ISNULL(SUM(CASE WHEN txn_rank = 1 AND localDate >= '${formattedWeekStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0) AS thisWeek,
        ROUND(ISNULL(SUM(CASE WHEN txn_rank = 1 AND localDate >= '${formattedMonthStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0) AS thisMonth,
        ROUND(ISNULL(SUM(CASE WHEN txn_rank = 1 AND localDate >= '${formattedQuarterStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0) AS thisQuarter,
        ROUND(ISNULL(SUM(CASE WHEN txn_rank = 1 AND localDate >= '${formattedYearStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0) AS thisYear,
        ROUND(ISNULL(SUM(CASE WHEN txn_rank = 1 AND localDate >= '${formattedPrevMonthStart}' AND localDate <= '${formattedPrevMonthEnd}' THEN amount END), 0), 0) AS previousMonth
      FROM RankedTransactions

      UNION ALL

      SELECT
        'Repeat-Deposit',
        ROUND(ISNULL(SUM(CASE WHEN txn_rank > 1 AND localDate = '${formattedToday}' THEN amount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN txn_rank > 1 AND localDate >= '${formattedWeekStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN txn_rank > 1 AND localDate >= '${formattedMonthStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN txn_rank > 1 AND localDate >= '${formattedQuarterStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN txn_rank > 1 AND localDate >= '${formattedYearStart}' AND localDate <= '${formattedCurrentDate}' THEN amount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN txn_rank > 1 AND localDate >= '${formattedPrevMonthStart}' AND localDate <= '${formattedPrevMonthEnd}' THEN amount END), 0), 0)
      FROM RankedTransactions

      UNION ALL

      SELECT
        'Withdraw',
        ROUND(ISNULL(SUM(CASE WHEN CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) = '${formattedToday}' THEN t.paidAmount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) >= '${formattedWeekStart}' AND CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) <= '${formattedCurrentDate}' THEN t.paidAmount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) >= '${formattedMonthStart}' AND CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) <= '${formattedCurrentDate}' THEN t.paidAmount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) >= '${formattedQuarterStart}' AND CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) <= '${formattedCurrentDate}' THEN t.paidAmount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) >= '${formattedYearStart}' AND CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) <= '${formattedCurrentDate}' THEN t.paidAmount END), 0), 0),
        ROUND(ISNULL(SUM(CASE WHEN CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) >= '${formattedPrevMonthStart}' AND CONVERT(DATE, DATEADD(MINUTE, ${timeZone.utcOffsetMinutes}, t.createdAt)) <= '${formattedPrevMonthEnd}' THEN t.paidAmount END), 0), 0)
      FROM [TRANSACTION] t
      INNER JOIN client c ON c.userId = t.userId AND c.isActive = 1 ${clientFilter}
      WHERE t.type='WITHDRAW' AND t.status='APPROVED'
    `;

      const data = await this.leadRepository.query(rawQuery);

      type Period = 'today' | 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear' | 'previousMonth';

      const calculateAchievement = (period: Period) => {
        const first = data.find((i) => i.TYPE === 'First-Time-Deposit')?.[period] || 0;
        const repeat = data.find((i) => i.TYPE === 'Repeat-Deposit')?.[period] || 0;
        const withdraw = data.find((i) => i.TYPE === 'Withdraw')?.[period] || 0;

        const totalDeposit = first + repeat;

        return {
          firstTimeDeposit: first,
          totalDeposit,
          withdrawals: withdraw,
          netDeposit: totalDeposit - withdraw,
        };
      };

      const currentMonthData = calculateAchievement('thisMonth');
      const previousMonthData = calculateAchievement('previousMonth');
      // Calculate percentage change
      let percentageChange = 0;
      if (previousMonthData.totalDeposit > 0) {
        percentageChange = parseFloat(
          (
            ((currentMonthData.totalDeposit - previousMonthData.totalDeposit) /
              previousMonthData.totalDeposit) *
            100
          ).toFixed(2)
        );
      } else if (currentMonthData.totalDeposit > 0) {
        percentageChange = 100; // If previous was 0 and current > 0, it's 100% increase
      }

      return {
        depositTargetAchievement: {
          today: calculateAchievement('today'),
          thisWeek: calculateAchievement('thisWeek'),
          thisMonth: currentMonthData,
          thisQuarter: calculateAchievement('thisQuarter'),
          thisYear: calculateAchievement('thisYear'),
          percentageChange,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting client deposit target',
        error,
      );
    }
  }

  async getAllSubIbs({
    userId,
    query,
  }: {
    userId: number;
    query: QuerySubIbs;
  }) {
    try {
      const page = query?.page ?? 1;
      const limit = query?.limit ?? 100;

      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user?.partnerId) {
        throw new NotFoundException('IB Client not found');
      }

      let where: FindOptionsWhere<Partner> = {
        masterIbId: user.partnerId,
        user: {
          client: {
            userId: Not(IsNull())
          }
        },
        ib: true,
      };

      if (query.name) {
        where = {
          masterIbId: user.partnerId,
          ib: true,
          name: ILike(`%${query.name}%`),
          country: query.country ? ILike(`%${query.country}%`) : undefined,
          email: query.email ? ILike(`%${query.email}%`) : undefined,
          created_at:
            query.from && query.to ? Between(query.from, query.to) : undefined,
          user: {
            client: {
              userId: Not(IsNull())
            }
          },
        };
      } else {
        if (query.country) {
          where.country = ILike(`%${query.country}%`);
        }
        if (query.status) {
          where.status = query.status as ActiveStatus;
        }
        if (query.phoneNumber) {
          where.telephone = ILike(`%${query.phoneNumber}%`);
        }
        if (query.email) {
          where.email = ILike(`%${query.email}%`);
        }
        if (query.from || query.to) {
          const fromDate = query.from
            ? new Date(query.from)
            : new Date('1970-01-01');

          const toDate = query.to
            ? new Date(query.to)
            : new Date();

          fromDate.setHours(0, 0, 0, 0);
          toDate.setHours(23, 59, 59, 999);

          where.created_at = Between(fromDate, toDate);
        }
      }

      const [subIbs, total] = await this.partnerRepository.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: 'DESC' },
      });

      const users = await this.userRepository.find({
        where: {
          partnerId: In(subIbs.map((ib) => ib.id)),
        },
        relations: {
          client: {
            commissionProfile: {
              classification: true,
            },
          },
        },
      });

      const hasNextPage = total > page * limit;

       const result = subIbs.map((ib) => ({
         ...ib,
         user: users.find((u) => u.partnerId === ib.id) || null,
       }));

      return {
        data: result,
        hasNextPage,
        total,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting all sub ibs',
        error,
      );
    }
  }

  async findOneSubIbById(id: number, userId: number, isClientEndpoint = false,) {

    try {
      const user = await this.userRepository.findOne({
        where: { partnerId: id },
        relations: { client:{commissionProfile:{classification:true}} },

      });
      const partner = await this.partnerRepository.findOne({
        where: { id: id, ib: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!partner) {
        throw new NotFoundException('Partner not found');
      }

      if (isClientEndpoint) {
        await this.userRepository.isUserAccessToIB(user.id, userId);
      }

      const partnerLinksCount = await this.partnerLinksRepository.count({
        where: { partnerId: partner?.id },
      });

      const partnerClientsCount = await this.clientRepository.count({
        where: { affid: partner?.id, userLifeCycle: UserLifeCycle.CLIENT },
      });
      const partnerApplicantsCount = await this.clientRepository.count({
        where: { affid: partner?.id, userLifeCycle: UserLifeCycle.APPLICANT },
      });
      const partnerRegisteredCount = await this.clientRepository.count({
        where: { affid: partner?.id, userLifeCycle: UserLifeCycle.REGISTERED },
      });

      // Get total deposits for all clients of this sub-IB
      const totalDepositsQuery = `
        SELECT COALESCE(SUM(t.paidAmount), 0) as totalDeposits
        FROM [TRANSACTION] t
        INNER JOIN client c ON c.userId = t.userId
        WHERE c.affid = ${partner.id}
        AND t.type = 'DEPOSIT'
        AND t.status = 'APPROVED'
      `;

      const totalDepositsResult =
        await this.userRepository.query(totalDepositsQuery);
      const totalDeposits = totalDepositsResult[0]?.totalDeposits || 0;

      // const mt5AccountsQuery = `
      //   SELECT
      //     m.id,
      //     m.login,
      //     m.userId,
      //     u.email,
      //     c.firstName,
      //     c.lastName
      //   FROM
      //     mt5_account m
      //   INNER JOIN
      //     [client] c ON c.userId = m.userId
      //   INNER JOIN
      //     [user] u ON u.id = m.userId
      //   WHERE
      //     c.userId = ${user.id}
      // `;

      // const mt5Accounts = await this.userRepository.query(mt5AccountsQuery);

      let data = {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        telephone: user?.tel,
        country: user?.country,
        totalLinks: partnerLinksCount,
        totalClients: partnerClientsCount,
        totalApplicants: partnerApplicantsCount,
        totalRegistered: partnerRegisteredCount,
        // totalLeads: partnerLeadsCount,
        totalDeposits: totalDeposits,
        status: partner.status,
        // mt5Accounts: mt5Accounts,
        createdAt: partner.created_at,
        updatedAt: partner.updated_at,
        commissionProfile: user?.client?.commissionProfile || null,
      };

      return data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error finding sub-IB', error);
    }
  }
  async getVolumeCommissionSummary(
    userId: number,
    date: Date | string,
    type: 'commission' | 'volume',
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user?.partnerId) {
        throw new NotFoundException('IB not found');
      }

      const partner = await this.partnerRepository.findOne({
        where: { id: user.partnerId, ib: true },
      });

      if (!partner) {
        throw new NotFoundException('IB partner not found');
      }

      const currentDate = date instanceof Date ? date : new Date(date);

      const volumeAndCommission =
        await this.ibCommissionDealsRepository.find({
          where: [{ partner: { id: partner.id } }],
          relations: { client: true, login: true, partner: true },
          select: {
            commission: true,
            volume: true,
            createdAt: true,
          },
          order: { createdAt: 'ASC' },
        });

      const monthlyData: Record<
        string,
        { commission: number; volume: number }
      > = volumeAndCommission.reduce((acc, curr) => {
        const monthKey = new Date(curr.createdAt)
          .toISOString()
          .substring(0, 7); // YYYY-MM

        if (!acc[monthKey]) {
          acc[monthKey] = { commission: 0, volume: 0 };
        }

        acc[monthKey].commission += Math.abs(curr.commission) || 0;
        acc[monthKey].volume += curr.volume / 10000 || 0;

        return acc;
      }, {});

      const months: {
        label: string;
        start: Date;
        end: Date;
      }[] = [];

      for (let i = 2; i >= 0; i--) {
        const d = new Date(currentDate);
        d.setMonth(currentDate.getMonth() - i);

        const start = new Date(d.getFullYear(), d.getMonth(), 1);
        const end =
          i === 0
            ? currentDate
            : new Date(d.getFullYear(), d.getMonth() + 1, 0);

        const label =
          i === 0
            ? 'This Month'
            : d.toLocaleString('en-US', { month: 'short' });

        months.push({ label, start, end });
      }

      const monthValues = months.map((m) => {
        const value =
          type === 'commission'
            ? Object.entries(monthlyData)
              .filter(([monthKey]) => {
                const monthDate = new Date(monthKey + '-01');
                return monthDate >= m.start && monthDate <= m.end;
              })
              .reduce((sum, [, v]) => sum + v.commission, 0)
            : Object.entries(monthlyData)
              .filter(([monthKey]) => {
                const monthDate = new Date(monthKey + '-01');
                return monthDate >= m.start && monthDate <= m.end;
              })
              .reduce((sum, [, v]) => sum + v.volume, 0);

        return Number(value.toFixed(2));
      });

      const monthlyArray = monthValues.map((value, index) => {
        const prev = index > 0 ? monthValues[index - 1] : 0;

        const percentageChange =
          prev === 0 && value > 0
            ? 100
            : prev === 0
              ? 0
              : ((value - prev) / prev) * 100;

        return {
          month: months[index].label,
          value,
          percentageChange: Number(percentageChange.toFixed(2)),
        };
      });

      return {
        monthlyData: monthlyArray,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting volume commission summary',
        error,
      );
    }
  }

  // src/ib/ib.service.ts
  async getSubIbsPerformance(
    userId: number,
    period: PerformancePeriod,
    timeZone: { userDate: Date; utcOffsetMinutes: number },
  ): Promise<SubIbPerformanceDto[]> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user?.partnerId) {
        throw new NotFoundException(
          'User is not a partner or has no partnerId',
        );
      }

      const mainPartner = await this.partnerRepository.findOne({
        where: { id: user.partnerId },
      });
      if (!mainPartner) {
        throw new NotFoundException('Partner not found');
      }

      const subIbs = await this.partnerRepository.find({
        where: { masterIbId: mainPartner.id, ib: true },
      });
      const partnerIds = subIbs.map((p) => p.id);
      if (partnerIds.length === 0) return [];

      const currentDate = new Date(timeZone.userDate);

      // Determine date range
      let startDate: Date | null = null;
      let endDate: Date | null = null;

      if (period === PerformancePeriod.TODAY) {
        // Aaj 00:00:00 se 23:59:59 tak
        startDate = new Date(currentDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (period === PerformancePeriod.WEEK) {
        // Last 7 days (aaj se 7 din pehle tak)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (period === PerformancePeriod.MONTH) {
        // Last 30 days (aaj se 30 din pehle tak)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (period === PerformancePeriod.QUARTER) {
        // Last 90 days / 3 months (aaj se 90 din pehle tak)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 90);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
      } else if (period === PerformancePeriod.YEAR) {
        // Last 365 days (aaj se 365 din pehle tak)
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - 365);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(currentDate);
        endDate.setHours(23, 59, 59, 999);
      }

      const dateConditionDeposits =
        startDate && endDate
          ? `AND md.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`
          : '';

      const dateConditionVolume =
        startDate && endDate
          ? `AND icd.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`
          : '';

      const dateConditionClients =
        startDate && endDate
          ? `AND c.createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`
          : '';

      const performanceQuery = `
      WITH ClientDeposits AS (
        SELECT 
          c.affid AS partnerId,
          COALESCE(SUM(CASE WHEN md.[Action] = 2 AND md.profit > 0 THEN md.profit ELSE 0 END), 0) AS totalDeposits,
          COALESCE(SUM(CASE WHEN md.[Action] = 2 AND md.profit < 0 THEN md.profit ELSE 0 END), 0) AS totalWithdraws
        FROM client c
        LEFT JOIN mt5_account ma ON ma.userId = c.userId
        LEFT JOIN mt5_deals md ON md.[Login] = ma.[Login]
        WHERE c.affid IN (${partnerIds.join(',')})
        ${dateConditionDeposits}
        GROUP BY c.affid
      ),
      VolumeCommission AS (
        SELECT 
          c.affid AS partnerId,
          COALESCE(SUM(icd.volume)/10000, 0) AS totalVolume,
          COALESCE(SUM(icd.commission), 0) AS totalCommission
        FROM ib_commission_deals icd
        INNER JOIN client c ON c.userId = icd.clientId AND icd.partnerId IN (${partnerIds.join(',')})
        ${dateConditionVolume}
        GROUP BY c.affid
      )
      SELECT 
        p.id,
        p.name,
        COALESCE((
          SELECT COUNT(*) 
          FROM client c 
          WHERE c.affid = p.id
          ${dateConditionClients}
        ), 0) AS totalClients,
        COALESCE(cd.totalDeposits - cd.totalWithdraws, 0) AS netDeposit,
        COALESCE(vc.totalVolume, 0) AS totalVolume,
        COALESCE(vc.totalCommission, 0) AS totalCommission
      FROM partner p
      LEFT JOIN ClientDeposits cd ON cd.partnerId = p.id
      LEFT JOIN VolumeCommission vc ON vc.partnerId = p.id
      WHERE p.id IN (${partnerIds.join(',')})
      ORDER BY vc.totalCommission DESC
    `;

      const results = await this.partnerRepository.query(performanceQuery);

      return results.map((row) => ({
        id: row.id,
        name: row.name,
        totalClients: Number(row.totalClients),
        netDeposit: Number(Number(row.netDeposit).toFixed(3)),
        totalVolume: Number(Number(row.totalVolume).toFixed(3)),
        totalCommission: Math.abs(Number(Number(row.totalCommission).toFixed(3))),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting sub-IBs performance',
        error,
      );
    }
  }

  // private getDateRangeForPeriod(
  //   period: PerformancePeriod,
  //   currentDate: Date,
  // ): { startDate: Date | null; endDate: Date | null } {
  //   const endDate = new Date(currentDate);
  //   const startDate = new Date(currentDate);

  //   switch (period) {
  //     case PerformancePeriod.CURRENT_MONTH:
  //       startDate.setDate(1);
  //       startDate.setHours(0, 0, 0, 0);
  //       endDate.setHours(23, 59, 59, 999);
  //       break;
  //     case PerformancePeriod.LAST_MONTH:
  //       startDate.setMonth(startDate.getMonth() - 1);
  //       startDate.setDate(1);
  //       startDate.setHours(0, 0, 0, 0);
  //       endDate.setDate(0); // Last day of previous month
  //       endDate.setHours(23, 59, 59, 999);
  //       break;
  //     default:
  //       return { startDate: null, endDate: null };
  //   }

  //   return { startDate, endDate };
  // }

  async getIbHierarchy(userId: number): Promise<IbHierarchyNode> {
    try {
      // Get the logged-in user's partner information
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user?.partnerId) {
        throw new NotFoundException('IB not found');
      }

      const mainPartner = await this.partnerRepository.findOne({
        where: { id: user.partnerId },
      });

      if (!mainPartner) {
        throw new NotFoundException('Partner not found');
      }
      const mt5Accounts = await this.mt5AccountRepository.findOne({
        where: { user: { id: user.id } },
      });
      // Create the root node
      const rootNode: IbHierarchyNode = {
        id: mainPartner.id,
        name: mainPartner.name,
        email: mainPartner.email,
        login: mt5Accounts?.login,
        clients: await this.getClientCountWithMt5Account(mainPartner.id),
        subIbs: 0,
        subIbsClients: 0,
        children: [],
      };

      // Recursively fetch all sub-IBs using masterIbId
      await this.buildIbHierarchyByMasterIbId(rootNode);

      this.calculateAggregatedCounts(rootNode);

      return rootNode;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting IB hierarchy',
        error,
      );
    }
  }

  private async buildIbHierarchyByMasterIbId(
    node: IbHierarchyNode,
  ): Promise<void> {
    try {
      // Find all partners whose masterIbId is the current node's id and are IBs
      const subIbs = await this.partnerRepository.find({
        where: {
          masterIbId: node.id,
        },
      });

      for (const subIb of subIbs) {
        // Find the user associated with this partner (if needed for MT5 login)
        const subIbUser = await this.userRepository.findOne({
          where: { partnerId: subIb.id },
        });

        // Get MT5 account for this sub-IB
        const mt5Account = subIbUser
          ? await this.mt5AccountRepository.findOne({
            where: { user: { id: subIbUser.id } },
          })
          : null;
        const childNode: IbHierarchyNode = {
          id: subIb.id,
          name: subIb.name,
          email: subIb.email,
          login: mt5Account?.login,
          clients: await this.getClientCountWithMt5Account(subIb.id),
          subIbs: 0,
          subIbsClients: 0,
          children: [],
        };

        node.children?.push(childNode);
        // Recursively build hierarchy for this sub-IB
        await this.buildIbHierarchyByMasterIbId(childNode);
      }
    } catch (error) {
      console.error('Error building IB hierarchy:', error);
      throw error;
    }
  }

private calculateAggregatedCounts(node: IbHierarchyNode): void {
  if (!node.children || node.children.length === 0) {
    node.subIbs = 0;
    node.subIbsClients = 0;
    return;
  }

  node.subIbs = node.children.length;

  let directChildrenClientsSum = 0;
  
  for (const child of node.children) {
    directChildrenClientsSum += child.clients; 
    
    this.calculateAggregatedCounts(child);
  }

  node.subIbsClients = directChildrenClientsSum;
}

  private async getClientCount(partnerId: number): Promise<number> {
    return this.clientRepository.count({ where: { affid: partnerId } });
  }

  // Get count of clients with MT5 accounts for a specific partner (only those with existing MT5 accounts)
  async getClientCountWithMt5Account(partnerId: number): Promise<number> {
    return this.clientRepository
      .createQueryBuilder('client')
      .leftJoin('client.user', 'user')
      .leftJoin('user.mt5Account', 'mt5Account')
      .where('client.affid = :partnerId', { partnerId })
      .andWhere('mt5Account.id IS NOT NULL')
      .getCount();
  }

  async getTopClientsByCommission(
    userId: number,
    period: 'today' | 'thisWeek' | 'thisMonth' | 'thisQuarter' | 'thisYear' | 'all',
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user?.partnerId) {
      throw new NotFoundException('IB not found');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: user.partnerId, ib: true },
    });
    if (!partner) {
      throw new NotFoundException('IB partner not found');
    }

    // 1️⃣ ROLLING DATE LOGIC
    const now = new Date();
    let startDate: Date | null = null;
    let endDate: Date | null = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    switch (period) {
      case 'today': {
        // Aaj 00:00:00 se 23:59:59 tak
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'thisWeek': {
        // Last 7 days (aaj se 7 din pehle tak)
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'thisMonth': {
        // Last 30 days (aaj se 30 din pehle tak)
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'thisQuarter': {
        // Last 90 days / 3 months (aaj se 90 din pehle tak)
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 90);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'thisYear': {
        // Last 365 days / 1 year (aaj se 365 din pehle tak)
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 365);
        startDate.setHours(0, 0, 0, 0);
        break;
      }
      case 'all':
      default:
        startDate = null;
        endDate = null;
    }

    let dateFilter = '';
    if (startDate && endDate) {
      dateFilter = `AND createdAt BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`;
    }

    // 2️⃣ FINAL QUERY
    const query = `
    SELECT TOP 5 * FROM (
      SELECT 
        c.userId,
        c.firstName,
        c.lastName,
        (
          SELECT COALESCE(SUM(md.profit), 0)
          FROM [mt5_deals] md
          INNER JOIN mt5_account ma ON md.[Login] = ma.[Login]
          WHERE ma.userId = c.userId
            AND md.[Action] = 2
            ${dateFilter.replace(/createdAt/g, 'md.createdAt')}
        ) AS totalDeposit,
        (
          SELECT COALESCE(SUM(commission_deal.Volume) / 10000, 0)
          FROM ib_commission_deals client_deal
          INNER JOIN ib_commission_deals commission_deal 
            ON commission_deal.ParentDealId = client_deal.deal
          WHERE client_deal.clientId = c.userId
            AND commission_deal.partnerId = ${partner.id}
            AND client_deal.[Action] IN (0, 1)
            AND client_deal.ParentDealId IS NULL
            AND commission_deal.[Action] IN (0, 1)
            ${dateFilter.replace(/createdAt/g, 'commission_deal.createdAt')}
        ) AS totalVolume,
        (
          SELECT COALESCE(ROUND(SUM(commission_deal.Commission), 3), 0)
          FROM ib_commission_deals client_deal
          INNER JOIN ib_commission_deals commission_deal 
            ON commission_deal.ParentDealId = client_deal.Deal
          WHERE client_deal.clientId = c.userId
            AND commission_deal.PartnerId = ${partner.id}
            AND commission_deal.Commission IS NOT NULL
            AND commission_deal.ParentDealId IS NOT NULL
            AND client_deal.ParentDealId IS NULL
            ${dateFilter.replace(/createdAt/g, 'commission_deal.createdAt')}
        ) AS totalCommission
      FROM client c
      WHERE c.affid = ${partner.id}
    ) sub
    ORDER BY sub.totalCommission DESC
  `;

    const results = await this.ibCommissionDealsRepository.query(query);

    return results.map((row) => ({
      userId: row.userId,
      name: [row.firstName, row.lastName].filter(Boolean).join(' '),
      totalVolume: Number(Number(row.totalVolume).toFixed(3)),
      totalCommission: Number(Number(row.totalCommission).toFixed(3)),
      totalDeposit: Number(Number(row.totalDeposit).toFixed(3)),
    }));
  }


  async getPartnerClientsBreakdown(
    user: User,
    options: QueryOptionsDto & { partnerId: number },
    isClientEndpoint = false
  ) {
    let { partnerId, startDate, endDate, page = 1, limit = 50 } = options;
    // Verify the partner exists and user has access to it
    const partner = await this.partnerRepository.findOne({
      where: { id: partnerId },
      relations: { mt5Account: true },
    });

    if (partnerId && isClientEndpoint) {
      const partnerUser = await this.userRepository.findOne({
        where: {
          partnerId
        }
      })
      if (!partnerUser) {
        throw new NotFoundException('Partner user not found');
      }
      await this.userRepository.isUserAccessToIB(partnerUser.id, user.id)
    }

    if (options.login && isClientEndpoint) {
      await this.userRepository.isUserAccessToLogin(options.login, user.id)
    }

    if (!partner) {
      throw new NotFoundException('Partner not found');
    }

    // Check if user has access to this partner (if needed - adjust based on your auth logic)
    // You might want to verify the user is the main IB or has permission to view this partner

    let queryParams: any[] = [];
    let paramIndex = 0;

    // Add partner ID as first parameter
    queryParams.push(partnerId);
    paramIndex++;

    // Handle date range filtering for different contexts
    let dealDateStartParam: any = null;
    let dealDateEndParam: any = null;
    let equityDateStartParam: any = null;
    let equityDateEndParam: any = null;

    if (startDate) {
      dealDateStartParam = paramIndex;
      queryParams.push(dateToUnixTimestamp(new Date(startDate)));
      paramIndex++;
    }

    if (endDate) {
      dealDateEndParam = paramIndex;
      queryParams.push(dateToUnixTimestamp(new Date(endDate)));
      paramIndex++;
    }

    if (startDate) {
      equityDateStartParam = paramIndex;
      queryParams.push(dateToUnixTimestamp(new Date(startDate)));
      paramIndex++;
    }

    if (endDate) {
      equityDateEndParam = paramIndex;
      queryParams.push(dateToUnixTimestamp(new Date(endDate)));
      paramIndex++;
    }

    // Calculate pagination offset
    const offset = (page - 1) * limit;

    // Build date filtering strings for CTEs
    const dealDateFilter =
      dealDateStartParam !== null && dealDateEndParam !== null
        ? `AND md.Time >= '${startDate}' AND md.Time <= '${endDate}'`
        : dealDateStartParam !== null
          ? `AND md.Time >= '${startDate}'`
          : dealDateEndParam !== null
            ? `AND md.Time <= '${endDate}'`
            : '';

    const commissionDateFilter =
      dealDateStartParam !== null && dealDateEndParam !== null
        ? `AND d.time >= '${startDate}' AND d.time <= '${endDate}'`
        : dealDateStartParam !== null
          ? `AND d.time >= '${startDate}'`
          : dealDateEndParam !== null
            ? `AND d.time <= '${endDate}'`
            : '';

    const equityDateFilter =
      equityDateStartParam !== null && equityDateEndParam !== null
        ? `AND mdr.DateTime >= @${equityDateStartParam} AND mdr.DateTime <= @${equityDateEndParam}`
        : equityDateStartParam !== null
          ? `AND mdr.DateTime >= @${equityDateStartParam}`
          : equityDateEndParam !== null
            ? `AND mdr.DateTime <= @${equityDateEndParam}`
            : '';

    // Get total count for pagination metadata
    const countQuery = `
      SELECT COUNT(DISTINCT ma.id) as totalCount
      FROM client c
      INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
      LEFT JOIN server s ON ma.serverId = s.id
      WHERE c.affid = @0 AND s.name = 'LIVE'
    `;

    const countResult = await this.clientRepository.query(countQuery, [
      partnerId,
    ]);
    const totalCount = countResult[0]?.totalCount || 0;

    // Main query with CTE structure for client-level data
    const mainQuery = `
    WITH ClientDepositWithdrawal AS (
      SELECT
        c.userId AS clientId,
        ma.id AS mt5AccountId,
        ROUND(SUM(CASE
          WHEN md.[Action] = 2 AND md.Profit > 0 THEN md.Profit
          ELSE 0
        END), 3) AS totalDeposits,
        ROUND(SUM(CASE
          WHEN md.[Action] = 2 AND md.Profit < 0 THEN ABS(md.Profit)
          ELSE 0
        END), 3) AS totalWithdrawals
      FROM client c
      INNER JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
      LEFT JOIN mt5_deals md ON md.[Login] = CAST(ma.[login] AS int)
      WHERE md.[Action] = 2
      ${dealDateFilter}
      GROUP BY c.userId, ma.id
    ),
    CommissionData AS (
      SELECT 
        ma.login,
        ROUND(SUM(CASE WHEN d.action = 2 AND d.comment LIKE 'ADJ%' THEN d.profit ELSE 0 END), 3) AS profitAdjustment,
        ROUND(SUM(CASE WHEN d.action IN (0, 1) THEN 1 ELSE 0 END), 3) AS numberOfTrades,
        ROUND(SUM(CASE WHEN d.storage IS NOT NULL THEN d.storage ELSE 0 END), 3) AS realizedSwaps,
        ROUND(SUM(CASE WHEN NOT d.volume = 0 THEN d.volume * mcr.lotSizeFactor ELSE 0 END), 3) AS totalLots
      FROM mt5_account ma
      LEFT JOIN ib_commission_deals d ON d.login = ma.login
      LEFT JOIN mt5_commision_rates mcr ON d.symbol = mcr.symbol
      ${commissionDateFilter}
      GROUP BY ma.login
    ),
    ClientDirectCommission AS (
      SELECT
        c.userId AS clientId,
        ma.id AS mt5AccountId,
        ROUND(SUM(CASE WHEN commission_deal.commission <> 0 THEN commission_deal.commission ELSE 0 END), 3) AS directCommission
      FROM ib_commission_deals client_deal
      INNER JOIN ib_commission_deals commission_deal ON commission_deal.ParentDealId = client_deal.deal
      INNER JOIN mt5_account ma ON client_deal.login = ma.login AND ma.deletedAt IS NULL
      INNER JOIN client c ON c.userId = ma.userId 
      LEFT JOIN server s ON ma.serverId = s.id
      WHERE c.affid = @0
        AND s.name = 'LIVE'
        AND commission_deal.partnerId = @0
        AND client_deal.ParentDealId IS NULL
      GROUP BY c.userId, ma.id
    ),
    AccountData AS (
      SELECT 
        ma.login,
        ROUND(COALESCE(mar.profit, 0), 3) AS unRealizedNetProfit,
        ROUND(COALESCE(mar.blockedProfit, 0), 3) AS netProfit,
        ROUND(COALESCE(mar.blockedProfit + mar.profit, 0), 3) AS realProfit,
        ROUND(COALESCE(mar.balance, 0), 3) AS closingBalance,
        ROUND(COALESCE(mar.Equity, 0), 3) AS closingEquity,
        ROUND(COALESCE(mar.Credit, 0), 3) AS closingCredit
      FROM mt5_account ma
      LEFT JOIN mt5_accounts_replicated mar ON ma.login = mar.login
    ),
    StartingEquityData AS (
      SELECT 
        ma.login,
        ROUND(COALESCE(first_equity.ProfitEquity, 0), 3) AS startingEquity
      FROM mt5_account ma
      OUTER APPLY (
        SELECT TOP 1 mdr.ProfitEquity
        FROM mt5_daily_2024_replicated mdr
        WHERE mdr.login = ma.login
        ${equityDateFilter}
        ORDER BY mdr.DateTime ASC
      ) first_equity
    )
    SELECT
      c.userId AS clientId,
      ma.login AS mt5Login,
      c.firstName + ' ' + c.lastName AS clientName,
      c.email AS clientEmail,
      c.createdAt AS registrationDate,
      ma.createdAt AS mt5AccountCreatedDate,
      COALESCE(cdw.totalDeposits, 0) AS totalDeposits,
      COALESCE(cdw.totalWithdrawals, 0) AS totalWithdrawals,
      ROUND(COALESCE(cdw.totalDeposits, 0) - COALESCE(cdw.totalWithdrawals, 0), 3) AS totalNetDeposit,
      ad.unRealizedNetProfit,
      ad.netProfit,
      ad.realProfit,
      ad.closingBalance,
      ad.closingEquity,
      ad.closingCredit,
      COALESCE(cd.profitAdjustment, 0) AS profitAdjustment,
      COALESCE(sed.startingEquity, 0) AS startingEquity,
      COALESCE(cdc.directCommission, 0) AS realizedCommission,
      COALESCE(cdc.directCommission, 0) AS totalSalesCommission,
      COALESCE(cd.numberOfTrades, 0) AS numberOfTrades,
      COALESCE(cd.realizedSwaps, 0) AS realizedSwaps,
      COALESCE(cd.totalLots, 0) AS totalLots,
      ROUND((ad.closingEquity - COALESCE(sed.startingEquity, 0)), 3) AS netRevenue,
      CASE 
        WHEN c.isActive = 1 AND c.deletedAt IS NULL THEN 'Active'
        ELSE 'Inactive'
      END AS clientStatus,
      CASE 
        WHEN ma.isDefault = 1 THEN 'Primary'
        ELSE 'Secondary'
      END AS accountType
    FROM client c
    INNER JOIN lead l ON c.leadId = l.id
    INNER JOIN partner p ON l.affId = p.uuid
    LEFT JOIN mt5_account ma ON ma.userId = c.userId
    LEFT JOIN ClientDepositWithdrawal cdw ON cdw.clientId = c.userId AND cdw.mt5AccountId = ma.id
    LEFT JOIN CommissionData cd ON cd.login = ma.login
    LEFT JOIN ClientDirectCommission cdc ON cdc.clientId = c.userId AND cdc.mt5AccountId = ma.id
    LEFT JOIN AccountData ad ON ad.login = ma.login
    LEFT JOIN StartingEquityData sed ON sed.login = ma.login
    LEFT JOIN server s ON ma.serverId = s.id
    WHERE p.id = @0 AND p.ib = 1 AND c.deletedAt IS NULL AND s.name = 'LIVE'
    ORDER BY c.userId, ma.isDefault DESC, ma.createdAt
    OFFSET @${paramIndex} ROWS
    FETCH NEXT @${paramIndex + 1} ROWS ONLY`;

    queryParams.push(offset, limit);

    const rawRows = await this.clientRepository.query(mainQuery, queryParams);

    // Return paginated results with metadata
    return {
      status: 0,
      statusCode: 200,
      message: 'Partner clients breakdown fetched successfully',
      result: {
        data: rawRows,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page < Math.ceil(totalCount / limit),
          hasPreviousPage: page > 1,
        },
      },
    };
  }

  async getSubIbStats(
    user: User,
    subIbId?: number,
    period: 'monthly' | 'quarterly' | 'yearly' = 'monthly'
  ) {
    // 1️⃣ Validate user is IB
    const partnerUser = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!partnerUser?.partnerId) {
      throw new NotFoundException('You are not an IB');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: partnerUser.partnerId, ib: true },
    });
    if (!partner) throw new NotFoundException('Partner not found');

    // 2️⃣ Determine target partner (IB or Sub-IB)
    let targetPartnerId = partner.id;

    if (subIbId) {
      const validatedSubIbId = this.validateNumeric(subIbId, 'subIbId');
      const subIb = await this.partnerRepository.findOne({
        where: { id: validatedSubIbId },
      });
      if (!subIb) throw new NotFoundException('Sub-IB not found');

      if (subIb.id !== partner.id && subIb.masterIbId !== partner.id) {
        throw new ForbiddenException('You do not have access to this Sub-IB');
      }

      targetPartnerId = validatedSubIbId;
    }

    // 3️⃣ Date range calculation - ROLLING PERIOD
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    let firstDay: Date;
    let days: number;

    switch (period) {
      case 'monthly': {
        days = 30;
        firstDay = new Date(now);
        firstDay.setDate(now.getDate() - days);
        firstDay.setHours(0, 0, 0, 0);
        break;
      }
      case 'quarterly': {
        days = 90;
        firstDay = new Date(now);
        firstDay.setDate(now.getDate() - days);
        firstDay.setHours(0, 0, 0, 0);
        break;
      }
      case 'yearly': {
        days = 365;
        firstDay = new Date(now);
        firstDay.setDate(now.getDate() - days);
        firstDay.setHours(0, 0, 0, 0);
        break;
      }
    }

    const firstDayStr = firstDay.toISOString();
    const lastDayStr = lastDay.toISOString();

    // 4️⃣ Final Query
    const query = `
    WITH SubIbClients AS (
      SELECT DISTINCT 
        c.userId AS clientId,
        c.userLifeCycle,
        ma.login AS mt5Login
      FROM client c
      INNER JOIN partner p ON c.affid = p.id
      LEFT JOIN mt5_account ma ON ma.userId = c.userId AND ma.deletedAt IS NULL
      WHERE p.id = ${targetPartnerId}
        AND c.createdAt >= '${firstDayStr}'
        AND c.createdAt <= '${lastDayStr}'
    ),
    Deposit AS (
      SELECT SUM(d.Profit) AS totalDeposit
      FROM mt5_deals d
      INNER JOIN SubIbClients c ON d.Login = CAST(c.mt5Login AS INT)
      WHERE d.Action = 2
        AND d.Profit > 0
        AND d.[Time] >= '${firstDayStr}'
        AND d.[Time] <= '${lastDayStr}'
    )
    SELECT 
      COUNT(DISTINCT CASE WHEN c.userLifeCycle = 'client' THEN c.clientId END) AS totalClients,
      COUNT(DISTINCT CASE WHEN c.userLifeCycle = 'applicant' THEN c.clientId END) AS totalApplicants,
      COUNT(DISTINCT CASE WHEN c.userLifeCycle = 'registered' THEN c.clientId END) AS totalRegistered,
      COALESCE((SELECT totalDeposit FROM Deposit), 0) AS totalDeposit
    FROM SubIbClients c;
  `;

    // 5️⃣ Execute
    const result = await this.userRepository.query(query);
    const stats = result[0] || {
      totalClients: 0,
      totalApplicants: 0,
      totalRegistered: 0,
      totalDeposit: 0,
    };

    // 6️⃣ Response
    return {
      status: 0,
      statusCode: 200,
      message: 'Sub-IB stats fetched successfully',
      result: {
        subIbId: targetPartnerId,
        period,
        totalClients: Number(stats.totalClients),
        totalApplicants: Number(stats.totalApplicants),
        totalRegistered: Number(stats.totalRegistered),
        totalDeposit: Number(stats.totalDeposit),
      },
    };
  }



  async getTransactionList(
    query: GetTransactionList,
    user: User,
    clientId?: number
  ) {
    // 1️⃣ Validate IB user
    const partnerUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!partnerUser?.partnerId) {
      throw new NotFoundException('You are not an IB');
    }

    const partner = await this.partnerRepository.findOne({
      where: { id: partnerUser.partnerId, ib: true },
    });

    if (!partner) {
      throw new NotFoundException('IB not found');
    }

    if (clientId) {
      const client = await this.clientRepository
        .createQueryBuilder('client')
        .innerJoin('client.lead', 'lead')
        .where('client.userId = :clientId', { clientId })
        .andWhere('lead.affId = :affId', { affId: partner.uuid })
        .andWhere('client.deletedAt IS NULL')
        .getOne();

      if (!client) {
        throw new ForbiddenException(
          'You do not have access to this client transactions',
        );
      }
    }

    return this.transactionService.findAll(query, clientId, true);
  }


  async getClientTradingAccount(clientId: number, userId: number) {
  await this.userRepository.isUserAccessToIB(clientId, userId);
  const { live } = await this.clientService.getAllAccountsByUserId(clientId);
  const mt5Accounts = await this.mt5AccountRepository.find({
    where: { user: { id: clientId } },
  });
  
  const merged = live.map((account) => {
    const match = mt5Accounts.find((a) => a.login == account.login);
    return {
      ...account,
      id: match?.id,
      tradingType: match?.tradingType,
    };
  });

  return merged;
}
}

// Helper function to calculate percentage change
function calculatePercentageChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue === 0 ? 0 : 100;
  return Number((((newValue - oldValue) / oldValue) * 100).toFixed(2));
}
