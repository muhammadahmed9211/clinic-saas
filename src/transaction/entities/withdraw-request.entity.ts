import { BankDetail } from 'src/bank-details/entities/bank-detail.entity';
import { User } from 'src/users/entities/user.entity';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum WithdrawType {
  BANK_WIRE_TRANSFER = 'BANK_WIRE_TRANSFER',
  CRYPTO = 'CRYPTO',
  CREDIT_DEBIT_CARD = 'CREDIT/DEBIT_CARD',
  NONE = 'NONE',
  E_WALLET = 'E_WALLET',
}

export enum WithdrawSubType {
  CLIENT_REQUEST = 'CLIENT_REQUEST',
  CHARGE_BACK = 'CHARGE_BACK',
  REFUND = 'REFUND',
}

@Entity()
export class WithdrawRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Wallet, { nullable: true })
  wallet: Wallet;

  @ManyToOne(() => BankDetail, { nullable: true, eager: true })
  bankDetail: BankDetail;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'simple-enum', enum: WithdrawType })
  type: WithdrawType;

  @Column({ type: 'simple-enum', default: WithdrawSubType.CLIENT_REQUEST })
  subType: WithdrawSubType;

  @Column({ type: 'varchar', nullable: true })
  login: string;

  @Column({ type: 'varchar', nullable: true })
  cardNumber: string;

  @Column({ type: 'varchar', nullable: true })
  cardHolderName: string;

  @Column({ type: 'varchar', nullable: true })
  cryptoCurrency: string;

  @Column({ type: 'varchar', nullable: true })
  userReason: string;

  @Column({ type: 'varchar', nullable: true })
  transactionReason: string;

  @Column({ type: 'varchar', nullable: true })
  cryptoAddress: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
