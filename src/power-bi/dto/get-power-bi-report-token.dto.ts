import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetReportToken {
  @ApiProperty({ example: '70d8fb57-4005-485f-a576-2836bdeaf67e' })
  @IsNotEmpty()
  @IsString()
  dashboardId: string;

  @ApiProperty({ example: 'd8594510-8528-44b9-a208-0d1711e1052e' })
  @IsNotEmpty()
  @IsString()
  tileId: string;
}
