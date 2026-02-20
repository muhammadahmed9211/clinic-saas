import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Opportunity } from '../entities/opportunity.entity';
import { Lead } from '../../entities/lead.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
  @ApiProperty({
    example: '846E433E-F36B-1410-80ED-00B820E2FA85',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  fileId: string;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  opportunityId: Opportunity;

  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  @IsNotEmpty()
  leadId: Lead;
}

export class AttachmentResponseDto {
  id: number;
  fileId: string;
  fileSize?: string;
  fileName?: string;
  url: string;
  attachedByFirstName: string;
  attachedByLastName: string;
  opportunityId?: any;
  leadId?: any;
  created_at: Date;
  updated_at: Date;
}
