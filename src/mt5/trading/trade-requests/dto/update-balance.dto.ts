import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateBalanceRequest {
  @ApiProperty({ required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login: string;

  @ApiProperty({ required: true })
  @IsNumber()
  type: number;

  @ApiProperty({ required: true })
  @IsNumber()
  balance: number;

  @ApiProperty({ required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  comment: string;
}
