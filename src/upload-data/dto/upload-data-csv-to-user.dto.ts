import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class UploadDataCsvToUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  lastName: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: i18nValidationMessage('validation.MIN') })
  password?: string;

  @ApiProperty({ example: '3222152033' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  telephone: string;

  @ApiProperty({ example: '92' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  telephonePrefix: string;

  @ApiProperty({ example: 1 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  verificationId: number;

  @ApiProperty({ example: 'PK' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @MinLength(2, { message: i18nValidationMessage('validation.MIN') })
  countryIso: string;

  @ApiProperty({ example: 'EN' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @MinLength(2, { message: i18nValidationMessage('validation.MIN') })
  languageIso: string;

  @ApiProperty({ example: 'Pakistan' })
  @IsOptional()
  country: string;

  @ApiProperty({ example: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  demo: boolean;

  @ApiProperty({ example: '136AE8BB-AF7E-4B38-AF66-FB9AF917D60F' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  affid: string;

  @ApiProperty({ example: 'standard-account' })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN') })
  p1: string;

  @ApiProperty({ example: 'Direct on Company Website' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  sc: string;

  @ApiProperty({ example: '657aa94dd779947f58947212' })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN') })
  id2: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  userType: number;

  @ApiProperty({ example: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  isBroker: boolean = false;
}
