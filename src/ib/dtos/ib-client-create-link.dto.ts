import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class IbClientCreateLinkDto {
  @ApiProperty({ example: 'Registration Link', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'Description', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;

  @ApiProperty({ example: 'Param 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p1?: string;

  @ApiProperty({ example: 'Param 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p2?: string;

  @ApiProperty({ example: 'Param 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p3?: string;
  @ApiProperty({ example: 'Param 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p4?: string;

  @ApiProperty({ example: 'Param 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p5?: string;

  @ApiProperty({ example: 'Param 1', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p6?: string;

  @ApiProperty({ example: 'IB' })
  @IsString()
  @IsOptional()
  utmSource?: string;

  @ApiProperty({ example: 'IBRegistrationLink' })
  @IsString()
  @IsOptional()
  source?: string;
}

export interface IbCustomParamDto {
  p1?: string;
  p2?: string;
  p3?: string;
}

export class IbClientUpdateLinkDto {
  @ApiPropertyOptional({ example: 'Registration Link' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name?: string;

  @ApiPropertyOptional({ example: 'Description' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description?: string;

  @ApiPropertyOptional({ example: 'Param 1' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p1?: string;

  @ApiPropertyOptional({ example: 'Param 2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p2?: string;

  @ApiPropertyOptional({ example: 'Param 3' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p3?: string;

  @ApiPropertyOptional({ example: 'Param 1' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p4?: string;

  @ApiPropertyOptional({ example: 'Param 2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p5?: string;

  @ApiPropertyOptional({ example: 'Param 3' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p6?: string;
}
