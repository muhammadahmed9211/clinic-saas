import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateListViewsFilterDto {
  @ApiProperty({ example: 'Marketing Team' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  listId: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isDefault: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isUserDefault: boolean;
}
