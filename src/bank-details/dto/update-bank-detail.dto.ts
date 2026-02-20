import {
  IsString,
  IsOptional,
  IsNotEmpty,
  ValidateNested,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { FileDto } from './create-bank-detail.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateBankDetailDto {
  @ApiProperty({ example: 'GB29NWBK60161331926819' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  iban: string;

  @ApiProperty({ example: 'Chase Bank' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  beneficiaryName: string;

  @ApiProperty({ example: 'AED' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  currency: string;

  @ApiProperty({ example: 'NWBKGB2L' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  swift: string;

  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  sortCode: string;

  @ApiProperty({ example: '123 Main Street' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  address: string;

  @ApiProperty({ example: 'CA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  state: string;

  @ApiProperty({ example: 'M1 1AB' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  zipCode: string;

  @ApiProperty({ example: 'Canada' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  country: string;

  @ApiProperty({ example: 'New Branch' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  branchName: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ValidateNested({ message: i18nValidationMessage('validation.INVALID_ID') })
  @ApiProperty({ type: () => FileDto })
  @Type(() => FileDto)
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: i18nValidationMessage('validation.NOT_EXIST'),
  })
  statement: FileDto;
}
