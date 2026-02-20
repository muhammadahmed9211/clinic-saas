import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifyOtpEmailDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: number;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  otp: string;
}
