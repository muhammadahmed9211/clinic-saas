import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rule } from './rule.entity';
import { FilterOperation } from 'src/database/base-repository/dto/advance-search.dto';
import { RuleGroup } from './rule-group.entity';

@Entity()
export class RuleCriteria {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Rule)
  rule: Rule;

  @ManyToOne(() => RuleGroup)
  group: RuleGroup;

  @Column({ type: 'simple-enum', enum: FilterOperation })
  operator: string;

  @Column({ type: 'text' })
  values: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
