import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ServerName } from 'src/wallet/entities/server.entity';

export class CreateTradingGroupDto {
  @ApiProperty({ example: 'Live\\B\\E\\IB\\C12R00_SW', required: true })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  name: string;

  @ApiProperty({ example: 'high', enum: ServerName, required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(ServerName, {
    message: i18nValidationMessage('validation.INVALID_PRIORITY'),
  })
  serverName: ServerName;
}
