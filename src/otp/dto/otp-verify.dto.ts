import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class OtpVerifyDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: number;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ example: '3222152033' })
  @Length(5, 15)
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: '92' })
  @IsOptional()
  @Matches(/^[^+]*$/, {
    message: i18nValidationMessage('validation.INVALID_TELEPHONE_PREFIX'),
  })
  telephonePrefix?: string;

  @ApiProperty({ example: '9xx2' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  code: string;
}
