import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetAccountByLoginRequest {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  login: string;
}

export class GetLiveAccountsByTradingTypeRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  tradingType?: 'normal' | 'copy_trading';
}
