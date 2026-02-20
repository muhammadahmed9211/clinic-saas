import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({ example: 'device-12345' })
  @IsString()
  deviceId: string;

  @ApiProperty({ example: 'mobile' })
  @IsString()
  deviceType: string;

  @ApiProperty({ example: 'iPhone 14 Pro Max' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A2890' })
  @IsString()
  model: string;

  @ApiProperty({ example: 'Apple', required: false })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiProperty({ example: 'Apple', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'iOS' })
  @IsString()
  os: string;

  @ApiProperty({ example: '26.1' })
  @IsString()
  osVersion: string;

  @ApiProperty({ example: '1.0.5' })
  @IsString()
  appVersion: string;

  @ApiProperty({
    example: 'dskfj39r23r9fdskfj239',
    required: false,
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;

  @ApiProperty({ example: '192.168.0.10', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    example: 'Karachi, Pakistan',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: 'Asia/Karachi',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Link the device to a user',
  })
  @IsOptional()
  userId?: number;

  @ApiProperty({
    example: 'EN',
    required: false,
    description: 'User device language locale',
  })
  @IsOptional()
  locale?: string;
}
