import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';

export class DistributionValueDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  distributionLevel: number;

  @ApiProperty({ example: '5.00', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  distributionAmount: string;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  level?: string;

  @ApiProperty({ example: '0', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fromAmount?: string;

  @ApiProperty({ example: '100', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  toAmount?: string;

  @ApiProperty({ example: '10', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  amount?: string;

  @ApiProperty({ example: 'Pips', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  distributionContext: string;
}

export class DistributionDto {
  @ApiProperty({ example: 'distribution', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  key: string;

  @ApiProperty({ example: 'Pips', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  value: string;

  @ApiProperty({ type: [DistributionValueDto], required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DistributionValueDto)
  distributionValues: DistributionValueDto[];
}

export class CreateIbConfigDto {
  @ApiProperty({ example: 'Standard FX $12 Rebates', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 3, required: true, description: 'Priority value must be unique across all configurations' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({}, { message: 'Priority must be a number' })
  priority: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  commissionProfile: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  profileType: number;

  @ApiProperty({ example: 'USDT, FOREX', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  symbols: string;

  @ApiProperty({ example: 'In', required: true, description: 'When "In" is selected, scalpingTrades becomes optional' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entry: string;

  @ApiProperty({ example: 'Scalping Trades', required: false, description: 'Required only when entry is not "In"' })
  @ValidateIf(o => o.entry !== 'In')
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  scalpingTrades?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  setCashback?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isDeductFromIb?: boolean;

  @ApiProperty({ example: 'percentage', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cashbackAmountType?: string;

  @ApiProperty({ example: '10', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cashbackAmount?: string;

  @ApiProperty({ type: [DistributionDto], required: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DistributionDto)
  distributions: DistributionDto[];
}

export class UpdateIbConfigDto {
  @ApiProperty({ example: 'Standard FX $12 Rebates', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name?: string;

  @ApiProperty({ example: 3, required: false, description: 'Priority value must be unique across all configurations' })
  @IsOptional()
  @IsNumber({}, { message: 'Priority must be a number' })
  priority?: number;

  // @ApiProperty({ example: 1, required: false })
  // @IsOptional()
  // @IsNumber()
  // commissionProfile?: number;

  // @ApiProperty({ example: 1, required: false })
  // @IsOptional()
  // @IsNumber()
  // profileType?: number;

  @ApiProperty({ example: 'USDT, FOREX', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  symbols?: string;

  @ApiProperty({ example: 'In', required: false, description: 'When "In" is selected, scalpingTrades becomes optional' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entry?: string;

  @ApiProperty({ example: 'Scalping Trades', required: false, description: 'Required only when entry is not "In"' })
  @ValidateIf(o => o.entry !== undefined && o.entry !== 'In')
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  scalpingTrades?: string;

  // @ApiProperty({ example: true, required: false })
  // @IsOptional()
  // @IsBoolean()
  // setCashback?: boolean;

  // @ApiProperty({ example: true, required: false })
  // @IsOptional()
  // @IsBoolean()
  // isDeductFromIb?: boolean;

  // @ApiProperty({ example: 'percentage', required: false })
  // @IsOptional()
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // cashbackAmountType?: string;

  // @ApiProperty({ example: '10', required: false })
  // @IsOptional()
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // cashbackAmount?: string;

  @ApiProperty({ type: [DistributionDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DistributionDto)
  distributions?: DistributionDto[];
}


export class DealIdsDto {
  @ApiProperty({ example: [1, 2, 3], type: [Number] })
  dealIds: number[];
}
