import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum KycState {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export enum Side {
  front = 'front',
  back = 'back',
}

export class CreatePartneKycDto {
  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 1,
    description: 'The ID of the document.',
  })
  documentId: number;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'BFE6423E-F36B-1410-8E91-00FBE52F62A4',
    description: 'The ID of the file.',
  })
  fileId: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'id_card',
    description: 'The ID type of the file.',
  })
  field_id: string;

  @ApiProperty({
    example: 'front',
    description: 'front or back',
  })
  @IsEnum(Side)
  side: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({
    example: 'pending',
    description: 'The state of the KYC document.',
  })
  state: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'passport',
    description: 'The type of the KYC document.',
  })
  type?: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  @ApiProperty({
    example: 'active',
    description: 'The status of the KYC document.',
  })
  status?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Document Title',
    description: 'The title of the KYC document.',
  })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'User KYC Note',
    description: 'The user KYC note.',
  })
  userKycNote?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description: 'The status of the KYC document.',
  })
  kycStatus?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Reasons for rejection',
    description: 'The reasons for rejection.',
  })
  rejectionReasons?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Rejection Reason Text',
    description: 'The text of the rejection reason.',
  })
  rejectionReasonsText?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Translation Status',
    description: 'The status of translation.',
  })
  translationStatus?: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Translation Rep',
    description: 'The translation representative.',
  })
  translationRep?: string | null;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    example: false,
    description: 'Whether the document is hidden or not.',
  })
  hidden?: boolean;
}

export class UpdatePartnerKycDocumentDetailDto {
  @ApiProperty({ example: 'id_card' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  fieldId: string;

  @ApiProperty({ example: 'Introducing Broker' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  classification: string;

  @ApiProperty({ example: '42201-8108058-2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  idNumber: string;

  @ApiProperty({ example: 'Pakistan' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  nationality: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsOptional()
  dateOfBirth: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsOptional()
  documentExpiryDate: string;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @IsOptional()
  rejectedReasonIds: number[];
}

export class partnerKycInfoDto {
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
