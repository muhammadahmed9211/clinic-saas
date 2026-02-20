import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class BankInfoDTO {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankAccountName?: string;

  @ApiProperty({ example: '1234567890', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankAccountNumber?: string;

  @ApiProperty({ example: 'Main Branch', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankBranchName?: string;

  @ApiProperty({ example: 'Additional comments', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankComment?: string;

  @ApiProperty({ example: 'US', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankCountryIso?: string;

  @ApiProperty({ example: 'Bank of America', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankName?: string;

  @ApiProperty({ example: 'BOFAUS3NXXX', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  bankSwiftCode?: string;
}
