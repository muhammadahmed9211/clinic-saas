import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetUserLogDto {
  @ApiProperty({ example: 1 })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entity_id: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  entity_type: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  parent_id: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  parent_type: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;
}

export class GetOperatorLogDto {
  @ApiProperty({ example: 1 })
  // @IsNumber()
  performer_id: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;
}
