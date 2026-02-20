// retention-info.dto.ts

import { IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RetentionInfoDTO {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  firstRetinationRep?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  retentionDesk?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  retentionRep?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  internalRetentionStatus?: number;
}
