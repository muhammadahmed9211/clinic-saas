import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationConfig } from './entities/automation-config.entity';
import { AutomationExecutionLog } from './entities/automation-execution-logs.entity';
import { AutomationConfigService } from './automation-config.service';
import { AutomationConfigController } from './automation-config.controller';
import { AutomationConfigRepository } from './repositories/automation-config.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutomationConfig, AutomationExecutionLog]),
  ],
  providers: [AutomationConfigService, AutomationConfigRepository],
  controllers: [AutomationConfigController],
  exports: [AutomationConfigService],
})
export class AutomationModule {}
