import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePartnerConfigDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  office?: number;

  @ApiProperty({ example: 33 })
  @IsOptional()
  @IsNumber()
  salesDesk?: number;

  @ApiProperty({ example: 37 })
  @IsOptional()
  @IsNumber()
  retentionDesk?: number;

  @ApiProperty({ example: 36 })
  @IsOptional()
  @IsNumber()
  supportDesk?: number;

  @ApiProperty({ example: 34 })
  @IsOptional()
  @IsNumber()
  financeDesk?: number;

  @ApiProperty({ example: 35 })
  @IsOptional()
  @IsNumber()
  kycDesk?: number;

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsNumber()
  salesRep?: number;

  @ApiProperty({ example: null, nullable: true })
  @IsOptional()
  @IsNumber()
  retentionRep?: number;

  @ApiProperty({ example: 1, nullable: true })
  @IsOptional()
  @IsNumber()
  regulation?: number;

  @ApiProperty({ example: '2023-01-02T00:00:00Z' })
  @IsOptional()
  updatedAt?: Date;
}
