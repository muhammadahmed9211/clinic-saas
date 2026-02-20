import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class NewsListDto {
  @ApiProperty({
    description: 'Stock symbol to get news for (e.g., AAPL, MSFT)',
    example: 'AAPL',
    type: String,
    required: true,
  })
  symbol: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    type: Number,
    required: false,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of news items to return per page',
    example: 10,
    type: Number,
    required: false,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiProperty({
    description: 'Return all news items (ignores page and limit)',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  all?: boolean = false;
}

export class NewsDetailDto {
  @ApiProperty({
    description:
      'News ID to get details for (e.g., 4cd7395e-588c-4a64-a33b-64371b30dc95)',
    example: '4cd7395e-588c-4a64-a33b-64371b30dc95',
    type: String,
    required: true,
  })
  id: string;
}

export class NewsHotDto {
  @ApiProperty({
    description: 'Number of news items to return',
    example: 10,
    type: Number,
    required: true,
    minimum: 1,
    maximum: 100,
  })
  limit: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    type: Number,
    required: false,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Return all news items (ignores page and limit)',
    example: false,
    type: Boolean,
    required: false,
    default: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  all?: boolean = false;
}
