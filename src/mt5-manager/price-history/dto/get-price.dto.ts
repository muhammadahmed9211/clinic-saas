/**
 * Price DTOs
 * Migrated by: Arshad Shaheen
 * Date: October 23, 2025
 */

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class SymbolPriceDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  symbol: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  trans_id: number;
}

export class GetTickHistoryDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  symbol?: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const timestamp = parseInt(value);
    const threeHoursInSeconds = 3 * 60 * 60;
    return (timestamp + threeHoursInSeconds).toString();
  })
  from?: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const timestamp = parseInt(value);
    const threeHoursInSeconds = 3 * 60 * 60;
    return (timestamp + threeHoursInSeconds).toString();
  })
  to?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  data?: string;
}

export class GetMarketDepth {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsOptional()
  symbol: string;
}

export class GetHistoryQuery {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  symbol: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  resolution: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const timestamp = parseInt(value);
    const threeHoursInSeconds = 3 * 60 * 60;
    return (timestamp + threeHoursInSeconds).toString();
  })
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return value;
    const timestamp = parseInt(value);
    const threeHoursInSeconds = 3 * 60 * 60;
    return (timestamp + threeHoursInSeconds).toString();
  })
  to: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  countback: string;
}

export class GetSymbolInfoQuery {
  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  group: string;
}

