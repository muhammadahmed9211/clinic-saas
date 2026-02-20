import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PermissionRoleRel } from './permission_role_rel.entity';
import { PermissionEndpointRel } from 'src/permission_endpoint/entities/permission_endpoint_rel.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  category: string;

  @Column()
  subCategory: string;

  @Column({ default: false })
  readOnly: boolean;

  @Column({ nullable: true, length: 'MAX' })
  meta: string;

  @OneToMany(
    () => PermissionRoleRel,
    (permissionRolerel) => permissionRolerel.permission,
  )
  permissionRoleRelId: PermissionRoleRel;

  @OneToMany(
    () => PermissionEndpointRel,
    (permissionEndpointRel) => permissionEndpointRel.permission,
  )
  permissionEndpointRel: PermissionEndpointRel;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
