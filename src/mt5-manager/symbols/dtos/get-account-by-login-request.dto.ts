/**
 * Symbols DTOs
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetAccountByLoginRequest {
  @ApiProperty()
  @IsString()
  login: string;
}

export class GetLiveAccountsByTradingTypeRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tradingType?: 'normal' | 'copy_trading';
}

