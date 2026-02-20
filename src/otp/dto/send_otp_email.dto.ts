import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsDateString,
  IsNotEmpty,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { OtpTypes } from 'src/users/entities/otp.entity';

export class SendOtpEmailDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ example: '3222152033' })
  @Length(5, 15)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: '92' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Matches(/^[^+]*$/, {
    message: i18nValidationMessage('validation.INVALID_TELEPHONE_PREFIX'),
  })
  @IsOptional()
  telephonePrefix?: string;

  @ApiProperty({
    enum: OtpTypes,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(OtpTypes)
  type: OtpTypes;

  @ApiProperty({ example: '2024-02-11T12:00:00Z' })
  @IsDateString()
  @IsOptional()
  expires?: Date;
}
