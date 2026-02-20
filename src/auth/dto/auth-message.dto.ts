import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/admin/kyc/dto/admin-kyc.dto';

export class MessageDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  leadId?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  opportunityId?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  send?: boolean;

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
}

export class TemplateDto {

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  searchValue?: string;
  
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  searchColumn?: string;// For searching template name or any field

  @ApiProperty({
    required: false,
  })
  @IsOptional() 
  @IsString()
  startDate?: string; 
  
  @ApiProperty({
    required: false,
  })
  @IsOptional() 
  @IsString()
  endDate?: string; 

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  sortBy?: string; // Column to sort by (e.g., 'name', 'createdAt')

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC'; // Sorting order (ASC or DESC)


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
    example: 'v1',required: false,
  })
  @IsOptional()
  @IsString()
  version?: string;
}

export class TemplateDtoAdvance extends PaginationDto {

}


export class PreviewDto {
  @ApiProperty({
    example: 'EN',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    example: 'FSCA-ENGLISH',
    required: false,
  })
  @IsOptional() 
  @IsString()
  layoutTitle?: string; 
  
  @ApiProperty({
    example: 'This is a message',
    required: false,
  })
  @IsOptional() 
  @IsString()
  body?: string;

  @ApiProperty({
    example: '2946',
    required: false,
  })
  @IsOptional()
  @IsString()
  entityValue?: string;

  @ApiProperty({
    example: 2,
    required: false,
  })
  @IsOptional() 
  entityId?: number;
}