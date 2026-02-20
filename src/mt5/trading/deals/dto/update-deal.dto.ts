import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDealDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Deal?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ExternalID?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Login?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Dealer?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Order?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Action?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Entry?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  Reason?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  Comment?: string;
}
