import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { TablesName } from '../types';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetTableColumnsDto {
  @ApiProperty({ enum: TablesName })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(TablesName)
  tableName: TablesName;
}
