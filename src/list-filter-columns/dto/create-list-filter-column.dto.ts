import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import {
  FilterOperation,
  SortOrder,
} from 'src/database/base-repository/dto/advance-search.dto';

export class CreateListFilterColumnDto {
  @ApiProperty({ enum: FilterOperation, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(FilterOperation)
  operator: FilterOperation;

  @ApiProperty({ example: ['General'], required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one value must be provided' })
  values: any[];

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listViewFilterId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listColumnMetaId: number;
}

export class ListFilterColumnDto {
  @ApiProperty({ example: 1 })
  @IsOptional({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  id: number;

  @ApiProperty({ enum: FilterOperation, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(FilterOperation)
  operator: FilterOperation;

  @ApiProperty({ example: ['General'], required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one value must be provided' })
  values: any[];

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listColumnMetaId: number;
}

export class AddListFiltersDto {
  @ApiProperty({ type: ListFilterColumnDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => ListFilterColumnDto)
  data: ListFilterColumnDto[];

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listViewFilterId: number;
}

class ListMetaDto {
  @ApiProperty({ enum: FilterOperation, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  name: string;
}

export class FilterDto {
  @ApiProperty({ enum: FilterOperation, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(FilterOperation)
  operator: FilterOperation;

  @ApiProperty({ example: ['General'], required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one value must be provided' })
  values: string[] | number[];

  @ApiProperty({ type: ListMetaDto })
  @IsOptional()
  @ValidateNested({ message: 'Name is required in list column meta' })
  @Type(() => ListMetaDto)
  listColumnMeta: ListMetaDto;
}

class SortDto {
  @ApiProperty({ enum: SortOrder })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @ApiProperty({ type: ListMetaDto })
  @IsOptional()
  @ValidateNested({ message: 'Name is required in list column meta' })
  @Type(() => ListMetaDto)
  listColumnMeta: ListMetaDto;
}

export class ApplyListFilterSortColumnDto {
  @ApiProperty({ type: FilterDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => FilterDto)
  filters: FilterDto[];

  @ApiProperty({ type: SortDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => SortDto)
  sort: SortDto[];

  @ApiProperty({ type: FilterDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => FilterDto)
  or?: FilterDto[];

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  listViewId?: number;
}
