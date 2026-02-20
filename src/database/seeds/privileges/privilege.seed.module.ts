import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Privilege } from 'src/privileges/entities/privilege.entity';
import { PrivilegeSeedService } from './privilege.seed.service';
import { RolePrivilege } from 'src/privileges/entities/role-privilege.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Privilege, RolePrivilege])],
  providers: [PrivilegeSeedService],
  exports: [PrivilegeSeedService],
})
export class PrivilegeSeedModule {}
