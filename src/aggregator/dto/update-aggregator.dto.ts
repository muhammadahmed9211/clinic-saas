import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAggregatorDto {
  @ApiProperty({ example: 'Aggregator' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  fee: number;
}
