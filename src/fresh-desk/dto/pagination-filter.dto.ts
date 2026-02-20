import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationFilterDto {
  @ApiProperty({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Number of items per page', default: 10 })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    required: false,
    description: '2 to get all open tickets, 5 to get all closed tickets',
  })
  @IsOptional()
  status?: number;
}
