import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionCategory } from 'src/roles/entities/permission_category.entity';
import { RolePermissionServiceSeed } from './role-permission.service';
import { Permission } from 'src/roles/entities/permissoin.entity';
import { RoleFilter } from 'src/roles/entities/role_filter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionCategory, Permission, RoleFilter]),
  ],
  providers: [RolePermissionServiceSeed],
  exports: [RolePermissionServiceSeed],
})
export class RolePermissionModule {}
