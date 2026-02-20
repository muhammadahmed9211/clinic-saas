import { IsOptional, IsEnum, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';

export class CreateRuleCriteriaDto {
  @ApiProperty({ example: 23, description: 'Referral Program ID' })
  @IsNumber()
  referralProgramId: number;

  @ApiProperty({ example: 'Is FTD', description: 'Rule name to apply' })
  @IsString()
  ruleName: string;

@ApiPropertyOptional({
  example: [3],
  description: 'Array of values for the rule criteria (can also send single value)',
  type: [String, Number, Boolean]
})
@IsOptional()
@IsArray()
values?: any[];

  @ApiPropertyOptional({ 
    example: FilterOperation.EQUALS,
    enum: FilterOperation,
    description: 'Comparison operator'
  })
  @IsOptional()
  @IsEnum(FilterOperation)
  operator?: FilterOperation;
}
