import { Module } from '@nestjs/common';
import { PrivilegeService } from './privileges.service';
import { PrivilegesController } from './privileges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { Privilege } from './entities/privilege.entity';
import { RolePrivilege } from './entities/role-privilege.entity';
import { Role } from 'src/roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Privilege, RolePrivilege, Role])],
  controllers: [PrivilegesController],
  providers: [IsExist, IsNotExist, PrivilegeService],
  exports: [PrivilegeService],
})
export class PrivilegeModule {}
