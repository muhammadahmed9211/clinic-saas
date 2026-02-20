import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateRoleDto {
  @ApiProperty({ required: true, example: 'user' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ required: true, example: 'crm' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  appName?: string;

  @ApiProperty({ required: false, example: '' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, example: false })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  isReadOnly?: boolean;

  @ApiProperty({ required: false, example: '' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  departmentId?: string;

  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isHidden: boolean;

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

  @ApiProperty({ required: false, example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  @IsOptional()
  isActive?: boolean;
}
