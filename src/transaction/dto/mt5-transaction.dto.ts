import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';

export class MT5TransactionDto {
  @ApiProperty({ example: '1023', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login: string;

  @ApiProperty({ example: 10, required: true })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  @Min(1, { message: i18nValidationMessage('validation.MIN') })
  amount: number;

  @ApiProperty({ example: 2013, required: true })
  @IsNumber(
    { allowNaN: false },
    { message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  walletId: number;
}
