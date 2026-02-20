import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { PSP } from 'src/transaction/entities/psp.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class TransactionAttempts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  pspId: number;

  @ManyToOne(() => PSP)
  @JoinColumn({ name: 'pspId' })
  psp: PSP;

  @Column({ default: false })
  isError: boolean;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  requestPayload: string;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  responsePayload: string | null;

  @Column('nvarchar', { length: 'MAX', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
