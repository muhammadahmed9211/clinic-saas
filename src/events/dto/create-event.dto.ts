import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EventCreateDto {
  @ApiProperty({ example: 'auth' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @ApiProperty({ example: 'authLogin' })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  serviceName: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  dataLoggigService: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  emailService: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  eventLoggingService: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  notification: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  task: boolean;
}
