import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { OtpTypes } from 'src/users/entities/otp.entity';

export class SendOtpLoginEmailDTO {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;
  
  @ApiProperty({ example: 'secret' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ApiProperty({
    enum: OtpTypes,
    example: OtpTypes.verify_email
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(OtpTypes)
  type: OtpTypes;
}
