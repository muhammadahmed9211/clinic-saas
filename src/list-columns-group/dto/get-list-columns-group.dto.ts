import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetListColumnsParamDto {
  @ApiProperty({ example: 1 })
  @IsNumberString()
  @IsOptional()
  listId?: number;
}
