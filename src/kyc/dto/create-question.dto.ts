import { AnswerDTO } from './create-answer.dto';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  IsNumber,
  IsIn,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { LanguageType } from 'src/users/entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class QuestionDTO {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({
    example: 'Personal Information',
    description: 'The UI group of the question.',
  })
  group: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({
    example: 'Name',
    description: 'The UI name of the question.',
  })
  name: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @ApiProperty({
    example: 'Sample Title',
    description: 'The title of the question.',
  })
  title: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  @ApiProperty({
    example: 'Sample Description',
    description: 'The description of the question (optional).',
  })
  desc: string;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsIn(
    [
      'Radio',
      'Input',
      'Select',
      'Checkbox',
      'Number',
      'Date',
      'Textarea',
      'Grouped Checkbox',
    ],
    {
      message:
        'Type must be one of Radio, Input, Select, Checkbox, Number, Date, Textarea, Grouped Checkbox',
    },
  ) // Added this line
  @ApiProperty({
    example: 'Radio',
    description: 'The type of the question (e.g., Radio, Input, Select).',
  })
  type: string; // Updated this line

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Specifies if the question is hidden.',
  })
  isHidden: boolean;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Specifies if the question is required.',
  })
  isRequired: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Specifies if the question is editable.',
  })
  isEditable: boolean;

  @IsArray()
  @Type(() => AnswerDTO)
  @ApiProperty({
    type: [AnswerDTO],
    example: [
      { text: 'Answer 1', sort: 1 },
      { text: 'Answer 2', sort: 2 },
    ],
    description: 'The list of answers associated with the question.',
  })
  answers: AnswerDTO[];

  @IsNumber()
  @IsIn([1, 2, 3, 4], { message: 'Step must be 1, 2, 3 or 4' }) // Added this line
  @ApiProperty({
    example: 1,
    description: 'The step of the question.',
  })
  step: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: 'The sorting of the question.',
  })
  sort: number;

  @IsEnum(LanguageType, {
    message: 'Language must be one of EN, AR, or default to EN if not provided',
  })
  @ApiProperty({
    example: 'EN',
    description: 'The language of the question.',
  })
  languageIso: LanguageType;
}


export class NewQuestionDTO {
  @IsOptional()
  @ApiProperty({
    example: 'true',
    description: 'Specifies if the question is new (default: false). true or false',
  })
  isNew?: string;
}