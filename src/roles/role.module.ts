import { Global, Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RoleFilterRel } from './entities/role_filter_rel.entity';
import { RoleFilter } from './entities/role_filter.entity';
import { RolesRepository } from './repositories/roles.repository';
import { Permission } from './entities/permissoin.entity';
import { PermissionCategory } from './entities/permission_category.entity';
import { PermissionRoleRel } from './entities/permission_role_rel.entity';
import { Office } from 'src/admin/custom-dropdown/custom-dropdown/entities/office.entity';
import { User } from 'src/users/entities/user.entity';
import { RoleDashboardWidget } from './entities/role_dashboard_widget.entity';
import { Desk } from 'src/admin/custom-dropdown/custom-dropdown/entities/desk.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Role,
      RoleFilterRel,
      RoleFilter,
      Permission,
      PermissionCategory,
      PermissionRoleRel,
      Office,
      User,
      RoleDashboardWidget,
      Desk,
      CustomStatus
    ]),
  ],
  controllers: [RoleController],
  providers: [RolesRepository, RoleService],
  exports: [RoleService],
})
export class RoleModule {}
