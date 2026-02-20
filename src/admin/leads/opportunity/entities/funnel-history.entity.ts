import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Opportunity } from './opportunity.entity';

@Entity()
export class FunnelHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stage: string;

  @Column()
  amount: number;

  @Column()
  probability: string;

  @Column({ type: 'float' })
  expectedInvestment: number;

  @Column()
  closingDate: Date;

  @Column()
  stageDuration: number;

  @Column()
  ModifiedBy: string;

  @Column()
  ModifyTime: Date;

  @ManyToOne(() => Opportunity)
  opportunity: Opportunity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
