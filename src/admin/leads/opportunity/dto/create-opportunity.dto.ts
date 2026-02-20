import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateOpportunityDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  dealOwner: number;

  @ApiProperty({ example: 'Deal Name' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  dealName: string;

  @ApiProperty({ example: 'Company Name' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  companyName: string;

  @ApiProperty({ example: '10%' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  nextStep: string;

  @ApiProperty({ example: 'lead Source' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leadSource: string;

  @ApiProperty({ example: 101, required: false })
  @IsOptional()
  @IsNumber()
  contactName: number;

  @ApiProperty({ example: 'Contact Name', required: false })
  @IsOptional()
  @IsString()
  contact: string;

  @ApiProperty({ example: '2024-10-10T14:48:00' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  closingDate: number;

  @ApiProperty({ example: 'Qualification' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  stage: string;

  @ApiProperty({ example: '20%' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  probability: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  expectedInvestment: number;

  @ApiProperty({ example: 'Business Type' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  typeOfBusiness: string;

  @ApiProperty({ example: 'description', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;
}

export class CreateEmailDto {
  @ApiProperty({ example: 'Hello, this is a html', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  html: string;

  @ApiProperty({ example: 'Subject', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @ApiProperty({ example: 'sales@example.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  from?: string;

  @ApiProperty({ example: 12345, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  leadId: number;

  @ApiProperty({ example: 12345, required: true })
  @IsOptional()
  opportunityId?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  send?: boolean;

  @ApiProperty({ example: 12345, required: false })
  @IsOptional()
  id: number;

  operatorId: number;
}

export class OpportunityQueryDto {
  @ApiProperty({ example: 'createdAt', required: false })
  @IsOptional()
  key: string;

  @ApiProperty({ example: 'ASC', required: false })
  @IsOptional()
  value: string;
}
