import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateMasterTaskDto {
  @ApiProperty({ example: 'Fill KYC Documents', required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  @Matches(/^[^\s]+$/, {
    message: 'Space not allowed',
  })
  name: string;

  @ApiProperty({ example: 'Fill KYC Documents', required: false })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.trim().replace(/\s+/g, ' ');
    }
    return value;
  })
  description: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isForcedComplete: boolean;
}
