import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTradingInfoRequestParams {
  @ApiProperty({ required: true })
  @IsString()
  login: string;
}

export class GetPostionsQueryDto {
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
  @IsOptional()
  @IsString()
  from: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  to: string;
}
