import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Methods as TransactionMethods } from '../entities/transaction-method.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class BaseTransactionMethod {
  @ApiProperty({ enum: TransactionMethods })
  @IsEnum(TransactionMethods)
  method: TransactionMethods;

  //Credit Card Starts

  @ValidateIf((body) => body.method === TransactionMethods.CREDIT_CARD)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardType: string;

  @ValidateIf((body) => body.method === TransactionMethods.CREDIT_CARD)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardHolderName: string;

  @ValidateIf((body) => body.method === TransactionMethods.CREDIT_CARD)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardNumber: string;

  @ValidateIf((body) => body.method === TransactionMethods.CREDIT_CARD)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardExpiration: string;

  //Credit Card Ends

  //E Wallet Starts

  @ValidateIf((body) => body.method === TransactionMethods.E_WALLET)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletName: string;

  @ValidateIf((body) => body.method === TransactionMethods.E_WALLET)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletTitle: string;

  @ValidateIf((body) => body.method === TransactionMethods.E_WALLET)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletId: string;

  //E Wallet Ends

  // Exchange Start
  @ApiProperty({ example: 1 })
  @ValidateIf((body) => body.method === TransactionMethods.EXCHANGE)
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  exchangeId?: number;

  // Exchange Ends

  // Wire Starts

  @ApiProperty({ example: 1 })
  @ValidateIf((body) => body.method === TransactionMethods.WIRE)
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  userBankId?: number;

  @ApiProperty({ example: 1 })
  @ValidateIf((body) => body.method === TransactionMethods.WIRE)
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  companyBankId?: number;

  // Wire ends

  // Crypto Starts

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @ValidateIf((body) => body.method === TransactionMethods.CRYPTO)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoHashReference: string;

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @ValidateIf((body) => body.method === TransactionMethods.CRYPTO)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoClientWalletAddress: string;

  @ApiProperty({ example: 'BTC' })
  @ValidateIf((body) => body.method === TransactionMethods.CRYPTO)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cryptoCoinName: string;

  @ApiProperty({ example: 'BTC' })
  @ValidateIf((body) => body.method === TransactionMethods.CRYPTO)
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  network: string;

  @ApiProperty({ example: 1 })
  @ValidateIf((body) => body.method === TransactionMethods.CRYPTO)
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  paidCryptoCoin: number;

  //Crypto Ends
}

export class CreateManualTransactionDto extends BaseTransactionMethod {
  @ApiProperty({ example: 10 })
  @IsNumber({ allowNaN: false })
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: 3017 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  walletId: number;

  @ApiProperty({ example: 'abc' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalTransactionId: string;

  @ApiProperty({ example: 'internal comment' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalComment: string;

  @ApiProperty({ example: 'user comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  commentForUser?: string;

  @ApiProperty({ example: 'user comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalReferenceNo?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsString()
  tradingPlatformId?: string;

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  evidenceId: string;

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  pspTransactionId: string;

  @ApiProperty({ example: 1 })
  @ValidateIf(
    (body) =>
      body.method !== TransactionMethods.WIRE &&
      body.method !== TransactionMethods.EXCHANGE,
  )
  @IsNotEmpty()
  @IsNumber()
  pspId: number;

  @ApiProperty({ example: 'PSP Account No' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  pspAccountNo?: string;

  @ApiProperty({ example: '11111' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  brokerExternalId?: string;

  @ApiProperty({ example: 'External Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalNote: string;

  @ApiProperty({ example: 1 })
  @ValidateIf((body) => body.method === TransactionMethods.WIRE)
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  userBankId?: number;

  login: string;
}
