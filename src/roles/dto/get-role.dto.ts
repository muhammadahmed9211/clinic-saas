import { ApiProperty } from '@nestjs/swagger';

export class getRoleDto {
  @ApiProperty({ required: true, example: 10 })
  limit: number;

  @ApiProperty({ required: true, example: 1 })
  page: number;
}
