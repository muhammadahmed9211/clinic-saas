import { Permission } from 'src/roles/entities/permissoin.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionEndpoint } from './permission_endpoint.entity';

@Entity()
export class PermissionEndpointRel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Permission)
  permission: Permission;

  @ManyToOne(() => PermissionEndpoint)
  permissionEndpoint: PermissionEndpoint;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
