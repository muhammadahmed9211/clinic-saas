import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum AccountTradingType {
  NORMAL = 'normal',
  COPY_TRADING = 'copy_trading',
}

export class CreateAccountRequest {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Group?: string;

  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Server: string;

  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Currency: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  PassMain?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  PassInvestor?: string;

  // @ApiProperty({
  //   required: true,
  // })
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // leverage?: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  Email: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Country?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Login?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  CertSerialNumber?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Rights?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  MQID?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Registration?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  LastAccess?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  LastPassChange?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  LastIP?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  FirstName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  LastName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  MiddleName?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Company?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Account?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Language?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  ClientID?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  City?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  State?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  ZipCode?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Address?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  @IsPhoneNumber()
  Phone?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  ID?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Status?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Comment?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Color?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  PhonePassword?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Leverage?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  Agent?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  LimitPositions?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  LimitOrders?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  CurrencyDigits?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  Balance?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  Credit?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  InterestRate?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  CommissionDaily?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  CommissionMonthly?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  CommissionAgentDaily?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  CommissionAgentMonthly?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  BalancePrevDay?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  BalancePrevMonth?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  EquityPrevDay?: string;

  @ApiProperty({
    required: false,
  })
  @IsNumberString()
  @IsOptional()
  EquityPrevMonth?: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  TradeAccounts?: string;

  @ApiProperty({
    required: false,
  })
  @Transform((type) => type.value.toLowerCase())
  @IsEnum(AccountTradingType)
  @IsOptional()
  TradingType?: AccountTradingType;
}
