import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateBillingInformationDto {
  @ApiProperty({ example: 'Jane Smith' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(1, 100)
  name: string;

  @ApiProperty({ example: 'New Country' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(1, 100)
  country: string;

  @ApiProperty({ example: 'New City' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(1, 100)
  city: string;

  @ApiProperty({ example: '456 Avenue' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(1, 100)
  address: string;

  @ApiProperty({ example: '+9876543210' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(1, 100)
  phone: string;

  @ApiProperty({ example: '54321' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(1, 100)
  postalCode: string;
}
