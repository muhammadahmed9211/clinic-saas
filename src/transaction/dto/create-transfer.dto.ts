import {
  ValidateIf,
  IsNumber,
  IsString,
  IsObject,
  ValidateNested,
  Min,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TransferDto {
  @ApiProperty({ example: 2013, required: true })
  @ValidateIf((data) => !data?.login)
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  walletId: number;

  @ApiProperty({ example: '94016', required: true })
  @ValidateIf((data) => !data?.walletId)
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login: string;
}


export class TransferRewardDto {
   @ApiProperty({ example: 10 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;
}

export class CreateTransferDto {
  @ApiProperty({ type: () => TransferDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TransferDto)
  transferIn: TransferDto;

  @ApiProperty({ type: () => TransferDto })
  @IsObject()
  @ValidateNested()
  @Type(() => TransferDto)
  transferOut: TransferDto;

  @ApiProperty({ example: 10 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: 'User comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  commentForUser?: string;

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
