import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsInt, ArrayMaxSize } from 'class-validator';

export class UpdateSalesStatusDto {
  @ApiProperty({
    description: 'Array of lead IDs to update',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray()
  @ArrayMaxSize(100, { message: 'You can only update a maximum of 100 leads at a time.' })
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  leadIds: number[];

  @ApiProperty({
    description: 'New sales status to set for the leads',
    example: 2,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  salesStatus: number;
}
