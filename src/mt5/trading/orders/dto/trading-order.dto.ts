import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class OrderPagedDto {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  login: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  to: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  offset: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  total: string;
}

export class OrderTicketsDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  ticket: string;
}

export class TradingTotalDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  login: string;
}

export class OrderOpenPagedDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  login: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  offset: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  total?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  symbol?: string;
}

export class OrderMultipleOpenDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  login: string[];

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  group: string[];

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  ticket: string[];

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  symbol: string[];
}

export class ClosedDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  login: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to: string;
}

export class GetBackupListDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  server: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to: string;
}

export class GetBackupDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  backup: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  login: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  server: string;
}
export class UpdateOrderDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  Order: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ExternalID?: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  Login: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Dealer?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  Symbol?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  Digits?: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  DigitsCurrency?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  ContractSize?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  State?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Reason?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TimeSetup?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TimeExpiration?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TimeDone?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Type?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TypeFill?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TypeTime?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PriceOrder?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PriceTrigger?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PriceCurrent?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PriceSL?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PriceTP?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  VolumeInitial?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  VolumeInitialExt?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  VolumeCurrent?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  VolumeCurrentExt?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ExpertID?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PositionID?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PositionByID?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  Comment?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ActivationMode?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ActivationTime?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ActivationPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ActivationFlags?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TimeSetupMsc?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TimeDoneMsc?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  RateMargin?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ModificationFlags?: number;
}

export class CancelOrderDto {
  @ApiProperty()
  @IsString()
  @Type(() => String)
  orderId: string;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  demo: boolean;
}
