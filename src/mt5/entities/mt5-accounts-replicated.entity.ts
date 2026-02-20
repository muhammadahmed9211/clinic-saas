import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mt5Account } from './mt5-account.entity';
import { Server } from 'src/wallet/entities/server.entity';

@Index('PK_mt5_accounts', ['login'], { unique: true })
@Entity('mt5_accounts_replicated', { schema: 'dbo' })
export class Mt5AccountsReplicated {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column('numeric', {
    name: 'CurrencyDigits',
    precision: 11,
    scale: 0,
    default: () => '(0)',
  })
  currencyDigits: number;

  @Column('float', { name: 'Balance', precision: 53, default: () => '(0.0)' })
  balance: number;

  @Column('float', { name: 'Credit', precision: 53, default: () => '(0.0)' })
  credit: number;

  @Column('float', { name: 'Margin', precision: 53, default: () => '(0.0)' })
  margin: number;

  @Column('float', {
    name: 'MarginFree',
    precision: 53,
    default: () => '(0.0)',
  })
  marginFree: number;

  @Column('float', {
    name: 'MarginLevel',
    precision: 53,
    default: () => '(0.0)',
  })
  marginLevel: number;

  @Column('numeric', {
    name: 'MarginLeverage',
    precision: 11,
    scale: 0,
    default: () => '(0)',
  })
  marginLeverage: number;

  @Column('float', {
    name: 'MarginInitial',
    precision: 53,
    default: () => '(0.0)',
  })
  marginInitial: number;

  @Column('float', {
    name: 'MarginMaintenance',
    precision: 53,
    default: () => '(0.0)',
  })
  marginMaintenance: number;

  @Column('float', { name: 'Profit', precision: 53, default: () => '(0.0)' })
  profit: number;

  @Column('float', { name: 'Storage', precision: 53, default: () => '(0.0)' })
  storage: number;

  @Column('float', { name: 'Floating', precision: 53, default: () => '(0.0)' })
  floating: number;

  @Column('float', { name: 'Equity', precision: 53, default: () => '(0.0)' })
  equity: number;

  @Column('float', { name: 'Assets', precision: 53, default: () => '(0.0)' })
  assets: number;

  @Column('float', {
    name: 'Liabilities',
    precision: 53,
    default: () => '(0.0)',
  })
  liabilities: number;

  @Column('float', {
    name: 'BlockedCommission',
    precision: 53,
    default: () => '(0.0)',
  })
  blockedCommission: number;

  @Column('float', {
    name: 'BlockedProfit',
    precision: 53,
    default: () => '(0.0)',
  })
  blockedProfit: number;

  @ManyToOne(() => Server)
  server: string;

  @CreateDateColumn({
    name: 'CreatedAt',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'UpdatedAt',
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'DeletedAt', nullable: true })
  deletedAt: Date;
}
