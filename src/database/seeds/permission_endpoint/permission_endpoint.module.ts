import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEndpoint } from 'src/permission_endpoint/entities/permission_endpoint.entity';
import { PermissionEndpointRel } from 'src/permission_endpoint/entities/permission_endpoint_rel.entity';
import { PermissionEndpointSeedService } from './permission_endpoint.service';
import { Permission } from 'src/roles/entities/permissoin.entity';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PermissionEndpoint,
      PermissionEndpointRel,
      Permission,
      PermissionRoleRel,
    ]),
  ],
  providers: [PermissionEndpointSeedService],
})
export class PermissionEndpointSeedModule {}
