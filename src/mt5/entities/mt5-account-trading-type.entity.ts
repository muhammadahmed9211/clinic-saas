import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Mt5Account } from './mt5-account.entity';

@Entity()
export class Mt5AccountTradingType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Mt5Account, (mt5Account) => mt5Account.tradingType)
  mt5Accounts: Mt5Account[]; // Changed to plural and array type

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
