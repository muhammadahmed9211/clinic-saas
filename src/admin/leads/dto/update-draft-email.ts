import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateDraftEmailDto {
  @ApiProperty({ example: 'Hello, this is a html', required: true })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  html: string;

  @ApiProperty({ example: 'Subject', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  subject: string;

  @ApiProperty({ example: 'sales@example.com', required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  from?: string;

  @ApiProperty({ example: 12345, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  leadId: number;

  @ApiProperty({ example: 12345, required: true })
  @IsOptional()
  opportunityId?: number;

  operatorId: number;
}
