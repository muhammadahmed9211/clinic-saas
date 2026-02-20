import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetAllUsersQueryDto {
  @ApiProperty({ required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  search?: string;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
      return Number(value);
  })
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  limit?: number;
}
