import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsUUID,
  IsBoolean,
  IsArray,
  IsNumber,
  ValidateIf,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';


export class BankInfoDto {
  @ApiProperty({ example: 'ABCDUS33' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  swift: string; // Swift Number

  @ApiProperty({ example: '123 Main St, Anytown, USA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  bankAddress: string; // Bank Address

  @ApiProperty({ example: '456 Main St, Anytown, USA' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  companyAddress: string; // Company Address

  @ApiProperty({ example: 'Additional information' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  additionalInformation: string; // Additional Note(Exteral)

  @ApiProperty({ example: 'Intermediate Bank' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  intermediateBankName: string; //Intermediate Bank Name

  @ApiProperty({ example: '789012' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  branchCode: string; // Branch Code

  @ApiProperty({ example: '123456789' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  reference: string; // Reference

  @ApiProperty({ example: '123456' })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  zipCode: string; // Zip Code

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isLocalMethodsEnable: boolean; // Local Methods

  @ApiProperty({
    example: ['AE5F433E-F36B-1410-8523-00DD52555502'],
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @IsString({ each: true })
  methodsIds?: string[];  // Upload Your Payment Methods Logos

  @ApiProperty({ example: 1.23 })
  @ValidateIf((o) => o.currency !== 'USD')
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  conversionRate: number;
}

export class CreateBankAccountDto extends BankInfoDto {

  @ApiProperty({ example: 'Chase Bank' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  bankName: string; // Bank Name

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  accountName: string; // Account Title

  @ApiProperty({ example: '987654321' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  accountNumber: string; // Account Number

  @ApiProperty({ example: 'DE89370400440532013000' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  iban: string; // IBAN

  @ApiProperty({ example: 'Main Branch' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  branchName: string; //Branch Name

  @ApiProperty({ example: 'USD' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  country: string;  //Bank Country

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  sortCode: string; // Sort Code

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isClientVisible: boolean; // Enable Visibility in Client Area Also

  @ApiProperty({ example: 'AE5F433E-F36B-1410-8523-00DD52555502' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsUUID()
  logoId: string; // Upload Bank Logo

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isRegulationRestricted: boolean; // Is Regulation Restricted

  @ApiProperty({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNumber(
    { allowNaN: false },
    { each: true, message: i18nValidationMessage('validation.IS_INT') },
  )
  regulationsId: number[]; // Enable Regulation

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  isCountryRestricted: boolean; // Is Country Restricted

  @ApiProperty({ example: [1, 2, 3] })
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNumber(
    { allowNaN: false },
    { each: true, message: i18nValidationMessage('validation.IS_INT') },
  )
  countryIds: number[]; // Enable Countries

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber(
    { allowNaN: false },
    { each: true, message: i18nValidationMessage('validation.IS_INT') },
  )
  @Min(1)  
  currencyId: number;
}