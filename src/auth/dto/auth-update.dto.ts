import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { IsExist } from '../../utils/validators/is-exists.validator';
import { FileEntity } from '../../files/entities/file.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Status } from 'src/statuses/entities/status.entity';
import { Exclude, Type } from 'class-transformer';
import { LanguageType } from 'src/users/entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AccountClassification } from 'src/users/entities/client.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';

class AnswerDto {
  @ApiProperty({ example: 500 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  Aid: number;

  @ApiProperty({ example: 'male' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  answerText: string;
}

class QuestionDto {
  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  Qid: number;

  @ApiProperty({ example: 'What is your gender?' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  questionText: string;

  @ApiProperty({ type: () => [AnswerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answer: AnswerDto[];
}

class AgreementDataDto {
  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  Aid: number;

  @ApiProperty({ example: 'What is your gender?' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  amswerText: string;
}

export class AuthUpdateDto {
  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  fullName?: string;

  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Matches(/^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/, {
    message: i18nValidationMessage('validation.INVALID_NAME_FORMAT'),
  })
  @MinLength(3)
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Matches(/^[a-zA-ZÀ-ÿ\u0600-\u06FF\s'-]+$/, {
    message: i18nValidationMessage('validation.INVALID_NAME_FORMAT'),
  })
  @MinLength(3)
  lastName?: string;

  @ApiProperty({ example: 'john@email.com' })
  @IsOptional()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  affId?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: '+971' })
  @IsOptional()
  telephonePrefix?: string;

  @Exclude()
  role?: Role | null;

  @Exclude()
  status?: Status;

  hash?: string | null;

  @ApiProperty({ example: '234567891' })
  @IsOptional()
  telephone?: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsOptional()
  dob?: Date;

  @ApiProperty({ example: '3150 Dubai Tower' })
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Dubai' })
  @IsOptional()
  city?: string;

  @ApiProperty({ example: 'Emirati' })
  @IsOptional()
  nationality?: string;

  @ApiProperty({ example: '00000' })
  @IsOptional()
  state?: string;

  @ApiProperty({ example: 'United Arabs Emirates' })
  @IsOptional()
  country?: string;

  @ApiProperty({ example: 'AE' })
  @IsOptional()
  countryIso?: string;

  @ApiProperty({ example: 'AR' })
  @IsOptional()
  languageIso?: LanguageType;

  @ApiProperty()
  @IsOptional()
  groupString?: string;

  @ApiProperty()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsOptional()
  id2?: string;

  @ApiProperty()
  @IsOptional()
  poBox?: string;

  @ApiProperty()
  @IsOptional()
  zip?: string;

  @ApiProperty()
  @IsOptional()
  kycNote?: string;

  @ApiProperty()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty()
  @IsOptional()
  telephoneValid?: boolean;

  @ApiProperty({ type: () => [QuestionDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  question2?: QuestionDto[];

  @ApiProperty({ type: () => [AgreementDataDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AgreementDataDto)
  agreementData?: AgreementDataDto[];

  @ApiProperty({ example: 'dummy text' })
  @IsOptional()
  userSignature?: string;

  @ApiProperty({ example: '+971 55 145 4388' })
  @IsOptional()
  mobile?: string;

  @ApiProperty()
  @IsOptional()
  questionAnswers?: string;

  @Exclude()
  userType?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  partnerTypeId?: number;

  @ApiProperty({ example: 'Individual Client (IC)' })
  @IsOptional()
  @IsString()
  partnerType?: string;

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
  utmSource?: string;

  @ApiProperty()
  @IsOptional()
  source?: string;

  @ApiProperty()
  @IsOptional()
  utmMedium?: string;

  @ApiProperty()
  @IsOptional()
  utmCampaign?: string;

  @ApiProperty()
  @IsOptional()
  utmContent?: string;

  @ApiProperty()
  @IsOptional()
  utmTerm?: string;

  @Exclude()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  isSwapFree?: boolean;

  @ApiProperty()
  @IsOptional()
  campaignQuestions?: string;

  @ApiProperty()
  @IsOptional()
  isBlockEmails?: boolean;

  @ApiProperty({ example: 'FSCA' })
  @IsOptional()
  regulations?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  regulation?: number;

  @ApiProperty()
  @IsOptional()
  totp?: boolean;

  @ApiProperty()
  @IsOptional()
  mobileOtp?: boolean;

  @ApiProperty()
  @IsOptional()
  emailOtp?: boolean;

  @ApiProperty()
  @IsOptional()
  isTotpDefault?: boolean;

  @ApiProperty()
  @IsOptional()
  isMobileOtpDefault?: boolean;

  @ApiProperty()
  @IsOptional()
  isEmailOtpDefault?: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  commissionProfileId?: number;

  @ApiProperty({ example:AccountClassification.STANDARD })
  @IsOptional()
  @IsString()
  accountClassification?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isFirstTimeNameChange?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isPhoneCountryChanged?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  typeIb?: boolean;
}
