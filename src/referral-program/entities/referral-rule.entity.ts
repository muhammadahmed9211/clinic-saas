import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReferralProgram } from './referral-program.entity';
import { RuleGroup } from 'src/rule/entities/rule-group.entity';

@Entity()
export class ReferralRule {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ReferralProgram)
  referralProgram: ReferralProgram;

  @ManyToOne(() => RuleGroup)
  ruleGroup: RuleGroup;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
