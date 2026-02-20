import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AnswerDTO {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({
    example: 'Sample Answer',
    description: 'The text content of the answer.',
  })
  text: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The sorting order of the answer.',
  })
  sort: number;
}
