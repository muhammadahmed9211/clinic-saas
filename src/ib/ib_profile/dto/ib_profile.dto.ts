import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class KeyFeatureDto {
  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ example: 'Rebate', required: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  feature?: string;
}
export class IbProfileCreateDto {
  @ApiProperty({ example: 'Standard $12 Rebates', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'Standard $12 Rebates Description', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  tradingGroupId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  copyTradingGroupId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  agentTradingGroupId: number;

  @ApiProperty({ example:1 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  classificationId: number;

  @ApiProperty({ example: 3, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  level: number;

  @ApiProperty({ example: 'Live-MT5', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  server: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  copyConfig?: boolean;

  @ApiProperty({ example: 1, required: false })
  @ValidateIf(o => o.copyProfileConfig === true)
  @IsNumber()
  configs?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isPublic?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  calculateCommission?: boolean;

  @ApiProperty({ type: [KeyFeatureDto], required: false })
  @IsOptional()
  keyFeatures?: KeyFeatureDto[];
}

export class UpdateIbProfileDto {
  @ApiProperty({ example: 'Standard $12 Rebates', required: false })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'Standard $12 Rebates Description', required: false })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;

  @ApiProperty({ example: 1, required: true })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  tradingGroupId: number;

  @ApiProperty({ example: 1, required: true })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  copyTradingGroupId: number;

  @ApiProperty({ example: 1, required: true })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  @Min(1 , { message: i18nValidationMessage('validation.IS_NUMBER') })
  agentTradingGroupId: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isPublic?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  calculateCommission?: boolean;

  @ApiProperty({ type: [KeyFeatureDto], required: false })
  @IsOptional()
  keyFeatures?: KeyFeatureDto[];
}
