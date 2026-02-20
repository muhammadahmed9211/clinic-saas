import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MassAssignRetentionDto {
  @ApiProperty({
    required: true,
    type: [Number],
    example: [48, 56, 33, 78],
  })
  @IsArray()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  leadIds: number[];

  @ApiProperty({ required: true, example: 1209 })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  retentionRepId: number;

  @ApiProperty({ required: true, example: 3 })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  deskId: number;
}
