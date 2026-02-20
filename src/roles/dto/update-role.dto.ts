import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Dashboards } from '../entities/role.entity';

export class UpdateRoleDto {
  @ApiProperty({ required: false, example: 'user' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false, example: 'crm' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  appName?: string;

  @ApiProperty({ required: false, example: '' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  isReadOnly?: boolean;

  @ApiProperty({ required: false, example: '' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  isHidden?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  canSeeEmail?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  canSeePhoneNumber?: boolean;

  @ApiProperty({ required: false, example: false })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  seeOtherConfidentialData?: boolean;

  @ApiProperty({ required: false, example: 0 })
  @IsNumber()
  @IsOptional()
  clonedFrom?: number;

  @ApiProperty({example:1})
  @IsOptional()
  @IsNumber()
  dashboardId: number;

  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  isActive?: boolean;
}
