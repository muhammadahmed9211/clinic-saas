import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RegulationEvent } from './regulation-event.entity';
import { RegulationRule } from './regulation-rule.entity';
import { Regulations } from '../../entities/regulations.entity';

@Entity()
@Unique(['regulation', 'event', 'rule'])
export class RegulationEventRuleMapping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Regulations)
  regulation: Regulations;

  @ManyToOne(() => RegulationEvent)
  event: RegulationEvent;

  @ManyToOne(() => RegulationRule)
  rule: RegulationRule;

  @Column()
  value: string;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
