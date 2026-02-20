import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryIbClients {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: Date;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: Date;
}

export class QueryIbLinks {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: Date;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: Date;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: 'active' | 'inactive';
}


export class QuerySubIbs {
  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiProperty({
    required: false,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  createdAt?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  from?: Date;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  to?: Date;
}

