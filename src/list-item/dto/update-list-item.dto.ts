import { ApiProperty } from '@nestjs/swagger';
import { CreateListItemDto } from './create-list-item.dto';
import { IsNumberString } from 'class-validator';

export class UpdateListItemDto extends CreateListItemDto {}
export class UpdateListParam {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumberString()
  id: number;
}
