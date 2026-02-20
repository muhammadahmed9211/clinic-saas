import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsInt, ArrayMaxSize } from 'class-validator';

export class UpdateRetentionStatusDto {
  @ApiProperty({
    description: 'Array of client IDs to update',
    example: [101, 102, 103],
    type: [Number],
  })
  @IsArray()
  @ArrayMaxSize(100, { message: 'You can only update a maximum of 100 clients at a time.' })
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  clientIds: number[];

  @ApiProperty({
    description: 'New retention status ID to set for the clients',
    example: 3,
    type: Number,
  })
  @IsInt()
  @IsNotEmpty()
  retentionStatusId: number;
}
