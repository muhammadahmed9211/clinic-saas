import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateClientRequest {
  @ApiProperty()
  // @IsOptional()
  // @IsEnum(ClientTypeId)
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ClientType: string; // Integer?: Client type. Passed as the ClientTypeId enumeration value

  @ApiProperty()
  // @IsOptional()
  // @IsEnum(ClientStatus, {
  //   message?: 'Client status must be valid',
  // })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ClientStatus: string; // Integer?: Client status. Passed as the ClientStatus enumeration value

  @ApiProperty()
  // @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ClientExternalID: string; // String?: Client ID in the external trading system

  @ApiProperty()
  // @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonName: string; // String?: Client's name

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Server: string;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Currency: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AssignedManager?: string; // Integer?: The manager responsible for the client

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  RecordID?: string; // Integer?: Client ID

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Comment?: string; // String?: A comment to a client

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ComplianceApprovedBy?: string; // Integer?: The manager who checked the client data and approved registration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ComplianceClientCategory?: string; // String?: Client compliance category — client classification based on the regulator rules

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ComplianceDateApproval?: string; // Integer?: Client approval date

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ComplianceDateTermination?: string; // Integer?: The date of service termination for the client

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LeadCampaign?: string; // String?: Lead campaign — the name of an advertising campaign the client was attracted by

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  LeadSource?: string; // String?: Lead source — a website the client has come from

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  Introducer?: string; // String?: The login (trading account) of the user who attracted this client

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonTitle?: string; // String?: Client's title, such as Mr. or Mrs

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonMiddleName?: string; // String?: Client's middle name

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonLastName?: string; // String?: Client's last name

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonBirthDate?: string; // Integer?: Client's date of birth. Specified in the FILETIME format

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonCitizenship?: string; // String?: Client's citizenship

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonGender?: string; // Integer?: Client's gender. Passed as a value of the EnGender enumeration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonTaxID?: string; // String?: Client's tax ID, for example TIN

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonDocumentType?: string; // String?: Client's identification document type?: passport, driver's license, etc

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonDocumentNumber?: string; // String?: The number of the identification document (of passport, driver's license, etc)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonDocumentDate?: string; // Integer?: The issue date of the identification document (of passport, driver's license, etc)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonDocumentExpiration?: string; // Integer?: The expiration date of the identification document (of passport, driver's license, etc)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonDocumentExtra?: string; // String?: Additional information (comment) to the identification document

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonEmployment?: string; // Integer?: Client's employment status. Passed as a value from the EnEmployment enumeration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonIndustry?: string; // Integer?: Client's employment industry. Passed as a value from the EnEmploymentIndustry enumeration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonEducation?: string; // Integer?: Client's education level. Passed as a value from the EnEducationLevel enumeration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonWealthSource?: string; // Integer?: Client's income source. Passed as a value from from the EnWealthSource enumeration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonAnnualIncome?: string; // Float?: Client's annual income amount

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonNetWorth?: string; // Float?: The amount of the client's net assets

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  PersonAnnualDeposit?: string; // Float?: The amount of the client's annual deposit

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyName?: string; // String?: Company name (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyRegNumber?: string; // String?: Company registration number (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyRegDate?: string; // Integer?: Company registration date (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyRegAuthority?: string; // String?: The name of the registration authority with which the company is registered (for corporate body)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyVat?: string; // String?: VAT number (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyLei?: string; // String?: LEI number for EMIR reports (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyLicenseNumber?: string; // String?: License number (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyLicenseAuthority?: string; // String?: The name of the licensing authority (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyCountry?: string; // String?: Company registration country (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyAddress?: string; // String?: Legal address of the company (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  CompanyWebsite?: string; // String?: Website address (for corporate clients)

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ContactPreferred?: string; // Integer?: Client's preferred contact method. Passed as a value of the EnPreferredCommunication enumeration

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ContactLanguage?: string; // String?: The language spoken by the client

  @ApiProperty()
  @IsOptional()
  ContactEmail?: string; // String?: Client's email address

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ContactPhone?: string; // String?: Client's phone number

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ContactMessengers?: string; // String?: List of the client's accounts in instant messengers

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ContactSocialNetworks?: string; // String?: List of the client's accounts in social networks

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ContactLastDate?: string; // Integer?: Date of the last client contact

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AddressCountry?: string; // String?: Client's country of residence

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AddressPostcode?: string; // String?: Client's zip code

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AddressStreet?: string; // String?: Client's address

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AddressState?: string; // String?: Client's region of residence

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  AddressCity?: string; // String?: Client's city of residence

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ExperienceFX?: string; // Integer?: Information about the client's Forex trading experience

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ExperienceCFD?: string; // Integer?: Information about the client's CFD trading experience

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ExperienceFutures?: string; // Integer?: Information about the client's Futures trading experience

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ExperienceStocks?: string; // Integer?: Information about the client's Stock trading experience

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  TradingGroup?: string; // String?: Preferred trading group for the client

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ClientOrigin?: string; // Integer?: Client record creation method

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  ClientOriginLogin?: string; // Integer?: The trading account number, based on which the client was created

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  KYCApplicantSumSub?: string; // String?: Client's ID in the SumSub KYC-system
}
