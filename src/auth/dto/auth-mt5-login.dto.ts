import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class AuthMt5LoginDto {
  @ApiProperty({ 
    example: '1001',
    description: 'MT5 account login number'
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ 
    example: 'MySecurePassword123',
    description: 'MT5 account password'
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: 'main',
    description: 'Password type: main (master) or investor',
    enum: ['main', 'investor'],
    default: 'main'
  })
  @IsIn(['main', 'investor'])
  type?: 'main' | 'investor' = 'main';
}

