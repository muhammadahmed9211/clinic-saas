import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateListViewColumnDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isSticky: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  listColumnsMetaId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  listViewFilterId: number;
}

export class ListViewColumnDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  sequence: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isSticky: boolean;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  listColumnsMetaId: number;
}

export class AddListViewColumnDto {
  @ApiProperty({ type: ListViewColumnDto, isArray: true })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true, message: 'Invalid filters array' })
  @Type(() => ListViewColumnDto)
  data: ListViewColumnDto[];

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listViewFilterId: number;
}
