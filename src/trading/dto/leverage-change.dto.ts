import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangeLeverageDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  name: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  email: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  regulation?: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  regulationId?: number;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  tradingAccount: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  referenceId: string;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  leverage: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @Transform(({ value }) => (value ? Number(value) : 10))
  // @IsNumber()
  // @IsOptional()
  // limit: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  accountId: string;
}
