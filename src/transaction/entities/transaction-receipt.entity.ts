import { FileEntity } from 'src/files/entities/file.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity()
export class TransactionReceipt {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  file: FileEntity;

  @ManyToOne(() => Transaction, { nullable: false })
  transaction: Transaction;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
