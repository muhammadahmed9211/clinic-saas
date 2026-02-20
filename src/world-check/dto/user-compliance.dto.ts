import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserComplianceDto {
  @ApiProperty({ required: false })
  @IsString()
  userComplianceData?: string;
}
