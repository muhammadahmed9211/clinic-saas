import { ApiProperty } from '@nestjs/swagger';

interface IMeta {
  id: string;
  column: string;
  position: number;
}
export class CreateRolePermissionDto {
  @ApiProperty({ example: [1, 2, 3] })
  permissionId: number[];

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({
    example: [
      {
        id: 'SEE_DASHBOARD_LEAD_LATEST',
        column: 'Column 01',
        position: 0,
      },
      {
        id: 'SEE_DASHBOARD_OPPORTUNITIES_GRAPH',
        column: 'Column 02',
        position: 0,
      },
      {
        id: 'SEE_DASHBOARD_MOST_VALUED_OPPORTUNITIES',
        column: 'Column 03',
        position: 0,
      },
    ],
  })
  meta: IMeta[];
}
