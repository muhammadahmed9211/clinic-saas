import { Role } from 'src/roles/entities/role.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { DashboardWidget } from './dashboard_widget.entity';

// @Entity()
export class RoleDashboardWidget {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => DashboardWidget, { onDelete: 'CASCADE' })
  dashboardWidget: DashboardWidget;

  @Column()
  eligibleColumn: number;

  @Column()
  eligibleRow: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
