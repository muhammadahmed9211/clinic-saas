import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsStrongPassword } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  old_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: i18nValidationMessage('validation.PASSWORD_LENGTH'),
    },
  )
  new_password: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  otpId?: number;
}
