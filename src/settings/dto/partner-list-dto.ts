import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PartnerListDTO {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  title: string;

  @ApiProperty()
  @IsDate({ message: i18nValidationMessage('validation.IS_DATE') })
  created_at: Date;

  @ApiProperty()
  @IsDate({ message: i18nValidationMessage('validation.IS_DATE') })
  updated_at: Date;
}
