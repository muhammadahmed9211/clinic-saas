import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export enum FilterOperation {
  EQUALS = 'EQUALS',
  NOT_EQUAL = 'NOT_EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL = 'GREATER_THAN_OR_EQUAL',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUAL = 'LESS_THAN_OR_EQUAL',
  CONTAINS = 'CONTAINS',
  BETWEEN = 'BETWEEN',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class FilterItem {
  @ApiProperty({ example: 'key' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ enum: FilterOperation })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(FilterOperation)
  operation: FilterOperation;

  @ApiProperty({ example: ['value'] })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsArray()
  @ArrayMinSize(1)
  value: string[] | number[] | boolean[];
}

export class SortItem {
  @ApiProperty({ enum: SortOrder })
  @IsNotEmpty()
  @IsEnum(SortOrder)
  order: SortOrder;

  @ApiProperty({ example: 'key' })
  @IsNotEmpty()
  @IsString()
  key: string;
}

export class AdvanceSearchDto {
  @ApiProperty({ type: FilterItem, isArray: true })
  @IsArray()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => FilterItem)
  filters: FilterItem[];

  @ApiProperty({ type: FilterItem, isArray: true })
  @IsArray()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => FilterItem)
  or?: FilterItem[];

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit: number;

  @ApiProperty({ example: 2 })
  @IsOptional()
  @IsNumber()
  page: number;

  @ApiProperty({ type: SortItem, isArray: true })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true, message: 'Invalid sort array' })
  @Type(() => SortItem)
  sort?: SortItem[];

  relations?: string[];
  countOnly?:boolean
}
