// create-communication.dto.ts

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum CommunicationType {
  Email = 'email',
  SMS = 'sms',
  WhatsApp = 'whatsapp',
}

export class CreateCommunicationDto {
  @ApiProperty({
    enum: CommunicationType,
    example: CommunicationType.Email,
    required: true,
  })
  @IsEnum(CommunicationType)
  type: CommunicationType;

  @ApiProperty({ example: 'Hello, this is a message', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  text: string;

  @ApiProperty({ example: 'sales@example.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  from: string;

  @ApiProperty({ example: 'Hello, this is a message', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  html: string;

  @ApiProperty({ example: 'Subject', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @ApiProperty({ example: 12345, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  userId: number;

  operatorId: number;
}

// communication-response.dto.ts

export class CommunicationResponseDto {
  type: string;
  text: string;
  html: string;
  userId: number;
  starred: boolean;
  operatorId?: number; // Assuming operatorId is an optional field
}

export class CommunicationDto {
  id: number;
  text: string;
  type: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  starred: boolean;
}

export class CreateEmailTemplateDto {
  @ApiProperty({ example: 'EN', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language: string;

  @ApiProperty({ example: 'Kyc Template', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  title: string;

  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  entityId: number;

  @ApiProperty({ example: 'NO_KYC', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;
}

export class UpdateEmailTemplateDto {
  @ApiProperty({ example: 'Hello, this is a message', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  text: string;

  @ApiProperty({ example: 'EN', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language: string;

  @ApiProperty({ example: 'NO_KYC', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'Kyc Template', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  title: string;

  @ApiProperty({ example: 'NO_KYC', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;
}

export class SendEmailDto {
  @ApiProperty({ example: '1', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  entityId: number;

  @ApiProperty({ example: '2946', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entityValue: string;

  @ApiProperty({ example: 2946, required: true })
  @IsOptional()
  userId: number;

  @ApiProperty({ example: 490, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  templateId: number;

  @ApiProperty({ example: 2, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  layoutId: number;

  @ApiProperty({ example: 'Thankyou for making your payment', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @ApiProperty({ example: 'sales@example.com', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  from: string;

  @ApiProperty({ example: `['john.doe@example.com','john.doe@example.com'] or 'john.doe@gmail.com'`, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  to: string | string[];

  operatorId?: number;
}

export class EmailTemplateResponseDto { 
  text?: string;
  language?: string;
  name?: string;
  title?: string
  entityId?: number
}

export class EmailLayoutResponseDto {
  layout: string;
  language: string;
  name: string;
  regulation:string
  regulationId:number
  companyName: string
}
export class CreateEmailLayoutDto {
  @ApiProperty({ example: 'Hello, this is a message', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  layout: string;

  @ApiProperty({ example: 'example', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  companyName: string;

  @ApiProperty({ example: 'EN', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language: string;

  @ApiProperty({ example: 'NO_KYC', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'FSCA', required: false })
  regulation: string;

  @ApiProperty({ example: 1, required: false })
  regulationId: number;
}


export class UpdateEmailLayoutDto {
  @ApiProperty({ example: 'Hello, this is a message', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  layout: string;

  @ApiProperty({ example: 'EN', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  language: string;

  @ApiProperty({ example: 'example', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  companyName: string;

  @ApiProperty({ example: 'NO_KYC', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'FSCA', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  regulation: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  regulationId: number;
}
