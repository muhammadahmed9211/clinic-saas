import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class DeskTypeDto {
  @ApiProperty({ description: 'desk type', example: '0 or 1' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  id: number;
}
