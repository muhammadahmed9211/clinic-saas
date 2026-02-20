import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserTaskCompleteDto {
  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  documentId?: number;
}
