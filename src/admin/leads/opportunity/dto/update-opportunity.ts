import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateOpportunityDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  dealOwner: number;

  @ApiProperty({ example: 'Deal Name', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  dealName: string;

  @ApiProperty({ example: 'Company Name', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  companyName: string;

  @ApiProperty({ example: 'Contact Name', required: false })
  @IsOptional()
  @IsString()
  contact: string;

  @ApiProperty({ example: '10%', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  nextStep: string;

  @ApiProperty({ example: 'lead Source', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leadSource: string;

  @ApiProperty({ example: '2024-10-10T14:48:00', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  closingDate: number;

  @ApiProperty({ example: 'Qualification', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  stage: string;

  @ApiProperty({ example: '20%', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  probability: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  expectedInvestment: number;

  @ApiProperty({ example: 'Business Type', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  typeOfBusiness: string;

  @ApiProperty({ example: 'description', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;
}
