import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { RuleGroup } from './entities/rule-group.entity';
import { RuleCriteria } from './entities/rule-criteria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rule,
      RuleGroup,
      RuleCriteria
    ]),
  ],
  controllers: [RuleController],
  providers: [RuleService],
})
export class RuleModule { }
