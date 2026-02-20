import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { TablesName } from '../types';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TableColumnOrder {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  id?: number;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsInt()
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  order: number;

  @ApiProperty({ example: 'Column' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  columnName: string;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsBoolean()
  isSticky: boolean;
}

export class CreateTableColumnOrderDto {
  @ApiProperty({
    type: [TableColumnOrder],
    example: [
      {
        id: 1,
        order: 1,
        columnName: 'Name',
        isSticky: false,
      },
      {
        id: 2,
        order: 2,
        columnName: 'Age',
        isSticky: true,
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableColumnOrder)
  data: TableColumnOrder[];

  @ApiProperty({ enum: TablesName })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(TablesName)
  tableName: TablesName;
}
