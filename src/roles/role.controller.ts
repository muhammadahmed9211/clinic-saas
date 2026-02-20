import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator/password.decorator';
import { User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { getRoleDto } from './dto/get-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApplyListFilterSortColumnDto } from 'src/list-filter-columns/dto/create-list-filter-column.dto';
import { Role } from './entities/role.entity';
import { GetListDto } from './dto/get-list.dto';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { CreateRoleFilterRelDto } from './dto/create-role-filter.dto';

@Controller({ path: 'role', version: '1' })
@ApiTags('Role')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  async createRole(@Body() body: CreateRoleDto, @GetUser() user: User) {
    return await this.roleService.createRole(body, user);
  }

  @Get()
  async getRoles(@GetUser() user: User, @Query() query: getRoleDto) {
    const userId = user.id;
    return this.roleService.getRoles({ userId, query });
  }

  @Get('operator/:id')
  async getOperator(@Param('id') id: number) {
    return await this.roleService.getOperators(id);
  }

  @Post('list')
  async getAllRoles(
    @GetUser() user: User,
    @Query() query: getRoleDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    return this.roleService.getAllRoles({ userId, query, body });
  }

  @Get('permission')
  async getRolesPermission() {
    return await this.roleService.getRolePermission();
  }

  @Get('permission-rel/:id')
  async getRoleswithPermission(@Param('id') id: number) {
    return await this.roleService.RolesWithPermission(id);
  }

  @Post('filter-rel')
  async roleFilterRel(@Body() body: CreateRoleFilterRelDto, @GetUser() user: User) {
    return await this.roleService.roleFilterRel(body , user);
  }

  @Get('permission-endpoint/:id')
  async getPermissionEndpoint(@Param('id') id: number) {
    return await this.roleService.getPermissionEndpoint(id);
  }

  @Get('permission/category')
  async getPermissionCategory() {
    return await this.roleService.getPermissionCategory();
  }

  @Get('filter')
  async getAllRoleFilter() {
    return await this.roleService.getAllRoleFilter();
  }

  @Get('filter-role/:id')
  async getAllRoleFilterById(@Param('id') id: number) {
    return await this.roleService.getAllRoleFilterById(id);
  }

  @Post('get-list')
  async getAll(
    @GetUser() user: User,
    @Query() query: getRoleDto,
    @Body() body: ApplyListFilterSortColumnDto,
  ) {
    const userId = user.id;
    return this.roleService.getAllRoles({ userId, query, body });
  }

  @Post('permission')
  async rolePermission(@Body() body: CreateRolePermissionDto, @GetUser() user: User) {
    return this.roleService.rolePermission(body, user);
  }

  @Patch('permission/:id')
  async updateRolePermission(
    @Param('id') id: number,
    @Body() body: CreateRolePermissionDto,
    @GetUser() user: User,
  ) {
    return this.roleService.updateRolePermission(id, body , user);
  }

  @Get('department-list')
  getDepartmentList() {
    return this.roleService.getDepartmentList();
  }

  @Get('list')
  async getRoleList(@Query() query: GetListDto): Promise<Role[]> {
    return await this.roleService.getRoleList(query);
  }

  @Get('/:id')
  async getRolesById(@Param('id') id: number) {
    return this.roleService.getById(id);
  }

  @Patch('/:id')
  async updateRole(
    @Param('id') id: number,
    @Body() body: UpdateRoleDto,
    @GetUser() user: User,
  ) {
    return this.roleService.updateRole(id, body, user);
  }

  @Delete('/:id')
  async deleteRole(@Param('id') id: number, @GetUser() user: User,) {
    return this.roleService.deleteRole(id, user);
  }
}
