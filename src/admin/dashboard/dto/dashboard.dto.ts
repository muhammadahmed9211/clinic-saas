import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDashboardWidgetDto {
  @ApiProperty({ example: 'examplepassword' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class CreateDashboardWidgetRoleDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  dashboardWidgetId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  eligibleColumn: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  eligibleRow: number;
}

export class UpdateDashboardWidgetRoleDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  dashboardWidgetId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  eligibleColumn: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  eligibleRow: number;
}

export class OperatorProductivitySummaryQueryDto {
  @ApiProperty({ example: 'daily' })
  @IsNotEmpty()
  @IsString()
  interval: string;
}
