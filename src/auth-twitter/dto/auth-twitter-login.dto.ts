import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthTwitterLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  accessTokenKey: string;

  @ApiProperty({ example: 'abc' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  accessTokenSecret: string;
}
