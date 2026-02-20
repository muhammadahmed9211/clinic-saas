import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export interface ClientSalesInfoDTO {
  userId: number;
  salesDeskId?: number;
  salesRepId?: number;
  internalSalesStatus?: number;
  clientPotential?: number;
  auditStatus?: number;
}

export class UpdateClientDTO {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  salesDeskId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  salesRepId?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  internalSalesStatus?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  clientPotential?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  auditStatus?: number;
}
