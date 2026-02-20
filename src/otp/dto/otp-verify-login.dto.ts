import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class OtpVerifyLoginDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: number;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ example: '9xx2' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  code: string;
}
