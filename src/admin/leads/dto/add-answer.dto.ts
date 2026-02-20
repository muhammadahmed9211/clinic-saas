import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AddAnswerDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsOptional()
  questionId?: number;

  @ApiProperty({ example: 'expected_amount', required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  key?: string;

  @ApiProperty({ example: 'How did you hear about us?', required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  question?: string;

  @ApiProperty({ example: 'Yes', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  answer: string;
}
