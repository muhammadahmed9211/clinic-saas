import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AuthFacebookLoginDto {
  @ApiProperty({ example: 'abc' })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  accessToken: string;
}
