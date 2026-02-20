import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Notification', required: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'This is a notification', required: false })
  @IsOptional()
  @IsString()
  description: string;
}
