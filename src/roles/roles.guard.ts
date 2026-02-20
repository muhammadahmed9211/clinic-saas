import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    const operatorRole = this.reflector.getAllAndOverride<boolean>('operatorRole', [
      context.getClass(),
      context.getHandler(),
    ]);
    const request = context.switchToHttp().getRequest();
    const userRoleId = request.user?.role?.id;
    if (operatorRole) {
      return userRoleId !== RoleEnum.client;
    }

    if (!roles.length) {
      return true;
    }
    return roles.includes(userRoleId);
  }
}
