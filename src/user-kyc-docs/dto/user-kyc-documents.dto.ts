import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum KycState {
  PENDING = 'pending',
  REJECTED = 'rejected',
  APPROVED = 'approved',
}
export class CreateUserKycDocumentsDto {
  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 1,
    description: 'The ID of the document.',
  })
  documentId: number;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'BFE6423E-F36B-1410-8E91-00FBE52F62A4',
    description: 'The ID of the file.',
  })
  fileId: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({
    example: 'id_card',
    description: 'The ID type of the file.',
  })
  field_id: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({
    example: 'front',
    description: 'front or back',
  })
  side: string;
}
