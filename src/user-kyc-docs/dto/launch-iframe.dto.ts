import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

export class LaunchIframeDto {
  @ApiProperty({
    example: 'PK',
    description: 'Country code in ISO2 format',
    default: 'PK',
  })
  @IsString()
  country: string;

  @ApiProperty({
    example: 'en',
    description: 'Language code (en, ar, ur, etc.)',
    default: 'en',
  })
  @IsString()
  language: string;

  @ApiProperty({
    example: ['id_card', 'passport'],
    description: 'Supported document types for verification',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  documentTypes: string[];

  @ApiProperty({
    example: true,
    description: 'Whether face verification is required',
    default: true,
    required: false,
  })
  @IsOptional()
  face?: boolean;
}
