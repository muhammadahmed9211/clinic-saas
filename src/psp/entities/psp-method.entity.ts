import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PSP } from 'src/transaction/entities/psp.entity';
import { TransactionMethod } from 'src/transaction/entities/transaction-method.entity';

@Entity()
export class PspMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TransactionMethod)
  method: TransactionMethod;

  @ManyToOne(() => PSP)
  psp: PSP;
  
  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
