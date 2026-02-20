import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

class SubscriptionsDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Snapshots' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;
}
export class CreateSubscriptionDto {
  @ApiProperty({ example: 'John' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'john@mailinator.com' })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  tc_accepted: boolean;

  @ApiProperty({ example: [] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubscriptionsDto)
  subscriptions: SubscriptionsDto[];

  @ApiProperty({ example: 'UR' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.INVALID_EMAIL') })
  lang: string;
}
