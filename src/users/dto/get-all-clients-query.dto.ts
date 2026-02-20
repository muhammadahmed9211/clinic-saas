import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetAllClientsQueryDto {
  @ApiProperty({ required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  search?: string;
}
