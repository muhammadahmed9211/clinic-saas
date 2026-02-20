import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt } from 'class-validator';

export class SearchQueryDto {
  @ApiProperty()
  @IsString()
  q: string;

  @ApiProperty()
  page: number = 1;

  @ApiProperty()
  limit: number = 10;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  indices: string;

  @ApiProperty({ required: false }) 
  @IsOptional()
  @IsString()
  sort: string = 'relevance';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dateFrom: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  dateTo: string;
}