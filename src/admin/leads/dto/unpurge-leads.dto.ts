import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UnPurgeLeadsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'max 50 leads can be un purged at once',
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Type(() => Number)
  leadIds: number[];
}