import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/admin/kyc/dto/admin-kyc.dto';

export class CreateEmailEventDto {
  @ApiProperty({ example: 'otp', description: 'Unique name for the email event',required:true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Name must not exceed 200 characters.' })
  name: string;

  @ApiProperty({ example: 'This is a description', description: 'Description of the email event', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters.' })
  description?: string;
}

export class UpdateEmailEventDto {
  @ApiProperty({
    example: 'updated_name',
    description: 'Updated name for the email event',
    required: true, 
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Name must not exceed 200 characters.' })
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Updated description of the email event',
    required: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters.' })
  description?: string;
}

export class EmailEventDtoAdvance extends PaginationDto {
}

export class UpdateEmailMappingDto {
  @ApiProperty({
    description: 'header and footer id of the email',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  headerFooterId?: number;

  @ApiProperty({
    description: 'body content id of the email',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  bodyContentId?: number;
}
