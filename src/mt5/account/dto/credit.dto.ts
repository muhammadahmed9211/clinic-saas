import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreditRequest {
  @IsNumber()
  @IsOptional()
  login: number;

  @ApiProperty({ required: true, example: 1 })
  @Min(1)
  @IsNumber()
  balance: number;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  internalNote: string;

  @ApiProperty({ example: 'Internal Reference' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalReferenceNo?: string;

  @ApiProperty({ example: 'Trading Platform Ref' })
  @IsOptional()
  @IsString()
  tradingPlatformId?: string;

  @ApiProperty({ example: 'Internal comment' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  internalComment?: string;

  @ApiProperty({ example: 'External Note' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalNote?: string;
}

export class CreditParam {
  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  id: string;
}

export class BonusCreditDto extends CreditRequest {
  @ApiProperty({ example: '6F24433E-F36B-1410-8F7A-001268AAE5F5' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  transactionId: string;
}
