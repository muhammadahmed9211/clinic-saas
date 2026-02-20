import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ApiProperty()
  @IsOptional()
  hash: string;

  @ApiProperty({ example: '123456' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  otp: string;
}
