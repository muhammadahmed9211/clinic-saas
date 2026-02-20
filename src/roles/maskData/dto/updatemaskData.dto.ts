import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMaskDataDto {
  @ApiProperty({ example: 'can view email', required: false })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ApiProperty({ example: 'email', required: false })
  @IsOptional()
  @IsString({ message: 'key must be a string' })
  key: string;

  @ApiProperty({ example: '****', required: false })
  @IsOptional()
  @IsString({ message: 'maskPattern must be a string' })
  maskPattern: string;

  @ApiProperty({
    example: 'Operator can view user email address',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  roleId: number;
}
