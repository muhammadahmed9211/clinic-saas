import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetBankAccountDto {
  @ApiProperty({ example: 'USD', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @MaxLength(100, { message: i18nValidationMessage('validation.MAX') })
  currency: string;
}
