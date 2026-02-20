import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class UserCreditCard {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  expiration: string;

  @Column({ type: 'varchar', nullable: true })
  number: string;

  @Column({ type: 'varchar' })
  holderName: string;

  @Column({ type: 'float', default: 0 })
  totalDeposit: number;

  @Column({ type: 'float', default: 0 })
  totalWithdrawal: number;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
