import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FileDto {
  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsUUID()
  id: string;
}

export class CreateBankDetailDto {
  @ApiProperty({ example: 'GB29NWBK60161331926819' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  iban: string;

  @ApiProperty({ example: 'Chase Bank' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  beneficiaryName: string;

  @ApiProperty({ example: 'AED' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  currency: string;

  @ApiProperty({ example: 'NWBKGB2L' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  swift: string;

  @ApiProperty({ example: 'New Branch' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  branchName: string;

  @ApiProperty({ example: '123456' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  sortCode: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  address: string;

  @ApiProperty({ example: 'CA' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  state: string;

  @ApiProperty({ example: 'M1 1AB' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  zipCode: string;

  @ApiProperty({ example: 'Canada' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  country: string;

  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ValidateNested({ message: i18nValidationMessage('validation.INVALID_ID') })
  @ApiProperty({ type: () => FileDto })
  @Type(() => FileDto)
  statement: FileDto;
}
