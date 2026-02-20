import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum ColumnsTypeEnum {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
}
export class CreateListColumnsMetaDto {
  @ApiProperty({ example: 'General', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'General', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  label: string;

  @ApiProperty({ enum: ColumnsTypeEnum, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(ColumnsTypeEnum)
  type: ColumnsTypeEnum;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isFilterAble?: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isSortable?: boolean;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  groupId: number;
}
