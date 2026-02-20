import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';

export class UpdateRuleCriteriaDto {
  @ApiPropertyOptional({
    example: [3],
    description: 'Array of values for the rule criteria (can also send single value)',
    type: [String, Number, Boolean]
  })
  @IsOptional()
  @IsArray()
  values?: any[];

  @IsOptional()
  @IsEnum(FilterOperation)
  operator?: FilterOperation;

  @IsOptional()
  @IsString()
  ruleName?: string;
}
