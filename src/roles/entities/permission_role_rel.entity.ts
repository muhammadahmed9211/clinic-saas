import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permissoin.entity';
import { Role } from './role.entity';

@Entity()
export class PermissionRoleRel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Permission)
  permission: Permission;

  @ManyToOne(() => Role)
  role: Role;

  @Column({ nullable: true, length: 'MAX' })
  meta: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
