import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PositionSymbolDto {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  login: string;

  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  symbol: string;
}

export class PositionTotalDto {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  login: string;
}

export class PositionPagedDto {
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
  offset: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  total: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  to: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  symbol: string;
}

export class PositionPagedFromServerDto {
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
  offset: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  total: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  symbol: string;
}

export class PositionBackupDto {
  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  backup: string;

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
  server: string;
}

export class ApiDataDto {
  @ApiProperty({
    description: 'Application ID',
    example: 'APP123',
  })
  @IsString()
  AppID: string;

  @ApiProperty({
    description: 'Data ID',
    example: 'ID456',
  })
  @IsString()
  ID: string;

  @ApiProperty({
    description: 'Integer value',
    example: '100',
  })
  @IsString()
  ValueInt: string;

  @ApiProperty({
    description: 'Unsigned integer value',
    example: '200',
  })
  @IsString()
  ValueUInt: string;

  @ApiProperty({
    description: 'Double value',
    example: '123.45',
  })
  @IsString()
  ValueDouble: string;
}

export class TradingPositionDto {
  @ApiProperty({
    description: 'Position identifier',
    example: 'POS123456',
  })
  @IsString()
  Position: string;

  @ApiProperty({
    description: 'External ID',
    example: 'EXT789',
  })
  @IsString()
  @IsOptional()
  ExternalID?: string;

  @ApiProperty({
    description: 'Login identifier',
    example: 'user123',
  })
  @IsString()
  Login: string;

  @ApiProperty({
    description: 'Dealer name',
    example: 'DEALER1',
  })
  @IsString()
  @IsOptional()
  Dealer?: string;

  @ApiProperty({
    description: 'Trading symbol',
    example: 'EURUSD',
  })
  @IsString()
  @IsOptional()
  Symbol?: string;

  @ApiProperty({
    description: 'Trading action (BUY/SELL)',
    example: 'BUY',
  })
  @IsString()
  @IsOptional()
  Action?: string;

  @ApiProperty({
    description: 'Number of decimal digits for prices',
    example: '5',
  })
  @IsString()
  @IsOptional()
  Digits?: string;

  @ApiProperty({
    description: 'Number of decimal digits for currency',
    example: '2',
  })
  @IsString()
  @IsOptional()
  DigitsCurrency?: string;

  @ApiProperty({
    description: 'Reason for position',
    example: 'REASON_CLIENT',
  })
  @IsString()
  @IsOptional()
  Reason?: string;

  @ApiProperty({
    description: 'Contract size',
    example: '100000',
  })
  @IsString()
  @IsOptional()
  ContractSize?: string;

  @ApiProperty({
    description: 'Position creation time (timestamp)',
    example: '1640995200',
  })
  @IsString()
  @IsOptional()
  TimeCreate?: string;

  @ApiProperty({
    description: 'Position update time (timestamp)',
    example: '1640998800',
  })
  @IsString()
  @IsOptional()
  TimeUpdate?: string;

  @ApiProperty({
    description: 'Position creation time in milliseconds',
    example: '1640995200000',
  })
  @IsString()
  @IsOptional()
  TimeCreateMsc?: string;

  @ApiProperty({
    description: 'Position update time in milliseconds',
    example: '1640998800000',
  })
  @IsString()
  @IsOptional()
  TimeUpdateMsc?: string;

  @ApiProperty({
    description: 'Modification flags',
    example: '0',
  })
  @IsString()
  @IsOptional()
  ModifyFlags?: string;

  @ApiProperty({
    description: 'Opening price',
    example: '1.13250',
  })
  @IsString()
  @IsOptional()
  PriceOpen?: string;

  @ApiProperty({
    description: 'Current market price',
    example: '1.13350',
  })
  @IsString()
  @IsOptional()
  PriceCurrent?: string;

  @ApiProperty({
    description: 'Stop Loss price',
    example: '1.13000',
  })
  @IsString()
  @IsOptional()
  PriceSL?: string;

  @ApiProperty({
    description: 'Take Profit price',
    example: '1.14000',
  })
  @IsString()
  @IsOptional()
  PriceTP?: string;

  @ApiProperty({
    description: 'Position volume',
    example: '1.00',
  })
  @IsString()
  @IsOptional()
  Volume?: string;

  @ApiProperty({
    description: 'Extended volume information',
    example: '100000',
  })
  @IsString()
  @IsOptional()
  VolumeExt?: string;

  @ApiProperty({
    description: 'Current profit/loss',
    example: '100.50',
  })
  @IsString()
  @IsOptional()
  Profit?: string;

  @ApiProperty({
    description: 'Swap/storage fee',
    example: '-5.00',
  })
  @IsString()
  @IsOptional()
  Storage?: string;

  @ApiProperty({
    description: 'Profit conversion rate',
    example: '1.00000',
  })
  @IsString()
  @IsOptional()
  RateProfit?: string;

  @ApiProperty({
    description: 'Margin conversion rate',
    example: '1.00000',
  })
  @IsString()
  @IsOptional()
  RateMargin?: string;

  @ApiProperty({
    description: 'Expert advisor ID',
    example: '12345',
  })
  @IsString()
  @IsOptional()
  ExpertID?: string;

  @ApiProperty({
    description: 'Expert advisor position ID',
    example: '67890',
  })
  @IsString()
  @IsOptional()
  ExpertPositionID?: string;

  @ApiProperty({
    description: 'Position comment',
    example: 'Manual trade',
  })
  @IsString()
  @IsOptional()
  Comment?: string;

  @ApiProperty({
    description: 'Activation mode for pending orders',
    example: 'ACTIVATION_SL',
  })
  @IsString()
  @IsOptional()
  ActivationMode?: string;

  @ApiProperty({
    description: 'Activation time for pending orders',
    example: '1641000000',
  })
  @IsString()
  @IsOptional()
  ActivationTime?: string;

  @ApiProperty({
    description: 'Activation price for pending orders',
    example: '1.13500',
  })
  @IsString()
  @IsOptional()
  ActivationPrice?: string;

  @ApiProperty({
    description: 'Activation flags',
    example: '0',
  })
  @IsString()
  @IsOptional()
  ActivationFlags?: string;
}
