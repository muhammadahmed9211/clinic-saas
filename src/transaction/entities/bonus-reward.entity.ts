import { Mt5Account } from 'src/mt5/entities/mt5-account.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { Transaction } from './transaction.entity';
import { Bonus } from 'src/bonus/entities/bonus.entity';

@Entity()
@Unique(['transaction'])
export class BonusReward {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar' })
  code: string;

  @Column()
  amount: number;

  @Column()
  convertedAmount: number;

  @Column({ type: 'nvarchar' })
  tradingPlatformRef: string;

  @ManyToOne(() => Mt5Account, { nullable: false })
  mt5Account: Mt5Account;

  @ManyToOne(() => Transaction, { nullable: false })
  transaction: Transaction;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Bonus)
  bonus: Bonus;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
