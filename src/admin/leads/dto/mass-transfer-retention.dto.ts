import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MassTransferRetentionDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  leadIds: number[];

  @ApiProperty()
  @IsBoolean()
  isTransferToRetention: boolean;
} 