import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from 'src/admin/kyc/dto/admin-kyc.dto';

export class CreateLabelDto {
  @ApiProperty({ example: 'label_key', description: 'Unique key for the label',required:true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'Key must not exceed 200 characters.' })
  key: string;

  @ApiProperty({ example: 'This is a label description', description: 'Description of the label', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters.' })
  description?: string;
}


export class UpdateLabelDto {
  @ApiProperty({ example: 'updated_key', description: 'Updated key for the label', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Key must not exceed 200 characters.' })
  key?: string;

  @ApiProperty({ example: 'Updated description', description: 'Updated description of the label', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters.' })
  description?: string;
}

export class LabelDtoAdvance extends PaginationDto {
}

export class UpdateLabelTranslationTextDto {
  @ApiProperty({
    description: 'New text for the label translation',
    example: 'Updated Label Text',
  })
  @IsString({ message: 'Text must be a string' })
  @IsNotEmpty({ message: 'Text cannot be empty' })
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters.' })
  text: string;
}
