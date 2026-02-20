import { User } from 'src/users/entities/user.entity';
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
import { ReferralProgram } from './referral-program.entity';

export enum ReferralsStatus {
  REGISTERED = 'Registered',
  SUCCESSFUL = 'Successful',
}

@Entity()
export class Referrals {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ReferralProgram)
  referralProgram: ReferralProgram;

  @ManyToOne(() => User)
  @JoinColumn({name:"referrerId"})
  referrer: User;

  @OneToOne(() => User)
  @JoinColumn({name:"referredId"})
  referred: User;

  @Column()
  referralCode: string;

  @Column()
  referralUuid: string;

  @Column({ default: ReferralsStatus.REGISTERED })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  reward: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
