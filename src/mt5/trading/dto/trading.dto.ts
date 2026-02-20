import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class TradingTicketGlobal {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  ticket: string;
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  login: string;
}

export class TradingTotalDto {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  login: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  to: string;
}
