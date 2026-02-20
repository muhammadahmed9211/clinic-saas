import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Length, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserAnswersDTO {
  @ApiProperty({
    description: 'The ID of the question',
    type: 'integer',
    example: 1,
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsInt()
  questionId: number;

  @ApiProperty({
    description: 'The ID of the selected answer',
    type: 'integer',
    example: 2,
  })
  @IsOptional()
  @IsInt()
  answerId: number;

  @ApiProperty({
    description: 'The text of the answer',
    type: 'string',
    maxLength: 255,
    example: 'This is the answer text',
  })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Length(1, 255)
  answerText: string;
}
