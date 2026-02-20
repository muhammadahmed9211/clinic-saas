// retention-info.dto.ts

import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class KycInfoDto {
  @ApiProperty({ example: 'id_card' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fieldId: string;

  @ApiProperty({ example: 'Approved' })
  @IsOptional()
  @IsString()
  kycStatus?: string;

  @ApiProperty({ example: 'kyc_status' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 'Please update this document' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycNote?: string;
}

export class AllKycInfoDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  kycStatus?: number;

  @ApiProperty({ example: 'Please update this document' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycNote?: string;

  @ApiProperty({ example: 'Approved' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  porVerificationStatus?: string;

  @ApiProperty({ example: 'Approved' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  idVerificationStatus?: string;

  @ApiProperty({ example: 'Approved' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fnsStatus?: string;

  @ApiProperty({ example: 'Completed' || 'New' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycWorkflowStatus?: string;

  @ApiProperty({ example: 'Individual Customer' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycClientType?: string;

  @ApiProperty({ example: 80 })
  @IsOptional()
  @IsNumber()
  kycScore?: number;

  @ApiProperty({ example: true || false })
  @IsOptional()
  pendingInvestigation?: boolean;
}
