import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrivilegeDTO {
  @ApiProperty({ example: 'getme' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isScreen: boolean;

  @ApiProperty({ example: 'GET' })
  @IsNotEmpty()
  @IsString()
  method: string;

  @ApiProperty({ example: '/api/v1/auth/me' })
  @IsNotEmpty()
  @IsString()
  api: string;

  @ApiProperty({ example: 'client/dashboard' })
  @IsNotEmpty()
  @IsString()
  screen: string;

  @ApiProperty({ example: 'description' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
