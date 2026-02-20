import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { SortOrder } from 'src/database/base-repository/dto/advance-search.dto';

export class CreateListColumnsSortDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @ApiProperty({ enum: SortOrder, required: true })
  @IsEnum(SortOrder)
  sortOrder: SortOrder;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listViewFilterId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsNumber()
  listColumnMetaId: number;
}
