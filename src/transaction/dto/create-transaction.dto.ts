import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  IsBoolean
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum COINS {
  ETH = 'ETH',
  USDT = 'USDT',
  USDC = 'USDC',
  BTC="BTC"
}

export enum STANDARDS {
  ERC_20 = 'ERC-20',
  TRC_20 = "TRC-20",
}

export enum SinglePaymentMethod {
  crypto = 'crypto',
  credit_card = 'credit_card',
  apm = 'apm',
}

export class AlphaPayPaymentDTO {
  @ValidateIf(
    (body) => body.single_payment_method === SinglePaymentMethod.crypto,
  )
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(COINS)
  currency: COINS;

  @ValidateIf(
    (body) =>
      body.single_payment_method === SinglePaymentMethod.crypto &&
      body.currency !== COINS.ETH,
  )
  @IsOptional({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEnum(STANDARDS)
  standard: STANDARDS;

  @IsOptional({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  notes: string;
}

export class CreateTransactionDto extends AlphaPayPaymentDTO {
  @ApiProperty({ example: 10 })
  @IsNumber({ allowNaN: false })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: 6016, required: true })
  @IsNumber({ allowNaN: false })
  walletId: number;

  @ApiProperty({ example: SinglePaymentMethod.credit_card })
  @IsEnum(SinglePaymentMethod)
  @IsOptional()
  single_payment_method: SinglePaymentMethod = SinglePaymentMethod.credit_card;

  @ApiProperty({ example: 'Client' })
  @IsNotEmpty()
  @IsString()
  app: string;

  @ApiProperty({ example: 'client-v2-development.example.com' })
  @IsNotEmpty()
  @IsString()
  host: string;

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

export interface ITransactionInfo {
  bonusCode: string;
  mt5AccountLogin: string;
  isNewTradingAccount:boolean
}
