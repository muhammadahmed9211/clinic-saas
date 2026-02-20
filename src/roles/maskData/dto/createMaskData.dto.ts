import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMaskDataDto {
  @ApiProperty({ example: 'can view email' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ example: 'email' })
  @IsString({ message: 'key must be a string' })
  key: string;

  @ApiProperty({ example: '****' })
  @IsString({ message: 'maskPattern must be a string' })
  maskPattern: string;

  @ApiProperty({
    example: 'Operator can view user email address',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;
}
