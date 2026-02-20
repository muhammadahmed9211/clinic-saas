import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateMasterTaskDto {
  @ApiProperty({ example: 'Fill KYC Documents', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' }) 
  @Matches(/^[^\s]+$/, {
      message: 'Space not allowed',
  })
  name: string;

  @ApiProperty({ example: 'Fill KYC Documents', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Description should not be empty' }) 
  description: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  label: number;

  @ApiProperty({ example: '/kyc', required: false })
  @IsOptional()
  @IsString()
  masterUrl: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  predecessor: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  successor: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isForcedComplete: boolean;
}
