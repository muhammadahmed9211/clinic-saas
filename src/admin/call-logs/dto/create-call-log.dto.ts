import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  CallToUserType,
  CallType,
  RelatedTo,
} from '../entities/call-log.entity';
import { Transform } from 'class-transformer';

export class CreateCallLogDto {
  @ApiProperty({ required: true, example: 'Client' })
  @Transform((type) => type.value.toLowerCase())
  @IsEnum(CallToUserType)
  callToUserType: CallToUserType;

  @ApiProperty({ required: true, example: 'Test User' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  callToUserName: string;

  @ApiProperty({ required: true, example: 'deal' })
  @Transform((type) => type.value.toLowerCase())
  @IsEnum(RelatedTo)
  releatedTo: RelatedTo;

  @ApiProperty({ required: true, example: 'outbound' })
  @Transform((type) => type.value.toLowerCase())
  @IsEnum(CallType)
  callType: CallType;

  @ApiProperty({ required: true, example: 'completed' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  outgoingCallStatus: string;

  @ApiProperty({ required: true, example: '2024-06-04 11:25:48.136' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  callStartDateTime: Date;

  @ApiProperty({ required: true, example: '2024-06-04 12:25:48.136' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  callEndDateTime: Date;

  @ApiProperty({ required: true, example: 'Testing agenda' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  callAgenda: string;

  @ApiProperty({ required: true, example: 'Test Call Owner' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  callOwner: string;

  @ApiProperty({ required: true, example: 'Test Subject' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @ApiProperty({ required: true, example: 'Test Description' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;

  @ApiProperty({ required: true, example: '67' })
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  callResults: number;
}
