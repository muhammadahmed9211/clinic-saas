import { EntityHelper } from 'src/utils/entity-helper';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Label } from './label.entity';

@Entity()
export class AdminMasterTask extends EntityHelper {
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
  responsible: string;

  @Column({ default: false })
  isForcedComplete: boolean;

  @Column({ nullable: true })
  sla: number;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
