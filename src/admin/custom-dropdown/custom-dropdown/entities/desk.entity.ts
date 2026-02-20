import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Office } from './office.entity';
import { OperatorDeskRel } from './operator-desk.entity';
import { Operator } from './operator.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';

export enum DeskType {
  Sales = 'sales',
  Retention = 'retention',
}

@Entity()
export class Desk extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'tinyint', default: 0 })
  is_test: boolean;

  @Column({ type: 'bigint', default: 0 })
  daily_goal: number;

  @Column({ type: 'bigint', default: 0 })
  monthly_goal: number;

  @Column({ type: 'bigint', default: 0 })
  weekly_goal: number;

  @Column({ type: 'bigint', nullable: true })
  office_id: number;

  @Column({ type: 'bigint', default: 0 })
  app_id: number;

  @Column({ type: 'bigint', default: 0 })
  system: number;

  @Column({ type: 'tinyint', default: 1 })
  is_active: boolean;

  @ManyToOne(() => Operator, {nullable: true})
  @JoinColumn()
  manager: Operator;

  @ManyToOne(() => Operator, {nullable: true})
  @JoinColumn()
  coordinator: Operator;

  @ManyToOne(() => Office, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'office_id' })
  office: Office;

  @OneToMany(() => OperatorDeskRel, (OperatorDeskRel) => OperatorDeskRel.desk)
  operator_rel: OperatorDeskRel;

  @OneToMany(() => Lead, (lead) => lead.salesDesk)
  leadDesk: Lead;
}
