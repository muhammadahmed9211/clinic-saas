import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrivilegeService } from './privileges.service';
import { RolePrivilegeDTO } from './dto/create-rolePrivilege.dto';
import { CreatePrivilegeDTO } from './dto/create-privilege.dto';

@ApiTags('Privilege')
@Controller({ path: 'privileges', version: '1' })
export class PrivilegesController {
  constructor(private readonly service: PrivilegeService) {}

  @Post()
  createPrivilege(@Body() data: CreatePrivilegeDTO) {
    return this.service.createPermission(data);
  }

  @Get()
  async getPrivilege() {
    return this.service.getPermissions();
  }

  @Post('role')
  createRolePrivilege(@Body() data: RolePrivilegeDTO) {
    return this.service.createRolePermission(data);
  }
}
