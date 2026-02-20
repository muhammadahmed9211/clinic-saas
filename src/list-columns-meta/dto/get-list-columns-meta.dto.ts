import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class GetListColumnsMetaParamDto {
  @ApiProperty({ example: 1, required: false })
  @IsNumberString()
  @IsOptional()
  listId?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumberString()
  @IsOptional()
  groupId?: number;
}
