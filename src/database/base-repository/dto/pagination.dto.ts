import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 'true', required: false })
  @IsOptional()
  @IsString()
  all?: string;
}

export class PaginationDtoForSentEmail {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 'true', required: false })
  @IsOptional()
  @IsString()
  all?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  send?: boolean;
}

export class PaginationDtoForSubIbReport {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mt5Id?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;
}

export class PaginationDtoForIBCommissionClientWiseReport {
  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page?: number;

  // @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mt5Login?: string;

  // @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  partnerId?: string;
}
