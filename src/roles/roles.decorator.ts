import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: number[]) => SetMetadata('roles', roles);

export const OperatorRole = () => SetMetadata('operatorRole', true);
