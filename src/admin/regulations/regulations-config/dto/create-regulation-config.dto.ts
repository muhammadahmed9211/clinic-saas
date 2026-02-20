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

export class CreateRegulationEventDto {
  @ApiProperty({ example: 'mt5_live_account_creation', required: true })
  @IsNotEmpty({ message: 'key cannot be empty' })
  @IsString({ message: 'key must be a string' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  key: string;

  @ApiProperty({ example: 'MT5 Live Account Creation', required: true })
  @IsNotEmpty({ message: 'title cannot be empty' })
  @IsString({ message: 'title must be a string' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  title: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description cannot be empty' })
  @MaxLength(200, { message: 'needs to be less than 200' })
  description: string;
}

export class CreateRegulationRuleDto {
  @ApiProperty({
    description: 'Type of regulation rule',
    enum: RegulationRuleType,
    default: RegulationRuleType.BOOLEAN,
    example: RegulationRuleType.BOOLEAN,
  })
  @IsString()
  @IsEnum(RegulationRuleType)
  type: RegulationRuleType;

  @ApiProperty({ example: 'is_kyc_required', required: true })
  @IsNotEmpty({ message: 'key cannot be empty' })
  @IsString({ message: 'key must be a string' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  key: string;

  @ApiProperty({ example: 'Is KYC Required', required: true })
  @IsNotEmpty({ message: 'label cannot be empty' })
  @IsString({ message: 'label must be a string' })
  @MaxLength(30, { message: 'needs to be less than 30' })
  label: string;

  @ApiProperty({ example: 'Description', required: false })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @MaxLength(200, { message: 'needs to be less than 200' })
  description: string;

  @ApiProperty({ example: 'enum values', required: false })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description cannot be empty' })
  enumValue: string;

  @ApiProperty({ example: 'TRUE', required: true })
  @IsString({ message: 'description must be a string' })
  defaultValue: string;
}
