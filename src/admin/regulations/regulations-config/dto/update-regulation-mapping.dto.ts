import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRegulationEventRuleMappingDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  regulationId: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  ruleId: number;

  @ApiProperty({ example: 'True', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value: string;
}
