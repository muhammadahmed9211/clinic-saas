import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum TicketType {
  INCIDENT = 'Incident',
  QUESTION = 'Question',
  PROBLEM = 'Problem',
  REFUND = 'Refund',
  TRANSACTION_ISSUE = 'Transaction issue',
  LOAN = 'Loan',
}

export class CreateTicketDTO {

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'Passport Renewal',
  })
  subject: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'I need to upload my passport image for renewal.',
  })
  message: string;

  @IsEnum(TicketType)
  @ApiProperty({
    enum: TicketType,
    description: 'Ticket type',
    enumName: 'TicketType',
  })
  type: TicketType;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Required image file to upload.',
  })
  @IsOptional()
  file?: Express.Multer.File;
}

export class ReplyTicketDTO {
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  // @ApiProperty({
  //   example: 'John Doe',
  // })
  // name: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'Passport Renewal',
  })
  subject: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'I need to upload my passport image for renewal.',
  })
  message: string;

  // @IsEnum(TicketType)
  // @ApiProperty({
  //   enum: TicketType,
  //   description: 'Ticket type',
  //   enumName: 'TicketType',
  // })
  // type: TicketType;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Required image file to upload.',
  })
  @IsOptional()
  file?: Express.Multer.File;
}
