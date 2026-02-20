import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomationConfigDto } from './create-automation-config.dto';

export class UpdateAutomationConfigDto extends PartialType(
  CreateAutomationConfigDto,
) {}

import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryLogsDto {
  @IsString()
  @IsOptional()
  entityType?: string;

  @IsNumberString()
  @IsOptional()
  entityId?: string;

  @IsString()
  @IsOptional()
  automationCode?: string;
}
