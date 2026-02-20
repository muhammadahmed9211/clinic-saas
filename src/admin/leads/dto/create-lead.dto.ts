import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserLifeCycle } from 'src/utils/enums/user-lifecycle.enum';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { AddAnswerDto } from './add-answer.dto';

export class CreateLeadDto {
  //   @ApiProperty({ required: false, example: 'Client' })
  //   @Transform((type) => type.value.toLowerCase())
  //   @IsEnum(CallToUserType)
  //   callToUserType: CallToUserType;

  @ApiProperty({ required: false, example: 'Test Owner' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leadOwner?: string;

  @ApiProperty({ required: false, example: 'Test title' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  title?: string;

  @ApiProperty({ required: true, example: 'Test Business Type' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  typeOfBusiness?: string;

  @ApiProperty({ required: true, example: '4' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  noOfLocations?: string;

  @ApiProperty({ required: false, example: '43223222' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fax?: string;

  @ApiProperty({ required: false, example: '021 3576278' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  phoneNumber?: string;

  @ApiProperty({ required: false, example: '971' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  telephonePrefix?: string;

  @ApiProperty({ required: false, example: '3576278' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  telephone?: string;

  @ApiProperty({ required: false, example: '03342576278' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  mobile?: string;

  @ApiProperty({ required: true, example: 'Test Source' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leadSource?: string;

  @ApiProperty({ required: false, example: 'Client' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  source?: string;

  @ApiProperty({ required: false, example: 'Test industury' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  industury?: string;

  @ApiProperty({ required: false, example: 'Test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  annualOptOut?: string;

  @ApiProperty({ required: false, example: 'Test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  emailOptOut?: string;

  @ApiProperty({ required: false, example: 'Test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  modifiedBy?: string;

  @ApiProperty({ required: true, example: 'Test companyName' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  companyName?: string;

  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  firstName?: string;

  @ApiProperty({ required: true, example: 'Doe' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  lastName?: string;

  @ApiProperty({ required: false, example: 'example@gmail.com' })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  email: string;

  @ApiProperty({ required: false, example: 'www.test.com' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  website?: string;

  @ApiProperty({ required: true, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  salesDeskId?: number;

  @ApiProperty({ required: true, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  salesRepId?: number;

  @ApiProperty({ required: false, example: 'Sales Rep' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  salesRep?: string;

  @ApiProperty({ required: true, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  salesPartnerId?: number;

  @ApiProperty({ required: true, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  salesOfficeId?: number;

  @ApiProperty({ required: true, example: '1' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  salesStatusId?: number;

  @ApiProperty({ required: true, example: '84' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  leadStatusId?: number;

  @ApiProperty({ required: false, example: '100' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  noOfEmployees?: string;

  @ApiProperty({ required: false, example: '4.2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  rating?: string;

  @ApiProperty({ required: false, example: 'Test User' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  createdBy?: string;

  @ApiProperty({ required: false, example: 'Test1234' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  skypeID?: string;

  @ApiProperty({ required: false, example: 'test@gmail.com' })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  secondaryEmail?: string;

  @ApiProperty({ required: false, example: 'TestTwitter' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  twitter?: string;

  @ApiProperty({ required: false, example: 'Test Street no. 32' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  streetAddress?: string;

  @ApiProperty({ required: false, example: 'Sindh' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  state?: string;

  @ApiProperty({ required: false, example: 'Test Owner' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  addresssLastName?: string;

  @ApiProperty({ required: false, example: 'Karachi' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  city?: string;

  @ApiProperty({ required: false, example: '74500' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  zipCode?: string;

  @ApiProperty({ required: false, example: '3' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  addressNoOfLocations?: string;

  @ApiProperty({ required: false, example: 'Streeet # 4' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  infoStreet?: string;

  @ApiProperty({ required: false, example: 'Test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  affiliate?: string;

  @ApiProperty({ required: false, example: '921' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  vistID?: string;

  @ApiProperty({ required: false, example: 'customParam1' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p1?: string;

  @ApiProperty({ required: false, example: 'customParam2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p2?: string;

  @ApiProperty({ required: false, example: 'customParam3' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p3?: string;

  @ApiProperty({ required: false, example: 'customParam4' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p4?: string;

  @ApiProperty({ required: false, example: 'customParam5' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p5?: string;

  @ApiProperty({ required: false, example: 'customParam6' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  p6?: string;

  @ApiProperty({ required: false, example: 'customParam6' })
  @IsOptional()
  @IsBoolean()
  pu?: boolean;

  @ApiProperty({ required: false, example: '2024-06-04 12:25:48.136' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  registrationDate?: Date;

  @ApiProperty({ required: false, example: 'Iphone' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  registrationDevice?: string;

  @ApiProperty({ required: false, example: '192.23.12.2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  registrationIP?: string;

  @ApiProperty({ required: false, example: '2024-06-04 12:25:48.136' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  lastCommunication?: Date;

  @ApiProperty({ required: false, example: '2024-06-04 12:25:48.136' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  lastUpdate?: Date;

  @ApiProperty({ required: false, example: 'xyz' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  utmSource?: string;

  @ApiProperty({ required: false, example: 'test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  utmCampaign?: string;

  @ApiProperty({ required: false, example: 'test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  campaignQuestions?: string;

  @ApiProperty({ required: false, example: '2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  utmTerm?: string;

  @ApiProperty({ required: false, example: 'Test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  utmMedium?: string;

  @ApiProperty({ required: false, example: 'Test' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  utmContent?: string;

  @ApiProperty({ required: false, example: '012' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  campaignID?: string;

  @ApiProperty({ required: false, example: '192' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  clientID?: string;

  @ApiProperty({ required: false, example: '1.4' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  leadGrading?: string;

  @ApiProperty({ required: false, example: 'Manager' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  designation?: string;

  @ApiProperty({ required: false, example: '20000' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  expectedInvestment?: string;

  @ApiProperty({ required: false, example: 'Pakistan' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  country?: string;

  @ApiProperty({ required: false, example: 'Pakistan' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  countryIso?: string;

  @ApiProperty({ required: false, example: 'English' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language?: string;

  @ApiProperty({ required: false, example: 'EN' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  languageIso?: string;

  @ApiProperty({ required: false, example: 'English' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  speakingLanguage?: string;

  @ApiProperty({ required: false, example: '14:25:00' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  localTime?: string;

  @ApiProperty({ required: false, example: '14:25:00' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  preferredTime?: string;

  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  salesManager?: string;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  dateOfBirth?: Date;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  appRegistration?: string;

  @ApiProperty({ required: false, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  appsFlyerId?: number;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  queryString?: string;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  affiliateLinkUrl?: string;

  @ApiProperty({ required: true, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  affiliateLinkId?: number;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  externalId?: string;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ip?: string;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  creationTime?: Date;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  tracking?: string;

  @ApiProperty({ required: false, example: '67' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  clickId?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  partner_uuid?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(UserLifeCycle)
  userLifeCycle?: UserLifeCycle;

  @ApiProperty({ required: false, example: '47' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  kycStatus?: number;

  @ApiProperty({ required: false, example: 'Demo' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  type?: string;

  @ApiProperty({ required: false, example: 'IT' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  industry?: string;

  @ApiProperty({ required: false, example: 'Yes' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  callOptOut?: string;

  @ApiProperty({ required: false, example: 'FSCA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  regulations?: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  regulationId?: number;

  @ApiProperty({ required: false, example: '2' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  totalDeposits?: string;

  @ApiProperty({ required: false, example: '2024-06-04' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  registeredCreatedTime?: Date;

  @ApiProperty({
    type: [AddAnswerDto],
    example: [
      {
        questionId: 1,
        key: 'how_did_you_hear_about_us',
        question: 'How did you hear about us?',
        answer: 'Social Media',
      },
      {
        questionId: 2,
        key: 'experience_level',
        question: 'Experience level',
        answer: '1 Year',
      },
    ],
    required: false,
  })
  @IsOptional()
  customQuestion?: AddAnswerDto[];
}


export class TelephoneExistLeadDto {
  @ApiProperty({ required: false, example: '971' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  telephonePrefix?: string;

  @ApiProperty({ required: false, example: '3576278' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  telephone?: string;
}
