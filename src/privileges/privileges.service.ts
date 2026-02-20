import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Privilege } from './entities/privilege.entity';
import { RolePrivilege } from './entities/role-privilege.entity';
import { RolePrivilegeDTO } from './dto/create-rolePrivilege.dto';
import { CreatePrivilegeDTO } from './dto/create-privilege.dto';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege)
    private readonly privilegeRepository: Repository<Privilege>,
    @InjectRepository(RolePrivilege)
    private readonly rolePrivilegeRepository: Repository<RolePrivilege>,
  ) {}

  async createPermission(data: CreatePrivilegeDTO): Promise<Privilege> {
    return await this.privilegeRepository.save(data);
  }

  async createRolePermission(data: RolePrivilegeDTO): Promise<RolePrivilege> {
    return await this.rolePrivilegeRepository.save({
      privilege: { id: data.privilegeId },
      role: { id: data.roleId },
    });
  }

  async getPermissions(): Promise<Privilege[]> {
    return await this.privilegeRepository.find();
  }

  async hasAccess(
    roleId: number,
    method: string,
    endpoint: string,
  ): Promise<boolean> {
    console.log(`ROLE: ${roleId} \nMETHOD: ${method} \nENDPOINT: ${endpoint}`);

    const regex = /\d+/g;
    const result = endpoint.split('v1')[1].replace(regex, '{id}');
    console.log(result);

    const rolePrivileges = await this.rolePrivilegeRepository.findOne({
      where: { privilege: { api: `/api/v1${result}`, method } },
      relations: { role: true },
    });

    console.log(rolePrivileges);

    return rolePrivileges?.role.id === roleId;
  }
}
