import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TranslationDto {
  @ApiProperty({ example: 'name', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  fieldName: string;

  @ApiProperty({ example: 'en', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  languageCode: string;

  @ApiProperty({ example: 'Regulation Name', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  translationText: string;
}

export class CreateRegulationDto {
  @ApiProperty({ example: 'Regulation Name', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: '12345', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  postalCode: string;

  @ApiProperty({ example: 'https://www.regulation-website.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  website: string;

  @ApiProperty({ example: 'Company Name', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  companyName: string;

  @ApiProperty({ example: 'South Africa', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  regulatedCountry: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  licenseLabelId: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({},{ message: i18nValidationMessage('validation.IS_NUMBER') })
  regulatedByLabelId: number;

  @ApiProperty({ example: 'example', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  domain: string;

  @ApiProperty({ example: 'https://www.regulation-website.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  clientportal_url: string;

  @ApiProperty({ example: 'host', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  smtp_host: string;

  @ApiProperty({ example: 'port', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  smtp_port: string;

  @ApiProperty({ example: 'smtp_username', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  smtp_username: string;

  @ApiProperty({ example: 'smtp pwd', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  smtp_password: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  smtp_secure: boolean;

  @ApiProperty({ example: 'no-reply@example.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  from_email: string;

  @ApiProperty({ example: '+123456789', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  contact: string;

  @ApiProperty({ example: 'logo.png', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  logo: string;


  @ApiProperty({ example: 'subDomain', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subDomain: string;

  @ApiProperty({
    example: ['US', 'CA', 'DE'],
    description: 'Array of domain extensions',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true, message: 'Each domain extension must be a string' })
  domainExtension: string[];

  // @ApiProperty({
  //   example: ['US', 'CA', 'DE'],
  //   description: 'Array of blocked country ISO codes',
  //   required: false,
  // })
  // @IsOptional()
  // @IsArray()
  // @IsString({ each: true, message: 'Each country code must be a string' })
  // blockedCountries: string[];

  @ApiProperty({
    description: 'Array of translations',
    type: [TranslationDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}

export class BlockCountriesDto {
  
  @ApiProperty({
    description: 'Country code to be blocked',
    example: 'US',
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  countryCode: string;
}

export class UnBlockCountriesDto extends PartialType(BlockCountriesDto) {
  @IsString()
  @IsNotEmpty()
  countryCode: string;
 }

export class UpdateRegulationDto extends PartialType(CreateRegulationDto) { }

export enum RegulationEmailEvent {
  TEST_SMTP = 'TEST_SMTP_CONFIG',
}




