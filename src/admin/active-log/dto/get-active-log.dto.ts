import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ActiveLogDTO {
  @ApiProperty({ example: 1 })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entity_id: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  parent_id?: string;
}
