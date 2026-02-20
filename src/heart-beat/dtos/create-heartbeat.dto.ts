import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateHeartBeatDto {
  @ApiProperty({ type: String, required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  userId: string;
}
