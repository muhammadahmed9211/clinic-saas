import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GetTaskQuery {
  @ApiProperty({ example: 'false', required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  isCompleted: string;

  @ApiProperty({ example: 'Not Started', required: false })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsOptional()
  status: string;

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

class AssigneeDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;
}

export class TaskDto {
  @Expose()
  entity: string;

  @Expose()
  entityId: number;

  @Expose()
  status: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  dueDate: string;

  @Expose()
  priority: string;

  @Expose()
  reminder: string;

  @Expose()
  repeatIntervalType: string;

  @Expose()
  daysAfter: number;

  @Expose()
  specificDate: string;

  @Expose()
  contactName: string;

  @Type(() => AssigneeDto)
  @Expose()
  assignee: AssigneeDto;

  @Expose()
  isCompleted: boolean;

  @Expose()
  createdBy: AssigneeDto;

  // These fields will not be included in the output
  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}

// Ensure to apply Transform decorator to the class
export class ResponseTaskDto {
  @Type(() => TaskDto)
  task: TaskDto;
}
