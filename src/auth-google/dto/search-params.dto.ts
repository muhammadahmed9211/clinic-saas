import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchParamsDto {
  @ApiProperty({ example: 'ib', required: false })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ example: 'EA23E4BC-0423-4F44-842A-B7BE18E69D34', required: false })
  @IsOptional()
  @IsString()
  partner_uuid?: string;

  @ApiProperty({ example: 'IBRegistrationLink', required: false })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example: 'IB', required: false })
  @IsOptional()
  @IsString()
  utmSource?: string;

  @ApiProperty({ example: 86, required: false })
  @IsOptional()
  @IsNumber()
  commissionProfileId?: number;

  @ApiProperty({ example: 'p1', required: false })
  @IsOptional()
  @IsString()
  p1?: string;

  @ApiProperty({ example: 'p2', required: false })
  @IsOptional()
  @IsString()
  p2?: string;

  @ApiProperty({ example: 'p3', required: false })
  @IsOptional()
  @IsString()
  p3?: string;

  @ApiProperty({ example: 'p4', required: false })
  @IsOptional()
  @IsString()
  p4?: string;

  @ApiProperty({ example: 'p5', required: false })
  @IsOptional()
  @IsString()
  p5?: string;

  @ApiProperty({ example: 'p6', required: false })
  @IsOptional()
  @IsString()
  p6?: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  pu?: boolean;

  @ApiProperty({ example: 'utmMedium', required: false })
  @IsOptional()
  @IsString()
  utmMedium?: string;

  @ApiProperty({ example: 'utmCampaign', required: false })
  @IsOptional()
  @IsString()
  utmCampaign?: string;

  @ApiProperty({ example: 'utmContent', required: false })
  @IsOptional()
  @IsString()
  utmContent?: string;

  @ApiProperty({ example: 'utmTerm', required: false })
  @IsOptional()
  @IsString()
  utmTerm?: string;

  @ApiProperty({ example: 'campaignId', required: false })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  partnerTypeId?: number;
}

