import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Operator } from './operator.entity';
import { Lead } from 'src/admin/leads/entities/lead.entity';

@Entity()
export class Office extends BaseEntity {
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

  @Column({ type: 'bigint', default: 0 })
  app_id: number;

  @Column({ type: 'bigint', default: 0 })
  system: number;

  @Column({ type: 'bigint', nullable: true })
  manager: number;

  @ManyToOne(() => Operator, { eager: true, nullable: true })
  @JoinColumn({ name: 'manager' })
  managerOperator: Operator;

  @OneToMany(() => Lead, (lead) => lead.salesOffice)
  leadOffice: Lead;
}
