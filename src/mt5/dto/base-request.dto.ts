import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import 'dotenv/config';
import { i18nValidationMessage } from 'nestjs-i18n';

const servers = process.env.MT5_KAFKA_CONSUMER_SERVERS
  ? process.env.MT5_KAFKA_CONSUMER_SERVERS.split(' ')
  : (['dev'] as const);

export type Servers = (typeof servers)[number];

export class BaseRequestDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: 'Please provide a valid server' })
  @ApiProperty()
  server: Servers;
}
