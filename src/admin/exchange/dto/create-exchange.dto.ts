import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExchangeDto {
  @ApiProperty({ example: 'Exchange Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Exchange Contact Name' })
  @IsNotEmpty()
  @IsString()
  contactName: string;

  @ApiProperty({ example: 'Exchange Address' })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ example: 'Exchange City' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Exchange Country' })
  @IsNotEmpty()
  @IsString()
  country: string;
}
