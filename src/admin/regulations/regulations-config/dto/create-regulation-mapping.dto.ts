import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRegulationEventRuleMappingDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  regulationId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  eventId: number;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  ruleId: number;

  @ApiProperty({ example: 'True', required: true })
  @IsString()
  @IsNotEmpty()
  value: string;
}
