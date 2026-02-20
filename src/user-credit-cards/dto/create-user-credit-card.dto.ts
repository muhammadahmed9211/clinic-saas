import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserCreditCardDto {
  @ApiProperty({ example: 'VISA' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  type: string;

  @ApiProperty({ example: '428' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  expiration: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  holderName: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  number: string;
}
