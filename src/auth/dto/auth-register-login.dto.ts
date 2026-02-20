import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ActiveStatus } from 'src/settings/entities/partner.entity';
import { AddAnswerDto } from 'src/admin/leads/dto/add-answer.dto';
import { AccountClassification } from 'src/users/entities/client.entity';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Matches(/^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/, {
    message: i18nValidationMessage('validation.INVALID_NAME_FORMAT'),
  })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Matches(/^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/, {
    message: i18nValidationMessage('validation.INVALID_NAME_FORMAT'),
  })
  lastName: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ example: '3222152033' })
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: '92' })
  @IsOptional()
  telephonePrefix?: string;

  @ApiProperty({ example: 1 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  verificationId: number;

  @ApiProperty({ example: 'PK' })
  @IsOptional()
  @MinLength(2, { message: i18nValidationMessage('validation.MIN') })
  countryIso?: string;

  @ApiProperty({ example: 'EN' })
  @IsOptional()
  @MinLength(2, { message: i18nValidationMessage('validation.MIN') })
  languageIso?: string;

  @ApiProperty({ example: 'English', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'Pakistan' })
  @IsOptional()
  country?: string;

  @ApiProperty({ example: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  demo: boolean;

  @ApiProperty({ example: '136AE8BB-AF7E-4B38-AF66-FB9AF917D60F' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  affid: string;

  @ApiProperty({ example: 'Direct on Company Website' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  sc: string;

  @ApiProperty({ example: '657aa94dd779947f58947212' })
  @MinLength(10, { message: i18nValidationMessage('validation.MIN') })
  id2: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  userType: number;

  @ApiProperty({ example: 'standard-account' })
  p1: string;

  @ApiProperty()
  @IsOptional()
  p2?: string;

  @ApiProperty()
  @IsOptional()
  p3?: string;

  @ApiProperty()
  @IsOptional()
  p4?: string;

  @ApiProperty()
  @IsOptional()
  p5?: string;

  @ApiProperty()
  @IsOptional()
  p6?: string;

  @ApiProperty()
  @IsOptional()
  pu?: boolean;

  @ApiProperty()
  @IsOptional()
  partnerId?: number;

  @ApiProperty()
  @IsOptional()
  utmSource?: string;

  @ApiProperty()
  @IsOptional()
  utmMedium?: string;

  @ApiProperty()
  @IsOptional()
  utmCampaign?: string;

  @ApiProperty()
  @IsOptional()
  campaignId?: string;

  @ApiProperty()
  @IsOptional()
  utmContent?: string;

  @ApiProperty()
  @IsOptional()
  utmTerm?: string;

  @ApiProperty({ example: false })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  isBroker: boolean = false;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  partner_uuid: string;
  @ApiProperty({ example: '123', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  campaignQuestions?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isBlockEmails: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  partnerTypeId?: number;

  @ApiProperty({ example: 'FSCA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  regulations?: string;

  @ApiProperty({})
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  otpId?: number;

  @ApiProperty({ example: 'https://www.google.com' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  affiliateLinkUrl?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isCopyTrading: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  commissionProfileId?: number;
  
  @ApiProperty({ example: '136AE8BB-AF7E-4B38-AF66-FB9AF917D60F' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  refCode?: string;

  @ApiProperty({ example: '136AE8BB-AF7E-4B38-AF66-FB9AF917D60F' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  refUuid?: string;

  @ApiProperty({ example:AccountClassification.STANDARD })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  classification?: string;

  @ApiProperty({ example:346})
  @IsOptional()
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  partnerLinkId?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isPhoneCountryChanged?: boolean;
}

export class AuthRegisterBrokerDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  lastName: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsEmail({})
  email: string;

  @ApiProperty({ example: '3222152033' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  telephone: string;

  @ApiProperty({ example: '92' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  telephonePrefix: string;

  @ApiProperty({ example: 1 })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  verificationId: number;

  @ApiProperty({ example: 'PK' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @MinLength(2, { message: i18nValidationMessage('validation.MIN') })
  countryIso: string;

  @ApiProperty({ example: 'EN' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @MinLength(2, { message: i18nValidationMessage('validation.MIN') })
  languageIso: string;

  @ApiProperty({ example: 1002 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  partnerTypeId: number;

  @ApiProperty({ example: 'ACTIVE' })
  @IsEnum(ActiveStatus)
  status: ActiveStatus;

  password?: string;

  title?: string;

  contactName?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isCopyTrading: boolean;
}

export class AuthRegisterQueryDto {
  @ApiProperty({ example: 'key', required: false })
  @IsOptional()
  key: string;
}
