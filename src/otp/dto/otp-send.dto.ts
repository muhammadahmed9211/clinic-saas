import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class OtpSendDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ example: 'John', required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  firstName?: string;

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

  @ApiProperty({ example: 'dummy_test_token' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  recaptchaToken: string;

  @ApiProperty({ example: 'FSCA' })
  @IsOptional()
  regulations?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  regulationId?: number;
}
