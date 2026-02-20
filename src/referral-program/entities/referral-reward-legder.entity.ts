import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Referrals } from './referrals.entity';
import { ReferralReward } from 'src/referral-reward/entities/referral-reward.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

export enum RewardAction {
  REWARD_CREDIT = 'Reward Credit',
  REWARD_WITHDRAW = 'Reward Withdraw',
  INCREMENT_REGISTERED='Increment Registered'
}

@Entity()
@Unique(['referralReward', 'version'])
export class ReferralRewardLedger {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  totalEarned: number;

  @Column()
  totalWithdraw: number;

  @Column()
  balance: number;

  @Column()
  totalEarnedAfter: number;

  @Column()
  totalWithdrawAfter: number;

  @Column()
  balanceAfter: number;

  @Column()
  version: number;

  @Column()
  action: string;

  @ManyToOne(() => ReferralReward)
  referralReward: ReferralReward;

  @OneToOne(() => Referrals, { nullable: true })
  @JoinColumn({name:"referralsId"})
  referrals: Referrals;

  @OneToOne(() => Transaction, { nullable: true })
  @JoinColumn({name:"transactionId"})
  transaction: Transaction;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
