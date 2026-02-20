import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { User } from '../entities/user.entity';
import { i18nValidationMessage } from 'nestjs-i18n';

export class FilterClientDto {
  @ApiProperty({ type: Role })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Role)
  roles?: Role[] | null;
}

export class SortClientDto {
  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  orderBy: keyof User;

  @ApiProperty()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  order: string;
}

export class QueryClientDto {
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

export class QueryInactiveClientDto {
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
    required: true,
  })
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsNumber()
  @IsOptional()
  repId: number;
}
