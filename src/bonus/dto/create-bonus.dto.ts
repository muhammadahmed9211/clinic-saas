import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  Min,
  IsArray,
  IsEnum,
  IsInt
} from 'class-validator';
import { DepositType, AccountClassification } from '../enum/bonus.enum';

export class CreateBonusDto {
  @ApiProperty({ description: 'Bonus code', example: 'SUMMER2025' })
  @IsString()
  @IsNotEmpty()
  bonusCode: string;

  @ApiProperty({ description: 'Bonus amount', example: 500 })
  @IsNumber()
  @Min(1)
  bonusAmount: number;

  @ApiProperty({ description: 'Title in English', example: 'Summer Bonus' })
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty({ description: 'Title in Arabic', example: 'مكافأة الصيف' })
  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @ApiProperty({ description: 'Description in English', example: 'Enjoy the summer bonus!' })
  @IsString()
  @IsNotEmpty()
  descriptionEn: string;

  @ApiProperty({ description: 'Description in Arabic', example: 'استمتع بمكافأة الصيف!' })
  @IsString()
  @IsNotEmpty()
  descriptionAr: string;

  @ApiPropertyOptional({ description: 'Minimum deposit amount', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumAmount?: number;

  @ApiPropertyOptional({ description: 'Regulations text', example: 'FSCA' })
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
  
  @ApiPropertyOptional({ description: 'Start date/time (ISO format)', example: '2025-07-20T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDateTime?: Date;

  @ApiPropertyOptional({ description: 'End date/time (ISO format)', example: '2025-08-20T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endDateTime?: Date;

  @ApiProperty({
  description: 'Deposit type of the bonus',
  enum: DepositType,
  example: DepositType.GENERAL,
})
  @IsEnum(DepositType, { message: 'Deposit type must be a valid' })
  depositType: DepositType;

  @ApiPropertyOptional({ description: 'Account Classification', enum: AccountClassification })
  @IsEnum(AccountClassification)
  @IsOptional()
  accountClassification?: AccountClassification;
  
  @ApiPropertyOptional({ description: 'currencyId', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  currencyId?: number;
}