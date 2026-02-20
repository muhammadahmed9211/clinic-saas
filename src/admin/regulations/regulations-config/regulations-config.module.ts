import { Global, Module } from '@nestjs/common';
import { RegulationsConfigController } from './regulations-config.controller';
import { RegulationsConfigService } from './regulations-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/users/entities/client.entity';
import { RegulationEvent } from './entities/regulation-event.entity';
import { RegulationRule } from './entities/regulation-rule.entity';
import { RegulationEventRuleMapping } from './entities/regulation-event-rule-mapping.entity';
import { RegulationEventRepository } from '../repositories/regulationEvent.repository';
import { RegulationRuleRepository } from '../repositories/regulationRule.repository';
import { RegulationsEventRuleMappingRepository } from '../repositories/regulationEventRuleMapping.repository';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegulationEvent,
      RegulationRule,
      RegulationEventRuleMapping,
      Client,
    ]),
  ],
  controllers: [RegulationsConfigController],
  providers: [RegulationsConfigService, RegulationEventRepository, RegulationRuleRepository, RegulationsEventRuleMappingRepository],
  exports: [RegulationsConfigService],
})
export class RegulationsConfigModule {}
