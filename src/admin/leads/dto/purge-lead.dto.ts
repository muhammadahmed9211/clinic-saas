import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PurgeLeadsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'max 10 leads can be purged at once',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  leadIds: number[];
}