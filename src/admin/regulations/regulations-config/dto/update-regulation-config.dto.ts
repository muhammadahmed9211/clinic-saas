import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RegulationRuleType } from '../entities/regulation-rule.entity';

export class UpdateRegulationEventDto {
  @ApiProperty({ example: 'mt5_live_account_creation', required: false })
  @IsOptional()
  @IsString({ message: 'key must be a string' })
  @IsNotEmpty({ message: 'key cannot be empty' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  key: string;

  @ApiProperty({ example: 'MT5 Live Account Creation', required: false })
  @IsOptional()
  @IsString({ message: 'title must be a string' })
  @IsNotEmpty({ message: 'title cannot be empty' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  title: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description cannot be empty' })
  @MaxLength(200, { message: 'needs to be less than 200' })
  description: string;
}

export class UpdateRegulationRuleDto {
  @ApiProperty({
    description: 'Type of regulation rule',
    enum: RegulationRuleType,
    default: RegulationRuleType.BOOLEAN,
    example: RegulationRuleType.BOOLEAN,
  })
  @IsString()
  @IsOptional()
  @IsEnum(RegulationRuleType)
  type: RegulationRuleType;

  @ApiProperty({ example: 'is_kyc_required', required: false })
  @IsOptional()
  @IsString({ message: 'key must be a string' })
  @IsNotEmpty({ message: 'key cannot be empty' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  key: string;

  @ApiProperty({ example: 'Is KYC Required', required: false })
  @IsOptional()
  @IsString({ message: 'label must be a string' })
  @IsNotEmpty({ message: 'label cannot be empty' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  label: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description cannot be empty' })
  @MaxLength(200, { message: 'needs to be less than 200' })
  description: string;

  @ApiProperty({ example: 'Enum Values', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  enumValue: string;

  @ApiProperty({ example: 'TRUE', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  defaultValue: string;
}
