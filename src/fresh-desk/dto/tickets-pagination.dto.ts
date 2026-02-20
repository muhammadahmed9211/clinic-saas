import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class TicketPaginationFilterDto {
  @ApiProperty({ description: 'Page number', default: 1 })
  @IsOptional()
  page?: number;

  @ApiProperty({ description: 'Number of items per page', default: 10 })
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: string;
}
