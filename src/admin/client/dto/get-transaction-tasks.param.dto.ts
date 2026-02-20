import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetTransactionTaskParamDto {
  @ApiProperty({ required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_NUMBER') })
  id: string;

  @ApiProperty({ required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  tId: string;
}
