import {
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  IsObject,
  IsIn,
} from 'class-validator';

export class CreateAutomationConfigDto {
  @IsString()
  automationCode: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(['Lead', 'Client'])
  entityType: string;

  @IsString()
  currentStatus: string;

  @IsString()
  @IsOptional()
  newStatus?: string;

  @IsString()
  @IsOptional()
  systemStatus?: string;

  @IsString()
  @IsOptional()
  nextAction?: string;

  @IsInt()
  executionFrequencyMinutes: number;

  @IsString()
  @IsOptional()
  executionTime?: string;

  @IsString()
  @IsOptional()
  executionDays?: string;

  @IsObject()
  @IsOptional()
  conditions?: object;

  @IsObject()
  @IsOptional()
  actions?: object;

  @IsInt()
  @IsOptional()
  maxExecutions?: number;

  @IsString()
  @IsOptional()
  pauseAction?: string;

  @IsString()
  @IsOptional()
  deactivateAction?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
