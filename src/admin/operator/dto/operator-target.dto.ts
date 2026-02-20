import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOperatorTargetDto {
  @ApiProperty({ description: 'Operator ID', example: 1 })
  @IsNumber()
  operator_id: number;

  @ApiProperty({
    description: 'Monthly deposit',
    example: 1000.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  monthly_deposit: number;

  @ApiProperty({ description: 'Daily lots', example: 5.0, required: false })
  @IsNumber()
  @IsOptional()
  daily_lots: number;
}

export class UpdateOperatorTargetDto {
  @ApiProperty({
    description: 'Monthly deposit',
    example: 1000.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  monthly_deposit: number;

  @ApiProperty({ description: 'Daily lots', example: 5.0, required: false })
  @IsNumber()
  @IsOptional()
  daily_lots: number;
}

export class GetOperatorTargetDto {
  @ApiProperty({
    description: 'Monthly deposit',
    example: 'September',
  })
  @IsString()
  month: string;

  @ApiProperty({ description: 'Year', example: '2024' })
  @IsString()
  year: string;
}

export class UpdateAutoMonthlyTargetDto {
  @ApiProperty({ description: 'Auto monthly target', example: true })
  @IsBoolean()
  autoMonthlyTarget: boolean;
}
