import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ActiveLogDto {
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  action: string;

  @IsOptional()
  @IsNumber()
  entity_id: number;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entity_type: string;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  json_object: string;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  performer_id: number;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  performer_type: string;

  @IsOptional()
  @IsNumber()
  parent_id: number;

  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  parent_type: string;

  @IsOptional()
  @IsDate()
  archive_insertion_date: Date;

  @IsNumber()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  is_from_archive: number;

  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  trigger_type: string;
}
