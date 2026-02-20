import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsNumberString,
  IsPhoneNumber,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateAccountParam {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login: string;
}

export class UpdateAccountRequest {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Name: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Group: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PassMain: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PassInvestor: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leverage: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  Email: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Country: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Login: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CertSerialNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Rights: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  MQID: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Registration: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LastAccess: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LastPassChange: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LastIP: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  FirstName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LastName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  MiddleName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Company: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Account: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Language: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ClientID: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  City: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  State: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ZipCode: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Address: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsPhoneNumber()
  Phone: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ID: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Status: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Comment: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Color: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PhonePassword: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Leverage: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Agent: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LimitPositions: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LimitOrders: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  CurrencyDigits: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  Balance: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  Credit: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  InterestRate: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  CommissionDaily: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  CommissionMonthly: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  CommissionAgentDaily: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  CommissionAgentMonthly: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  BalancePrevDay: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  BalancePrevMonth: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  EquityPrevDay: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  EquityPrevMonth: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  TradeAccounts: string;
}

export class ChangeLeverageRequest {
  @ApiProperty({
    required: false,
    example: '500',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leverage: string;
}
