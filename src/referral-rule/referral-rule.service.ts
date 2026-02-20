import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { ReferralRule } from 'src/referral-program/entities/referral-rule.entity';
import { RuleCriteria } from 'src/rule/entities/rule-criteria.entity';
import { RuleGroup } from 'src/rule/entities/rule-group.entity';
import { Rule } from 'src/rule/entities/rule.entity';
import { Repository } from 'typeorm';
import { UpdateRuleCriteriaDto } from './dto/update-rule-criteria.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { entityType } from 'src/admin/active-log/active-log.type';
import { EventTypes } from 'src/common/services/event.type';
import { ActivityFields } from 'src/admin/active-log/active-log.service';

@Injectable()
export class ReferralRuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
    @InjectRepository(ReferralRule)
    private readonly referralRuleRepository: Repository<ReferralRule>,
    @InjectRepository(RuleGroup)
    private readonly ruleGroupRepository: Repository<RuleGroup>,
    @InjectRepository(RuleCriteria)
    private readonly ruleCriteriaRepository: Repository<RuleCriteria>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  
async createRuleCriteria(
  referralProgramId: number,
  ruleName: string,
  userId: number,
  value?: any,
  operator: FilterOperation = FilterOperation.EQUALS,
): Promise<any> {
  return await this.ruleCriteriaRepository.manager.transaction(async (transactionalEntityManager) => {
    try {
      const referralRule = await transactionalEntityManager.findOne(ReferralRule, {
        where: { referralProgram: { id: referralProgramId } },
        relations: ['ruleGroup', 'referralProgram'],
      });

      if (!referralRule || !referralRule.ruleGroup) {
        throw new NotFoundException('Rule group not found for referral program');
      }
      const rule = await transactionalEntityManager.findOneBy(Rule, { name: ruleName });
      if (!rule) {
        throw new NotFoundException(`Rule not found: ${ruleName}`);
      }
      const existingCriteria = await transactionalEntityManager.findOne(RuleCriteria, {
        where: {
          rule: { id: rule.id },
          group: { id: referralRule.ruleGroup.id },
          operator
        }
      });
      if (existingCriteria) {
        throw new ConflictException(`Rule criteria already exists for rule "${ruleName}" with operator "${operator}"`);
      }
      const normalizedValues = Array.isArray(value) ? value : [value];
      const criteria = transactionalEntityManager.create(RuleCriteria, {
        rule,
        group: referralRule.ruleGroup,
        operator,
        values: JSON.stringify(normalizedValues),
      });
      const savedCriteria = await transactionalEntityManager.save(RuleCriteria, criteria);
      setImmediate(() => {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: savedCriteria,
          oldData: null,
          entityId: referralProgramId,
          entityType: entityType.REFERRAL_PROGRAM,
          performerId: userId,
          performerType: 'Operator',
          field: ActivityFields.RECORD_CREATED
        });

        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordCreated',
          entity_id: referralProgramId,
          entity_type: entityType.REFERRAL_PROGRAM,
          json_object: savedCriteria,
          performer_id: userId,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default'
        });
      });
      return {
        id: savedCriteria.id,
        ruleId: savedCriteria.rule.id,
        ruleName: savedCriteria.rule.name,
        groupId: savedCriteria.group.id,
        operator: savedCriteria.operator,
        values: JSON.parse(savedCriteria.values),
        referralProgramId: referralProgramId,
        createdAt: savedCriteria.createdAt,
        updatedAt: savedCriteria.updatedAt,
        deletedAt: savedCriteria.deletedAt
      };

    } catch (error) {
      if (error.message && error.message.includes('UQ_rule_criteria')) {
        throw new ConflictException(`Rule criteria with these details already exists`);
      }
      if (error.message && error.message.includes('Violation of UNIQUE KEY constraint')) {
        throw new ConflictException('Rule criteria with these details already exists');
      }
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid data provided for rule criteria creation');
      }
      if (error instanceof ConflictException || 
          error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the rule criteria');
    }
  });
}

async findAll(): Promise<any[]> {
  const rules = await this.referralRuleRepository.find({
    relations: [
      'referralProgram',
      'ruleGroup',
      'ruleGroup.criteria',
      'ruleGroup.criteria.rule',
    ],
    order: { id: 'DESC' },
  });

  // Create a new result with parsed values
  return rules.map(rule => ({
    ...rule,
    ruleGroup: rule.ruleGroup
      ? {
          ...rule.ruleGroup,
          criteria: rule.ruleGroup.criteria?.map(c => ({
            ...c,
            values: (() => {
              try {
                const parsed = JSON.parse(c.values || '[]');
                return Array.isArray(parsed) && parsed.length === 1
                  ? parsed[0]
                  : parsed;
              } catch {
                return [];
              }
            })(),
          })),
        }
      : null,
  }));
}

async findOne(id: number): Promise<any> {
  const referralRule = await this.ruleCriteriaRepository.findOne({
    where: { id },
    relations: ['rule'],
  });
  if (!referralRule) {
    throw new NotFoundException(`ReferralRule criteria with ID ${id} not found`);
  }
  let parsedValues: any;
  try {
    parsedValues = JSON.parse(referralRule.values || '[]');
  } catch {
    parsedValues = [];
  }
  referralRule.values =
    Array.isArray(parsedValues) && parsedValues.length === 1
      ? parsedValues[0]
      : parsedValues;

  return referralRule;
}

async updateRuleCriteria(
  id: number, 
  dto: UpdateRuleCriteriaDto, 
  userId: number
): Promise<any> {
  return await this.ruleCriteriaRepository.manager.transaction(async (transactionalEntityManager) => {
    try {
      const criteria = await transactionalEntityManager.findOne(RuleCriteria, {
        where: { id },
        relations: ['rule', 'group'],
      });
      if (!criteria) {
        throw new NotFoundException(`Rule criteria not found with id: ${id}`);
      }

      const referralRule = await transactionalEntityManager.findOne(ReferralRule, {
        where: { ruleGroup: { id: criteria.group.id } },
        relations: ['referralProgram'],
      });

      if (!referralRule) {
        throw new NotFoundException('Referral program not found for this rule criteria');
      }

      const oldData = { ...criteria };
      if (dto.ruleName) {
        const rule = await transactionalEntityManager.findOneBy(Rule, { name: dto.ruleName });
        if (!rule) {
          throw new NotFoundException(`Rule not found: ${dto.ruleName}`);
        }
        criteria.rule = rule;
      }
      if (dto.values !== undefined) {
        const normalizedValues = Array.isArray(dto.values) ? dto.values : [dto.values];
        criteria.values = JSON.stringify(normalizedValues);
      }
      if (dto.operator !== undefined) {
        criteria.operator = dto.operator;
      }
      const updatedCriteria = await transactionalEntityManager.save(RuleCriteria, criteria);
      setImmediate(() => {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: updatedCriteria,
          oldData: oldData,
          entityId: referralRule.referralProgram.id,
          entityType: entityType.REFERRAL_PROGRAM,
          performerId: userId,
          performerType: 'Operator',
          field: ActivityFields.DETAILS_UPDATED
        });
        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordUpdated',
          entity_id: referralRule.referralProgram.id,
          entity_type: entityType.REFERRAL_PROGRAM,
          json_object: updatedCriteria,
          performer_id: userId,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default'
        });
      });
      return {
        id: updatedCriteria.id,
        ruleId: updatedCriteria.rule.id,
        ruleName: updatedCriteria.rule.name,
        groupId: updatedCriteria.group.id,
        operator: updatedCriteria.operator,
        values: JSON.parse(updatedCriteria.values),
        createdAt: updatedCriteria.createdAt,
        updatedAt: updatedCriteria.updatedAt,
        deletedAt: updatedCriteria.deletedAt
      };
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid data provided for rule criteria update');
      }
      if (error instanceof BadRequestException || 
          error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while updating the rule criteria');
    }
  });
}

  async deleteRuleCriteria(id: number, userId: number): Promise<any> {
  return await this.ruleCriteriaRepository.manager.transaction(async (transactionalEntityManager) => {
    try {
      const existing = await transactionalEntityManager.findOne(RuleCriteria, {
        where: { id },
        relations: ['rule', 'group']
      });

      if (!existing) throw new NotFoundException('Rule criteria not found');

      const referralRule = await transactionalEntityManager.findOne(ReferralRule, {
        where: { ruleGroup: { id: existing.group.id } },
        relations: ['referralProgram'],
      });

      if (!referralRule) throw new NotFoundException('Referral program not found for this rule criteria');

      // Flatten oldData: replace nested objects with IDs
      const oldData = {
        ...existing,
        rule: existing.rule?.id ?? null,
        group: existing.group?.id ?? null,
        createdAt: existing.createdAt?.toISOString() ?? null,
        updatedAt: existing.updatedAt?.toISOString() ?? null,
        deletedAt: existing.deletedAt?.toISOString() ?? null
      };

      await transactionalEntityManager.softDelete(RuleCriteria, id);

      setImmediate(() => {
        this.eventEmitter.emit(EventTypes.USER_LOG, {
          newData: null,
          oldData,
          entityId: referralRule.referralProgram.id,
          entityType: entityType.REFERRAL_PROGRAM,
          performerId: userId,
          performerType: 'Operator',
          field: ActivityFields.RECORD_DELETED
        });

        this.eventEmitter.emit(EventTypes.ACTIVE_LOG, {
          action: 'RecordDeleted',
          entity_id: referralRule.referralProgram.id,
          entity_type: entityType.REFERRAL_PROGRAM,
          json_object: oldData,
          performer_id: userId,
          performer_type: 'Operator',
          is_from_archive: 0,
          trigger_type: 'Default'
        });
      });

      return {
        id,
        message: 'Rule criteria deleted successfully'
      };

    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException('Invalid data provided for rule criteria deletion');
      }
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('An unexpected error occurred while deleting the rule criteria');
    }
  });
}



 async getCriteriaByReferralProgramId(referralProgramId: number): Promise<any[]> {
  const referralRule = await this.referralRuleRepository.findOne({
    where: { referralProgram: { id: referralProgramId } },
    relations: ['ruleGroup'],
  });

  if (!referralRule || !referralRule.ruleGroup) {
    throw new NotFoundException('Rule group not found for referral program');
  }

  const criteriaList = await this.ruleCriteriaRepository.find({
    where: { group: { id: referralRule.ruleGroup.id } },
    relations: ['rule', 'group'],
  });

  // Parse values for API response
  return criteriaList.map(criteria => ({
    ...criteria,
    values: (() => {
      try {
        const parsed = JSON.parse(criteria.values || '[]');
        return Array.isArray(parsed) && parsed.length === 1
          ? parsed[0]
          : parsed;
      } catch {
        return [];
      }
    })(),
  }));
}


}