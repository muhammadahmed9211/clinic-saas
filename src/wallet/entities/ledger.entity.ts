import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Entity,
} from 'typeorm';
import { Wallet } from './wallet.entity';

export enum LedgerType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

@Entity()
export class Ledger {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, { eager: false })
  wallet: Wallet;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'float' , nullable:true})
  balanceBefore: number;

  @Column({ type: 'float' , nullable:true})
  balanceAfter: number;

  @ManyToOne(() => Transaction, { nullable: true })
  transaction?: Transaction;

  @Column({ type: 'simple-enum' })
  type: LedgerType;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
