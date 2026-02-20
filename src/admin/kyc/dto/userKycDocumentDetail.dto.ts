import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserKycDocumentDetailDto {
  @ApiProperty({ example: 'Fatima' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  firstName: string;

  @ApiProperty({ example: 'Zehra' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  lastName: string;

  @ApiProperty({ example: 2022 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  userKycDocumentId: number;

  @ApiProperty({ example: 'Passport' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  type: string;

  @ApiProperty({ example: 'Introducing Broker' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  classification: string;

  @ApiProperty({ example: '42201-8108058-2' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  idNumber: string;

  @ApiProperty({ example: 'Pakistan' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  nationality: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  dateOfBirth: string;

  @ApiProperty({ example: '2024-12-31' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  documentExpiryDate: string;

  @ApiProperty({ example: [1, 2] })
  @IsArray()
  rejectedReasonIds: number[];
}

export class UpdateUserKycDocumentDetailDto {
  @ApiProperty({ example: 'id_card' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  fieldId: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  userId: number;

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

  @ApiProperty({ example: 'Reason for rejecting on basis of other' })
  @IsOptional()
  rejectedReasonOther?: string;
}

export class GetUserKycDocumentDetailDto {
  @ApiProperty({ example: 'id_card' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  fieldId: string;
}
