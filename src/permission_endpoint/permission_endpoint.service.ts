import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PermissionEndpoint } from './entities/permission_endpoint.entity';
import { PermissionEndpointRel } from './entities/permission_endpoint_rel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionRoleRel } from 'src/roles/entities/permission_role_rel.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionEndpointService {
  constructor(
    @InjectRepository(PermissionEndpoint)
    private readonly permissionEndpointRepository: Repository<PermissionEndpoint>,
    @InjectRepository(PermissionRoleRel)
    private readonly permissionRoleRelRepository: Repository<PermissionRoleRel>,
    @InjectRepository(PermissionEndpointRel)
    private readonly permissionEndpointRelRepository: Repository<PermissionEndpointRel>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
  ) {}

  async getAll() {
    return await this.permissionEndpointRepository.find();
  }

  async getByEndpoint(url: string, method: string) {
    return await this.permissionEndpointRepository.findOne({
      where: { url, method, isScreen: false },
    });
  }

  async isPermissionAssignedToRole(roleId:number, permission:string){
    const isPermissionAssigned = await this.permissionRoleRelRepository.findOne({
      where:{
        permission:{
          key:permission,
          isActive:true
        },
        role:{
          id:roleId
        }
      }
    });
    if(!isPermissionAssigned){
      throw new BadRequestException("Forbidden")
    }
    return isPermissionAssigned
  } 

  async isPermissionAssignedToUser(userId:number, permission:string){
    const user = await this.userRepository.findOne({
      where:{id:userId},
      relations:{
        role:true
      }
    });
    if(!user || !user?.role?.id){
      throw new BadRequestException("User role not found")
    }

    return this.isPermissionAssignedToRole(user.role.id , permission)
  } 


  async hasAccess(
    roleId: number,
    method: string,
    endpoint: string,
  ): Promise<boolean> {
    console.log(`ROLE: ${roleId} \nMETHOD: ${method} \nENDPOINT: ${endpoint}`);
    if(!roleId){
        throw new UnauthorizedException("You don't have access")
    }
    // const regex = /\d+/g;
    // const result = endpoint.split('v1')[1].replace(regex, '{id}');
    // console.log(result);

    const PermissionEndpoint = await this.permissionEndpointRepository.findOne({
      where: { url: endpoint, method, isScreen: false },
    });

    if (!PermissionEndpoint) return true;

    const permission = await this.permissionEndpointRelRepository.findOne({
      where: { permissionEndpoint: { id: PermissionEndpoint.id } },
      relations: { permission: true },
    });

    if (!permission?.permission) return false;

    const permissionRole = await this.permissionRoleRelRepository.findOne({
      where: {
        permission: { id: permission.permission.id },
        role: { id: roleId },
      },
    });

    console.log(permissionRole);

    if (permissionRole) return true;
    else return false;
  }
}
