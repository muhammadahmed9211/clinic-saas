import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserEWalletDto {
  @ApiProperty({ example: 'VISA' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: '428' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  title: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  eWalletId: string;
}
