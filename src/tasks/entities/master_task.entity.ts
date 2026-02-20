import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Label } from './label.entity';
import { Regulations } from 'src/admin/regulations/entities/regulations.entity';
import { Operator } from 'src/admin/custom-dropdown/custom-dropdown/entities/operator.entity';

@Entity()
export class MasterTask extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => Label, { cascade: true })
  @JoinColumn()
  label: Label;

  @Column({ nullable: true })
  masterUrl: string;

  @Column({ nullable: true })
  predecessor: number;

  @Column({ nullable: true })
  successor: number;

  @Column({ default: false })
  isForcedComplete: boolean;

  @Column({ nullable: true })
  sla: number;

  @Column({ nullable: true })
  responsible: string;

  @ManyToOne(() => Regulations, { nullable: true })
  regulation: Regulations;

  @ManyToOne(() => Operator, { nullable: true })
  createdBy: Operator;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
