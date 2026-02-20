import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { COINS } from './create-cypto-address.dto';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateManualCrypto {
  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  evidenceId: string;

  @ApiProperty({ example: 76 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  walletId: number;

  @ApiProperty({ example: 'hash' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoHashReference: string;

  @ApiProperty({ example: 'ETH' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  network: string;

  @ApiProperty({ enum: COINS })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(COINS)
  currency: COINS;

  @ApiProperty({ example: 'hash' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoClientWalletAddress: string;

  @ApiProperty({ example: 76 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'silver' })
  @IsOptional()
  @IsString()
  bonusCode: string;
  
  @ApiProperty({ example: '1091' })
  @IsOptional()
  @IsString()
  mt5AccountLogin: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isNewTradingAccount: boolean;
}

export class CreateManualBank {
  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  evidenceId: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  companyBankId: number;

  @ApiProperty({ example: 10 })
  @IsNumber({ allowNaN: false })
  @Min(1)
  amount: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  userBankId: number;

  @ApiProperty({ example: 'silver' })
  @IsOptional()
  @IsString()
  bonusCode: string;
  
  @ApiProperty({ example: '1091' })
  @IsOptional()
  @IsString()
  mt5AccountLogin: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isNewTradingAccount: boolean;
}
