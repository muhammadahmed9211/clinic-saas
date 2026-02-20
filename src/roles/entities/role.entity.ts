import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber } from 'class-validator';
import { EntityHelper } from '../../utils/entity-helper';
import { RoleFilterRel } from './role_filter_rel.entity';
import { PermissionRoleRel } from './permission_role_rel.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';
import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';

export enum Dashboards {
  GENERAL = 'General Dashboard',
  SALES_AGENT = 'Sales Agent Dashboard',
}
@Entity()
export class Role extends EntityHelper {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  @IsNumber()
  id: number;

  @Allow()
  @ApiProperty({ example: 'Super Admin' })
  @Column()
  name?: string;

  @Column({ default: 'crm' })
  appName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: Dashboards.GENERAL })
  defaultDashboard: string;

  @Column({nullable:true})
  dashboardId: number;

  @ManyToOne(() => CustomStatus)
  @JoinColumn({ name: 'dashboardId' })
  dashboard: CustomStatus;

  @Column({ default: false })
  isReadOnly: boolean;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ default: true })
  isHidden: boolean;

  @Column({ default: true })
  canSeeEmail: boolean;

  @Column({ default: true })
  canSeePhoneNumber: boolean;

  @Column({ default: true })
  seeOtherConfidentialData: boolean;

  @Column({ nullable: true })
  clonedFrom: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RoleFilterRel, (roleFilterRel) => roleFilterRel.role)
  roleFilterRel: RoleFilterRel;

  @OneToMany(
    () => PermissionRoleRel,
    (permissionRolerel) => permissionRolerel.role,
  )
  permissionRoleRel: PermissionRoleRel;

  @OneToMany(() => Operator, (operator) => operator.role)
  operator: Operator;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
