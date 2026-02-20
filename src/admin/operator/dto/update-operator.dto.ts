import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { FileEntity } from 'src/files/entities/file.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';

export class UpdateOperatorDTO {
  @ApiProperty({ type: () => FileEntity })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id'], {
    message: 'imageNotExists',
  })
  photo?: FileEntity;

  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Mark' })
  @IsOptional()
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Mark' })
  @IsOptional()
  @IsString()
  last_name: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  role: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  system: number;

  @ApiProperty({
    example: '$2a$10$pxVOsEghck6GMuOiUbS',
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({ example: '+971505103666' })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  @IsNumber()
  manager_operator_id?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  bypass_ip_whitelist?: boolean;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsString()
  whitelist_ips?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  is_blocked?: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  is_test: boolean;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  imap_host: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  imap_port: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  imap_password: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  imap_protocol: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  imap_ssl_enabled: boolean;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  imap_ssl_protocol: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  imap_folders: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  smtp_host: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  smtp_port: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  smtp_password: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  smtp_protocol: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  smtp_transport_strategy: string;

  @ApiProperty({ example: 'https://www.example.com/_next/image/?' })
  @IsString()
  @IsOptional()
  image_url: string;

  @ApiProperty({ example: [1, 3] })
  @IsOptional()
  desk_id: number[];

  @ApiProperty({ required: false, example: ['English', 'Arabic'] })
  @IsOptional()
  @IsArray({ message: 'Must be array' })
  speakingLanguage?: string[];

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean({ message: 'Must be boolean' })
  autoLeadAssign: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean({ message: 'Must be boolean' })
  autoClientAssign: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsNumber({}, { message: 'Must be number' })
  weeklyCount: number;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsNumber({}, { message: 'Must be number' })
  retentionWeeklyCount: number;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsNumber({}, { message: 'Must be number' })
  assignmentPriority: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  availabilityStartTime?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  availabilityEndTime?: Date;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean({ message: 'Must be boolean' })
  autoLeadReassign?: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsNumber({}, { message: 'Must be number' })
  leadReassignWeeklyCount?: number;
}

export class OperatorChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsStrongPassword(
    {
      minLength: 8,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message: i18nValidationMessage('validation.PASSWORD_LENGTH'),
    },
  )
  new_password: string;
}
