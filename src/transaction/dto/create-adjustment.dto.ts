import {
  IsNumber,
  IsString,
  Min,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  AccountType,
  AdjustmentType,
} from '../entities/transaction.entity';

export class CreateAdjustmentDto {
  @ApiProperty({ example: 10 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: AccountType.MT5 })
  @IsNotEmpty()
  @IsEnum(AccountType, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  accountType: AccountType;

  @ApiProperty({ example: AdjustmentType.POSITIVE })
  @IsNotEmpty()
  @IsEnum(AdjustmentType, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  type: AdjustmentType;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_ENUM') })
  isClientVisible: boolean;

  @ApiProperty({ example: '1234' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login: string;


  @ApiProperty({ example: 'Internal comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalComment?: string;

  @ApiProperty({ example: 'External Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalNote?: string;

  @ApiProperty({ example: 'Internal comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  tradingPlatformId?: string;

  @ApiProperty({ example: 'Internal Reference No' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalReferenceNo?: string;
}