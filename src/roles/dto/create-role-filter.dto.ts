import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class FilterData {
  @ApiProperty({ example: 1 })
  @IsNumber()
  roleFilterId: number;

  @ApiProperty({
    example: '[1,2,3]',
    description: 'JSON string of filter reference IDs',
  })
  @IsString()
  filterRefIds: string;

  @ApiProperty({
    example: 'AND',
    description: 'Optional condition for the filter',
    required: false,
  })
  @IsOptional()
  @IsString()
  condition?: string;
}

export class CreateRoleFilterRelDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;

  @ApiProperty({ type: [FilterData] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilterData)
  filters: FilterData[];
}
