import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RepeatIntervalType, RepeatType, TaskEntityType } from '../entities/task.entity';
import { Transform } from 'class-transformer';

export enum TaskPriorityLevel {
  HIGH = 'high',
  NORMAL = 'normal',
  LOW = 'low',
}

export enum TaskRelatedTo {
  CLIENT = 'client',
  TRANSACTION = 'transaction',
  DEAL = 'deal',
  LEAD = 'lead',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Test Title', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @ApiProperty({ example: '2025-05-17', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  dueDate: Date;

  @ApiProperty({ example: 'high', enum: TaskPriorityLevel, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(TaskPriorityLevel, {
    message: i18nValidationMessage('validation.INVALID_PRIORITY'),
  })
  priority: TaskPriorityLevel;

  @ApiProperty({ example: '1', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  assignTo: number;

  @ApiProperty({ example: 'general', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(TaskEntityType, {
    message: i18nValidationMessage(`validation.INVALID_ENTITY`),
  })
  entity: TaskEntityType;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  entityId: number | string;
  
  @ApiProperty({ example: '2025-05-17', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  reminder: Date;

  @ApiProperty({ example: 3600000 })
  @IsOptional()
  remindBefore: number;

  // @ApiProperty({ example: 'on', required: true })
  // @IsOptional()
  // repeat: 'never' | 'after' | 'on';
  @ApiProperty({ example: 'daily', default: 'never' })
  @IsEnum(RepeatType)
  @IsOptional()
  @Transform(({ value }) => value === '' ? 'never' : value)
  repeat?: RepeatType;

  @ApiProperty({ example: 'on', default: 'never' })
  @IsEnum(RepeatIntervalType)
  @IsOptional()
  @Transform(({ value }) => value === '' ? 'never' : value)
  repeatIntervalType?: RepeatIntervalType;

  @ApiProperty({ example: '2025-05-17'})
  @ValidateIf((o) => o.repeat === 'on')
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  on: Date;

  @ApiProperty({ example: 5, required: false })
  @ValidateIf((o) => o.repeat === 'after')
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1, { message: i18nValidationMessage('validation.MIN_VALUE_ONE') })
  after: number;

  @ApiProperty({ example: 8, required: true })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsOptional()
  contact: number;

  @ApiProperty({ example: 'client', required: true })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsOptional()
  @IsEnum(TaskRelatedTo, {
    message: i18nValidationMessage(`validation.INVALID_RELATED_TO`),
  })
  relatedTo: TaskRelatedTo;

  @ApiProperty({ example: 1, required: true })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  relatedToId: number;

  @ApiProperty({ example: 'Not started', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  status: string;

  @ApiProperty({ example: 'this is a description', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;
}
