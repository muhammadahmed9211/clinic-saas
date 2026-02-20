import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsDateString,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CommissionReportQueryDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering (YYYY-MM-DD)',
    example: '2024-01-01',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering (YYYY-MM-DD)',
    example: '2024-12-31',
    type: String,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: '122345',
  })
  @IsOptional()
  @IsString()
  login?: string;
  
  @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: 'john doe',
  })
  @IsOptional()
  @IsString()
  clientName?: string;

  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: 'Client classification to filter by',
    example: 'Elite',
  })
  @IsOptional()
  classification?: string; 
}

export class CommissionReportItemDto {
  @ApiProperty({ description: 'Client ID', example: 123 })
  clientId: number;

  @ApiProperty({ description: 'MT5 Account ID', example: '50001234' })
  mt5AccountId: string;

  @ApiProperty({ description: 'Client full name', example: 'John Doe' })
  clientName: string;

  @ApiProperty({ description: 'Client email', example: 'john@example.com' })
  clientEmail: string;

  @ApiProperty({
    description: 'Registration date',
    example: '2024-01-15T10:30:00Z',
  })
  registrationDate: Date;

  @ApiProperty({
    description: 'MT5 account creation date',
    example: '2024-01-16T09:00:00Z',
  })
  mt5AccountCreatedDate: Date;

  @ApiProperty({ description: 'Total deposits', example: 5000.0 })
  totalDeposit: number;

  @ApiProperty({
    description: 'Net deposits (deposits - withdrawals)',
    example: 3500.0,
  })
  totalNetDeposit: number;

  @ApiProperty({ description: 'Total withdrawals', example: 1500.0 })
  totalWithdrawal: number;

  @ApiProperty({ description: 'Total trading volume', example: 250000.0 })
  totalVolume: number;

  @ApiProperty({ description: 'Total commission earned', example: 750.0 })
  totalCommission: number;
}

export class PaginationMetaDto {
  @ApiProperty({ description: 'Current page number', example: 1 })
  currentPage: number;

  @ApiProperty({ description: 'Number of records per page', example: 50 })
  pageSize: number;

  @ApiProperty({ description: 'Total number of records', example: 1250 })
  totalRecords: number;

  @ApiProperty({ description: 'Total number of pages', example: 25 })
  totalPages: number;

  @ApiProperty({
    description: 'Whether there is a previous page',
    example: false,
  })
  hasPreviousPage: boolean;

  @ApiProperty({ description: 'Whether there is a next page', example: true })
  hasNextPage: boolean;
}

export class CommissionReportResponseDto {
  @ApiProperty({
    description: 'Commission report data',
    type: [CommissionReportItemDto],
  })
  data: CommissionReportItemDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
} 

export class CommissionReportPaginationDto {
  @ApiPropertyOptional({
    description: 'Page number (1-based)',
    example: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of records per page',
    example: 10,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    description: 'Filter by MT5 symbol',
    example: 'EURUSD',
  })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiPropertyOptional({
    description: 'Filter by deal ID',
    example: 123456,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  dealId?: number;

  @ApiPropertyOptional({
    description: 'Start date filter (YYYY-MM-DD or ISO format)',
    example: '2026-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date filter (YYYY-MM-DD or ISO format)',
    example: '2026-01-18',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class QueryOptionsDto {
 @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: '122345',
  })
  @IsOptional()
  @IsString()
  login?: string;
  
  @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({
    description: 'Search term for client name or email',
    example: 'john doe',
  })
  @IsOptional()
  @IsString()
  clientName?: string;


  @ApiProperty({
    description: 'Partner ID to filter by',
    required: false,
    example: '12345',
    type: String,
  })
  @IsOptional()
  @IsString()
  partnerId?: number;

  @ApiProperty({
    description: 'Start date for filtering (ISO 8601 format)',
    required: false,
    example: '2024-01-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({
    description: 'End date for filtering (ISO 8601 format)',
    required: false,
    example: '2024-12-31T23:59:59.999Z',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({
    description: 'Page number for pagination (starts from 1)',
    required: false,
    default: 1,
    minimum: 1,
    example: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    default: 50,
    minimum: 1,
    maximum: 1000,
    example: 50,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  limit?: number = 50;

@ApiProperty({
  description: 'Sub-IB ID to filter by (optional)',
  required: false,
  example: 12345,
  type: Number,
})

@IsOptional()
@Type(() => Number)
@IsInt()
subIbId?: number;

}
