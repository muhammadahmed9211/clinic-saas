import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Lead } from '../../entities/lead.entity';
import { Meetings } from '../entities/meetings.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum Status {
  COMPLETE = 'COMPLETE',
  CANCEL = 'CANCEL',
  SCHEDULED = 'SCHEDULED', //by default
  PENDING_CONFIRMATION = 'PENDING CONFIRMATION',
}

export class CreateMeetingDto {
  @ApiProperty({
    example: 'Team Meeting',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    example: 'Conference Room 1',
  })
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  allDay: boolean;

  @ApiProperty({
    example: 'admin@outlook.com',
  })
  @IsString()
  @IsOptional()
  fromEmail: string;

  @ApiProperty({
    example: 'Asia/Dubai',
  })
  @IsString()
  @IsOptional()
  userTimezone: string;

  @ApiProperty({
    example: '2024-07-14T09:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  from: Date;

  @ApiProperty({
    example: '2024-07-14T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  to: Date;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  hostId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'The participant IDs for the meeting',
  })
  @IsOptional()
  participants: number[];

  @ApiProperty({
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  relatedToId: number;

  @ApiProperty({
    example: 'This is a team meeting to discuss project updates.',
  })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ required: false, example: '2' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  opportunityID: number;

  @ApiProperty({
    example: Status.SCHEDULED,
    enum: Status,
  })
  @IsEnum(Status)
  @IsOptional()
  status: Status;

  @ApiProperty({
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;
}

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {
  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  relatedToId: number;

  @ApiProperty({
    example: 'Asia/Dubai',
  })
  @IsString()
  @IsOptional()
  userTimezone: string;

  @ApiProperty({ required: false, example: '2' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  opportunityID: number;
}

export class rescheduleMeetingDto extends PartialType(CreateMeetingDto) {
  @ApiProperty({
    example: 'Asia/Dubai',
  })
  @IsString()
  @IsOptional()
  userTimezone: string;

  @ApiProperty({
    example: '2024-07-14T09:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  from: Date;

  @ApiProperty({
    example: '2024-07-14T10:00:00Z',
  })
  @IsDateString()
  @IsOptional()
  to: Date;

  @ApiProperty({ required: false, example: '2' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  opportunityID: number;
}

export class DeleteMeetingDto {
  @ApiProperty({
    example: 'the reason to be deleted is',
  })
  @IsString()
  @IsOptional()
  deleteReason: string;
}

export class CompleteMeetingDto {
  @ApiProperty({
    example: 'the completion reason is',
  })
  @IsString()
  @IsOptional()
  completionReason: string;
}

export class CancelMeetingDto {
  @ApiProperty({
    example: 'the reason to cancel is',
  })
  @IsString()
  @IsOptional()
  cancelReason: string;
}

export class MeetingAttachmentDto {
  @ApiProperty({
    example: '846E433E-F36B-1410-80ED-00B820E2FA85',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  fileId: string;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  meetingId: Meetings;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  leadId: Lead;
}

export class MeetingAttachmentResponseDto {
  id: number;
  fileId: string;
  fileSize?: string;
  fileName?: string;
  url: string;
  attachedByFirstName: string;
  attachedByLastName: string;
  meetingId?: any;
  leadId?: any;
  created_at: Date;
  updated_at: Date;
}

export class DeleteParticipantsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'The participant IDs for the meeting',
  })
  @IsOptional()
  participants: number[];
}

export class AddParticipantsDto extends PartialType(DeleteParticipantsDto) {}
