import {
  IsNotEmpty,
  IsEnum,
  ValidateIf,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { WithdrawType } from '../entities/withdraw-request.entity';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class WithdrawRequestDTO {
  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: '1023' })
  @ValidateIf((object) => !object.walletId)
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  login?: string;

  @ApiProperty({ example: '3017' })
  @ValidateIf((object) => !object.login)
  @IsNumber()
  walletId?: number;

  @ApiProperty({ enum: WithdrawType })
  @IsEnum(WithdrawType)
  type: WithdrawType;

  @ApiProperty({ example: 1 })
  @ValidateIf((object) => object.type === WithdrawType.E_WALLET)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_STRING') },
  )
  userEWalletId?: number;

  @ApiProperty({ example: 1 })
  @ValidateIf((object) => object.type === WithdrawType.CREDIT_DEBIT_CARD)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_STRING') },
  )
  creditCardDetailsId?: number;

  @ApiProperty({ example: 'BTC' })
  @ValidateIf((object) => object.type === WithdrawType.CRYPTO)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoCurrency?: string;

  @ApiProperty({ example: 'Client Remarks' })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  clientRemarks?: string;

  @ApiProperty({ example: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' })
  @ValidateIf((object) => object.type === WithdrawType.CRYPTO)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoAddress?: string;

  @ApiProperty({ example: 'ETH' })
  @ValidateIf((object) => object.type === WithdrawType.CRYPTO)
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  network?: string;

  @ApiProperty({ example: 1004 })
  @ValidateIf((object) => object.type === WithdrawType.BANK_WIRE_TRANSFER)
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  bankDetailId?: number;

  exchangeId?: number;

  @ApiProperty({})
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  verificationId?: number
}
