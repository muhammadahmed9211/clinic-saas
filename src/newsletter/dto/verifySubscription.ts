import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VerifySubscriptionDto {
  @ApiProperty({ example: '123456' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  otp: string;

  @ApiProperty({ example: 'john@mailinator.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;
}
