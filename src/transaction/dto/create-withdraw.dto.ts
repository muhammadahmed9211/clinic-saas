import {
  IsBoolean,
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
import { WithdrawSubType } from '../entities/withdraw-request.entity';
import { i18nValidationMessage } from 'nestjs-i18n';
import { BaseTransactionMethod } from './create-manual-transaction.dto';

export interface IWithdrawPayload {
  pspTransactionId?: string;
  internalReferenceNo?: string;
  evidenceId?: string;
  pspId?: number;
  tradingPlatformId?: string;
  transactionNote?: string;
  internalNote?: string;
  commentForUser?: string;
  brokerExternalId?: string;
  pspAccountNo?: string;
  externalNote?: string;
}

export class CreateWithdraw extends BaseTransactionMethod {
  @ApiProperty({ example: 10 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: 3017 })
  @ValidateIf((body) => !body.walletId)
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login?: string;

  @ApiProperty({ enum: WithdrawSubType })
  @IsOptional()
  @IsEnum(WithdrawSubType)
  subType: WithdrawSubType = WithdrawSubType.CLIENT_REQUEST;

  @ApiProperty({ example: 3017 })
  @ValidateIf((body) => !body.login)
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  walletId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsString()
  tradingPlatformId?: string;

  @ApiProperty({ example: 1 })
  @ValidateIf(
    (body) =>
      body.method !== TransactionMethods.WIRE &&
      body.method !== TransactionMethods.EXCHANGE,
  )
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  pspId: number;

  @ApiProperty({ example: true })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isApproved: boolean;

  @ApiProperty({ example: 'Internal Comment' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalComment: string;

  @ApiProperty({ example: 'External Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalNote: string;

  @ApiProperty({ example: 'Comment For User' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  commentForUser?: string;

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  evidenceId: string;

  @ApiProperty({ example: 'Internal Reference' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalReferenceNo?: string;

  @ApiProperty({ example: 'Transaction Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  transactionNote?: string;

  @ApiProperty({ example: 'Internal Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalNote?: string;

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  pspTransactionId: string;

  @ApiProperty({ example: 'PSP Account No' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  pspAccountNo?: string;

  @ApiProperty({ example: '11111' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  brokerExternalId?: string;

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardType: string;

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardHolderName: string;

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardNumber: string;

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  cardExpiration: string;

  //Credit Card Ends

  //E Wallet Starts

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletName: string;

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletTitle: string;

  @ValidateIf(() => false)
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletId: string;

  @ValidateIf((body) => body.method === TransactionMethods.CREDIT_CARD)
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  creditCardDetailsId: number;

  @ValidateIf((body) => body.method === TransactionMethods.E_WALLET)
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  userEWalletId: number;
}
