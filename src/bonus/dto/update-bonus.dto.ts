import {
  IsOptional,
  IsString,
  IsInt,
  IsDateString,
  IsBoolean,
  IsArray,
  IsNumber,
  IsEnum,
  Min
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DepositType, AccountClassification } from '../enum/bonus.enum';

export class UpdateBonusDto {
  @ApiPropertyOptional({
    example: 'Summer Promo',
    description: 'English title of the bonus',
  })
  @IsOptional()
  @IsString()
  titleEn?: string;

  @ApiPropertyOptional({
    example: 'عرض الصيف',
    description: 'Arabic title of the bonus',
  })
  @IsOptional()
  @IsString()
  titleAr?: string;

  @ApiPropertyOptional({
    example: 'Get a bonus on summer deposits!',
    description: 'English description of the bonus',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: 'احصل على مكافأة على ودائع الصيف!',
    description: 'Arabic description of the bonus',
  })
  @IsOptional()
  @IsString()
  descriptionAr?: string;

  @ApiPropertyOptional({
    example: 'SUMMER2025',
    description: 'Unique bonus code to apply during deposit',
  })
  @IsOptional()
  @IsString()
  bonusCode?: string;

  @ApiPropertyOptional({
    example: 100,
    description: 'Minimum deposit amount required to activate the bonus',
  })
 
  @ApiPropertyOptional({ description: 'Minimum deposit amount', example: 100 })
    @IsOptional()
    @IsNumber()
    minimumAmount?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Bonus amount awarded on qualifying deposit',
  })
  @IsOptional()
  @IsInt()
  bonusAmount?: number;

  @ApiPropertyOptional({
    example: 'FCA',
    description: 'Name of the regulatory authority',
  })
  @IsOptional()
  @IsString()
  regulations?: string;

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2, 3],
    description: 'List of country IDs where the bonus is available',
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  countryIds?: number[];

  @ApiPropertyOptional({
    example: '2025-08-01T00:00:00.000Z',
    description: 'Start datetime of the bonus in ISO format',
  })
  @IsOptional()
  @IsDateString()
  startDateTime?: Date;

  @ApiPropertyOptional({
    example: '2025-08-31T23:59:59.000Z',
    description: 'End datetime of the bonus in ISO format',
  })
  @IsOptional()
  @IsDateString()
  endDateTime?: Date;

  @ApiPropertyOptional({
    example: true,
    description: 'Bonus status — active or inactive',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
  description: 'Category of the bonus',
  enum: DepositType,
  example: DepositType.GENERAL,
})
  @IsOptional()
  @IsEnum(DepositType, { message: 'depositType must be a valid' })
  depositType?: DepositType;

  @ApiPropertyOptional({ description: 'Account Classification', enum: AccountClassification, example: AccountClassification.STANDARD })
  @IsEnum(AccountClassification)
  @IsOptional()
  accountClassification?: AccountClassification;
  
  @ApiPropertyOptional({ description: 'currencyId', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
    currencyId?: number;
}
