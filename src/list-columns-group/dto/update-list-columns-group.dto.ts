import { ApiProperty } from '@nestjs/swagger';
import { CreateListColumnsGroupDto } from './create-list-columns-group.dto';
import { IsNumberString } from 'class-validator';

export class UpdateListColumnsGroupDto extends CreateListColumnsGroupDto {}
export class UpdateListColumnsParamDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumberString()
  id: number;
}
