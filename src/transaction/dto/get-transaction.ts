import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTransaction {
  @ApiProperty({
    example: '6E08433E-F36B-1410-8528-00DD52555502',
    required: true,
  })
  @IsUUID()
  id: string;
}
