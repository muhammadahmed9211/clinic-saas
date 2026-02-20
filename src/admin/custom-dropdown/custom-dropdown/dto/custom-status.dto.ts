import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { StatusType } from 'src/admin/client/entities/custom_status.entity';

export class ClientInfoDto {
  @ApiProperty({ enum: StatusType })
  @Transform((type) => type.value.toLowerCase())
  @IsEnum(StatusType)
  type: StatusType;
}

export enum ClientType {
  'Individual Client (IC)' = 'IC',
  'Introducing Broker (IB)' = 'IB',
  'Money Manager (MM)' = 'MM',
  'Institution (Inst)' = 'Inst',
  'Joint Account (Joint)' = 'Joint',
  'Corporation (Corp)' = 'Corp',
}
