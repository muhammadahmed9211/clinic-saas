import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteOperatorDTO {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  assigneeId: number;
}
