import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLeadDto } from './create-lead.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @ApiProperty({ required: false, example: 'Sales Desk' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  salesDesk?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  retentionDeskId?: number;

  @ApiProperty({ required: false, example: 'Retention Desk' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  retentionDesk?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  retentionRepId?: number;

  @ApiProperty({ required: false, example: 'Retention Rep' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  retentionRep?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  supportDeskId?: number;

  @ApiProperty({ required: false, example: 'Support Desk' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  supportDesk?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  supportRepId?: number;

  @ApiProperty({ required: false, example: 'Support Rep' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  supportRep?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  financeDeskId?: number;

  @ApiProperty({ required: false, example: 'Finance Desk' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  financeDesk?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  financeRepId?: number;

  @ApiProperty({ required: false, example: 'Finance Rep' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  financeRep?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  kycDeskId?: number;

  @ApiProperty({ required: false, example: 'kyc Desk' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycDesk?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  kycRepId?: number;

  @ApiProperty({ required: false, example: 'Kyc Rep' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycRep?: string;

  @ApiProperty({ required: false, example: 'Example Office' })
  @IsOptional()
  @IsNumber()
  officeId?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  office?: string;

  @ApiProperty({ required: false, example: 'English' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  speakingLanguage?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  salesPartnerId?: number;
  
  @ApiProperty({ required: false, example: '123@skype' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  skypeID?: string;
}
