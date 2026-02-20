import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OperatorDTO {
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Mark', required: false })
  @IsOptional()
  @IsString()
  full_name: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Mark' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  @ApiProperty({ example: 1, required: true })
  @IsNotEmpty()
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

  @ApiProperty({ example: 'https://www.example.com/_next/image/?' })
  @IsString()
  @IsOptional()
  image_url: string;

  @ApiProperty({ example: null })
  @IsString()
  @IsOptional()
  smtp_transport_strategy: string;

  @ApiProperty({ example: [1, 3] })
  @IsOptional()
  desk_id: number[];

  @IsOptional()
  uuid?: string;

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
  @IsNumber({}, { message: 'Must be number' })
  weeklyCount: number;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean({ message: 'Must be boolean' })
  autoLeadReassign: boolean;

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsNumber({}, { message: 'Must be number' })
  leadReassignWeeklyCount: number;
}

export class TokenDTO {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  token: string;
}

export class DeskDTO {
  @ApiProperty({ example: 'Desk Name', description: 'The name of the desk' })
  name: string;

  @ApiProperty({ example: 1, description: 'The type of the desk' })
  type: number; // In the entity, type is defined as number

  @ApiProperty({ example: 10, description: 'The daily goal for the desk' })
  daily_goal: number;

  @ApiProperty({ example: 100, description: 'The monthly goal for the desk' })
  monthly_goal: number;

  @ApiProperty({ example: 50, description: 'The weekly goal for the desk' })
  weekly_goal: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the office to which the desk belongs',
  })
  office_id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the operator',
  })
  coordinator: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the operator',
  })
  manager: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the app associated with the desk',
  })
  system: number;

  @ApiProperty({
    example: true,
    description: 'Whether the desk is active or not',
  })
  is_active: boolean;
}

export class UpdateDeskDTO {
  @ApiProperty({ example: 'Desk Name', description: 'The name of the desk' })
  name: string;

  @ApiProperty({ example: 10, description: 'The daily goal for the desk' })
  daily_goal: number;

  @ApiProperty({ example: 100, description: 'The monthly goal for the desk' })
  monthly_goal: number;

  @ApiProperty({ example: 50, description: 'The weekly goal for the desk' })
  weekly_goal: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the office to which the desk belongs',
  })
  office_id: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the operator',
  })
  coordinator: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the operator',
  })
  manager: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the app associated with the desk',
  })
  system: number;

  @ApiProperty({
    example: true,
    description: 'Whether the desk is active or not',
  })
  is_active: boolean;

  type?: number;
}

export class CreateOfficeDTO {
  @ApiProperty({
    example: 'Office Name',
    description: 'The name of the office',
  })
  name: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the system associated with the office',
  })
  system: number;
}

export class UpdateOfficeDTO {
  @ApiProperty({
    example: 'Updated Office Name',
    description: 'The updated name of the office',
  })
  name?: string;

  @ApiProperty({
    example: 2,
    description: 'The updated ID of the system associated with the office',
  })
  system?: number;
}

export class OperatorData extends OperatorDTO {
  id: number;
  photo: any;
  isPartner: boolean;
  partnerId: number;
  autoMonthlyTarget: boolean;
  retentionWeeklyCount: number;
  assignmentPriority: number;
  availabilityStartTime: Date;
  availabilityEndTime: Date;
  autoClientAssign: boolean;
  createdAt: Date;
  updatedAt: Date;
  operator_rel: {
    desk: {
      name: string;
    };
  };
}
