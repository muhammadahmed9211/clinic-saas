import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateIBAutomationDto {
  @ApiProperty({ example: 'Introducing Broker (IB)' })
  @IsString()
  @IsNotEmpty()
  type: string;
}
