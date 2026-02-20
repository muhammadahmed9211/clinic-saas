import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyTransactionOtp {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: number;

  @ApiProperty({ example: '123456' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  otp: string;
}
