import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  Entity,
  Index,
} from 'typeorm';
import { Server } from './server.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10 })
  currency: string;

  @Column({ type: 'float' })
  balance: number;

  @Column({ type: 'float' })
  actualBalance: number;

  @Column({ type: 'float', default: 0 })
  totalDeposit: number;

  @Column({ type: 'float', default: 0 })
  totalWithdraw: number;

  @Column({ type: 'float', default: 0 })
  totalTransferIn: number;

  @Column({ type: 'float', default: 0 })
  totalTransferOut: number;

  @Column({ type: 'float', default: 0 })
  negativeAdjustment: number;

  @Column({ type: 'float', default: 0 })
  positiveAdjustment: number;

  @Column({ type: 'float', default:0 })
  rtdAmount: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Index()
  user: User;

  @ManyToOne(() => Server)
  server: Server;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
