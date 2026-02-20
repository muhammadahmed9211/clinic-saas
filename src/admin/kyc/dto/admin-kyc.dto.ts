import {
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  ArrayMinSize,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LanguageType } from 'src/users/entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum KycTemplateNames {
  KYC_FOLLOW_UP = 'KYC_FOLLOW',
  KYC_PAYMENT_REJECTION = 'KYC_PAYMENT_REJECTION',
  KYC_REJECTION = 'KYC_REJECTION',
  KYC_NOT_STARTED = 'KYC_NOT_STARTED',
  KYC_REJECTION_ID = 'KYC_REJECTION_ID',
  KYC_REJECTION_RESIDENCY = 'KYC_REJECTION_RESIDENCY',
  KYC_UNDER_REVIEW = 'KYC_UNDER_REVIEW',
}

export enum KycTemplateSubject_EN {
  KYC_FOLLOW_UP = 'You are one step away from online trading!',
  KYC_PAYMENT_REJECTION = 'Action Required: Update Your Proof of Payment for KYC',
  KYC_REJECTION = 'Action Required: Update KYC Documents for Your Trading Account',
  KYC_NOT_STARTED = 'Account Verification Required - Important Action Needed',
  KYC_REJECTION_ID = 'Action Required: Update Your Proof of Identity for KYC',
  KYC_REJECTION_RESIDENCY = 'Action Required: Update Your Proof of Residency for KYC',
  KYC_UNDER_REVIEW = 'Thank You for Uploading Your Document',
}

export enum KycTemplateSubject_AR {
  KYC_FOLLOW_UP = 'أنت على بعد خطوة واحدة من التداول عبر الإنترنت!',
  KYC_PAYMENT_REJECTION = 'إجراء مطلوب: تحديث بيانات إثبات الدفع الخاص مع ماليات',
  KYC_REJECTION = 'تحديث حالة طلب إعرف عميلك KYC الخاص بك',
  KYC_NOT_STARTED = 'مطلوب تأكيد الحساب - يلزم اتخاذ إجراء مهم',
  KYC_REJECTION_ID = 'إجراء مطلوبه: تحديث مستندات اعرف عميلك KYC الخاص بك',
  // eslint-disable-next-line
  KYC_REJECTION_RESIDENCY = 'إجراء مطلوبه: تحديث مستندات اعرف عميلك KYC الخاص بك',
  KYC_UNDER_REVIEW = 'شكرًا لك على تحميل المستندات الخاص بك',
}

class FieldValueDto {
  @ApiProperty({ example: 'new_value' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  id: string;

  @ApiProperty({ example: 'New Value' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  label: string;

  @ApiProperty({ example: 'Upload New Document' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;
}

class MetaDataDto {
  @ApiProperty({ example: 'Asset Document' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  field_name: string;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsBoolean()
  is_dropdown: boolean;

  @ApiProperty({ type: [FieldValueDto] })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FieldValueDto)
  field_values: FieldValueDto[];
}

export class CreateDocumentDto {
  @ApiProperty({ example: 'Car Document' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'This is a new car document.' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;

  @ApiProperty({ type: MetaDataDto })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ValidateNested()
  @Type(() => MetaDataDto)
  meta_data: MetaDataDto;

  @IsEnum(LanguageType, {
    message: 'Language must be one of EN, AR, or default to EN if not provided',
  })
  @ApiProperty({
    example: 'EN',
    description: 'The language of the question.',
  })
  languageIso: LanguageType;
}

export class IbAggrementsDto {
  @ApiProperty({ example: false, required: false })
  @IsOptional()
  isPartner?: boolean;
}

export enum NotesType {
  KYC_DOC = 'KYC_DOC',
  KYC_GENERAL = 'KYC_GENERAL',
  PARTNER_GENERAL = 'PARTNER_GENERAL',
  KYC_PAYMENT = 'KYC_PAYMENT',
  LEAD_DEAL = 'LEAD_DEAL',
  LEAD_GENERAL = 'LEAD_GENERAL',
  LEAD_INBOUND = 'LEAD_INBOUND',
  LEAD_OUTBOUND = 'LEAD_OUTBOUND',
  LEAD_MEETING = 'LEAD_MEETING',
  TRANSACTION_NOTE = 'TRANSACTION_NOTE',
  TICKET_GENERAL= 'TICKET_GENERAL'
}

export enum LeadNotesType {
  LEAD_DEAL = 'LEAD_DEAL',
  LEAD_GENERAL = 'LEAD_GENERAL',
  LEAD_INBOUND = 'LEAD_INBOUND',
  LEAD_OUTBOUND = 'LEAD_OUTBOUND',
  LEAD_MEETING = 'LEAD_MEETING',
   TICKET_GENERAL= 'TICKET_GENERAL'
}

export class CreateKycNoteDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  user_id: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  partner_id: number;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({ enum: NotesType })
  @IsEnum(NotesType)
  type: NotesType;

  @ApiProperty({ example: 'This is a new note.' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  note: string;

  @ApiProperty({ example: '18FB423E-F36B-1410-80DD-00B820E2FA85' })
  @IsOptional()
  @IsUUID()
  file_id: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  user_kyc_document_id: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  ticket_id: number;
}

export class UpdateKycNoteDto {
  @ApiProperty({ example: 'This is a new note.' })
  @IsOptional()
  note?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ example: '18FB423E-F36B-1410-80DD-00B820E2FA85' })
  @IsOptional()
  @IsUUID()
  file_id?: string;
}

export class GetKycNotesDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({ enum: NotesType })
  @IsEnum(NotesType)
  type: NotesType;

  @ApiPropertyOptional()
  @IsOptional()
  documentId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  ticketId?: number;
}

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsOptional()
  limit: number;
}

export class GetAllKycDocsDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId?: number;
}

export class KYCEmailDto {
  title: string;
  template: KycTemplateNames;
  data?: object;
  userId?: number;
  phone?: string;
  message?: string;
  otherReason?: string;
}
