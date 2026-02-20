import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RolePrivilegeDTO {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  privilegeId: number;
}
