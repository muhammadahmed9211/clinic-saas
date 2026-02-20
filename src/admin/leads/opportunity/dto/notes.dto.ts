import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { LeadNotesType, NotesType } from 'src/admin/kyc/dto/admin-kyc.dto';

export class CreateLeadNoteDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  lead_id?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  user_id?: number;

  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({ enum: NotesType })
  @IsEnum(NotesType)
  type: NotesType;

  @ApiProperty({ example: 'This is a new note.' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  note: string | undefined;

  @ApiProperty({ example: '18FB423E-F36B-1410-80DD-00B820E2FA85' })
  @IsOptional()
  @IsUUID()
  file_id?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  opportunity_id?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  call_id?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  meeting_id?: number;

  @ApiProperty({ required: false, example: '1' })
  @IsOptional()
  relatedToId?: number;

  @ApiProperty({ required: false, example: 'deal' })
  @IsOptional()
  relatedToName?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  ticket_id?: number;
}

export class UpdateLeadNoteDto {
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

  @ApiProperty({ required: false, example: '1' })
  @IsOptional()
  relatedToId?: number;

  @ApiProperty({ required: false, example: 'deal' })
  @IsOptional()
  @Transform((type) => type.value.toLowerCase())
  relatedToName?: string;
}

export class GetLeadNotesDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({ enum: LeadNotesType })
  @IsEnum(LeadNotesType)
  type: LeadNotesType;

  @ApiPropertyOptional()
  @IsOptional()
  opportunity_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  meeting_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  call_id?: number;

  @ApiPropertyOptional()
  @IsOptional()
  ticket_id?: number;
}
