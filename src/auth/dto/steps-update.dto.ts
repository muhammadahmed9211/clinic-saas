import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class StepsUpdateDto {
  @ApiProperty({ example: 1 })
  @IsOptional()
  completedSteps?: number;
}
