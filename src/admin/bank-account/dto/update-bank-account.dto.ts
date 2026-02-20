import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { BankInfoDto } from './create-bank-account.dto';

export class UpdateBankAccountDto extends BankInfoDto {

  @ApiProperty({ example: 'Chase Bank' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  bankName: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  accountName: string;

  @ApiProperty({ example: '987654321' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  accountNumber: string;

  @ApiProperty({ example: 'DE89370400440532013000' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  iban: string;

  @ApiProperty({ example: 'Main Branch' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  branchName: string;

  @ApiProperty({ example: 'USD' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  country: string;

  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  sortCode: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isClientVisible: boolean;

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsOptional({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  logoId: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isRegulationRestricted: boolean;

  @ApiProperty({example: [1, 2, 3]})
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNumber(
    { allowNaN: false },
    { each: true, message: i18nValidationMessage('validation.IS_INT') },
  )
  regulationsId: number[];

  @ApiProperty({ example: true })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isCountryRestricted: boolean;

  @ApiProperty({example: [1, 2, 3]})
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNumber(
    { allowNaN: false },
    { each: true, message: i18nValidationMessage('validation.IS_INT') },
  )
  countryIds: number[];

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber(
      { allowNaN: false },
      { each: true, message: i18nValidationMessage('validation.IS_INT') },
  )
  @Min(1)  
  currencyId: number;
}

export class CreateBankAccount {
  @ApiProperty({ example: '456 Main St, Anytown, USA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  companyAddress: string;

  @ApiProperty({ example: 'Intermediate Bank' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  intermediateBankName: string;

  @ApiProperty({ example: '789012' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  branchCode: string;

  @ApiProperty({ example: '123 Main St, Anytown, USA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  bankAddress: string;

  @ApiProperty({ example: 'ABCDUS33' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  swift: string;

  @ApiProperty({ example: 'Additional information' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  additionalInformation: string;

  @ApiProperty({ example: '123456789' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  reference: string;
}