import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsString()
  entity_id: string;

  @ApiProperty({ example: 'clients', required: false })
  @IsOptional()
  @IsString()
  entity_name: string;

  @ApiProperty({ example: 'Notification', required: false })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is a notification', required: false })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  title_label_id: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  description_label_id: number;

  @ApiProperty({ example: 'Medium', required: false })
  @IsOptional()
  @IsString()
  priority: string;

  @ApiProperty({ example: '/clients/123', required: false })
  @IsOptional()
  @IsString()
  link: string;
}
