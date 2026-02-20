import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { RegisterDeviceDto } from 'src/push-notification/dto/device-info.dto';
import { PartialType } from '@nestjs/mapped-types';

export class PartialRegisterDeviceDto extends PartialType(RegisterDeviceDto) {}

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'admin@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email: string;

  @ApiProperty({ example: 'secret' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ApiProperty({ example: true })
  isOperator: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  verificationId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  otpId?: number;

  @ApiProperty({ type: PartialRegisterDeviceDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PartialRegisterDeviceDto)
  device?: PartialRegisterDeviceDto;

  @ApiProperty({ example: 'your-fcm-token', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fcmToken?: string;
}

export class AuthLoginLongTokenDto {
  @ApiProperty({ example: 'admin@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email: string;

  @ApiProperty({ example: 'secret' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  password: string;

  @ApiProperty({ example: true })
  isOperator: boolean;
}
