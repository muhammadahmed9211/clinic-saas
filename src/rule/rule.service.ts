import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { Repository } from 'typeorm';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { IsNull } from 'typeorm';



@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  
  ) {}

  async create(createRuleDto: CreateRuleDto) {
    const rule = this.ruleRepository.create(createRuleDto);
    return this.ruleRepository.save(rule);
  }

async findAll() {
  const rules = await this.ruleRepository.find({
    where: { deletedAt: IsNull() },
    select: ['name', 'type'],
    order: { name: 'ASC' },
  });
  return rules;
}

  async findOne(id: number) {
    return this.ruleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRuleDto: UpdateRuleDto) {
    await this.ruleRepository.update(id, updateRuleDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.ruleRepository.softDelete(id);
  }

 
}