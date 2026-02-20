import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export type TradeStatus = 'all' | 'closed' | 'open';

export class QueryTradingInfoDto {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  accountId: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  trade: TradeStatus;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  to: string;
}

export class ParamsTradingInfoDto {
  @ApiProperty({
    required: true,
  })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  id: number;
}
