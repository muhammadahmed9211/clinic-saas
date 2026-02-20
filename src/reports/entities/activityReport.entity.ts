import { CustomStatus } from 'src/admin/client/entities/custom_status.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('activity_reports')
export class ActivityReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  statusId: number;

  @Column({ type: 'float', default: 0 })
  weightage: number;

  @Column({ type: 'float', default: 0 })
  target: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToOne(() => CustomStatus, (customStatus) => customStatus.activityReports)
  @JoinColumn({ name: 'statusId' })
  status: CustomStatus;
}