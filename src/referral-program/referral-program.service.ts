import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IntervalType,
  ReferralProgram,
  ReferralProgramStatus,
  ReferralProgramType,
  RewardType,
} from './entities/referral-program.entity';
import { Between, DataSource, In, Not, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Referrals, ReferralsStatus } from './entities/referrals.entity';
import {
  FilterItem,
  FilterOperation,
} from 'src/database/base-repository/dto/advance-search.dto';
import { UserRepository } from 'src/users/repositories/user.repository';
import { ReferralRewardService } from 'src/referral-reward/referral-reward.service';
import { ClientRepository } from 'src/users/repositories/client.repository';
import { ReferralsRepository } from './repositories/referrals.repository';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { ListNames } from 'src/list-item/dto/create-list-item.dto';
import { PaginationDto } from 'src/database/base-repository/dto/pagination.dto';
import { CreateReferralDto } from './dto/create-referral.dto';
import { ActivityFields } from 'src/admin/active-log/active-log.service';
import { entityType } from 'src/admin/active-log/active-log.type';
import { EventTypes } from 'src/common/services/event.type';
import { Label } from 'src/tasks/entities/label.entity';
import { LabelTranslation } from 'src/tasks/entities/label_translation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { ReferralRule } from './entities/referral-rule.entity';
import { RuleGroup, RuleType } from 'src/rule/entities/rule-group.entity';
import { UpdateReferralDto } from './dto/update-referral.dto';
import { ReferralProgramRepository } from './repositories/referral-program.repository';
import { FileEntity } from 'src/files/entities/file.entity';
import { FilesService } from 'src/files/files.service';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class ReferralProgramService {
  constructor(
    private readonly referralProgramRepository: ReferralProgramRepository,
    private readonly referralsRepository: ReferralsRepository,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly referralRewardService: ReferralRewardService,
    private readonly clientRepository: ClientRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly filesService: FilesService,
    @InjectRepository(Label)
    private readonly labelRepository: Repository<Label>,
    @InjectRepository(LabelTranslation)
    private readonly labelTranslationRepository: Repository<LabelTranslation>,
    @InjectRepository(Regulations)
    private readonly regulationsRepository: Repository<Regulations>,
    @InjectRepository(ReferralRule)
    private readonly referralRuleRepository: Repository<ReferralRule>,
    @InjectRepository(RuleGroup)
    private readonly ruleGroupRepository: Repository<RuleGroup>,
    private readonly dataSource: DataSource,
  ) {}

  async getReferralLink(user: User, program: ReferralProgram) {
    const baseUrl = this.configService.get('app.frontendDomain', {
      infer: true,
    });
    const userData = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });
    const link = `${baseUrl}/register-live-trading-account-F1?ref_uuid=${userData?.uuid}&ref_prog=${program?.code}`;
    return link;
  }

  async getActiveProgram() {
    const program = await this.referralProgramRepository.findOne({
      where: {
        status: ReferralProgramStatus.ACTIVE,
      },
      relations: {
        title: {
          labelTranslation: true,
        },
        description: {
          labelTranslation: true,
        },
        image: true,
      },
    });
    if (!program) {
      return null;
    }
    let imageUrl = null;
    if (program.image?.id) {
      try {
        imageUrl = await this.filesService.getSignedUrl(program.image.id);
      } catch (error) {
        imageUrl = null;
      }
    }
    return {
      ...program,
      image: imageUrl,
    };
  }

  async getActiveReferralWithLink(user: User) {
    const program = await this.getActiveProgram();
    if (!program) {
      return null;
    }
    const link = await this.getReferralLink(user, program);
    return {
      program,
      link,
    };
  }

  async getReferralsList(
    limit: number,
    page: number,
    body: ApplyListFilterSortColumnDto,
    user: User,
    clientId: number,
  ) {
    const filters: FilterItem[] = [];
    if (clientId) {
      const filter: FilterItem = {
        name: 'referrer.id',
        operation: FilterOperation.EQUALS,
        value: [clientId],
      };
      filters.push(filter);
    }

    const payload = {
      relations: [
        'referred',
        'referred.client',
        'referred.client.customKycStatus',
        'referred.client.wallet',
      ],
      limit,
      page,
      listName: ListNames.REFERRALS,
      filterList: body.filters,
      sortList: body.sort,
      sort: body.sort,
      userId: user.id,
      defaultSortKey: 'createdAt',
      listViewId: body.listViewId,
      orList: body.or,
      filters,
    };

    const data = await this.referralsRepository.advanceFilters(payload);
    const userIds = data.result.map((r)=>{ return r.referred.id});
    const lots = await this.getUsersLotSize(userIds);

    const result = data.result.map((r)=>{
      const userId = r.referred.id;
      const lotsSize = lots.find((l)=> l.userId === userId);
      if(r.referred.client){
        //@ts-expect-error type-error
        r.referred.client.lotsSize = lotsSize?.lotSize ? lotsSize?.lotSize : 0;
      }
      return r;
    });
    data.result = result;
    return data;
  }

  async getReferrals(user: User, pagination: PaginationDto) {
    const { limit = 10, page = 1 } = pagination;
    const allReferrals = await this.referralsRepository.findWithPagination(
      {
        where: {
          referrer: {
            id: user.id,
          },
        },
        relations: {
          referred: {
            client: {
              customKycStatus: true,
              wallet: true,
            },
          },
        },
      },
      { ...pagination, limit, page },
    );

    const userIds = allReferrals?.result.map((r)=>{ return r.referred.id}) || [];
    const lots = await this.getUsersLotSize(userIds);
    
    const result = allReferrals?.result?.map((referral) => {
      const { referred, reward } = referral;
      const { firstName, lastName, ...user } = referred;
      const { client } = user;
      const { wallet, userLifeCycle, ftdAmount } = client;
      const { rtdAmount } = wallet;
      const RTD = rtdAmount;
      const FTD = Number(ftdAmount);

      const userId = referral.referred.id;
      const lotsSize = lots.find((l)=> l.userId === userId);

      return {
        firstName,
        lastName,
        userLifeCycle,
        FTD,
        RTD,
        isFtd: client.FTD,
        reward: Number(reward),
        kycStatus: client.customKycStatus?.name,
        registeredAt: client.createdAt,
        lotsSize : lotsSize?.lotsSize ? lotsSize?.lotsSize : 0
      };
    });
    return {
      ...allReferrals,
      result,
    };
  }

  async getRewardInfo(user: User) {
    const info = await this.referralRewardService.getUserReferralWallet(user);

    const totalFunded = await this.referralsRepository.count({
      where:{
        referred:{
          client:{
            FTD:true
          }
        },
        referrer:{
          id:user.id
        }
      }
    });
     const tradedReferrals = await this.referralsRepository.count({
      where:{
        status:ReferralsStatus.SUCCESSFUL,
        referrer:{
          id:user.id
        }
      }
    });
    //@ts-expect-error type-error
    info.tradedReferrals = tradedReferrals;
    //@ts-expect-error type-error
    info.totalFunded = totalFunded;
    
    const programInfo = await this.getActiveReferralWithLink(user);
    if (programInfo) {
      return { info, ...programInfo};
    }
    return { info };
  }

  async getRewardInfoByClientId(user: User, userId: number) {
    const client = await this.clientRepository.getClientWithRoleFilter(
      user.id,
      { user: { id: userId } },
      { user: true },
    );
    if (!client || !client.user) {
      return;
    }
    return this.getRewardInfo(client.user);
  }

  async addReferral(userId: number, info: { code: string; uuid: string }) {
    try {
      const { code, uuid } = info;
      const program = await this.referralProgramRepository.findOne({
        where: {
          status: ReferralProgramStatus.ACTIVE,
          code,
        },
      });

      if (!program) {
        console.error(`Program not found with code ${code}`);
        return;
      }

      const referrer = await this.userRepository.findOne({
        where: {
          uuid,
        },
      });

      if (!referrer) {
        console.error(`Referrer not found with uuid ${uuid}`);
        return;
      }

      const referral = await this.referralsRepository.save(
        this.referralsRepository.create({
          referralCode: code,
          referralUuid: uuid,
          referralProgram: program,
          referrer,
          referred: {
            id: userId,
          },
        }),
      );
      await this.referralRewardService.incrementRegisteredInUserReferral(
        referrer,
      );
      return referral;
    } catch (error) {
      console.error(error, 'ERROR While adding referral');
    }
  }

 getIntervalDuration(intervalType: IntervalType): number {
  switch (intervalType) {
    case IntervalType.DAY:
      return 24 * 60 * 60 * 1000;
    case IntervalType.MONTH:
      const now = new Date();
      const currentMonth = now.getMonth();
      const nextMonth = new Date(now.getFullYear(), currentMonth + 1, 1);
      const daysInMonth = (nextMonth.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
      return daysInMonth * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

async getUserLotSize(userId: number, startTime: Date, intervalType: IntervalType, intervalValue: number) {
  const adjustedStartTime = new Date(startTime.getTime() - (3 * 60 * 60 * 1000)); // Subtract 3 hours in milliseconds
  const adjustedEndTime = new Date(adjustedStartTime.getTime() + (intervalValue * this.getIntervalDuration(intervalType))); // Adjust the end time for the interval

  const query = `
    SELECT 
    SUM((md.volume/md.ContractSize)/(10000/md.ContractSize)) AS lotSize
    FROM mt5_deals md
    LEFT JOIN mt5_account ma ON ma.login = md.login
    LEFT JOIN mt5_commision_rates mcr ON md.Symbol = mcr.symbol
    LEFT JOIN server s ON ma.serverId = s.id
    LEFT JOIN client c ON c.userId = ma.userId
    WHERE s.name = 'Live'
    AND md.[Action] IN (0, 1) AND md.Entry = 1
    AND ma.userId = @0
    AND c.createdAt >= @1
    AND c.createdAt <= @2
    AND md.createdAt >= @1
    AND md.createdAt <= @2
    GROUP BY ma.userId
  `;

  const params = [
    userId,
    adjustedStartTime,
    adjustedEndTime,
  ];

  const result = await this.dataSource.query(query, params);
  return result[0]?.lotSize ? Number(Number(result[0].lotSize).toFixed(2)) : 0;
}

async getUsersLotSize(userIds: number[]) {
  if (!userIds.length) {
    return [];
  }

  const placeholders = userIds.join(",");

  const query = `SELECT
    SUM((md.volume/md.ContractSize)/(10000/md.ContractSize)) AS lotSize,
    ma.userId as userId
    FROM mt5_deals md
    LEFT JOIN mt5_account ma ON ma.login = md.login
    LEFT JOIN mt5_commision_rates mcr ON md.Symbol = mcr.symbol
    LEFT JOIN server s ON ma.serverId = s.id
    LEFT JOIN client c ON c.userId = ma.userId
    WHERE s.name = 'Live'
    AND md.Action IN (0, 1) AND md.Entry=1
    AND ma.userId IN (${placeholders})
    GROUP BY ma.userId`;

  const result = await this.dataSource.query(query);
  const lots = result ? result.map((r)=>{
    const lotSize = Number(Number(r.lotSize || 0).toFixed(2));
    return {
      ...r,
      lotSize
    }
  }) : []
  return lots;
}


  async run(token:string) {
    const execution_token = this.configService.get('referral.execution_token', {
      infer: true,
    });
    if(token !== execution_token){
      return;
    }
    const lotSizeRequired = this.configService.get('referral.lot_size', {
      infer: true,
    });
    if(!lotSizeRequired || isNaN(lotSizeRequired) || 0 > lotSizeRequired){
      return;
    }

    const query = `SELECT r.id
    FROM referrals r
    LEFT JOIN referral_program rp ON rp.id = r.referralProgramId
    WHERE r.status = 'REGISTERED'
    AND ((rp.intervalType = 'DAY' AND DATEADD(DAY, rp.intervalValue, r.createdAt) > GETDATE()) OR (rp.intervalType = 'MONTH' AND DATEADD(MONTH, rp.intervalValue, r.createdAt) > GETDATE()) OR (rp.intervalType = 'YEAR' AND DATEADD(YEAR, rp.intervalValue, r.createdAt) > GETDATE()) OR (rp.intervalType NOT IN ('DAY','MONTH','YEAR') AND r.createdAt > GETDATE()))
    AND r.deletedAt IS NULL
    AND rp.deletedAt IS NULL;`
    
    const data = await this.referralsRepository.query(query);
    const ids = data.map((d)=>d.id);
    
    const referrals = await this.referralsRepository.find({
      where: {
        status: ReferralsStatus.REGISTERED,
        id:In(ids)
      },
      relations: {
        referred: {
          client: {
            customKycStatus: true,
          },
        },
        referrer: true,
        referralProgram: {
          referralRule: {
            ruleGroup: {
              criteria: {
                rule: true,
              },
            },
          },
        },
      },
    });

    for (let index = 0; index < referrals.length; index++) {
      const referral = referrals[index];
      const program = referral.referralProgram;
      const rules = referral.referralProgram.referralRule.map((r) => {
        return r.ruleGroup.criteria;
      });
      for (const rule of rules) {
        const filters = rule.map((r) => {
          const filter: FilterItem = {
            operation: r.operator as FilterOperation,
            value: JSON.parse(r.values) || [],
            name: r.rule.field,
          };
          return filter;
        });
        const userFilter = {
          operation: FilterOperation.EQUALS,
          value: [referral.referred.id],
          name: 'id',
        };
        filters.push(userFilter);
        const resp = await this.userRepository.advanceSearch({
          filters,
          all: true,
          limit: 10,
          page: 1,
          select: undefined,
        });
        if (resp?.result && Array.isArray(resp.result) && resp.result.length) {
          const data = resp.result[0].id;
          if (data === referral.referred.id && program.startDateTime && program.endDateTime) {
            const lotSize = await this.getUserLotSize(referral.referred.id , referral.createdAt, program.intervalType as IntervalType, program.intervalValue);
            if(lotSize < lotSizeRequired){
              continue;
            };  
            const { reward } =
              await this.referralRewardService.credit(referral);
            if (reward) {
              await this.referralsRepository.update(referral.id, {
                status: ReferralsStatus.SUCCESSFUL,
                reward,
              });
            }
          }
        }
      }
    }
    return referrals;
  }

    async createReferralProgram(body: CreateReferralDto, userId: number): Promise<any> {
    const {challengePeriod,...dto} = body;
    return await this.referralProgramRepository.manager.transaction(async (transactionalEntityManager) => {
      try {
        const titleKey = `REFERRAL_PROGRAM_TITLE_${dto.code}`;
        const descKey = `REFERRAL_PROGRAM_DESC_${dto.code}`;

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

        const [titleEn, titleAr, descriptionEn, descriptionAr] = await Promise.all([
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
            }),
          ),
        ]);

        let regulationEntity: Regulations | null = null;
        if (dto.regulation) {
          regulationEntity = await transactionalEntityManager.findOneBy(Regulations, { name: dto.regulation });
          if (!regulationEntity) {
            throw new BadRequestException(`Invalid regulation: ${dto.regulation}`);
          }
        }

        let imageEntity: FileEntity | null = null;
        if (dto.image) {
          const fileExists = await transactionalEntityManager.findOne(FileEntity, {
            where: { id: dto.image }
          });
          if (!fileExists) {
            throw new BadRequestException('File with given id does not exist');
          }
          imageEntity = new FileEntity();
          imageEntity.id = dto.image;
        }

        const rewardTypeMap: Record<string, number> = { amount: 1, percentage: 2 };

        const referralProgram = transactionalEntityManager.create(ReferralProgram, {
          ...dto,
          intervalType : IntervalType.DAY,
          reward: dto.rewardAmount,
          rewardType: rewardTypeMap[dto.rewardType?.toLowerCase()],
          regulation: regulationEntity,
          image: dto.image ? { id: dto.image } as FileEntity : null,
          titleId: savedTitleLabel.id,
          descriptionId: savedDescLabel.id,
          titleEn,
          titleAr,
          descriptionEn,
          descriptionAr,
          intervalValue : challengePeriod || 0,
        });

        const savedProgram = await transactionalEntityManager.save(ReferralProgram, referralProgram);

        const ruleGroup = transactionalEntityManager.create(RuleGroup, {
          name: dto.code,
          type: RuleType.Referral
        });
        const savedRuleGroup = await transactionalEntityManager.save(RuleGroup, ruleGroup);

        const referralRule = transactionalEntityManager.create(ReferralRule, {
          referralProgram: savedProgram,
          ruleGroup: savedRuleGroup,
        });
        await transactionalEntityManager.save(ReferralRule, referralRule);

        setImmediate(() => {
          this.eventEmitter.emit(EventTypes.USER_LOG, {
            newData: savedProgram,
            oldData: null,
            entityId: savedProgram.id,
            entityType: entityType.REFERRAL_PROGRAM,
            performerId: userId,
            performerType: 'Operator',
            field: ActivityFields.RECORD_CREATED
          });

          this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
            action: 'RecordCreated',
            entity_id: savedProgram.id,
            entity_type: entityType.REFERRAL_PROGRAM,
            json_object: savedProgram,
            performer_id: userId,
            performer_type: 'Operator',
            is_from_archive: 0,
            trigger_type: 'Default'
          });
        });

        return {
          ...savedProgram,
          regulation: savedProgram.regulation ? savedProgram.regulation.name : null,
          titleEn: titleEn.text,
          titleAr: titleAr.text,
          descriptionEn: descriptionEn.text,
          descriptionAr: descriptionAr.text,
          ruleGroupId: savedRuleGroup.id
        };
      } catch (error) {
        if (error.message && error.message.includes('Violation of UNIQUE KEY constraint')) {
          throw new ConflictException(
            `A referral program with code "${dto.code}" and type "${dto.type || 'Single Tier'}" already exists`
          );
        }
        if (error.name === 'QueryFailedError') {
          throw new BadRequestException('Invalid data provided');
        }
        if (error instanceof ConflictException || error instanceof BadRequestException) {
          throw error;
        }
        throw new InternalServerErrorException('An unexpected error occurred');
      }
    });
  }
 
  async updateReferralProgram(id: number, body: UpdateReferralDto, userId: number): Promise<any> {
      const {challengePeriod=null, ...dto}  = body;
  return await this.referralProgramRepository.manager.transaction(async (transactionalEntityManager) => {
    try {
      const program = await transactionalEntityManager.findOne(ReferralProgram, {
        where: { id },
        relations: ['title', 'description', 'regulation']
      });

      if (!program)
        throw new NotFoundException(`Referral program with ID ${id} not found.`);

      const oldData = JSON.parse(JSON.stringify(program));
      if (oldData.startDateTime) oldData.startDateTime = new Date(oldData.startDateTime);
      if (oldData.endDateTime) oldData.endDateTime = new Date(oldData.endDateTime);

      const [oldTitleEn, oldTitleAr, oldDescriptionEn, oldDescriptionAr] = await Promise.all([
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.title.id }, langCode: 'en' } }),
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.title.id }, langCode: 'ar' } }),
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.description.id }, langCode: 'en' } }),
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.description.id }, langCode: 'ar' } }),
      ]);

      // Handle translation fields
      const translationFields: { key: 'titleEn' | 'titleAr' | 'descriptionEn' | 'descriptionAr'; entityId: number; langCode: 'en' | 'ar' }[] = [
        { key: 'titleEn', entityId: program.title.id, langCode: 'en' },
        { key: 'titleAr', entityId: program.title.id, langCode: 'ar' },
        { key: 'descriptionEn', entityId: program.description.id, langCode: 'en' },
        { key: 'descriptionAr', entityId: program.description.id, langCode: 'ar' }
      ];

      for (const { key, entityId, langCode } of translationFields) {
        const newValue = (dto as any)[key];
        if (newValue !== undefined)
          await transactionalEntityManager.update(LabelTranslation, { label: { id: entityId }, langCode }, { text: newValue });
      }

      const { titleEn: dtoTitleEn, titleAr: dtoTitleAr, descriptionEn: dtoDescriptionEn, descriptionAr: dtoDescriptionAr, rewardType, image, regulation, startDateTime, endDateTime, ...cleanDto } = dto;

      Object.assign(program, cleanDto);

      if (dto.rewardType) {
        const rewardTypeMap: Record<string, number> = { amount: 1, percentage: 2 };
        const key = dto.rewardType.toLowerCase();
        if (key in rewardTypeMap) program.rewardType = rewardTypeMap[key];
      }

      if (dto.image) {
        const imageEntity = await transactionalEntityManager.findOne(FileEntity, { where: { id: dto.image } });
        if (!imageEntity) throw new BadRequestException('File with given id does not exist');
        program.image = imageEntity;
      }

      if (dto.startDateTime !== undefined) program.startDateTime = new Date(dto.startDateTime);
      if (dto.endDateTime !== undefined) program.endDateTime = new Date(dto.endDateTime);

      if (dto.regulation) {
        const reg = await transactionalEntityManager.findOneBy(Regulations, { name: dto.regulation });
        if (reg) program.regulation = reg;
      }

      if(challengePeriod){
        program.intervalType = IntervalType.DAY;
        program.intervalValue = challengePeriod;
      }

      await transactionalEntityManager.save(ReferralProgram, program);

      const [titleEn, titleAr, descriptionEn, descriptionAr] = await Promise.all([
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.title.id }, langCode: 'en' } }),
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.title.id }, langCode: 'ar' } }),
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.description.id }, langCode: 'en' } }),
        transactionalEntityManager.findOne(LabelTranslation, { where: { label: { id: program.description.id }, langCode: 'ar' } }),
      ]);

      const { intervalValue: newIntervalValue, intervalType: newIntervalType, ...programData } = program;
      const newData = {
        ...programData,
        challengePeriod: newIntervalValue, 
        regulation: program.regulation?.name,
        startDateTime: program.startDateTime ? program.startDateTime.toISOString() : null,
        endDateTime: program.endDateTime ? program.endDateTime.toISOString() : null,
        titleEn: titleEn?.text,
        titleAr: titleAr?.text,
        descriptionEn: descriptionEn?.text,
        descriptionAr: descriptionAr?.text
      };

      const { intervalValue: oldIntervalValue, intervalType: oldIntervalType, ...oldProgramData } = oldData;
      const oldDataForLog = {
        ...oldProgramData,
        challengePeriod: oldIntervalValue,
        regulation: oldData.regulation?.name,
        startDateTime: oldData.startDateTime ? oldData.startDateTime.toISOString() : null,
        endDateTime: oldData.endDateTime ? oldData.endDateTime.toISOString() : null,
        titleEn: oldTitleEn?.text,
        titleAr: oldTitleAr?.text,
        descriptionEn: oldDescriptionEn?.text,
        descriptionAr: descriptionAr?.text
      };

      this.eventEmitter.emit(EventTypes.USER_LOG, {
        newData,
        oldData: oldDataForLog,
        entityId: program.id,
        entityType: entityType.REFERRAL_PROGRAM,
        performerId: userId,
        performerType: 'Operator',
        field: ActivityFields.DETAILS_UPDATED
      });

      this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
        action: 'RecordUpdated',
        entity_id: program.id,
        entity_type: entityType.REFERRAL_PROGRAM,
        json_object: newData,
        performer_id: userId,
        performer_type: 'Operator',
        is_from_archive: 0,
        trigger_type: 'Default'
      });

      return {
        ...program,
        regulation: program.regulation?.name ?? null,
        titleEn: titleEn?.text,
        titleAr: titleAr?.text,
        descriptionEn: descriptionEn?.text,
        descriptionAr: descriptionAr?.text
      };

    } catch (error) {
      if (
        error instanceof ConflictException || error instanceof BadRequestException || error instanceof NotFoundException
      ) {
        throw error;
      }
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid data provided for referral program update');
      }
      if (error.message?.includes('UQ_referral_program_code_type') || error.message?.includes('Violation of UNIQUE KEY constraint')) {
        throw new ConflictException(`A referral program with code "${dto.code}" and type "${dto.type}" already exists`);
      }
      throw new InternalServerErrorException('An unexpected error occurred while updating the referral program');
    }
  });
}

  async deleteReferralProgram(
    id: number,
    userId: number,
  ): Promise<{ message: string }> {
    const program = await this.referralProgramRepository.findOne({
      where: { id },
      relations: ['title', 'description'],
    });

    if (!program) {
      throw new NotFoundException(`Referral program with ID ${id} not found`);
    }
    await this.referralProgramRepository.softDelete(id);

    this.eventEmitter.emit(EventTypes.USER_LOG, {
      oldData: program,
      newData: null,
      entityId: program.id,
      entityType: entityType.REFERRAL_PROGRAM,
      performerId: userId,
      performerType: 'Operator',
      field: ActivityFields.RECORD_DELETED,
    });

    this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
      action: 'RecordDeleted',
      entity_id: program.id,
      entity_type: entityType.REFERRAL_PROGRAM,
      json_object: program,
      performer_id: userId,
      performer_type: 'Operator',
      is_from_archive: 0,
      trigger_type: 'Default',
    });

    return { message: `Referral program with ID ${id} deleted successfully` };
  }

  async getReferralProgramById(id: number) {
  const referral = await this.referralProgramRepository.findOne({
    where: { id },
    relations: ['title', 'description', 'regulation', 'image'],
  });

  if (!referral) {
    throw new NotFoundException(`Referral Program with ID ${id} not found`);
  }

  const referralRule = await this.referralRuleRepository.findOne({
    where: { referralProgram: { id } },
    relations: ['ruleGroup'],
  });

  const titleId = referral.title?.id;
  const descriptionId = referral.description?.id;
  const labelIds = [titleId, descriptionId].filter(Boolean);
  const translations = await this.labelTranslationRepository.find({
    where: { label: { id: In(labelIds) } },
    relations: ['label'],
  });

  const translationMap = new Map<number, { en?: string; ar?: string }>();
  for (const tr of translations) {
    const labelId = tr.label.id;
    if (!translationMap.has(labelId)) translationMap.set(labelId, {});
    if (tr.langCode === 'en') translationMap.get(labelId)!.en = tr.text;
    if (tr.langCode === 'ar') translationMap.get(labelId)!.ar = tr.text;
  }

    let imageUrl = null;
    if (referral.image?.id) {
      try {
        imageUrl = await this.filesService.getSignedUrl(referral.image.id);
      } catch (error) {
        imageUrl = null;
      }
    }

    return {
      ...referral,
      regulation: referral.regulation?.name || null,
      image: referral.image ? {
        ...referral.image,
        url: imageUrl
      } : null,
      titleEn: translationMap.get(titleId)?.en ?? null,
      titleAr: translationMap.get(titleId)?.ar ?? null,
      descriptionEn: translationMap.get(descriptionId)?.en ?? null,
      descriptionAr: translationMap.get(descriptionId)?.ar ?? null,
      ruleGroupId: referralRule?.ruleGroup?.id || null,
      challengePeriod: referral.intervalValue
    };
  }

  async getFilteredReferralList({
    userId,
    paginationOptions,
    dto,
  }: {
    userId: number;
    paginationOptions: { page: number; limit: number };
    dto: ApplyListFilterSortColumnDto;
  }) {
    const referralPrograms = await this.referralProgramRepository.advanceFilters({
      userId,
      page: paginationOptions.page,
      limit: paginationOptions.limit,
      listName: ListNames.REFERRAL_PROGRAM,
      filterList: dto?.filters || undefined,
      sortList: dto?.sort || undefined,
      defaultSortKey: 'createdAt',
      listViewId: dto?.listViewId,
      relations: [
        'regulation',
        'title',
        'description',
        'titleEn',
        'titleAr',
        'descriptionEn',
        'descriptionAr',
        'image',
      ],
    });

    if (referralPrograms.result && Array.isArray(referralPrograms.result)) {
      referralPrograms.result = await Promise.all(
        referralPrograms.result.map(async (program) => {
          let imageUrl = null;
          if (program.image?.id) {
            try {
              imageUrl = await this.filesService.getSignedUrl(program.image.id);
            } catch (error) {
              imageUrl = null;
            }
          }

          return {
            ...program,
            image: imageUrl,
            challengePeriod: program.intervalValue,
          };
        })
      );
    }

    return referralPrograms;
  }

}
