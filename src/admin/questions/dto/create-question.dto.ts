import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum QuestionDataType {
  CURRENCY = 'currency',
  ALPHABETIC = 'alphabetic',
  ALPHANUMERIC = 'alphanumeric',
  NUMERIC = 'numeric',
  DATE = 'date',
  BOOLEAN = 'boolean',
}

export class CreateQuestionDto {
  @ApiProperty({ example: 'Expected Investment', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  label: string;

  @ApiProperty({
    example: 'What is the expected amount of investment?',
    required: true,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  description: string;

  @ApiProperty({ example: 'alphabetic', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(QuestionDataType, {
    message: i18nValidationMessage('validation.INVALID_DATA_TYPE'),
  })
  dataType: QuestionDataType;

  @ApiProperty({ example: 'expected_amount', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  key: string;
}
