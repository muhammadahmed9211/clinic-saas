import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  Min,
  IsBoolean,
} from 'class-validator';
import {
  TransactionPriority,
  TransactionWorkflowStatus,
} from '../entities/transaction.entity';
import { WithdrawSubType } from '../entities/withdraw-request.entity';
import { Methods as TransactionMethods } from 'src/transaction/entities/transaction-method.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateTransactionParamDto {
  @ApiProperty({
    example: '6E08433E-F36B-1410-8528-00DD52555502',
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsUUID()
  id: string;
}

export class UpdateTransactionDto {
  @ApiProperty({ enum: TransactionWorkflowStatus })
  @IsOptional()
  @IsEnum(TransactionWorkflowStatus)
  workflowStatus?: TransactionWorkflowStatus;

  @ApiProperty({ example: 'This is an internal comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalComment?: string;

  @ApiProperty({ enum: TransactionPriority })
  @IsOptional()
  @IsEnum(TransactionPriority)
  priority?: TransactionPriority;

  @ApiProperty({ example: 'NONE' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  kycStatus?: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNumber()
  fee?: number;

  @ApiProperty({ example: 'Reason for internal decline' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalDeclineReason?: string;

  @ApiProperty({ example: 'Comment for user' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  commentForUser?: string;

  @ApiProperty({ enum: TransactionMethods })
  @IsOptional()
  @IsEnum(TransactionMethods)
  method?: TransactionMethods;

  @ApiProperty({ example: 'externalTransactionId123' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalTransactionId?: string;

  @ApiProperty({ example: '1021' })
  @IsOptional()
  @IsNumber()
  salesRepId?: number;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsNumber()
  salesDeskId?: number;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsNumber()
  retentionRepId?: number;

  @ApiProperty({ example: 'Retention Desk 1' })
  @IsOptional()
  @IsNumber()
  retentionDeskId?: number;

  @ApiProperty({ example: 'Acquisition status' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  acquisitionStatus?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  pspId?: number;

  @ApiProperty({ example: 'Manual PSP Name' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  pspNameManual?: string;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  creditBonus?: number;

  @ApiProperty({ enum: WithdrawSubType })
  @IsOptional()
  @IsEnum(WithdrawSubType)
  subType?: WithdrawSubType;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  userReason?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  transactionReason?: string;

  @ApiProperty({ example: 20 })
  @IsOptional()
  @IsNumber()
  balanceBonus?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount?: number;

  @IsOptional()
  @IsNumber()
  creditCardDetailsId?: number;

  @IsOptional()
  @IsNumber()
  userEWalletId?: number;

  @ApiProperty({ example: 'HIGH' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  authenticationAlert?: string;

  @ApiProperty({ example: 'PSP ACCOUNT' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  pspAccountNo?: string;

  @ApiProperty({ example: 'BROKER ID' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  brokerExternalId?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  reconcile?: boolean;

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsNumber()
  kycRepId?: number;

  @ApiProperty({ example: 'External Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalNote?: string;

  @ApiProperty({ example: 'Reason for withdrawal and deposit' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  reason?: string;
}
