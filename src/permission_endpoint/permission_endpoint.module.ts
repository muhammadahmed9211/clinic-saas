import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEndpointController } from './permission_endpoint.controller';
import { PermissionEndpointService } from './permission_endpoint.service';
import { PermissionEndpoint } from './entities/permission_endpoint.entity';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';
import { PermissionEndpointRel } from './entities/permission_endpoint_rel.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionEndpoint,
      PermissionRoleRel,
      PermissionEndpointRel,
      User
    ]),
  ],
  controllers: [PermissionEndpointController],
  providers: [PermissionEndpointService],
  exports: [PermissionEndpointService],
})
export class PermissionEndpointModule {}
