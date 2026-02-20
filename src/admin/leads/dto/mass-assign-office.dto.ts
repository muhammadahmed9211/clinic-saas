import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MassAssignOfficeDto {
  @ApiProperty({
    type: [Number],
    example: [1000369, 1000367, 1000365, 1000361, 1000353],
  })
  @IsArray()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  leadIds: number[];

  @ApiProperty({ required: true, example: '1' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  officeId: string;
}
