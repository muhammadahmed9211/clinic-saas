import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionEvents {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Transaction)
  transaction: Transaction;

  @Column({ type: 'text' })
  payload: string;

  @Column({ type: 'text', nullable: true })
  generatedPayload: string;

  @Column({ type: 'text', nullable: true })
  calledBy: string;

  @Column({ type: 'text', nullable: true })
  responseBody: string;

  @Column({ type: 'text', nullable: true })
  ip: string;

  @Column({ nullable: true })
  isProcessed: boolean;

  @Column({ type: 'text', nullable: true })
  errorMsg: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}