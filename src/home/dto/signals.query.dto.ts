import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsPositive,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsString,
} from 'class-validator';

export enum SentimentType {
  BULLISH = 'bullish',
  BEARISH = 'bearish',
  NEUTRAL = 'neutral',
}

export enum MarketType {
  STOCK = 'stock',
  INDEX = 'index',
  COMMODITIES = 'commodities',
  SECTOR = 'sector',
  BOND = 'bond',
  FOREX = 'forex',
  CRYPTO = 'crypto',
}

export class SignalsQueryDto {
  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page size must be an integer' })
  @IsPositive({ message: 'Page size must be positive' })
  @Min(1, { message: 'Page size must be at least 1' })
  @Max(100, { message: 'Page size cannot exceed 100' })
  pageSize: number = 10;

  @ApiProperty({
    description: 'Page number (1-based)',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page number must be an integer' })
  @IsPositive({ message: 'Page number must be positive' })
  @Min(1, { message: 'Page number must be at least 1' })
  pageNumber: number = 1;

  @ApiProperty({
    description: 'Filter signals by sentiment',
    example: SentimentType.BULLISH,
    enum: SentimentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(SentimentType, {
    message: 'Sentiment must be one of: bullish, bearish, neutral',
  })
  sentiment?: SentimentType;

  @ApiProperty({
    description: 'Filter signals by symbol',
    example: 'EURUSD',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiProperty({
    description: 'Filter signals by market type',
    example: MarketType.FOREX,
    enum: MarketType,
    required: false,
  })
  @IsOptional()
  @IsEnum(MarketType, {
    message:
      'Market must be one of: stock, index, commodities, sector, bond, forex',
  })
  marketType?: MarketType;

  @ApiProperty({
    description: 'Search title for signals',
    example: 'Alphabet intraday',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}