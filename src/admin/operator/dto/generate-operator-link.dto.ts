import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateOperatorLinkDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ example: 'p1value' })
  @IsString()
  @IsOptional()
  p1?: string;

  @ApiProperty({ example: 'p2value' })
  @IsString()
  @IsOptional()
  p2?: string;

  @ApiProperty({ example: 'p3value' })
  @IsString()
  @IsOptional()
  p3?: string;

  @ApiProperty({ example: 'p4value' })
  @IsString()
  @IsOptional()
  p4?: string;

  @ApiProperty({ example: 'p5value' })
  @IsString()
  @IsOptional()
  p5?: string;

  @ApiProperty({ example: 'p6value' })
  @IsString()
  @IsOptional()
  p6?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  popUnder?: boolean;
}

export class UpdateGeneratedOperatorDto {
  @ApiProperty({ example: 'p1value' })
  @IsString()
  @IsOptional()
  p1?: string;

  @ApiProperty({ example: 'p2value' })
  @IsString()
  @IsOptional()
  p2?: string;

  @ApiProperty({ example: 'p3value' })
  @IsString()
  @IsOptional()
  p3?: string;

  @ApiProperty({ example: 'p4value' })
  @IsString()
  @IsOptional()
  p4?: string;

  @ApiProperty({ example: 'p5value' })
  @IsString()
  @IsOptional()
  p5?: string;

  @ApiProperty({ example: 'p6value' })
  @IsString()
  @IsOptional()
  p6?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  popUnder?: boolean;
}
