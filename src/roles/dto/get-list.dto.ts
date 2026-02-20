import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetListDto {
  @ApiProperty({ required: false, example: true })
  @IsOptional()
  isHidden?: string;
}
