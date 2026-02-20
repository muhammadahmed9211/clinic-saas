import { Module } from '@nestjs/common';
import { ReferralRuleController } from './referral-rule.controller';
import { ReferralRuleService } from './referral-rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from 'src/rule/entities/rule.entity';
import { RuleGroup } from 'src/rule/entities/rule-group.entity';
import { RuleCriteria } from 'src/rule/entities/rule-criteria.entity';
import { ReferralRule } from 'src/referral-program/entities/referral-rule.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        Rule,
        RuleGroup,
        RuleCriteria,
        ReferralRule
      ]),
    ],
  controllers: [ReferralRuleController],
  providers: [ReferralRuleService]
})
export class ReferralRuleModule {}
